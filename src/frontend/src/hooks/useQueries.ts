// Main queries hook - imports from modular files
export * from "./useUserQueries";
export * from "./useArticleQueries";
export * from "./useLikeQueries";
export * from "./useCommentQueries";
export * from "./useTradingPairQueries";
export * from "./useMiningConfigQueries";
export * from "./useApprovalQueries";
export * from "./useLandMinerQueries";
export * from "./useGoldExchangeQueries";

// Re-export commonly used types
export type { CommentWithReplies } from "./useCommentQueries";
export type { MiningProbabilities } from "./useMiningConfigQueries";
export type { ExchangeRecord, ExchangeResult } from "./useGoldExchangeQueries";

// Re-export mining leaderboard hook for backward compatibility
export { useGetMiningLeaderboard } from "./useUserQueries";
