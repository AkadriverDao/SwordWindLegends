// Migration module for the article-management refactor.
//
// State shape changes vs. the previously deployed version:
//   - Article: removed `approvalStatus : Int` and `submittedForReview : Bool`;
//              added `visible : Bool`, `pinned : Bool`, `pinOrder : Nat`,
//              `hideReason : Text`.
//   - UserProfile: added `email : ?Text`.
//   - Actor: added `nextPinOrder : Nat` stable field.
//
// Old types are defined inline (copied from the previous main.mo) per the
// migrating-motoko-actors skill — never import from `.old/`.

import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserApproval "mo:caffeineai-user-approval/approval";
import Ledger "ledger";
import Registry "blob-storage/registry";

module {
    // ---- Old types (mirrors of the previously deployed stable signature) ----

    public type OldUserProfile = {
        name : Text;
    };

    public type OldArticle = {
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

    public type OldComment = {
        commentId : Nat;
        articleId : Nat;
        author : Principal;
        content : Text;
        createdAt : Time.Time;
    };

    // Old actor stable state. Field names and types must match the previous
    // version's stable signature exactly so the upgrade compatibility check
    // passes.
    public type OldRegistry = {
        var authorizedPrincipals : [Principal];
        var blobsToRemove : Map.Map<Text, Bool>;
        var references : Map.Map<Text, Registry.FileReference>;
    };

    public type OldActor = {
        accessControlState : AccessControl.AccessControlState;
        approvalState : UserApproval.UserApprovalState;
        var userProfiles : Map.Map<Principal, OldUserProfile>;
        var articles : Map.Map<Nat, OldArticle>;
        var nextArticleId : Nat;
        var comments : Map.Map<Nat, OldComment>;
        var nextCommentId : Nat;
        var articleLikes : Map.Map<Nat, List.List<Principal>>;
        var ledgerState : Ledger.LedgerState;
        var registry : OldRegistry;
    };

    // ---- New types (mirrors of the new stable signature) ----

    public type NewUserProfile = {
        name : Text;
        email : ?Text;
    };

    public type NewArticle = {
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

    public type NewComment = {
        commentId : Nat;
        articleId : Nat;
        author : Principal;
        content : Text;
        createdAt : Time.Time;
    };

    public type NewRegistry = {
        var authorizedPrincipals : [Principal];
        var blobsToRemove : Map.Map<Text, Bool>;
        var references : Map.Map<Text, Registry.FileReference>;
    };

    public type NewActor = {
        accessControlState : AccessControl.AccessControlState;
        approvalState : UserApproval.UserApprovalState;
        var userProfiles : Map.Map<Principal, NewUserProfile>;
        var articles : Map.Map<Nat, NewArticle>;
        var nextArticleId : Nat;
        var comments : Map.Map<Nat, NewComment>;
        var nextCommentId : Nat;
        var articleLikes : Map.Map<Nat, List.List<Principal>>;
        var nextPinOrder : Nat;
        var ledgerState : Ledger.LedgerState;
        var registry : NewRegistry;
    };

    public func run(old : OldActor) : NewActor {
        // Migrate user profiles: add email = null.
        let userProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
            func(_principal, profile) {
                { name = profile.name; email = null };
            },
        );

        // Migrate articles: drop approvalStatus/submittedForReview, add the
        // new visibility/pin fields with safe defaults. Every legacy article
        // becomes visible=true (the de-approval requirement).
        let articles = old.articles.map<Nat, OldArticle, NewArticle>(
            func(_id, article) {
                {
                    title = article.title;
                    content = article.content;
                    author = article.author;
                    createdAt = article.createdAt;
                    updatedAt = article.updatedAt;
                    likeCount = article.likeCount;
                    categories = article.categories;
                    visible = true;
                    pinned = false;
                    pinOrder = 0;
                    hideReason = "";
                };
            },
        );

        // Comments are structurally unchanged — same fields, same types.
        let comments = old.comments;

        // articleLikes is unchanged.
        let articleLikes = old.articleLikes;

        {
            accessControlState = old.accessControlState;
            approvalState = old.approvalState;
            var userProfiles;
            var articles;
            var nextArticleId = old.nextArticleId;
            var comments;
            var nextCommentId = old.nextCommentId;
            var articleLikes;
            // New stable field: start the pin-order counter at 0. Existing
            // articles are all unpinned, so the first pin gets order 0.
            var nextPinOrder = 0;
            var ledgerState = old.ledgerState;
            var registry = old.registry;
        };
    };
};
