import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { TradingPair } from '../backend';

// Super user Principal IDs
const SUPER_USER_PRINCIPALS = [
  '56mut-kmgj4-vw3kg-4wrap-bxuiu-tbewj-3iovp-pe6ra-ejg2n-f6oyu-hae',
  '2cho5-wjr5v-rmr6c-ltfkb-g4a6w-c7j26-ya2lp-46pn2-n2air-wbjnw-cae'
];

// Conditional logging helper
async function conditionalLog(actor: any, message: string, ...args: any[]) {
  try {
    if (actor) {
      const logEnabled = await actor.getLogEnabled();
      if (logEnabled) {
        console.log(message, ...args);
      }
    }
  } catch (error) {
    // If we can't check log status, don't log anything
  }
}

export function useGetAllTradingPairs() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, TradingPair]>>({
    queryKey: ['allTradingPairs'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getAllTradingPairs();
        await conditionalLog(actor, 'Backend trading pairs retrieved:', result);
        return result;
      } catch (error) {
        await conditionalLog(actor, 'Error fetching trading pairs from backend:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useAddTradingPair() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ symbol, coinId }: { symbol: string; coinId: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      const currentPrincipal = identity.getPrincipal().toString();
      if (!SUPER_USER_PRINCIPALS.includes(currentPrincipal)) {
        throw new Error('权限不足：只有超级管理员可以管理交易对');
      }

      try {
        await conditionalLog(actor, '调用后端 addTradingPair 方法:', symbol, coinId);
        await actor.addTradingPair(symbol, coinId, true);
        await conditionalLog(actor, '交易对添加成功:', symbol, coinId);
      } catch (error) {
        await conditionalLog(actor, '添加交易对失败:', error);
        if (error instanceof Error && error.message.includes('权限不足')) {
          throw error;
        }
        throw new Error('添加交易对失败，请重试');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTradingPairs'] });
      queryClient.refetchQueries({ queryKey: ['allTradingPairs'] });
    },
    onError: (error) => {
      console.error('添加交易对失败:', error);
    },
  });
}

export function useUpdateTradingPair() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ symbol, enabled }: { symbol: string; enabled: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      const currentPrincipal = identity.getPrincipal().toString();
      if (!SUPER_USER_PRINCIPALS.includes(currentPrincipal)) {
        throw new Error('权限不足：只有超级管理员可以管理交易对');
      }

      try {
        await conditionalLog(actor, '调用后端 updateTradingPair 方法:', symbol, enabled);
        await actor.updateTradingPair(symbol, enabled);
        await conditionalLog(actor, '交易对更新成功:', symbol);
      } catch (error) {
        await conditionalLog(actor, '更新交易对失败:', error);
        if (error instanceof Error && error.message.includes('权限不足')) {
          throw error;
        }
        throw new Error('更新交易对失败，请重试');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTradingPairs'] });
      queryClient.refetchQueries({ queryKey: ['allTradingPairs'] });
    },
    onError: (error) => {
      console.error('更新交易对失败:', error);
    },
  });
}

export function useDeleteTradingPair() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (symbol: string) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      const currentPrincipal = identity.getPrincipal().toString();
      if (!SUPER_USER_PRINCIPALS.includes(currentPrincipal)) {
        throw new Error('权限不足：只有超级管理员可以管理交易对');
      }

      try {
        await conditionalLog(actor, '调用后端 deleteTradingPair 方法:', symbol);
        await actor.deleteTradingPair(symbol);
        await conditionalLog(actor, '交易对删除成功');
      } catch (error) {
        await conditionalLog(actor, '删除交易对失败:', error);
        if (error instanceof Error && error.message.includes('权限不足')) {
          throw error;
        }
        throw new Error('删除交易对失败，请重试');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTradingPairs'] });
      queryClient.refetchQueries({ queryKey: ['allTradingPairs'] });
    },
    onError: (error) => {
      console.error('删除交易对失败:', error);
    },
  });
}
