import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

// Land Miner Game Configuration Types
export interface MiningProbabilities {
  goldProbability: number;
  deathProbability: number;
  nothingProbability: number;
}

// Global log status cache
let globalLogStatus: boolean | null = null;
let lastLogStatusFetch = 0;
const LOG_STATUS_CACHE_DURATION = 100;

// Conditional logging helper
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
    // If we can't check log status, don't log anything
  }
}

function conditionalLogSync(
  logEnabled: boolean,
  message: string,
  ...args: any[]
) {
  if (logEnabled) {
    console.log(message, ...args);
  }
}

export function useGetMiningProbabilities() {
  const { actor, isFetching } = useActor();

  return useQuery<MiningProbabilities>({
    queryKey: ["miningProbabilities"],
    queryFn: async () => {
      if (!actor)
        return {
          goldProbability: 65,
          deathProbability: 5,
          nothingProbability: 30,
        };
      try {
        await conditionalLog(actor, "获取挖矿概率配置");
        const [goldProb, deathProb] = await actor.getMiningProbability();
        const goldProbability = Number(goldProb);
        const deathProbability = Number(deathProb);
        const nothingProbability = 100 - goldProbability - deathProbability;

        const probabilities = {
          goldProbability,
          deathProbability,
          nothingProbability,
        };

        await conditionalLog(actor, "返回的概率配置:", probabilities);
        return probabilities;
      } catch (error) {
        await conditionalLog(actor, "获取挖矿概率配置失败:", error);
        return {
          goldProbability: 65,
          deathProbability: 5,
          nothingProbability: 30,
        };
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchInterval: 100,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useGetMiningLoggingEnabled() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["miningLoggingEnabled"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const logEnabled = await actor.getLogEnabled();
        globalLogStatus = logEnabled;
        lastLogStatusFetch = Date.now();
        conditionalLogSync(logEnabled, "获取挖矿日志开关状态:", logEnabled);
        return logEnabled;
      } catch (_error) {
        globalLogStatus = false;
        lastLogStatusFetch = Date.now();
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchInterval: 100,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
