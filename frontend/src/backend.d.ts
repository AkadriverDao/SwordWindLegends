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
    submittedForReview: boolean;
    createdAt: Time;
    author: Principal;
    approvalStatus: bigint;
    updatedAt: Time;
}
export type Time = bigint;
export interface Comment {
    content: string;
    commentId: bigint;
    createdAt: Time;
    author: Principal;
    articleId: bigint;
}
export interface TradingPair {
    enabled: boolean;
    coinId: string;
    symbol: string;
}
export interface Land {
    x: bigint;
    y: bigint;
    id: bigint;
}
export interface GameMod {
    title: string;
    link: string;
    createdAt: Time;
    gameId: bigint;
    description: string;
    imageUrl: string;
}
export interface MiningLeaderboardEntry {
    principal: Principal;
    gold: bigint;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type MiningResult = {
    __kind__: "gold";
    gold: bigint;
} | {
    __kind__: "nothing";
    nothing: null;
} | {
    __kind__: "death";
    death: null;
};
export interface FileReference {
    hash: string;
    path: string;
}
export interface MiningHistory {
    result: MiningResult;
    landId: bigint;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum PlayerStatus {
    alive = "alive",
    dead = "dead"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(articleId: bigint, content: string): Promise<bigint>;
    addGameMod(title: string, description: string, imageUrl: string, link: string): Promise<bigint>;
    addTradingPair(symbol: string, coinId: string, enabled: boolean): Promise<void>;
    approveArticle(articleId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(title: string, content: string, submittedForReview: boolean, categories: Array<string>): Promise<bigint>;
    deleteArticle(articleId: bigint): Promise<void>;
    deleteComment(commentId: bigint): Promise<void>;
    deleteTradingPair(symbol: string): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    getAllArticles(): Promise<Array<[bigint, Article]>>;
    getAllGameMods(): Promise<Array<[bigint, GameMod]>>;
    getAllLands(): Promise<Array<Land>>;
    getAllTradingPairs(): Promise<Array<[string, TradingPair]>>;
    getArticle(articleId: bigint): Promise<Article | null>;
    getArticleLikeCount(articleId: bigint): Promise<bigint>;
    getArticlesByAuthor(author: Principal): Promise<Array<[bigint, Article]>>;
    getArticlesByCategory(category: string): Promise<Array<[bigint, Article]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsForArticle(articleId: bigint): Promise<Array<Comment>>;
    getFileReference(path: string): Promise<FileReference>;
    getGameModById(gameId: bigint): Promise<GameMod | null>;
    getLand(landId: bigint): Promise<Land | null>;
    getLogEnabled(): Promise<boolean>;
    getMiningHistory(): Promise<Array<MiningHistory>>;
    getMiningLeaderboard(): Promise<Array<MiningLeaderboardEntry>>;
    getMiningProbability(): Promise<[bigint, bigint]>;
    getPlayerGold(): Promise<bigint>;
    getPlayerStatus(): Promise<PlayerStatus>;
    getTokenBalance(): Promise<bigint>;
    getTotalGoldMined(): Promise<bigint>;
    getTotalMiningOperations(): Promise<bigint>;
    getTotalPlayers(): Promise<bigint>;
    getTradingPair(symbol: string): Promise<TradingPair | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasLikedArticle(articleId: bigint): Promise<boolean>;
    initializeAccessControl(): Promise<void>;
    initializeLands(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    likeArticle(articleId: bigint): Promise<void>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listFileReferences(): Promise<Array<FileReference>>;
    mineLand(landId: bigint): Promise<MiningResult>;
    registerFileReference(path: string, hash: string): Promise<void>;
    rejectArticle(articleId: bigint): Promise<void>;
    requestApproval(): Promise<void>;
    revive(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setLogEnabled(enabled: boolean): Promise<void>;
    setMiningProbability(goldProb: bigint, deathProb: bigint): Promise<void>;
    transferTokens(to: Principal, amount: bigint): Promise<void>;
    unlikeArticle(articleId: bigint): Promise<void>;
    updateArticle(articleId: bigint, title: string, content: string, submittedForReview: boolean, categories: Array<string>): Promise<void>;
    updateGameMod(gameId: bigint, title: string, description: string, imageUrl: string, link: string): Promise<void>;
    updateTradingPair(symbol: string, enabled: boolean): Promise<void>;
}
