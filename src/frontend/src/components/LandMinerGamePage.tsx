import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CoinsIcon,
  PickaxeIcon,
  RefreshCwIcon,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Land,
  type MiningResult,
  useGetAllLands,
  useGetGameStatistics,
  useGetPlayerGold,
  useGetUserGameState,
  useMineLand,
  useRefreshPlayerGold,
  useRefreshUserGameState,
  useReviveCharacter,
} from "../hooks/useLandMinerQueries";
import { useGetMiningLoggingEnabled } from "../hooks/useMiningConfigQueries";
import GameAuthRequired from "./landminer/GameAuthRequired";
import GameConnectionError from "./landminer/GameConnectionError";
import GameLoadingState from "./landminer/GameLoadingState";
import GameWelcomeSection from "./landminer/GameWelcomeSection";
import LandMap from "./landminer/LandMap";
import MiningResultPopup from "./landminer/MiningResultPopup";
import UnifiedGameStatus from "./landminer/UnifiedGameStatus";

interface LandMinerGamePageProps {
  navigate: (
    route:
      | "/"
      | "/profile"
      | "/leaderboard"
      | "/customize"
      | "/article"
      | "/management"
      | "/category"
      | "/landminer",
    params?: any,
  ) => void;
}

export default function LandMinerGamePage({
  navigate,
}: LandMinerGamePageProps) {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [miningCountdown, setMiningCountdown] = useState<number | null>(null);
  const [miningResult, setMiningResult] = useState<
    (MiningResult & { landId: number }) | null
  >(null);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [isMiningInProgress, setIsMiningInProgress] = useState(false);
  const [backendConnectionError, setBackendConnectionError] = useState<
    string | null
  >(null);

  // Game data queries
  const {
    data: lands,
    isLoading: landsLoading,
    error: landsError,
    refetch: refetchLands,
  } = useGetAllLands();
  const {
    data: userGameStateData,
    isLoading: gameStateLoading,
    refetch: refetchGameState,
  } = useGetUserGameState();
  const {
    data: gameStatisticsData,
    isLoading: statisticsLoading,
    refetch: refetchStatistics,
  } = useGetGameStatistics();
  const { data: playerGold, refetch: refetchPlayerGold } = useGetPlayerGold();
  const refreshPlayerGold = useRefreshPlayerGold();

  // Game operations
  const mineLand = useMineLand();
  const reviveCharacter = useReviveCharacter();
  const refreshUserGameState = useRefreshUserGameState();

  const isAuthenticated = !!identity;
  const isLoading = landsLoading || gameStateLoading || statisticsLoading;

  // Use real-time gold data as the primary source
  const currentGoldBalance =
    playerGold !== undefined ? playerGold : userGameStateData?.goldCoins || 0;

  // Handle undefined values by converting to null
  const userGameState = userGameStateData ?? null;
  const gameStatistics = gameStatisticsData ?? null;

  // Conditional logging based on backend log switch
  const conditionalLog = useCallback(
    (message: string, ...args: any[]) => {
      if (loggingEnabled) {
        console.log(message, ...args);
      }
    },
    [loggingEnabled],
  );

  conditionalLog("土地矿工游戏: 组件已加载", {
    isAuthenticated,
    landsCount: lands?.length,
    userGameState,
    gameStatistics,
    currentGoldBalance,
    playerGold,
    backendConnectionError,
    actorAvailable: !!actor,
    actorFetching,
  });

  // Check connection issues
  useEffect(() => {
    if (landsError) {
      conditionalLog("土地矿工游戏: 连接错误:", landsError);
      setBackendConnectionError(
        "无法连接到游戏服务器，请检查网络连接或联系管理员",
      );
    } else if (!actor && !actorFetching) {
      conditionalLog("土地矿工游戏: 游戏服务器不可用");
      setBackendConnectionError("游戏服务器尚未部署或配置错误，请联系管理员");
    } else {
      setBackendConnectionError(null);
    }
  }, [landsError, actor, actorFetching, conditionalLog]);

  // Mining countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (miningCountdown !== null && miningCountdown > 0) {
      interval = setInterval(() => {
        setMiningCountdown((prev) => {
          if (prev === null || prev <= 1) {
            // Mining completed, request result
            requestMiningResult();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [miningCountdown]);

  // Request mining result when countdown completes
  const requestMiningResult = async () => {
    if (!selectedLand) return;

    conditionalLog("挖矿倒计时完成，请求挖矿结果");

    try {
      const result = await mineLand.mutateAsync(selectedLand.id);
      conditionalLog("收到挖矿结果:", result);

      // Display result with land ID
      const resultWithLandId = {
        ...result,
        landId: Number(selectedLand.id),
      };

      setMiningResult(resultWithLandId);
      setShowResultPopup(true);
      setIsMiningInProgress(false);

      // Immediately refresh data after mining
      conditionalLog("挖矿结果已收到，刷新游戏数据");
      await Promise.all([
        refetchGameState(),
        refetchStatistics(),
        refetchPlayerGold(),
        refreshPlayerGold(),
      ]);

      // Force additional refresh for gold balance
      refreshUserGameState();

      conditionalLog("挖矿完成后，已获取最新游戏数据");
    } catch (error) {
      conditionalLog("请求挖矿结果失败:", error);
      setIsMiningInProgress(false);

      // Show error result
      const errorResult = {
        outcome: "empty" as const,
        goldCoins: 0,
        message:
          error instanceof Error ? error.message : "挖矿请求失败，请重试",
        landId: Number(selectedLand.id),
      };
      setMiningResult(errorResult);
      setShowResultPopup(true);
    }
  };

  const handleCloseResultPopup = async () => {
    conditionalLog("关闭挖矿结果弹窗，确保金币余额最新");
    setShowResultPopup(false);
    setMiningResult(null);

    // Force refresh data when popup closes
    await Promise.all([
      refetchGameState(),
      refetchStatistics(),
      refetchPlayerGold(),
      refreshPlayerGold(),
    ]);

    // Additional forced refresh for real-time gold updates
    refreshUserGameState();

    conditionalLog("弹窗关闭后，金币余额已强制刷新");
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleLandClick = (land: Land) => {
    // Check character status before allowing land selection
    const isDisabled =
      isMiningInProgress || (userGameState && !userGameState.isAlive);

    if (isDisabled) {
      if (userGameState && !userGameState.isAlive) {
        conditionalLog("土地矿工游戏: 角色死亡状态，无法选择土地");
      } else if (isMiningInProgress) {
        conditionalLog("土地矿工游戏: 挖矿期间无法选择其他土地");
      }
      return;
    }

    conditionalLog("土地矿工游戏: 选择土地", land.id.toString());
    setSelectedLand(land);
  };

  const handleMineLand = async (landId: bigint): Promise<void> => {
    conditionalLog("土地矿工游戏: 开始挖矿", landId.toString());

    // Check character status before mining
    if (isMiningInProgress || (userGameState && !userGameState.isAlive)) {
      if (userGameState && !userGameState.isAlive) {
        conditionalLog("土地矿工游戏: 角色死亡状态，无法进行挖矿操作");
        throw new Error("角色已死亡，请先复活后再进行挖矿");
      }
      conditionalLog("土地矿工游戏: 正在挖矿中，无法进行新的操作");
      throw new Error("正在挖矿中，请等待当前挖矿完成");
    }

    try {
      // Start mining countdown immediately
      setIsMiningInProgress(true);
      setMiningCountdown(10);
      setMiningResult(null);
      setShowResultPopup(false);
      setBackendConnectionError(null);

      conditionalLog("土地矿工游戏: 开始10秒挖矿倒计时");
    } catch (error) {
      conditionalLog("土地矿工游戏: 挖矿失败:", error);
      setBackendConnectionError(
        error instanceof Error ? error.message : "挖矿操作失败",
      );
      throw error;
    }
  };

  const handleReviveCharacter = async (): Promise<void> => {
    conditionalLog("土地矿工游戏: 请求复活角色");

    // Check character status
    if (!userGameState || userGameState.isAlive) {
      conditionalLog("土地矿工游戏: 角色未死亡，无需复活");
      return;
    }

    try {
      conditionalLog("土地矿工游戏: 发送复活请求");
      await reviveCharacter.mutateAsync();

      // Clear UI states after revival
      setMiningCountdown(null);
      setMiningResult(null);
      setSelectedLand(null);
      setShowResultPopup(false);
      setIsMiningInProgress(false);
      setBackendConnectionError(null);

      // Refresh all data after revival
      await Promise.all([
        refetchGameState(),
        refetchStatistics(),
        refetchLands(),
        refetchPlayerGold(),
        refreshPlayerGold(),
      ]);

      // Force additional refresh for real-time updates
      refreshUserGameState();

      conditionalLog(
        "土地矿工游戏: 角色复活完成，UI状态已重置，游戏数据已刷新",
      );
    } catch (error) {
      conditionalLog("土地矿工游戏: 复活失败:", error);
      setBackendConnectionError(
        error instanceof Error ? error.message : "复活操作失败",
      );
      throw error;
    }
  };

  const handleRetryInit = () => {
    conditionalLog("土地矿工游戏: 重试初始化");
    setBackendConnectionError(null);
    // Retry fetching data
    refetchLands();
    refetchGameState();
    refetchStatistics();
    refetchPlayerGold();
  };

  // Show connection error if any
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

  // Check character status for mining operations
  const isCharacterDead = userGameState ? !userGameState.isAlive : false;
  const isMiningDisabled = isCharacterDead || isMiningInProgress;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
        {/* Header */}
        <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <button
              type="button"
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
                在任意土地上开始您的挖矿冒险之旅！所有挖矿结果由系统随机生成，金币余额实时更新
              </p>
            </div>

            {/* Real-time Gold Balance Display in Header */}
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
                  (实时同步)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="p-8">
          <GameWelcomeSection />

          {/* Connection Status */}
          {backendConnectionError && (
            <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangleIcon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-red-500 font-bold text-lg global-font mb-2">
                    游戏服务器连接问题
                  </h4>
                  <p className="text-dark-text-secondary global-font mb-4">
                    {backendConnectionError}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetryInit}
                    className="bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font flex items-center space-x-2"
                  >
                    <RefreshCwIcon size={16} />
                    <span>重试连接</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Character Death Warning with Revival Option */}
          {userGameState && !userGameState.isAlive && (
            <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-2xl">💀</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-red-500 font-bold text-lg global-font mb-2">
                    角色已死亡，金币已清零
                  </h4>
                  <p className="text-dark-text-secondary global-font mb-4">
                    您的角色遇到了黑暗物质而死亡，所有金币已清零。必须先复活角色才能继续挖矿。
                  </p>
                  <button
                    type="button"
                    onClick={handleReviveCharacter}
                    disabled={reviveCharacter.isPending}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font flex items-center space-x-2 disabled:opacity-50"
                  >
                    {reviveCharacter.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>复活中...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">✨</span>
                        <span>复活角色</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Optimized Layout: Land Map at Top, Compact Control Console Below */}
          <div className="space-y-8">
            {/* Land Map - Fully Expanded at Top */}
            <div className="w-full">
              <LandMap
                lands={lands || []}
                onLandClick={handleLandClick}
                isLoading={isLoading}
                isMiningLocked={isMiningDisabled}
              />
            </div>

            {/* Mining Status Banner - Below Map */}
            {isMiningInProgress && miningCountdown !== null && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white border-3 border-gray-500 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <PickaxeIcon size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 global-font">
                        ⛏️ 正在挖矿中...
                      </h3>
                      <p className="text-white/90 text-lg global-font">
                        土地 #{selectedLand?.id.toString()} -
                        等待系统生成挖矿结果
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2 elegant-numbers">
                      {miningCountdown}
                    </div>
                    <p className="text-white/80 text-sm global-font">
                      秒后获得结果
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((10 - miningCountdown) / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Compact Control Console */}
            <UnifiedGameStatus
              gameState={userGameState}
              gameStatistics={gameStatistics}
              selectedLand={selectedLand}
              onMineLand={handleMineLand}
              onReviveCharacter={handleReviveCharacter}
              isLoading={isLoading}
              isMining={isMiningInProgress}
              miningCountdown={miningCountdown}
            />
          </div>

          {/* Game Integration Notice - Simplified and User-Friendly */}
          <div className="mt-8 bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-6 border-2 border-gray-500">
            <div className="flex items-start space-x-3">
              <span className="text-2xl shrink-0">🔒</span>
              <div>
                <p className="text-dark-text font-bold global-font text-sm mb-2">
                  游戏系统说明
                </p>
                <p className="text-dark-text-secondary text-xs global-font">
                  所有挖矿结果、角色状态、金币数量、死亡复活等游戏逻辑完全由系统控制。前端不保存任何游戏数据，所有状态信息实时同步。每块土地可以无限次挖矿，每次挖矿都会获得新的随机结果。点击土地后将立即开始10秒挖矿倒计时，倒计时结束后获取挖矿结果。挖矿结果将通过弹窗清晰显示，获得金币时会突出显示具体数量，金币余额会实时更新。角色死亡时金币会自动清零，复活后可以重新开始游戏。所有游戏数据安全存储在区块链上。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mining Result Popup */}
      {showResultPopup && miningResult && (
        <MiningResultPopup
          result={miningResult}
          currentGoldBalance={currentGoldBalance}
          onClose={handleCloseResultPopup}
        />
      )}
    </div>
  );
}
