import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MiningLeaderboardEntry, UserProfile } from "../types/backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Super user Principal IDs - both users can access management system
const SUPER_USER_PRINCIPALS = [
  "56mut-kmgj4-vw3kg-4wrap-bxuiu-tbewj-3iovp-pe6ra-ejg2n-f6oyu-hae",
  "2cho5-wjr5v-rmr6c-ltfkb-g4a6w-c7j26-ya2lp-46pn2-n2air-wbjnw-cae",
];

// Global log status cache for immediate access
let globalLogStatus: boolean | null = null;
let lastLogStatusFetch = 0;
const LOG_STATUS_CACHE_DURATION = 100;

// Enhanced conditional logging helper
async function conditionalLog(actor: any, message: string, ...args: any[]) {
  try {
    if (actor) {
      const now = Date.now();
      if (
        globalLogStatus === null ||
        now - lastLogStatusFetch > LOG_STATUS_CACHE_DURATION
      ) {
        try {
          const logEnabled = await actor.getLogEnabled();
          globalLogStatus = logEnabled;
          lastLogStatusFetch = now;
        } catch (_error) {
          return;
        }
      }

      if (globalLogStatus) {
        console.log(message, ...args);
      }
    }
  } catch (_error) {
    // If we can't check log status, don't log anything to be safe
  }
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      await conditionalLog(actor, "获取用户资料");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await conditionalLog(actor, "保存用户资料:", profile);
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["miningLeaderboard"] });
    },
  });
}

export function useGetUserProfile(user: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      await conditionalLog(actor, "获取用户资料:", user.toString());
      return actor.getUserProfile(user);
    },
    enabled: !!actor && !isFetching && !!user,
    staleTime: 10 * 60 * 1000,
  });
}

// Check if current user is super user
export function useIsSuperUser() {
  const { identity } = useInternetIdentity();

  const isSuperUser = identity
    ? SUPER_USER_PRINCIPALS.includes(identity.getPrincipal().toString())
    : false;

  return {
    isSuperUser,
  };
}

// Check if current user has management access
export function useHasManagementAccess() {
  const { identity } = useInternetIdentity();

  const hasManagementAccess = identity
    ? SUPER_USER_PRINCIPALS.includes(identity.getPrincipal().toString())
    : false;

  return {
    hasManagementAccess,
  };
}

// Mining leaderboard hooks - replacing article leaderboard
export function useGetMiningLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<MiningLeaderboardEntry[]>({
    queryKey: ["miningLeaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        await conditionalLog(actor, "获取挖矿排行榜数据");
        const result = await actor.getMiningLeaderboard();
        return result || [];
      } catch (error) {
        console.error("Error fetching mining leaderboard:", error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });
}

// Token balance hook
export function useGetTokenBalance() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ["tokenBalance", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      try {
        await conditionalLog(actor, "获取代币余额");
        return await actor.getTokenBalance();
      } catch (error) {
        console.error("Error fetching token balance:", error);
        return BigInt(0);
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 30 * 1000,
  });
}

// Token transfer hook
export function useTransferTokens() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recipient,
      amount,
    }: { recipient: string; amount: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      const recipientPrincipal = Principal.fromText(recipient);
      await conditionalLog(actor, "转账代币:", recipient, amount.toString());
      return actor.transferTokens(recipientPrincipal, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
    },
    onError: (error) => {
      console.error("Token transfer failed:", error);
    },
  });
}
