import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ApprovalStatus = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export interface Article {
  'categories' : Array<string>,
  'title' : string,
  'likeCount' : bigint,
  'content' : string,
  'submittedForReview' : boolean,
  'createdAt' : Time,
  'author' : Principal,
  'approvalStatus' : bigint,
  'updatedAt' : Time,
}
export interface Comment {
  'content' : string,
  'commentId' : bigint,
  'createdAt' : Time,
  'author' : Principal,
  'articleId' : bigint,
}
export interface FileReference { 'hash' : string, 'path' : string }
export interface Land { 'x' : bigint, 'y' : bigint, 'id' : bigint }
export interface MiningHistory {
  'result' : MiningResult,
  'landId' : bigint,
  'timestamp' : Time,
}
export interface MiningLeaderboardEntry {
  'principal' : Principal,
  'gold' : bigint,
}
export type MiningResult = { 'gold' : bigint } |
  { 'nothing' : null } |
  { 'death' : null };
export type PlayerStatus = { 'alive' : null } |
  { 'dead' : null };
export type Time = bigint;
export interface TradingPair {
  'enabled' : boolean,
  'coinId' : string,
  'symbol' : string,
}
export interface UserApprovalInfo {
  'status' : ApprovalStatus,
  'principal' : Principal,
}
export interface UserProfile { 'name' : string }
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface _SERVICE {
  'addComment' : ActorMethod<[bigint, string], bigint>,
  'addTradingPair' : ActorMethod<[string, string, boolean], undefined>,
  'approveArticle' : ActorMethod<[bigint], undefined>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'createArticle' : ActorMethod<
    [string, string, boolean, Array<string>],
    bigint
  >,
  'deleteArticle' : ActorMethod<[bigint], undefined>,
  'deleteComment' : ActorMethod<[bigint], undefined>,
  'deleteTradingPair' : ActorMethod<[string], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'getAllArticles' : ActorMethod<[], Array<[bigint, Article]>>,
  'getAllLands' : ActorMethod<[], Array<Land>>,
  'getAllTradingPairs' : ActorMethod<[], Array<[string, TradingPair]>>,
  'getArticle' : ActorMethod<[bigint], [] | [Article]>,
  'getArticleLikeCount' : ActorMethod<[bigint], bigint>,
  'getArticlesByAuthor' : ActorMethod<[Principal], Array<[bigint, Article]>>,
  'getArticlesByCategory' : ActorMethod<[string], Array<[bigint, Article]>>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getCommentsForArticle' : ActorMethod<[bigint], Array<Comment>>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getLand' : ActorMethod<[bigint], [] | [Land]>,
  'getLogEnabled' : ActorMethod<[], boolean>,
  'getMiningHistory' : ActorMethod<[], Array<MiningHistory>>,
  'getMiningLeaderboard' : ActorMethod<[], Array<MiningLeaderboardEntry>>,
  'getMiningProbability' : ActorMethod<[], [bigint, bigint]>,
  'getPlayerGold' : ActorMethod<[], bigint>,
  'getPlayerStatus' : ActorMethod<[], PlayerStatus>,
  'getTokenBalance' : ActorMethod<[], bigint>,
  'getTotalGoldMined' : ActorMethod<[], bigint>,
  'getTotalMiningOperations' : ActorMethod<[], bigint>,
  'getTotalPlayers' : ActorMethod<[], bigint>,
  'getTradingPair' : ActorMethod<[string], [] | [TradingPair]>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'hasLikedArticle' : ActorMethod<[bigint], boolean>,
  'initializeAccessControl' : ActorMethod<[], undefined>,
  'initializeLands' : ActorMethod<[], undefined>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'isCallerApproved' : ActorMethod<[], boolean>,
  'likeArticle' : ActorMethod<[bigint], undefined>,
  'listApprovals' : ActorMethod<[], Array<UserApprovalInfo>>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'mineLand' : ActorMethod<[bigint], MiningResult>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'rejectArticle' : ActorMethod<[bigint], undefined>,
  'requestApproval' : ActorMethod<[], undefined>,
  'revive' : ActorMethod<[], undefined>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'setApproval' : ActorMethod<[Principal, ApprovalStatus], undefined>,
  'setLogEnabled' : ActorMethod<[boolean], undefined>,
  'setMiningProbability' : ActorMethod<[bigint, bigint], undefined>,
  'transferTokens' : ActorMethod<[Principal, bigint], undefined>,
  'unlikeArticle' : ActorMethod<[bigint], undefined>,
  'updateArticle' : ActorMethod<
    [bigint, string, string, boolean, Array<string>],
    undefined
  >,
  'updateTradingPair' : ActorMethod<[string, boolean], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
