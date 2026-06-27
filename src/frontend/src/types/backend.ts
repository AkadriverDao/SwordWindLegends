import type { Principal } from "@icp-sdk/core/principal";

export interface UserProfile {
  name: string;
  email?: string;
}

export interface Article {
  id: bigint;
  title: string;
  content: string;
  author: Principal;
  createdAt: bigint;
  updatedAt: bigint;
  likes: bigint;
  visible: boolean;
  pinned: boolean;
  pinOrder: bigint;
  hideReason: string;
  categories: string[];
}

export interface Comment {
  id: bigint;
  articleId: bigint;
  author: Principal;
  content: string;
  createdAt: bigint;
  commentId: bigint;
}

export interface TradingPair {
  symbol: string;
  coinId: string;
  enabled: boolean;
}

export interface MiningLeaderboardEntry {
  principal: Principal;
  name: string;
  goldCoins: bigint;
  miningCount: bigint;
}

export interface FileReference {
  id: string;
  url: string;
}
