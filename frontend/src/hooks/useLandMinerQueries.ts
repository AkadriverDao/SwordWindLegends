import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useGetMiningLoggingEnabled } from './useMiningConfigQueries';

// Types for Land Miner Game
export interface Land {
  id: bigint;
  x: number;
  y: number;
}

export interface UserGameState {
  goldCoins: number;
  isAlive: boolean;
  miningCount: number;
  totalEarnings: number;
}

export interface MiningResult {
  outcome: 'gold' | 'empty' | 'dark_matter';
  goldCoins: number;
  message: string;
}

export interface GameStatistics {
  totalLands: number;
  totalMiners: number;
  totalMiningOperations: number;
  totalGoldMined: number;
}

export function useGetAllLands() {
  const { actor, isFetching } = useActor();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  return useQuery<Land[]>({
    queryKey: ['landMiner_allLands'],
    queryFn: async () => {
      if (!actor) {
        if (loggingEnabled) {
          console.log('游戏服务器不可用，返回模拟数据');
        }
        const mockLands: Land[] = [];
        for (let i = 0; i < 1000; i++) {
          const x = i % 40;
          const y = Math.floor(i / 40);
          mockLands.push({
            id: BigInt(i),
            x,
            y,
          });
        }
        return mockLands;
      }
      
      try {
        if (loggingEnabled) {
          console.log('获取所有土地数据');
        }
        
        const backendLands = await actor.getAllLands();
        if (loggingEnabled) {
          console.log('返回的土地数据:', backendLands);
        }
        
        return backendLands.map((land) => ({
          id: land.id,
          x: Number(land.x),
          y: Number(land.y),
        }));
      } catch (error) {
        if (loggingEnabled) {
          console.log('获取土地数据失败:', error);
        }
        const mockLands: Land[] = [];
        for (let i = 0; i < 1000; i++) {
          const x = i % 40;
          const y = Math.floor(i / 40);
          mockLands.push({
            id: BigInt(i),
            x,
            y,
          });
        }
        return mockLands;
      }
    },
    enabled: true,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useGetUserGameState() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  return useQuery<UserGameState | null>({
    queryKey: ['landMiner_userGameState', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      try {
        if (loggingEnabled) {
          console.log('获取用户游戏状态');
        }
        
        let currentGold = 0;
        let isAlive = true;
        
        try {
          currentGold = Number(await actor.getPlayerGold());
          if (loggingEnabled) {
            console.log('获取的金币数量:', currentGold);
          }
          
          const status = await actor.getPlayerStatus();
          isAlive = status === 'alive';
          if (loggingEnabled) {
            console.log('获取的角色状态:', status, '是否存活:', isAlive);
          }
          
          // If character is dead, ensure gold is 0 (backend should handle this, but frontend sync)
          if (!isAlive) {
            currentGold = 0;
            if (loggingEnabled) {
              console.log('角色死亡状态，金币已清零');
            }
          }
        } catch (error) {
          if (loggingEnabled) {
            console.log('获取玩家游戏状态失败:', error);
          }
          currentGold = 0;
          isAlive = true;
        }
        
        if (loggingEnabled) {
          console.log('最新游戏状态 - 金币:', currentGold, '存活状态:', isAlive);
        }
        
        return {
          goldCoins: currentGold,
          isAlive: isAlive,
          miningCount: 0,
          totalEarnings: currentGold,
        };
      } catch (error) {
        if (loggingEnabled) {
          console.log('获取用户游戏状态失败:', error);
        }
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 1 * 1000,
    refetchInterval: 2 * 1000,
  });
}

export function useGetPlayerGold() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  return useQuery<number>({
    queryKey: ['landMiner_playerGold', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return 0;
      try {
        if (loggingEnabled) {
          console.log('获取玩家当前金币数量');
        }
        
        const goldCoins = Number(await actor.getPlayerGold());
        if (loggingEnabled) {
          console.log('玩家金币数量:', goldCoins);
        }
        return goldCoins;
      } catch (error) {
        if (loggingEnabled) {
          console.log('获取玩家金币失败:', error);
        }
        return 0;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 500,
    refetchInterval: 1 * 1000,
  });
}

export function useGetGameStatistics() {
  const { actor, isFetching } = useActor();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  return useQuery<GameStatistics | null>({
    queryKey: ['landMiner_gameStatistics'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        if (loggingEnabled) {
          console.log('获取游戏统计数据');
        }
        
        const [totalPlayers, totalMiningOperations, totalGoldMined] = await Promise.all([
          actor.getTotalPlayers(),
          actor.getTotalMiningOperations(),
          actor.getTotalGoldMined(),
        ]);
        
        return {
          totalLands: 1000,
          totalMiners: Number(totalPlayers),
          totalMiningOperations: Number(totalMiningOperations),
          totalGoldMined: Number(totalGoldMined),
        };
      } catch (error) {
        if (loggingEnabled) {
          console.log('获取游戏统计失败:', error);
        }
        return {
          totalLands: 1000,
          totalMiners: 0,
          totalMiningOperations: 0,
          totalGoldMined: 0,
        };
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useMineLand() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  return useMutation({
    mutationFn: async (landId: bigint): Promise<MiningResult> => {
      if (!actor) throw new Error('游戏服务器不可用');
      if (!identity) throw new Error('用户未认证');
      
      if (loggingEnabled) {
        console.log('开始挖矿，土地ID:', landId.toString());
      }
      
      try {
        if (loggingEnabled) {
          console.log('调用挖矿方法:', landId.toString());
        }
        const backendResult = await actor.mineLand(landId);
        if (loggingEnabled) {
          console.log('挖矿方法返回结果:', backendResult);
        }
        
        let result: MiningResult;
        
        if (backendResult.__kind__ === 'nothing') {
          result = {
            outcome: 'empty',
            goldCoins: 0,
            message: `这次运气不好，在土地 #${landId} 什么都没挖到，继续努力！`
          };
        } else if (backendResult.__kind__ === 'gold' && backendResult.gold !== undefined) {
          const goldAmount = Number(backendResult.gold);
          result = {
            outcome: 'gold',
            goldCoins: goldAmount,
            message: `恭喜！您在土地 #${landId} 挖到了 ${goldAmount} 枚金币！`
          };
        } else if (backendResult.__kind__ === 'death') {
          result = {
            outcome: 'dark_matter',
            goldCoins: 0,
            message: `危险！您在土地 #${landId} 挖到了黑暗物质，角色死亡，金币清零！`
          };
        } else {
          if (loggingEnabled) {
            console.log('未知的挖矿结果格式:', backendResult);
          }
          result = {
            outcome: 'empty',
            goldCoins: 0,
            message: `挖矿完成，但结果格式未知`
          };
        }
        
        if (loggingEnabled) {
          console.log('转换后的挖矿结果:', result);
        }
        return result;
      } catch (error) {
        if (loggingEnabled) {
          console.log('挖矿请求失败:', error);
        }
        
        if (error instanceof Error) {
          if (error.message.includes('角色已死亡') || error.message.includes('dead')) {
            throw new Error('角色已死亡，请先复活后再进行挖矿');
          } else if (error.message.includes('无效的土地ID') || error.message.includes('Invalid land')) {
            throw new Error('无效的土地ID，请选择有效的土地');
          } else if (error.message.includes('Unauthorized') || error.message.includes('权限不足')) {
            throw new Error('权限不足，请确保已登录');
          }
        }
        
        throw new Error('挖矿请求失败，请重试');
      }
    },
    onSuccess: async () => {
      if (loggingEnabled) {
        console.log('挖矿成功，刷新金币余额和排行榜');
      }
      
      queryClient.invalidateQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_gameStatistics'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_playerGold'] });
      queryClient.invalidateQueries({ queryKey: ['miningLeaderboard'] });
      
      queryClient.refetchQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_gameStatistics'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_playerGold'] });
      queryClient.refetchQueries({ queryKey: ['miningLeaderboard'] });
      
      if (loggingEnabled) {
        console.log('所有游戏查询已刷新，包括排行榜');
      }
    },
    onError: (error) => {
      if (loggingEnabled) {
        console.log('挖矿请求失败:', error);
      }
    },
  });
}

export function useReviveCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (!actor) throw new Error('游戏服务器不可用');
      if (!identity) throw new Error('用户未认证');
      
      if (loggingEnabled) {
        console.log('开始复活角色');
      }
      
      try {
        if (loggingEnabled) {
          console.log('调用复活方法');
        }
        await actor.revive();
        if (loggingEnabled) {
          console.log('复活方法调用成功');
        }
      } catch (error) {
        if (loggingEnabled) {
          console.log('复活请求失败:', error);
        }
        
        if (error instanceof Error) {
          if (error.message.includes('角色已存活') || error.message.includes('already alive')) {
            throw new Error('角色已存活，无需复活');
          } else if (error.message.includes('玩家未找到') || error.message.includes('Player not found')) {
            throw new Error('玩家数据未找到，请重新登录');
          } else if (error.message.includes('Unauthorized') || error.message.includes('权限不足')) {
            throw new Error('权限不足，请确保已登录');
          }
        }
        
        throw new Error('复活请求失败，请重试');
      }
    },
    onSuccess: async () => {
      if (loggingEnabled) {
        console.log('复活成功，刷新所有游戏相关查询以获取最新状态，包括排行榜');
      }
      
      queryClient.invalidateQueries({ queryKey: ['landMiner_allLands'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_gameStatistics'] });
      queryClient.invalidateQueries({ queryKey: ['landMiner_playerGold'] });
      queryClient.invalidateQueries({ queryKey: ['miningLeaderboard'] });
      
      queryClient.refetchQueries({ queryKey: ['landMiner_allLands'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_userGameState'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_gameStatistics'] });
      queryClient.refetchQueries({ queryKey: ['landMiner_playerGold'] });
      queryClient.refetchQueries({ queryKey: ['miningLeaderboard'] });
      
      if (loggingEnabled) {
        console.log('复活成功，所有游戏查询已刷新，包括排行榜');
      }
    },
    onError: (error) => {
      if (loggingEnabled) {
        console.log('复活角色失败:', error);
      }
    },
  });
}

export function useRefreshUserGameState() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  return () => {
    if (loggingEnabled) {
      console.log('强制刷新用户游戏状态以获取最新金币余额和排行榜');
    }
    queryClient.invalidateQueries({ queryKey: ['landMiner_userGameState', identity?.getPrincipal().toString()] });
    queryClient.refetchQueries({ queryKey: ['landMiner_userGameState', identity?.getPrincipal().toString()] });
    queryClient.invalidateQueries({ queryKey: ['landMiner_playerGold', identity?.getPrincipal().toString()] });
    queryClient.refetchQueries({ queryKey: ['landMiner_playerGold', identity?.getPrincipal().toString()] });
    queryClient.invalidateQueries({ queryKey: ['miningLeaderboard'] });
    queryClient.refetchQueries({ queryKey: ['miningLeaderboard'] });
  };
}

export function useRefreshPlayerGold() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  return async () => {
    if (loggingEnabled) {
      console.log('强制刷新玩家金币余额和排行榜');
    }
    
    queryClient.invalidateQueries({ queryKey: ['landMiner_playerGold', identity?.getPrincipal().toString()] });
    queryClient.invalidateQueries({ queryKey: ['miningLeaderboard'] });
    
    await queryClient.refetchQueries({ queryKey: ['landMiner_playerGold', identity?.getPrincipal().toString()] });
    await queryClient.refetchQueries({ queryKey: ['miningLeaderboard'] });
    
    if (loggingEnabled) {
      console.log('玩家金币余额和排行榜已强制刷新完成');
    }
  };
}
