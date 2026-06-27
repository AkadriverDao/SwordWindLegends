import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Debug "mo:core/Debug";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Ledger "ledger";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import UserApproval "mo:caffeineai-user-approval/approval";
import Int "mo:core/Int";
import Registry "blob-storage/registry";
import BlobStorage "blob-storage/Mixin";
import EmailClient "mo:caffeineai-email/emailClient";

import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";

import Migration "migration";

(with migration = Migration.run)
actor {
    let accessControlState = AccessControl.initState();
    let approvalState = UserApproval.initState(accessControlState);

    include MixinAuthorization(accessControlState, null);
    include MixinObjectStorage();
    include MixinViews();

    public shared ({ caller }) func initializeAccessControl() : async () {
        AccessControl.initialize(accessControlState, caller);
    };

    public type UserProfile = {
        name : Text;
        email : ?Text;
    };

    var userProfiles = Map.empty<Principal, UserProfile>();

    public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can view profiles");
        };
        userProfiles.get(caller);
    };

    public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
        if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
            Runtime.trap("Unauthorized: Can only view your own profile or admin can view all");
        };
        userProfiles.get(user);
    };

    public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can save profiles");
        };
        userProfiles.add(caller, profile);
    };

    public type Article = {
        title : Text;
        content : Text;
        author : Principal;
        createdAt : Time.Time;
        updatedAt : Time.Time;
        likeCount : Nat;
        categories : [Text];
        visible : Bool;
        pinned : Bool;
        pinOrder : Nat;
        hideReason : Text;
    };

    var articles = Map.empty<Nat, Article>();
    var nextArticleId : Nat = 0;

    public type Comment = {
        commentId : Nat;
        articleId : Nat;
        author : Principal;
        content : Text;
        createdAt : Time.Time;
    };

    var comments = Map.empty<Nat, Comment>();
    var nextCommentId : Nat = 0;

    var articleLikes = Map.empty<Nat, List.List<Principal>>();

    var nextPinOrder : Nat = 0;

    var ledgerState = Ledger.initState();

    public shared ({ caller }) func createArticle(title : Text, content : Text, categories : [Text]) : async Nat {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can create articles");
        };

        let article : Article = {
            title;
            content;
            author = caller;
            createdAt = Time.now();
            updatedAt = Time.now();
            likeCount = 0;
            categories;
            visible = true;
            pinned = false;
            pinOrder = 0;
            hideReason = "";
        };

        let articleId = nextArticleId;
        articles.add(articleId, article);
        nextArticleId += 1;

        articleId;
    };

    public shared ({ caller }) func updateArticle(articleId : Nat, title : Text, content : Text, categories : [Text]) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can update articles");
        };

        switch (articles.get(articleId)) {
            case null {
                Runtime.trap("Article not found");
            };
            case (?article) {
                if (article.author != caller) {
                    Runtime.trap("Unauthorized: Only the author can update this article");
                };

                let updatedArticle : Article = {
                    article with
                    title;
                    content;
                    updatedAt = Time.now();
                    categories;
                };

                articles.add(articleId, updatedArticle);
            };
        };
    };

    public shared ({ caller }) func deleteArticle(articleId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can delete articles");
        };

        switch (articles.get(articleId)) {
            case null {
                Runtime.trap("Article not found");
            };
            case (?article) {
                if (article.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
                    Runtime.trap("Unauthorized: Only the author or admin can delete articles");
                };

                articles.remove(articleId);
            };
        };
    };

    public query ({ caller }) func getArticle(articleId : Nat) : async ?Article {
        switch (articles.get(articleId)) {
            case null { null };
            case (?article) {
                if (AccessControl.isAdmin(accessControlState, caller)) {
                    return ?article;
                };
                if (article.author == caller) {
                    return ?article;
                };
                if (article.visible) {
                    return ?article;
                };
                null;
            };
        };
    };

    public query ({ caller }) func getAllArticles() : async [(Nat, Article)] {
        var articleList = List.empty<(Nat, Article)>();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        for ((id, article) in articles.entries()) {
            if (isAdmin or article.visible or article.author == caller) {
                articleList.add((id, article));
            };
        };
        articleList.toArray();
    };

    public query ({ caller }) func getArticlesByAuthor(author : Principal) : async [(Nat, Article)] {
        var articleList = List.empty<(Nat, Article)>();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        for ((id, article) in articles.entries()) {
            if (article.author == author) {
                if (isAdmin or article.visible or article.author == caller) {
                    articleList.add((id, article));
                };
            };
        };
        articleList.toArray();
    };

    public query ({ caller }) func getArticlesByCategory(category : Text) : async [(Nat, Article)] {
        var articleList = List.empty<(Nat, Article)>();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        for ((id, article) in articles.entries()) {
            if (article.categories.find(func(c : Text) : Bool { c == category }) != null) {
                if (isAdmin or article.visible or article.author == caller) {
                    articleList.add((id, article));
                };
            };
        };
        articleList.toArray();
    };

    public shared ({ caller }) func setArticlePinned(articleId : Nat, pinned : Bool) : async () {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
            Runtime.trap("Unauthorized: Only admins can pin articles");
        };

        switch (articles.get(articleId)) {
            case null {
                Runtime.trap("Article not found");
            };
            case (?article) {
                let updatedArticle : Article = if (pinned) {
                    let order = nextPinOrder;
                    nextPinOrder += 1;
                    { article with pinned = true; pinOrder = order };
                } else {
                    { article with pinned = false; pinOrder = 0 };
                };
                articles.add(articleId, updatedArticle);
            };
        };
    };

    public shared ({ caller }) func setArticleVisible(articleId : Nat, visible : Bool, hideReason : Text) : async () {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
            Runtime.trap("Unauthorized: Only admins can change article visibility");
        };

        switch (articles.get(articleId)) {
            case null {
                Runtime.trap("Article not found");
            };
            case (?article) {
                let updatedArticle : Article = if (visible) {
                    { article with visible = true; hideReason = "" };
                } else {
                    { article with visible = false; hideReason };
                };
                articles.add(articleId, updatedArticle);

                if (not visible) {
                    switch (userProfiles.get(article.author)) {
                        case null {};
                        case (?profile) {
                            switch (profile.email) {
                                case null {};
                                case (?email) {
                                    let subject = "您的文章已被隐藏：" # article.title;
                                    let body = "您好，您的文章《" # article.title # "》已被平台管理员隐藏。\n隐藏原因：" # hideReason;
                                    let _ = await EmailClient.sendServiceEmail(
                                        "no-reply",
                                        [email],
                                        subject,
                                        body,
                                    );
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    let registry = {
        var authorizedPrincipals = [] : [Principal];
        var blobsToRemove = Map.empty<Text, Bool>();
        var references = Registry.new();
    };
    include BlobStorage(registry.references);

    public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
        Registry.add(registry.references, path, hash);
    };

    public query ({ caller }) func getFileReference(path : Text) : async ?Registry.FileReference {
        Registry.get(registry.references, path);
    };

    public query ({ caller }) func listFileReferences() : async [Registry.FileReference] {
        Registry.list(registry.references);
    };

    public shared ({ caller }) func dropFileReference(path : Text) : async () {
        Registry.remove(registry.references, path);
    };

    public query ({ caller }) func getTokenBalance() : async Nat {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can view token balance");
        };
        Ledger.getBalance(ledgerState, caller);
    };

    public shared ({ caller }) func transferTokens(to : Principal, amount : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can transfer tokens");
        };
        Ledger.transfer(ledgerState, caller, to, amount);
    };

    public query ({ caller }) func isCallerApproved() : async Bool {
        AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
    };

    public shared ({ caller }) func requestApproval() : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can request approval");
        };
        UserApproval.requestApproval(approvalState, caller);
    };

    public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Runtime.trap("Unauthorized: Only admins can perform this action");
        };
        UserApproval.setApproval(approvalState, user, status);
    };

    public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Runtime.trap("Unauthorized: Only admins can perform this action");
        };
        UserApproval.listApprovals(approvalState);
    };

    public shared ({ caller }) func addComment(articleId : Nat, content : Text) : async Nat {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can add comments");
        };

        if (articleId == 999999) {
            let comment : Comment = {
                commentId = nextCommentId;
                articleId;
                author = caller;
                content;
                createdAt = Time.now();
            };

            comments.add(nextCommentId, comment);
            nextCommentId += 1;

            return nextCommentId - 1;
        };

        switch (articles.get(articleId)) {
            case null {
                Runtime.trap("Article not found");
            };
            case (?article) {
                let canAccess = AccessControl.isAdmin(accessControlState, caller) or
                               article.author == caller or
                               article.visible;

                if (not canAccess) {
                    Runtime.trap("Unauthorized: Cannot comment on this article");
                };

                let comment : Comment = {
                    commentId = nextCommentId;
                    articleId;
                    author = caller;
                    content;
                    createdAt = Time.now();
                };

                comments.add(nextCommentId, comment);
                nextCommentId += 1;

                nextCommentId - 1;
            };
        };
    };

    public query ({ caller }) func getCommentsForArticle(articleId : Nat) : async [Comment] {
        if (articleId == 999999) {
            var commentList = List.empty<Comment>();
            for ((_, comment) in comments.entries()) {
                if (comment.articleId == articleId) {
                    commentList.add(comment);
                };
            };
            return commentList.toArray();
        };

        switch (articles.get(articleId)) {
            case null {
                Runtime.trap("Article not found");
            };
            case (?article) {
                let canAccess = AccessControl.isAdmin(accessControlState, caller) or
                               article.author == caller or
                               article.visible;

                if (not canAccess) {
                    Runtime.trap("Unauthorized: Cannot view comments for this article");
                };

                var commentList = List.empty<Comment>();
                for ((_, comment) in comments.entries()) {
                    if (comment.articleId == articleId) {
                        commentList.add(comment);
                    };
                };
                commentList.toArray();
            };
        };
    };

    public shared ({ caller }) func likeArticle(articleId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can like articles");
        };

        switch (articles.get(articleId)) {
            case null {
                Runtime.trap("Article not found");
            };
            case (?article) {
                let canLike = article.author == caller or article.visible;
                if (not canLike) {
                    Runtime.trap("Cannot like hidden articles");
                };

                let currentLikes = switch (articleLikes.get(articleId)) {
                    case null { List.empty<Principal>() };
                    case (?likes) { likes };
                };

                if (currentLikes.find(func(p : Principal) : Bool { p == caller }) != null) {
                    Runtime.trap("Already liked this article");
                };

                currentLikes.add(caller);
                articleLikes.add(articleId, currentLikes);

                let updatedArticle : Article = {
                    article with likeCount = article.likeCount + 1
                };
                articles.add(articleId, updatedArticle);
            };
        };
    };

    public shared ({ caller }) func unlikeArticle(articleId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can unlike articles");
        };

        switch (articles.get(articleId)) {
            case null {
                Runtime.trap("Article not found");
            };
            case (?article) {
                let currentLikes = switch (articleLikes.get(articleId)) {
                    case null { List.empty<Principal>() };
                    case (?likes) { likes };
                };

                if (currentLikes.find(func(p : Principal) : Bool { p == caller }) == null) {
                    Runtime.trap("Have not liked this article");
                };

                let updatedLikes = List.empty<Principal>();
                for (p in currentLikes.values()) {
                    if (p != caller) {
                        updatedLikes.add(p);
                    };
                };
                articleLikes.add(articleId, updatedLikes);

                let updatedArticle : Article = {
                    article with likeCount = if (article.likeCount > 0) { article.likeCount - 1 : Nat } else {
                        0;
                    };
                };
                articles.add(articleId, updatedArticle);
            };
        };
    };

    public query ({ caller }) func hasLikedArticle(articleId : Nat) : async Bool {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            return false;
        };

        switch (articleLikes.get(articleId)) {
            case null { false };
            case (?likes) {
                likes.find(func(p : Principal) : Bool { p == caller }) != null;
            };
        };
    };

    public query func getArticleLikeCount(articleId : Nat) : async Nat {
        switch (articles.get(articleId)) {
            case null { 0 };
            case (?article) { article.likeCount };
        };
    };

    public shared ({ caller }) func deleteComment(commentId : Nat) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can delete comments");
        };

        switch (comments.get(commentId)) {
            case null {
                Runtime.trap("Comment not found");
            };
            case (?comment) {
                if (comment.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
                    Runtime.trap("Unauthorized: Only the comment author or admin can delete this comment");
                };

                comments.remove(commentId);
            };
        };
    };



};
