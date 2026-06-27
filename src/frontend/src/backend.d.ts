import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Article {
    categories: Array<string>;
    title: string;
    likeCount: bigint;
    content: string;
    createdAt: Time;
    author: Principal;
    updatedAt: Time;
    pinned: boolean;
    hideReason: string;
    visible: boolean;
    pinOrder: bigint;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type Time = bigint;
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Comment {
    content: string;
    commentId: bigint;
    createdAt: Time;
    author: Principal;
    articleId: bigint;
}
export interface FileReference {
    hash: string;
    path: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface UserProfile {
    name: string;
    email?: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(articleId: bigint, content: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(title: string, content: string, categories: Array<string>): Promise<bigint>;
    deleteArticle(articleId: bigint): Promise<void>;
    deleteComment(commentId: bigint): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    getAllArticles(): Promise<Array<[bigint, Article]>>;
    getArticle(articleId: bigint): Promise<Article | null>;
    getArticleLikeCount(articleId: bigint): Promise<bigint>;
    getArticlesByAuthor(author: Principal): Promise<Array<[bigint, Article]>>;
    getArticlesByCategory(category: string): Promise<Array<[bigint, Article]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsForArticle(articleId: bigint): Promise<Array<Comment>>;
    getFileReference(path: string): Promise<FileReference | null>;
    getTokenBalance(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasLikedArticle(articleId: bigint): Promise<boolean>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    likeArticle(articleId: bigint): Promise<void>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listFileReferences(): Promise<Array<FileReference>>;
    registerFileReference(path: string, hash: string): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setArticlePinned(articleId: bigint, pinned: boolean): Promise<void>;
    setArticleVisible(articleId: bigint, visible: boolean, hideReason: string): Promise<void>;
    transferTokens(to: Principal, amount: bigint): Promise<void>;
    unlikeArticle(articleId: bigint): Promise<void>;
    updateArticle(articleId: bigint, title: string, content: string, categories: Array<string>): Promise<void>;
}
