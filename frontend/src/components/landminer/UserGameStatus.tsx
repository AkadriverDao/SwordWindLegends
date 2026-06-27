import React from 'react';
import { CoinsIcon, MapIcon, HeartIcon, TrendingUpIcon, ClockIcon, PickaxeIcon, SparklesIcon } from 'lucide-react';

interface UserGameState {
  goldCoins: number;
  ownedLands: number[];
  isAlive: boolean;
  miningCount: number;
  totalEarnings: number;
  isMining: boolean;
  miningLandId: number | null;
  miningStartTime: number | null;
}

interface UserGameStatusProps {
  gameState: UserGameState | null;
  isLoading: boolean;
  miningCountdown?: number | null;
  onReviveCharacter?: () => Promise<void>;
}

export default function UserGameStatus({ gameState, isLoading, miningCountdown, onReviveCharacter }: UserGameStatusProps) {
  const [isReviving, setIsReviving] = React.useState(false);

  console.log('UserGameStatus: 渲染用户状态', gameState, '挖矿倒计时:', miningCountdown);

  const handleReviveCharacter = async () => {
    if (!onReviveCharacter || !gameState || gameState.isAlive || isReviving) return;
    
    console.log('UserGameStatus: 开始复活角色');
    setIsReviving(true);
    
    try {
      await onReviveCharacter();
      console.log('UserGameStatus: 角色复活成功');
    } catch (error) {
      console.error('UserGameStatus: 复活失败:', error);
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

  if (!gameState) {
    return (
      <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">⛏️</span>
        </div>
        <p className="text-dark-text font-bold global-font mb-2">开始您的挖矿之旅</p>
        <p className="text-dark-text-secondary text-sm global-font">占领一块土地开始挖矿冒险！</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xl">👤</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-dark-text global-font">🎮 游戏状态</h3>
          <p className="text-dark-text-secondary text-sm global-font">您的挖矿进度和统计</p>
        </div>
      </div>

      {/* Character Death Warning with Revival Button */}
      {!gameState.isAlive && (
        <div className="mb-6 bg-red-500/20 border-2 border-red-500 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xl">💀</span>
              </div>
              <div>
                <p className="text-red-500 font-bold global-font">角色已死亡</p>
                <p className="text-dark-text-secondary text-sm global-font">
                  必须复活才能继续挖矿
                </p>
              </div>
            </div>
            {onReviveCharacter && (
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
      )}

      {/* Mining Status Display */}
      {gameState.isMining && miningCountdown !== null && miningCountdown !== undefined && (
        <div className="mb-6 bg-amber-500/20 border-2 border-amber-500 rounded-xl p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
              <PickaxeIcon size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-amber-500 font-bold global-font">
                ⛏️ 正在挖矿土地 #{gameState.miningLandId}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <ClockIcon size={14} className="text-amber-500" />
                <span className="text-amber-500 text-sm font-bold elegant-numbers">
                  {miningCountdown} 秒后完成
                </span>
              </div>
            </div>
          </div>
          
          {/* Mining Progress Bar */}
          <div className="mt-3 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((10 - miningCountdown) / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Character Status */}
      <div className={`mb-6 p-4 rounded-xl border-2 ${
        gameState.isAlive 
          ? 'bg-green-500/20 border-green-500' 
          : 'bg-red-500/20 border-red-500'
      }`}>
        <div className="flex items-center space-x-3">
          <HeartIcon size={20} className={gameState.isAlive ? 'text-green-500' : 'text-red-500'} />
          <div>
            <p className={`font-bold global-font ${gameState.isAlive ? 'text-green-500' : 'text-red-500'}`}>
              {gameState.isAlive ? '🌟 角色存活' : '💀 角色死亡'}
            </p>
            <p className="text-dark-text-secondary text-sm global-font">
              {gameState.isAlive ? 
                (gameState.isMining ? '正在挖矿中，请等待完成' : '可以继续挖矿冒险') : 
                '遇到黑暗物质，需要复活才能继续'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Game Statistics - Only show if character is alive */}
      {gameState.isAlive && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
            <div className="flex items-center space-x-2 mb-2">
              <CoinsIcon size={16} className="text-yellow-500" />
              <span className="text-dark-text font-bold text-sm global-font">金币</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500 elegant-numbers">
              {gameState.goldCoins}
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
            <div className="flex items-center space-x-2 mb-2">
              <MapIcon size={16} className="text-blue-500" />
              <span className="text-dark-text font-bold text-sm global-font">土地</span>
            </div>
            <div className="text-2xl font-bold text-blue-500 elegant-numbers">
              {gameState.ownedLands.length}
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUpIcon size={16} className="text-purple-500" />
              <span className="text-dark-text font-bold text-sm global-font">挖矿次数</span>
            </div>
            <div className="text-2xl font-bold text-purple-500 elegant-numbers">
              {gameState.miningCount}
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
            <div className="flex items-center space-x-2 mb-2">
              <CoinsIcon size={16} className="text-green-500" />
              <span className="text-dark-text font-bold text-sm global-font">总收益</span>
            </div>
            <div className="text-2xl font-bold text-green-500 elegant-numbers">
              {gameState.totalEarnings}
            </div>
          </div>
        </div>
      )}

      {/* Owned Lands List - Only show if character is alive */}
      {gameState.isAlive && gameState.ownedLands.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-bold text-dark-text global-font mb-3">🏠 我的土地</h4>
          <div className="bg-dark-card rounded-xl p-3 border-2 border-gray-500 max-h-32 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {gameState.ownedLands.map((landId) => (
                <span
                  key={landId}
                  className={`inline-flex items-center px-2 py-1 rounded border text-xs font-bold global-font ${
                    gameState.isMining && gameState.miningLandId === landId
                      ? 'bg-amber-500/20 text-amber-500 border-amber-500 animate-pulse'
                      : 'bg-blue-500/20 text-blue-500 border-blue-500'
                  }`}
                >
                  {gameState.isMining && gameState.miningLandId === landId ? '⛏️' : '#'}{landId}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
