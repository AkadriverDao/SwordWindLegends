import React, { useState, useEffect } from 'react';
import { CoinsIcon, HeartIcon, TrendingUpIcon, ClockIcon, PickaxeIcon, UsersIcon, BarChart3Icon, LockIcon, AlertTriangleIcon, SparklesIcon } from 'lucide-react';
import { useGetPlayerGold, useRefreshPlayerGold } from '../../hooks/useLandMinerQueries';
import { useGetMiningLoggingEnabled } from '../../hooks/useMiningConfigQueries';

interface Land {
  id: bigint;
  x: number;
  y: number;
}

interface UserGameState {
  goldCoins: number;
  isAlive: boolean;
  miningCount: number;
  totalEarnings: number;
}

interface GameStatistics {
  totalLands: number;
  totalMiners: number;
  totalMiningOperations: number;
  totalGoldMined: number;
}

interface UnifiedGameStatusProps {
  gameState: UserGameState | null;
  gameStatistics: GameStatistics | null;
  selectedLand: Land | null;
  onMineLand: (landId: bigint) => Promise<void>;
  onReviveCharacter: () => Promise<void>;
  isLoading: boolean;
  isMining: boolean;
  miningCountdown?: number | null;
}

export default function UnifiedGameStatus({ 
  gameState, 
  gameStatistics, 
  selectedLand,
  onMineLand,
  onReviveCharacter,
  isLoading,
  isMining,
  miningCountdown
}: UnifiedGameStatusProps) {
  const [isMiningLand, setIsMiningLand] = useState(false);
  const [isReviving, setIsReviving] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [previousGoldAmount, setPreviousGoldAmount] = useState<number | null>(null);
  const [showGoldIncrease, setShowGoldIncrease] = useState(false);

  // Get real-time gold balance
  const { data: playerGold, refetch: refetchPlayerGold } = useGetPlayerGold();
  const refreshPlayerGold = useRefreshPlayerGold();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();
  
  // Use real-time gold data as the primary source
  const currentGoldCoins = playerGold !== undefined ? playerGold : (gameState?.goldCoins || 0);

  // Conditional logging based on backend log switch
  const conditionalLog = (message: string, ...args: any[]) => {
    if (loggingEnabled) {
      console.log(message, ...args);
    }
  };

  // Monitor gold changes for visual feedback
  useEffect(() => {
    if (previousGoldAmount !== null && currentGoldCoins > previousGoldAmount) {
      conditionalLog('检测到金币增加，显示视觉反馈', { 
        previous: previousGoldAmount, 
        current: currentGoldCoins,
        increase: currentGoldCoins - previousGoldAmount
      });
      setShowGoldIncrease(true);
      setTimeout(() => setShowGoldIncrease(false), 3000);
    }
    
    setPreviousGoldAmount(currentGoldCoins);
  }, [currentGoldCoins, loggingEnabled]);

  const handleMineLand = async () => {
    if (!selectedLand || isMiningLand || isMining) return;
    
    // Check character status before mining
    if (gameState && !gameState.isAlive) {
      conditionalLog('角色死亡，无法挖矿');
      setOperationError('角色已死亡，请先复活后再进行挖矿');
      return;
    }
    
    conditionalLog('开始挖矿', selectedLand.id.toString());
    setIsMiningLand(true);
    setOperationError(null);
    
    try {
      await onMineLand(selectedLand.id);
      conditionalLog('挖矿请求成功，刷新金币余额');
      
      // Force refresh player gold immediately after mining
      await Promise.all([
        refetchPlayerGold(),
        refreshPlayerGold()
      ]);
      
      conditionalLog('挖矿完成后，已获取最新金币余额');
    } catch (error) {
      conditionalLog('挖矿失败:', error);
      const errorMessage = error instanceof Error ? error.message : '挖矿失败，请重试';
      setOperationError(errorMessage);
      
      // Show user-friendly error messages
      if (errorMessage.includes('不可用') || errorMessage.includes('not found') || errorMessage.includes('not yet implemented')) {
        setOperationError('挖矿功能暂时不可用，请稍后重试');
      }
    } finally {
      setIsMiningLand(false);
    }
  };

  const handleReviveCharacter = async () => {
    if (!gameState || gameState.isAlive || isReviving) return;
    
    conditionalLog('请求复活角色');
    setIsReviving(true);
    setOperationError(null);
    
    try {
      await onReviveCharacter();
      conditionalLog('角色复活成功，刷新金币余额');
      
      // Force refresh player gold after revival
      await Promise.all([
        refetchPlayerGold(),
        refreshPlayerGold()
      ]);
    } catch (error) {
      conditionalLog('复活失败:', error);
      const errorMessage = error instanceof Error ? error.message : '复活失败，请重试';
      setOperationError(errorMessage);
      
      // Show user-friendly error messages
      if (errorMessage.includes('不可用') || errorMessage.includes('not found') || errorMessage.includes('not yet implemented')) {
        setOperationError('复活功能暂时不可用，请稍后重试');
      }
    } finally {
      setIsReviving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-theme-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-dark-text-secondary global-font">加载游戏状态中...</p>
      </div>
    );
  }

  // Check character status
  const isCharacterDead = gameState ? !gameState.isAlive : false;

  return (
    <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
      {/* Compact Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xl">🎮</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-dark-text global-font">游戏控制台</h3>
          <p className="text-dark-text-secondary text-sm global-font">挖矿操作中心</p>
        </div>
      </div>

      {/* Enhanced Character Status with Prominent Real-Time Gold Display */}
      {gameState && (
        <div className={`mb-4 p-4 rounded-xl border-2 ${
          gameState.isAlive 
            ? 'bg-green-500/20 border-green-500' 
            : 'bg-red-500/20 border-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HeartIcon size={20} className={gameState.isAlive ? 'text-green-500' : 'text-red-500'} />
              <div className="flex-1">
                <p className={`font-bold global-font text-sm ${gameState.isAlive ? 'text-green-500' : 'text-red-500'}`}>
                  {gameState.isAlive ? '🌟 角色存活' : '💀 角色死亡'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Enhanced Prominent Real-Time Gold Display */}
              <div className={`bg-gradient-to-r from-yellow-400 to-orange-400 border-2 border-yellow-500 rounded-xl px-4 py-2 shadow-lg transition-all duration-500 ${
                showGoldIncrease ? 'scale-110 shadow-2xl ring-4 ring-yellow-300 animate-pulse' : ''
              }`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-white elegant-numbers flex items-center space-x-1 ${
                    showGoldIncrease ? 'animate-bounce' : ''
                  }`}>
                    <CoinsIcon size={20} className={`text-white ${showGoldIncrease ? 'animate-spin' : ''}`} />
                    <span className={showGoldIncrease ? 'gold-celebration' : ''}>{currentGoldCoins}</span>
                    {showGoldIncrease && (
                      <span className="text-lg animate-bounce ml-2">✨</span>
                    )}
                  </div>
                  <div className="text-xs text-white/90 global-font font-bold">
                    {showGoldIncrease ? '🎉 金币已更新！' : '游戏金币'}
                  </div>
                </div>
              </div>
              
              {/* Revival Button - Only show when character is dead */}
              {!gameState.isAlive && (
                <button
                  onClick={handleReviveCharacter}
                  disabled={isReviving}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center space-x-2 global-font text-sm touch-target"
                >
                  {isReviving ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                      <span>复活中...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon size={14} />
                      <span>✨ 复活</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Land Action */}
      {selectedLand && (
        <div className="mb-4">
          <div className="bg-dark-card rounded-xl p-3 border-2 border-gray-500">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-dark-text font-bold global-font text-sm">
                  土地 #{selectedLand.id.toString()}
                </p>
                <p className="text-dark-text-secondary text-xs global-font">
                  ({selectedLand.x}, {selectedLand.y}) - 可无限次挖矿
                </p>
              </div>
              <div className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-500">
                🌱
              </div>
            </div>

            {/* Error Display */}
            {operationError && (
              <div className="mb-2 bg-red-500/20 border border-red-500 rounded p-2">
                <div className="flex items-center space-x-1">
                  <AlertTriangleIcon size={12} className="text-red-500" />
                  <p className="text-red-500 font-bold text-xs global-font">
                    {operationError}
                  </p>
                </div>
              </div>
            )}

            {/* Character Death Mining Prohibition Warning */}
            {isCharacterDead && (
              <div className="mb-2 bg-red-500/20 border border-red-500 rounded p-2">
                <div className="flex items-center space-x-1">
                  <span className="text-red-500 text-sm">💀</span>
                  <p className="text-red-500 font-bold text-xs global-font">
                    角色死亡，无法挖矿。请先复活角色。
                  </p>
                </div>
              </div>
            )}

            {/* Mining Status */}
            {isMining && miningCountdown !== null && (
              <div className="mb-2 bg-amber-500/20 border border-amber-500 rounded p-2">
                <div className="flex items-center space-x-1">
                  <ClockIcon size={12} className="text-amber-500" />
                  <p className="text-amber-500 font-bold text-xs global-font">
                    等待挖矿结果... {miningCountdown}秒
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleMineLand}
              disabled={isMiningLand || isLoading || isMining || isCharacterDead}
              className={`w-full py-2 px-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 global-font text-sm touch-target ${
                isCharacterDead 
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              }`}
              type="button"
              title={isCharacterDead ? '角色死亡，无法挖矿' : '在此土地上挖矿'}
            >
              {isMiningLand ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  <span>挖矿请求中...</span>
                </>
              ) : isMining ? (
                <>
                  <LockIcon size={14} />
                  <span>等待结果</span>
                </>
              ) : isCharacterDead ? (
                <>
                  <span className="text-sm">💀</span>
                  <span>角色死亡</span>
                </>
              ) : (
                <>
                  <PickaxeIcon size={14} />
                  <span>开始挖矿</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Compact Statistics Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* User Stats */}
        {gameState && (
          <>
            <div className="bg-dark-card rounded-lg p-2 border border-gray-500 text-center">
              <div className="text-lg font-bold text-purple-500 elegant-numbers">
                {gameState.miningCount}
              </div>
              <div className="text-xs text-dark-text-secondary global-font">挖矿</div>
            </div>

            <div className="bg-dark-card rounded-lg p-2 border border-gray-500 text-center">
              <div className="text-lg font-bold text-green-500 elegant-numbers">
                {gameState.totalEarnings}
              </div>
              <div className="text-xs text-dark-text-secondary global-font">收益</div>
            </div>

            {/* Enhanced Real-Time Gold Display */}
            <div className={`bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-500 rounded-lg p-2 text-center shadow-lg transition-all duration-500 ${
              showGoldIncrease ? 'scale-110 shadow-2xl ring-2 ring-yellow-300 bg-gradient-to-r from-yellow-400/40 to-orange-400/40' : ''
            }`}>
              <div className={`text-xl font-bold text-yellow-500 elegant-numbers flex items-center justify-center space-x-1 ${
                showGoldIncrease ? 'animate-bounce' : ''
              }`}>
                <CoinsIcon size={16} className={`text-yellow-500 ${showGoldIncrease ? 'animate-spin' : ''}`} />
                <span className={showGoldIncrease ? 'gold-celebration' : ''}>{currentGoldCoins}</span>
                {showGoldIncrease && (
                  <span className="text-sm animate-bounce">✨</span>
                )}
              </div>
              <div className={`text-xs global-font font-bold ${
                showGoldIncrease ? 'text-yellow-400 animate-pulse' : 'text-yellow-600'
              }`}>
                {showGoldIncrease ? '🎉 实时更新！' : '游戏金币'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Real-Time Gold Balance Notification */}
      {showGoldIncrease && previousGoldAmount !== null && (
        <div className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 border-3 border-yellow-500 rounded-xl p-4 shadow-2xl animate-bounce">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-spin">
              <CoinsIcon size={24} className="text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg global-font">
                🎉 金币余额已更新！
              </p>
              <p className="text-white/90 text-sm global-font">
                +{currentGoldCoins - previousGoldAmount} 金币 → 总计 {currentGoldCoins} 金币
              </p>
              <p className="text-white/80 text-xs global-font">
                ✨ 余额已同步最新状态
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Server Statistics */}
      {gameStatistics && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3Icon size={14} className="text-purple-500" />
            <h4 className="text-sm font-bold text-dark-text global-font">📊 服务器统计</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-dark-card rounded-lg p-2 border border-gray-500 text-center">
              <div className="text-sm font-bold text-purple-500 elegant-numbers">
                {gameStatistics.totalMiners}
              </div>
              <div className="text-xs text-dark-text-secondary global-font">矿工</div>
            </div>
            <div className="bg-dark-card rounded-lg p-2 border border-gray-500 text-center">
              <div className="text-sm font-bold text-orange-500 elegant-numbers">
                {gameStatistics.totalMiningOperations}
              </div>
              <div className="text-xs text-dark-text-secondary global-font">挖矿</div>
            </div>
          </div>
          
          {/* Total Gold Mined */}
          <div className="mt-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-2 border border-yellow-500">
            <div className="flex items-center space-x-2">
              <CoinsIcon size={14} className="text-yellow-500" />
              <div>
                <p className="text-yellow-500 font-bold global-font text-xs">
                  全服总金币: {gameStatistics.totalGoldMined}
                </p>
                <p className="text-dark-text-secondary text-xs global-font">
                  所有矿工累计挖掘金币
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Operation Tips */}
      <div className="bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-lg p-3 border border-gray-500">
        <div className="flex items-start space-x-2">
          <span className="text-sm shrink-0">🔒</span>
          <div>
            <p className="text-dark-text font-bold global-font text-xs mb-1">游戏操作指南</p>
            <p className="text-dark-text-secondary text-xs global-font">
              {isCharacterDead ? '角色已死亡，金币已清零，请先点击复活按钮恢复生命' : 
               isMining ? '正在生成挖矿结果，请等待完成' : 
               '点击任意土地开始挖矿，所有结果由系统生成。每块土地可无限次挖矿！挖矿结果将通过弹窗显示，包括具体的金币数量。每次挖矿后都会立即获取最新金币余额并在界面上显示。当前显示的金币数量直接来自游戏系统，确保数据准确性。'}
            </p>
            {operationError && (
              <div className="mt-2 bg-red-500/20 border border-red-500 rounded p-2">
                <p className="text-red-500 font-bold text-xs global-font">
                  ⚠️ {operationError}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
