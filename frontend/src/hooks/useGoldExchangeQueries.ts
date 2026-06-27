import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

// Types for Gold Exchange System (will be replaced with backend types when implemented)
export interface ExchangeRecord {
  exchangeId: number;
  goldAmount: number;
  icpAmount: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface ExchangeResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

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

// Get current exchange rate (gold to ICP)
export function useGetExchangeRate() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['exchangeRate'],
    queryFn: async () => {
      if (!actor) return 100; // Default rate: 100 gold = 1 ICP
      try {
        await conditionalLog(actor, '获取金币兑换汇率');
        // TODO: Replace with actual backend call when implemented
        // return Number(await actor.getExchangeRate());
        return 100; // Mock rate
      } catch (error) {
        await conditionalLog(actor, '获取兑换汇率失败:', error);
        return 100; // Fallback rate
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}

// Get user's exchange history
export function useGetExchangeHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ExchangeRecord[]>({
    queryKey: ['exchangeHistory', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      try {
        await conditionalLog(actor, '获取金币兑换历史');
        // TODO: Replace with actual backend call when implemented
        // const history = await actor.getExchangeHistory();
        // return history.map(record => ({
        //   exchangeId: Number(record.exchangeId),
        //   goldAmount: Number(record.goldAmount),
        //   icpAmount: Number(record.icpAmount),
        //   timestamp: Number(record.timestamp) / 1000000, // Convert from nanoseconds
        //   status: record.status
        // }));
        
        // Mock data for now
        return [
          {
            exchangeId: 1,
            goldAmount: 500,
            icpAmount: 5,
            timestamp: Date.now() - 86400000,
            status: 'completed' as const
          },
          {
            exchangeId: 2,
            goldAmount: 200,
            icpAmount: 2,
            timestamp: Date.now() - 172800000,
            status: 'completed' as const
          }
        ];
      } catch (error) {
        await conditionalLog(actor, '获取兑换历史失败:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000,
  });
}

// Exchange gold for ICP
export function useExchangeGoldForICP() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goldAmount }: { goldAmount: number }): Promise<ExchangeResult> => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      await conditionalLog(actor, '开始金币兑换:', goldAmount);
      
      try {
        // TODO: Replace with actual backend call when implemented
        // const result = await actor.exchangeGoldForICP(BigInt(goldAmount));
        // return {
        //   success: result.success,
        //   message: result.message,
        //   transactionId: result.transactionId
        // };
        
        // Mock implementation for now
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
        
        const icpAmount = goldAmount / 100; // Mock exchange rate
        return {
          success: true,
          message: `成功兑换 ${goldAmount} 金币为 ${icpAmount.toFixed(4)} ICP`,
          transactionId: `tx_${Date.now()}`
        };
      } catch (error) {
        await conditionalLog(actor, '金币兑换失败:', error);
        
        if (error instanceof Error) {
          if (error.message.includes('Insufficient balance') || error.message.includes('余额不足')) {
            throw new Error('金币余额不足，请先通过挖矿获得更多金币');
          } else if (error.message.includes('Invalid amount') || error.message.includes('无效数量')) {
            throw new Error('兑换数量无效，请输入有效的金币数量');
          } else if (error.message.includes('Unauthorized') || error.message.includes('权限不足')) {
            throw new Error('权限不足，请确保已登录');
          }
        }
        
        throw new Error('兑换失败，请重试');
      }
    },
    onSuccess: () => {
      // Refresh related queries after successful exchange
      queryClient.invalidateQueries({ queryKey: ['exchangeHistory'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_playerGold'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.invalidateQueries({ queryKey: ['miningLeaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['tokenBalance'] });
      
      queryClient.refetchQueries({ queryKey: ['exchangeHistory'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_playerGold'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.refetchQueries({ queryKey: ['miningLeaderboard'] });
      queryClient.refetchQueries({ queryKey: ['tokenBalance'] });
    },
    onError: (error) => {
      console.error('金币兑换失败:', error);
    },
  });
}
