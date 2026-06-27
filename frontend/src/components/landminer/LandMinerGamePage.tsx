import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, PickaxeIcon, AlertTriangleIcon, RefreshCwIcon, CoinsIcon } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetAllLands, useGetUserGameState, useGetGameStatistics, useMineLand, useReviveCharacter, useRefreshUserGameState, useGetPlayerGold, useRefreshPlayerGold, type Land, type MiningResult } from '../../hooks/useLandMinerQueries';
import { useActor } from '../../hooks/useActor';
import LandMap from './LandMap';
import UnifiedGameStatus from './UnifiedGameStatus';
import MiningResultPopup from './MiningResultPopup';
import GameWelcomeSection from './GameWelcomeSection';
import GameConnectionError from './GameConnectionError';
import GameAuthRequired from './GameAuthRequired';
import GameLoadingState from './GameLoadingState';

interface LandMinerGamePageProps {
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article' | '/management' | '/category' | '/landminer', params?: any) => void;
}

export default function LandMinerGamePage({ navigate }: LandMinerGamePageProps) {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [miningCountdown, setMiningCountdown] = useState<number | null>(null);
  const [miningResult, setMiningResult] = useState<(MiningResult & { landId: number }) | null>(null);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [isMiningInProgress, setIsMiningInProgress] = useState(false);
  const [backendConnectionError, setBackendConnectionError] = useState<string | null>(null);

  // 主 canister数据查询 - 完全主 canister控制
  const { data: lands, isLoading: landsLoading, error: landsError, refetch: refetchLands } = useGetAllLands();
  const { data: userGameStateData, isLoading: gameStateLoading, refetch: refetchGameState } = useGetUserGameState();
  const { data: gameStatisticsData, isLoading: statisticsLoading, refetch: refetchStatistics } = useGetGameStatistics();
  const { data: playerGold, refetch: refetchPlayerGold } = useGetPlayerGold();
  const refreshPlayerGold = useRefreshPlayerGold();

  // 主 canister变更操作 - 完全主 canister控制
  const mineLand = useMineLand();
  const reviveCharacter = useReviveCharacter();
  const refreshUserGameState = useRefreshUserGameState();

  const isAuthenticated = !!identity;
  const isLoading = landsLoading || gameStateLoading || statisticsLoading;
  
  // 使用主 canister getPlayerGold作为金币数据的主要来源
  const currentGoldBalance = playerGold !== undefined ? playerGold : (userGameStateData?.goldCoins || 0);

  // Handle undefined values by converting to null - 所有数据来自主 canister
  const userGameState = userGameStateData ?? null;
  const gameStatistics = gameStatisticsData ?? null;

  console.log('LandMinerGamePage: 组件已加载，完全依赖主 canister数据', { 
    isAuthenticated, 
    landsCount: lands?.length,
    userGameState,
    gameStatistics,
    currentGoldBalance,
    playerGold,
    backendConnectionError,
    actorAvailable: !!actor,
    actorFetching
  });

  // 检查主 canister连接问题
  useEffect(() => {
    if (landsError) {
      console.error('LandMinerGamePage: 主 canister连接错误:', landsError);
      setBackendConnectionError('无法连接到主 canister游戏服务器，请检查网络连接或联系管理员');
    } else if (!actor && !actorFetching) {
      console.warn('LandMinerGamePage: 主 canister actor不可用');
      setBackendConnectionError('主 canister尚未部署或配置错误，请联系管理员');
    } else {
      setBackendConnectionError(null);
    }
  }, [landsError, actor, actorFetching]);

  const handleBack = () => {
    console.log('LandMinerGamePage: 返回首页');
    navigate('/');
  };

  const handleRetryInit = () => {
    console.log('LandMinerGamePage: 重试初始化');
    setBackendConnectionError(null);
    refetchLands();
    refetchGameState();
    refetchStatistics();
    refetchPlayerGold();
  };

  // Show main canister connection error if any
  if (backendConnectionError || landsError || (!actor && !actorFetching)) {
    return (
      <GameConnectionError 
        onBack={handleBack}
        onRetry={handleRetryInit}
        error={backendConnectionError}
      />
    );
  }

  if (!isAuthenticated) {
    return <GameAuthRequired onBack={handleBack} />;
  }

  if (isLoading) {
    return <GameLoadingState onBack={handleBack} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
        {/* Header */}
        <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110"
            >
              <ArrowLeftIcon size={20} className="text-dark-text" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <PickaxeIcon size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-dark-text global-font">
                  ⛏️ 土地矿工
                </h2>
              </div>
              <p className="text-dark-text-secondary font-medium global-font">
                在任意土地上开始您的挖矿冒险之旅！所有挖矿结果由主 canister安全随机生成，金币余额通过getPlayerGold接口实时更新
              </p>
            </div>
            
            {/* Real-time Gold Balance Display in Header with main canister getPlayerGold API integration */}
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-500 rounded-xl px-4 py-2">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-500 elegant-numbers flex items-center space-x-1">
                  <CoinsIcon size={18} className="text-yellow-500" />
                  <span>{currentGoldBalance}</span>
                </div>
                <div className="text-xs text-yellow-600 global-font font-bold">
                  当前金币余额
                </div>
                <div className="text-xs text-yellow-700 global-font">
                  (主 canister实时)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="p-8">
          <GameWelcomeSection />

          {/* Game Layout */}
          <div className="space-y-8">
            {/* Land Map - Fully Expanded at Top */}
            <div className="w-full">
              <LandMap
                lands={lands || []}
                onLandClick={(land) => setSelectedLand(land)}
                isLoading={isLoading}
                isMiningLocked={false}
              />
            </div>

            {/* Compact Control Console */}
            <UnifiedGameStatus
              gameState={userGameState}
              gameStatistics={gameStatistics}
              selectedLand={selectedLand}
              onMineLand={async (landId) => {
                // Mining logic will be handled in a separate component
              }}
              onReviveCharacter={async () => {
                // Revival logic will be handled in a separate component
              }}
              isLoading={isLoading}
              isMining={isMiningInProgress}
              miningCountdown={miningCountdown}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Mining Result Popup */}
      {showResultPopup && miningResult && (
        <MiningResultPopup
          result={miningResult}
          currentGoldBalance={currentGoldBalance}
          onClose={() => setShowResultPopup(false)}
        />
      )}
    </div>
  );
}

