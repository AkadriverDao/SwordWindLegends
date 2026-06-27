import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Ledger "ledger";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import UserApproval "user-approval/approval";
import Int "mo:base/Int";
import Registry "blob-storage/registry";
import BlobStorage "blob-storage/Mixin";



persistent actor {
    let accessControlState = AccessControl.initState();
    let approvalState = UserApproval.initState(accessControlState);

    public shared ({ caller }) func initializeAccessControl() : async () {
        AccessControl.initialize(accessControlState, caller);
    };

    public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
        AccessControl.getUserRole(accessControlState, caller);
    };

    public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
        AccessControl.assignRole(accessControlState, caller, user, role);
    };

    public query ({ caller }) func isCallerAdmin() : async Bool {
        AccessControl.isAdmin(accessControlState, caller);
    };

    public type UserProfile = {
        name : Text;
    };

    transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
    var userProfiles = principalMap.empty<UserProfile>();

    public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can view profiles");
        };
        principalMap.get(userProfiles, caller);
    };

    public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
        if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
            Debug.trap("Unauthorized: Can only view your own profile or admin can view all");
        };
        principalMap.get(userProfiles, user);
    };

    public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can save profiles");
        };
        userProfiles := principalMap.put(userProfiles, caller, profile);
    };

    public type Article = {
        title : Text;
        content : Text;
        author : Principal;
        createdAt : Time.Time;
        updatedAt : Time.Time;
        approvalStatus : Int;
        submittedForReview : Bool;
        likeCount : Nat;
        categories : [Text];
    };

    transient let articleMap = OrderedMap.Make<Nat>(Nat.compare);
    var articles = articleMap.empty<Article>();
    var nextArticleId : Nat = 0;

    public type Comment = {
        commentId : Nat;
        articleId : Nat;
        author : Principal;
        content : Text;
        createdAt : Time.Time;
    };

    transient let commentMap = OrderedMap.Make<Nat>(Nat.compare);
    var comments = commentMap.empty<Comment>();
    var nextCommentId : Nat = 0;

    transient let likeMap = OrderedMap.Make<Nat>(Nat.compare);
    var articleLikes = likeMap.empty<List.List<Principal>>();

    var ledgerState = Ledger.initState();

    public shared ({ caller }) func createArticle(title : Text, content : Text, submittedForReview : Bool, categories : [Text]) : async Nat {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can create articles");
        };

        let article : Article = {
            title;
            content;
            author = caller;
            createdAt = Time.now();
            updatedAt = Time.now();
            approvalStatus = 0;
            submittedForReview;
            likeCount = 0;
            categories;
        };

        let articleId = nextArticleId;
        articles := articleMap.put(articles, articleId, article);
        nextArticleId += 1;

        articleId;
    };

    public shared ({ caller }) func updateArticle(articleId : Nat, title : Text, content : Text, submittedForReview : Bool, categories : [Text]) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can update articles");
        };

        switch (articleMap.get(articles, articleId)) {
            case null {
                Debug.trap("Article not found");
            };
            case (?article) {
                if (article.author != caller) {
                    Debug.trap("Unauthorized: Only the author can update this article");
                };

                let updatedArticle : Article = {
                    title;
                    content;
                    author = caller;
                    createdAt = article.createdAt;
                    updatedAt = Time.now();
                    approvalStatus = if (article.approvalStatus == 2 and submittedForReview) {
                        0;
                    } else {
                        article.approvalStatus;
                    };
                    submittedForReview;
                    likeCount = article.likeCount;
                    categories;
                };

                articles := articleMap.put(articles, articleId, updatedArticle);
            };
        };
    };

    public shared ({ caller }) func deleteArticle(articleId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can delete articles");
        };

        switch (articleMap.get(articles, articleId)) {
            case null {
                Debug.trap("Article not found");
            };
            case (?article) {
                if (article.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
                    Debug.trap("Unauthorized: Only the author or admin can delete articles");
                };

                articles := articleMap.delete(articles, articleId);
            };
        };
    };

    public query ({ caller }) func getArticle(articleId : Nat) : async ?Article {
        switch (articleMap.get(articles, articleId)) {
            case null { null };
            case (?article) {
                if (AccessControl.isAdmin(accessControlState, caller)) {
                    return ?article;
                };
                if (article.author == caller) {
                    return ?article;
                };
                if (article.approvalStatus == 1) {
                    return ?article;
                };
                null;
            };
        };
    };

    public query ({ caller }) func getAllArticles() : async [(Nat, Article)] {
        var articleList = List.nil<(Nat, Article)>();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        for ((id, article) in articleMap.entries(articles)) {
            if (isAdmin) {
                articleList := List.push((id, article), articleList);
            } else {
                if (article.approvalStatus == 1 or article.author == caller) {
                    articleList := List.push((id, article), articleList);
                };
            };
        };
        List.toArray(articleList);
    };

    public query ({ caller }) func getArticlesByAuthor(author : Principal) : async [(Nat, Article)] {
        var articleList = List.nil<(Nat, Article)>();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        for ((id, article) in articleMap.entries(articles)) {
            if (article.author == author) {
                if (isAdmin) {
                    articleList := List.push((id, article), articleList);
                } else {
                    if (article.approvalStatus == 1 or article.author == caller) {
                        articleList := List.push((id, article), articleList);
                    };
                };
            };
        };
        List.toArray(articleList);
    };

    public query ({ caller }) func getArticlesByCategory(category : Text) : async [(Nat, Article)] {
        var articleList = List.nil<(Nat, Article)>();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        for ((id, article) in articleMap.entries(articles)) {
            if (Array.find(article.categories, func(c : Text) : Bool { c == category }) != null) {
                if (isAdmin) {
                    articleList := List.push((id, article), articleList);
                } else {
                    if (article.approvalStatus == 1 or article.author == caller) {
                        articleList := List.push((id, article), articleList);
                    };
                };
            };
        };
        List.toArray(articleList);
    };

    let registry = Registry.new();
    include BlobStorage(registry);

    public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
        Registry.add(registry, path, hash);
    };

    public query ({ caller }) func getFileReference(path : Text) : async Registry.FileReference {
        Registry.get(registry, path);
    };

    public query ({ caller }) func listFileReferences() : async [Registry.FileReference] {
        Registry.list(registry);
    };

    public shared ({ caller }) func dropFileReference(path : Text) : async () {
        Registry.remove(registry, path);
    };

    public query ({ caller }) func getTokenBalance() : async Nat {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can view token balance");
        };
        Ledger.getBalance(ledgerState, caller);
    };

    public shared ({ caller }) func transferTokens(to : Principal, amount : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can transfer tokens");
        };
        Ledger.transfer(ledgerState, caller, to, amount);
    };

    public query ({ caller }) func isCallerApproved() : async Bool {
        AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
    };

    public shared ({ caller }) func requestApproval() : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can request approval");
        };
        UserApproval.requestApproval(approvalState, caller);
    };

    public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can perform this action");
        };
        UserApproval.setApproval(approvalState, user, status);
    };

    public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can perform this action");
        };
        UserApproval.listApprovals(approvalState);
    };

    public shared ({ caller }) func approveArticle(articleId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can approve articles");
        };

        switch (articleMap.get(articles, articleId)) {
            case null {
                Debug.trap("Article not found");
            };
            case (?article) {
                let updatedArticle : Article = {
                    article with approvalStatus = 1
                };
                articles := articleMap.put(articles, articleId, updatedArticle);
            };
        };
    };

    public shared ({ caller }) func rejectArticle(articleId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can reject articles");
        };

        switch (articleMap.get(articles, articleId)) {
            case null {
                Debug.trap("Article not found");
            };
            case (?article) {
                let updatedArticle : Article = {
                    article with approvalStatus = 2
                };
                articles := articleMap.put(articles, articleId, updatedArticle);
            };
        };
    };

    public shared ({ caller }) func addComment(articleId : Nat, content : Text) : async Nat {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can add comments");
        };

        if (articleId == 999999) {
            let comment : Comment = {
                commentId = nextCommentId;
                articleId;
                author = caller;
                content;
                createdAt = Time.now();
            };

            comments := commentMap.put(comments, nextCommentId, comment);
            nextCommentId += 1;

            return nextCommentId - 1;
        };

        switch (articleMap.get(articles, articleId)) {
            case null {
                Debug.trap("Article not found");
            };
            case (?article) {
                let canAccess = AccessControl.isAdmin(accessControlState, caller) or
                               article.author == caller or
                               article.approvalStatus == 1;

                if (not canAccess) {
                    Debug.trap("Unauthorized: Cannot comment on this article");
                };

                let comment : Comment = {
                    commentId = nextCommentId;
                    articleId;
                    author = caller;
                    content;
                    createdAt = Time.now();
                };

                comments := commentMap.put(comments, nextCommentId, comment);
                nextCommentId += 1;

                nextCommentId - 1;
            };
        };
    };

    public query ({ caller }) func getCommentsForArticle(articleId : Nat) : async [Comment] {
        if (articleId == 999999) {
            var commentList = List.nil<Comment>();
            for ((_, comment) in commentMap.entries(comments)) {
                if (comment.articleId == articleId) {
                    commentList := List.push(comment, commentList);
                };
            };
            return List.toArray(commentList);
        };

        switch (articleMap.get(articles, articleId)) {
            case null {
                Debug.trap("Article not found");
            };
            case (?article) {
                let canAccess = AccessControl.isAdmin(accessControlState, caller) or
                               article.author == caller or
                               article.approvalStatus == 1;

                if (not canAccess) {
                    Debug.trap("Unauthorized: Cannot view comments for this article");
                };

                var commentList = List.nil<Comment>();
                for ((_, comment) in commentMap.entries(comments)) {
                    if (comment.articleId == articleId) {
                        commentList := List.push(comment, commentList);
                    };
                };
                List.toArray(commentList);
            };
        };
    };

    public shared ({ caller }) func likeArticle(articleId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can like articles");
        };

        switch (articleMap.get(articles, articleId)) {
            case null {
                Debug.trap("Article not found");
            };
            case (?article) {
                if (article.approvalStatus != 1) {
                    Debug.trap("Cannot like unapproved articles");
                };

                let currentLikes = switch (likeMap.get(articleLikes, articleId)) {
                    case null { List.nil<Principal>() };
                    case (?likes) { likes };
                };

                if (List.some(currentLikes, func(p : Principal) : Bool { p == caller })) {
                    Debug.trap("Already liked this article");
                };

                let updatedLikes = List.push(caller, currentLikes);
                articleLikes := likeMap.put(articleLikes, articleId, updatedLikes);

                let updatedArticle : Article = {
                    article with likeCount = article.likeCount + 1
                };
                articles := articleMap.put(articles, articleId, updatedArticle);
            };
        };
    };

    public shared ({ caller }) func unlikeArticle(articleId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can unlike articles");
        };

        switch (articleMap.get(articles, articleId)) {
            case null {
                Debug.trap("Article not found");
            };
            case (?article) {
                let currentLikes = switch (likeMap.get(articleLikes, articleId)) {
                    case null { List.nil<Principal>() };
                    case (?likes) { likes };
                };

                if (not List.some(currentLikes, func(p : Principal) : Bool { p != caller })) {
                    Debug.trap("Have not liked this article");
                };

                let updatedLikes = List.filter(currentLikes, func(p : Principal) : Bool { p != caller });
                articleLikes := likeMap.put(articleLikes, articleId, updatedLikes);

                let updatedArticle : Article = {
                    article with likeCount = if (article.likeCount > 0) { article.likeCount - 1 : Nat } else {
                        0;
                    };
                };
                articles := articleMap.put(articles, articleId, updatedArticle);
            };
        };
    };

    public query ({ caller }) func hasLikedArticle(articleId : Nat) : async Bool {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            return false;
        };

        switch (likeMap.get(articleLikes, articleId)) {
            case null { false };
            case (?likes) {
                List.some(likes, func(p : Principal) : Bool { p == caller });
            };
        };
    };

    public query func getArticleLikeCount(articleId : Nat) : async Nat {
        switch (articleMap.get(articles, articleId)) {
            case null { 0 };
            case (?article) { article.likeCount };
        };
    };

    public shared ({ caller }) func deleteComment(commentId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can delete comments");
        };

        switch (commentMap.get(comments, commentId)) {
            case null {
                Debug.trap("Comment not found");
            };
            case (?comment) {
                if (comment.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
                    Debug.trap("Unauthorized: Only the comment author or admin can delete this comment");
                };

                comments := commentMap.delete(comments, commentId);
            };
        };
    };

    public type TradingPair = {
        symbol : Text;
        coinId : Text;
        enabled : Bool;
    };

    transient let tradingPairMap = OrderedMap.Make<Text>(Text.compare);
    var tradingPairs = tradingPairMap.empty<TradingPair>();

    public shared ({ caller }) func addTradingPair(symbol : Text, coinId : Text, enabled : Bool) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can add trading pairs");
        };

        let pair : TradingPair = {
            symbol;
            coinId;
            enabled;
        };

        tradingPairs := tradingPairMap.put(tradingPairs, symbol, pair);
    };

    public shared ({ caller }) func updateTradingPair(symbol : Text, enabled : Bool) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can update trading pairs");
        };

        switch (tradingPairMap.get(tradingPairs, symbol)) {
            case null {
                Debug.trap("Trading pair not found");
            };
            case (?existingPair) {
                let updatedPair : TradingPair = {
                    symbol;
                    coinId = existingPair.coinId;
                    enabled;
                };
                tradingPairs := tradingPairMap.put(tradingPairs, symbol, updatedPair);
            };
        };
    };

    public shared ({ caller }) func deleteTradingPair(symbol : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can delete trading pairs");
        };

        switch (tradingPairMap.get(tradingPairs, symbol)) {
            case null {
                Debug.trap("Trading pair not found");
            };
            case (?_) {
                tradingPairs := tradingPairMap.delete(tradingPairs, symbol);
            };
        };
    };

    public query func getAllTradingPairs() : async [(Text, TradingPair)] {
        Iter.toArray(tradingPairMap.entries(tradingPairs));
    };

    public query func getTradingPair(symbol : Text) : async ?TradingPair {
        tradingPairMap.get(tradingPairs, symbol);
    };

    public type Land = {
        id : Nat;
        x : Nat;
        y : Nat;
    };

    public type MiningResult = {
        #nothing;
        #gold : Nat;
        #death;
    };

    public type PlayerStatus = {
        #alive;
        #dead;
    };

    public type Player = {
        principal : Principal;
        gold : Nat;
        status : PlayerStatus;
        lastMiningTime : Time.Time;
    };

    public type MiningHistory = {
        landId : Nat;
        result : MiningResult;
        timestamp : Time.Time;
    };

    var landMinerPlayers = principalMap.empty<Player>();
    var landMinerHistories = principalMap.empty<[MiningHistory]>();
    var landMinerLands : [Land] = [];
    var nextLandId : Nat = 0;

    var goldProbability : Nat = 65;
    var deathProbability : Nat = 5;
    var logEnabled : Bool = false;

    private func initializeLandsInternal() {
        let size = 1000;
        let mutableLands = Array.init<Land>(size, { id = 0; x = 0; y = 0 });
        var i = 0;
        while (i < size) {
            mutableLands[i] := {
                id = i;
                x = i % 40;
                y = i / 40;
            };
            i += 1;
        };
        landMinerLands := Array.freeze(mutableLands);
    };

    public shared ({ caller }) func initializeLands() : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can initialize lands");
        };
        if (landMinerLands.size() == 0) {
            initializeLandsInternal();
        };
    };

    public shared ({ caller }) func mineLand(landId : Nat) : async MiningResult {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can mine land");
        };

        if (landId >= 1000) {
            Debug.trap("无效的土地ID");
        };

        let player = switch (principalMap.get(landMinerPlayers, caller)) {
            case null {
                let newPlayer : Player = {
                    principal = caller;
                    gold = 0;
                    status = #alive;
                    lastMiningTime = Time.now();
                };
                landMinerPlayers := principalMap.put(landMinerPlayers, caller, newPlayer);
                newPlayer;
            };
            case (?existingPlayer) {
                if (existingPlayer.status == #dead) {
                    Debug.trap("角色已死亡，请先复活");
                };
                existingPlayer;
            };
        };

        let randomSeed = Int.abs(Time.now()) % 100;
        let result = if (randomSeed < 100 - goldProbability - deathProbability) {
            #nothing;
        } else if (randomSeed < 100 - deathProbability) {
            let goldAmount = (randomSeed % 10) + 1;
            #gold(goldAmount);
        } else {
            #death;
        };

        let updatedPlayer = switch (result) {
            case (#gold(amount)) {
                {
                    player with
                    gold = player.gold + amount;
                    lastMiningTime = Time.now();
                };
            };
            case (#death) {
                {
                    player with
                    status = #dead;
                    gold = 0;
                    lastMiningTime = Time.now();
                };
            };
            case (#nothing) {
                {
                    player with
                    lastMiningTime = Time.now();
                };
            };
        };

        landMinerPlayers := principalMap.put(landMinerPlayers, caller, updatedPlayer);

        let history = {
            landId;
            result;
            timestamp = Time.now();
        };

        let playerHistory = switch (principalMap.get(landMinerHistories, caller)) {
            case null { [] };
            case (?existingHistory) { existingHistory };
        };

        let newHistory = Array.append(playerHistory, [history]);
        landMinerHistories := principalMap.put(landMinerHistories, caller, newHistory);

        if (logEnabled) {
            let logMessage = switch (result) {
                case (#gold(amount)) {
                    "挖矿结果: 金币 " # Nat.toText(amount) # " 个";
                };
                case (#death) {
                    "挖矿结果: 角色死亡";
                };
                case (#nothing) {
                    "挖矿结果: 啥也没挖到";
                };
            };
            Debug.print("土地ID: " # Nat.toText(landId) # ", " # logMessage);
        };

        result;
    };

    public shared ({ caller }) func revive() : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can revive");
        };

        switch (principalMap.get(landMinerPlayers, caller)) {
            case null {
                Debug.trap("玩家未找到");
            };
            case (?player) {
                if (player.status == #alive) {
                    Debug.trap("角色已存活");
                };

                let updatedPlayer = {
                    player with
                    status = #alive;
                    lastMiningTime = Time.now();
                };
                landMinerPlayers := principalMap.put(landMinerPlayers, caller, updatedPlayer);
            };
        };
    };

    public query ({ caller }) func getPlayerStatus() : async PlayerStatus {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can view player status");
        };

        switch (principalMap.get(landMinerPlayers, caller)) {
            case null { #alive };
            case (?player) { player.status };
        };
    };

    public query ({ caller }) func getPlayerGold() : async Nat {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can view gold balance");
        };

        switch (principalMap.get(landMinerPlayers, caller)) {
            case null { 0 };
            case (?player) { player.gold };
        };
    };

    public query ({ caller }) func getMiningHistory() : async [MiningHistory] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can view mining history");
        };

        switch (principalMap.get(landMinerHistories, caller)) {
            case null { [] };
            case (?history) { history };
        };
    };

    public query func getAllLands() : async [Land] {
        if (landMinerLands.size() == 0) {
            let size = 1000;
            let mutableLands = Array.init<Land>(size, { id = 0; x = 0; y = 0 });
            var i = 0;
            while (i < size) {
                mutableLands[i] := {
                    id = i;
                    x = i % 40;
                    y = i / 40;
                };
                i += 1;
            };
            Array.freeze(mutableLands);
        } else {
            landMinerLands;
        };
    };

    public query func getLand(landId : Nat) : async ?Land {
        if (landId >= 1000) {
            null;
        } else {
            if (landMinerLands.size() == 0) {
                ?{
                    id = landId;
                    x = landId % 40;
                    y = landId / 40;
                };
            } else {
                if (landId < landMinerLands.size()) {
                    ?landMinerLands[landId];
                } else {
                    null;
                };
            };
        };
    };

    public query func getTotalPlayers() : async Nat {
        principalMap.size(landMinerPlayers);
    };

    public query func getTotalMiningOperations() : async Nat {
        var total = 0;
        for ((_, history) in principalMap.entries(landMinerHistories)) {
            total += history.size();
        };
        total;
    };

    public query func getTotalGoldMined() : async Nat {
        var total = 0;
        for ((_, player) in principalMap.entries(landMinerPlayers)) {
            total += player.gold;
        };
        total;
    };

    public shared ({ caller }) func setMiningProbability(goldProb : Nat, deathProb : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only super administrators can set mining probability");
        };

        if (goldProb + deathProb > 100) {
            Debug.trap("Invalid probability: Total probability cannot exceed 100");
        };

        goldProbability := goldProb;
        deathProbability := deathProb;
    };

    public shared ({ caller }) func setLogEnabled(enabled : Bool) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only super administrators can set log enabled");
        };

        logEnabled := enabled;
    };

    public query func getMiningProbability() : async (Nat, Nat) {
        (goldProbability, deathProbability);
    };

    public query func getLogEnabled() : async Bool {
        logEnabled;
    };

    public type MiningLeaderboardEntry = {
        principal : Principal;
        gold : Nat;
    };

    public query func getMiningLeaderboard() : async [MiningLeaderboardEntry] {
        var entries = List.nil<MiningLeaderboardEntry>();

        for ((principal, player) in principalMap.entries(landMinerPlayers)) {
            entries := List.push(
                {
                    principal;
                    gold = player.gold;
                },
                entries,
            );
        };

        let entriesArray = List.toArray(entries);
        Array.sort<MiningLeaderboardEntry>(
            entriesArray,
            func(a, b) {
                if (a.gold > b.gold) { #less } else if (a.gold < b.gold) {
                    #greater;
                } else { #equal };
            },
        );
    };

    public type GameMod = {
        gameId : Nat;
        title : Text;
        description : Text;
        imageUrl : Text;
        link : Text;
        createdAt : Time.Time;
    };

    transient let gameModMap = OrderedMap.Make<Nat>(Nat.compare);
    var gameMods = gameModMap.empty<GameMod>();

    public shared ({ caller }) func addGameMod(title : Text, description : Text, imageUrl : Text, link : Text) : async Nat {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only super users can add games");
        };

        let gameId = nextLandId;
        let newGameMod : GameMod = {
            title;
            description;
            imageUrl;
            link;
            gameId;
            createdAt = Time.now();
        };

        gameMods := gameModMap.put(gameMods, gameId, newGameMod);
        nextLandId += 1;
        gameId;
    };

    public shared ({ caller }) func updateGameMod(gameId : Nat, title : Text, description : Text, imageUrl : Text, link : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only super users can update games");
        };

        switch (gameModMap.get(gameMods, gameId)) {
            case null {
                Debug.trap("Game not found");
            };
            case (?_) {
                let updatedGameMod : GameMod = {
                    title;
                    description;
                    imageUrl;
                    link;
                    gameId;
                    createdAt = Time.now();
                };

                gameMods := gameModMap.put(gameMods, gameId, updatedGameMod);
            };
        };
    };

    public query ({ caller }) func getAllGameMods() : async [(Nat, GameMod)] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only authenticated users can view game mods");
        };
        Iter.toArray(gameModMap.entries(gameMods));
    };

    public query ({ caller }) func getGameModById(gameId : Nat) : async ?GameMod {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only authenticated users can view game mods");
        };
        gameModMap.get(gameMods, gameId);
    };
};
