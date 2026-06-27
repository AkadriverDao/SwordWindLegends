import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

// Super user Principal IDs
const SUPER_USER_PRINCIPALS = [
  '56mut-kmgj4-vw3kg-4wrap-bxuiu-tbewj-3iovp-pe6ra-ejg2n-f6oyu-hae',
  '2cho5-wjr5v-rmr6c-ltfkb-g4a6w-c7j26-ya2lp-46pn2-n2air-wbjnw-cae'
];

// Land Miner Game Configuration Types
export interface MiningProbabilities {
  goldProbability: number;
  deathProbability: number;
  nothingProbability: number;
}

// Global log status cache
let globalLogStatus: boolean | null = null;
let lastLogStatusFetch: number = 0;
const LOG_STATUS_CACHE_DURATION = 100;

// Conditional logging helper
async function conditionalLog(actor: any, message: string, ...args: any[]) {
  try {
    if (actor) {
      const now = Date.now();
      if (globalLogStatus === null || (now - lastLogStatusFetch) > LOG_STATUS_CACHE_DURATION) {
        try {
          const logEnabled = await actor.getLogEnabled();
          globalLogStatus = logEnabled;
          lastLogStatusFetch = now;
        } catch (error) {
          return;
        }
      }
      
      if (globalLogStatus) {
        console.log(message, ...args);
      }
    }
  } catch (error) {
    // If we can't check log status, don't log anything
  }
}

function conditionalLogSync(logEnabled: boolean, message: string, ...args: any[]) {
  if (logEnabled) {
    console.log(message, ...args);
  }
}

export function useGetMiningProbabilities() {
  const { actor, isFetching } = useActor();

  return useQuery<MiningProbabilities>({
    queryKey: ['miningProbabilities'],
    queryFn: async () => {
      if (!actor) return { goldProbability: 65, deathProbability: 5, nothingProbability: 30 };
      try {
        await conditionalLog(actor, '获取挖矿概率配置');
        const [goldProb, deathProb] = await actor.getMiningProbability();
        const goldProbability = Number(goldProb);
        const deathProbability = Number(deathProb);
        const nothingProbability = 100 - goldProbability - deathProbability;
        
        const probabilities = {
          goldProbability,
          deathProbability,
          nothingProbability,
        };
        
        await conditionalLog(actor, '返回的概率配置:', probabilities);
        return probabilities;
      } catch (error) {
        await conditionalLog(actor, '获取挖矿概率配置失败:', error);
        return { goldProbability: 65, deathProbability: 5, nothingProbability: 30 };
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchInterval: 100,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useSetMiningProbabilities() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (probabilities: MiningProbabilities) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      const currentPrincipal = identity.getPrincipal().toString();
      if (!SUPER_USER_PRINCIPALS.includes(currentPrincipal)) {
        throw new Error('权限不足：只有超级管理员可以配置挖矿概率');
      }

      const total = probabilities.goldProbability + probabilities.deathProbability + probabilities.nothingProbability;
      if (Math.abs(total - 100) > 0.01) {
        throw new Error('概率总和必须等于100%');
      }

      try {
        await conditionalLog(actor, '设置挖矿概率配置:', probabilities);
        await actor.setMiningProbability(
          BigInt(probabilities.goldProbability),
          BigInt(probabilities.deathProbability)
        );
        await conditionalLog(actor, '挖矿概率配置设置成功');
      } catch (error) {
        await conditionalLog(actor, '设置挖矿概率配置失败:', error);
        throw error;
      }
    },
    onSuccess: () => {
      globalLogStatus = null;
      lastLogStatusFetch = 0;
      
      queryClient.invalidateQueries({ queryKey: ['miningProbabilities'] });
      queryClient.invalidateQueries({ queryKey: ['miningLoggingEnabled'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_playerGold'] });
      
      queryClient.refetchQueries({ queryKey: ['miningProbabilities'] });
      queryClient.refetchQueries({ queryKey: ['miningLoggingEnabled'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_playerGold'] });
    },
    onError: (error) => {
      console.error('设置挖矿概率配置失败:', error);
    },
  });
}

export function useGetMiningLoggingEnabled() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['miningLoggingEnabled'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const logEnabled = await actor.getLogEnabled();
        globalLogStatus = logEnabled;
        lastLogStatusFetch = Date.now();
        conditionalLogSync(logEnabled, '获取挖矿日志开关状态:', logEnabled);
        return logEnabled;
      } catch (error) {
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

export function useSetMiningLoggingEnabled() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      const currentPrincipal = identity.getPrincipal().toString();
      if (!SUPER_USER_PRINCIPALS.includes(currentPrincipal)) {
        throw new Error('权限不足：只有超级管理员可以配置挖矿日志');
      }

      try {
        await conditionalLog(actor, '设置挖矿日志开关:', enabled);
        await actor.setLogEnabled(enabled);
        await conditionalLog(actor, '挖矿日志开关设置成功:', enabled);
        globalLogStatus = enabled;
        lastLogStatusFetch = Date.now();
      } catch (error) {
        await conditionalLog(actor, '设置挖矿日志开关失败:', error);
        throw error;
      }
    },
    onSuccess: () => {
      globalLogStatus = null;
      lastLogStatusFetch = 0;
      
      queryClient.invalidateQueries({ queryKey: ['miningLoggingEnabled'] });
      queryClient.invalidateQueries({ queryKey: ['miningProbabilities'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_playerGold'] });
      
      queryClient.refetchQueries({ queryKey: ['miningLoggingEnabled'] });
      queryClient.refetchQueries({ queryKey: ['miningProbabilities'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_playerGold'] });
    },
    onError: (error) => {
      console.error('设置挖矿日志开关失败:', error);
    },
  });
}
