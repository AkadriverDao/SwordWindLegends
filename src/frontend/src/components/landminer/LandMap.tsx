import React, { useState } from "react";
import { useGetMiningLoggingEnabled } from "../../hooks/useMiningConfigQueries";

interface Land {
  id: bigint;
  x: number;
  y: number;
}

interface LandMapProps {
  lands: Land[];
  onLandClick: (land: Land) => void;
  isLoading: boolean;
  isMiningLocked?: boolean;
}

export default function LandMap({
  lands,
  onLandClick,
  isLoading,
  isMiningLocked = false,
}: LandMapProps) {
  const [clickedLand, setClickedLand] = useState<string | null>(null);
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  // Create a 40x25 grid for 1000 lands
  const GRID_WIDTH = 40;
  const GRID_HEIGHT = 25;

  // Conditional logging based on backend log switch
  const conditionalLog = (message: string, ...args: any[]) => {
    if (loggingEnabled) {
      console.log(message, ...args);
    }
  };

  conditionalLog(
    "土地地图: 渲染地图，土地数量:",
    lands.length,
    "挖矿锁定:",
    isMiningLocked,
  );

  const getLandByPosition = (x: number, y: number): Land | undefined => {
    return lands.find((land) => land.x === x && land.y === y);
  };

  const getLandColor = (isDisabled: boolean, isClicked: boolean) => {
    const baseClasses = isClicked ? "transform scale-110 shadow-lg" : "";

    // If mining is locked (character death or mining in progress), show disabled state
    if (isDisabled) {
      return `bg-gray-500 hover:bg-gray-500 border-gray-600 cursor-not-allowed ${baseClasses}`;
    }

    // All lands are available for mining (vacant state)
    return `bg-green-500 hover:bg-green-400 border-green-600 cursor-pointer ${baseClasses} ${isClicked ? "ring-4 ring-green-300" : ""}`;
  };

  const getLandIcon = (isDisabled: boolean) => {
    if (isDisabled) {
      return "🌫️"; // Show different icon for disabled lands
    }

    // All lands show as vacant/available for mining
    return "🌱";
  };

  const handleLandClick = (land: Land) => {
    const isDisabled = isMiningLocked;

    if (isDisabled) {
      if (isMiningLocked) {
        conditionalLog("土地地图: 挖矿锁定期间无法操作土地");
      }
      return;
    }

    // Add visual feedback
    const landKey = `${land.x}-${land.y}`;
    setClickedLand(landKey);

    // Remove the visual feedback after animation
    setTimeout(() => {
      setClickedLand(null);
    }, 300);

    conditionalLog("土地地图: 点击土地", land.id.toString());
    onLandClick(land);
  };

  if (isLoading) {
    return (
      <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-theme-primary border-t-transparent mx-auto mb-4" />
        <p className="text-dark-text font-bold global-font">
          加载土地地图中...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🗺️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark-text global-font">
              土地地图
            </h3>
            <p className="text-dark-text-secondary text-sm global-font">
              1000块土地，每块都可以无限次挖矿，结果由系统生成
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded border border-green-600" />
            <span className="text-dark-text-secondary global-font">
              空置土地（可挖矿）
            </span>
          </div>
          {isMiningLocked && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded border border-gray-600" />
              <span className="text-dark-text-secondary global-font">
                操作禁用
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Fully Expanded Map Container */}
      <div className="w-full border-2 border-gray-500 rounded-xl bg-dark-card p-4">
        <div
          className="grid gap-1 w-full"
          style={{
            gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))`,
            aspectRatio: `${GRID_WIDTH} / ${GRID_HEIGHT}`,
          }}
        >
          {Array.from({ length: GRID_HEIGHT }, (_, y) =>
            Array.from({ length: GRID_WIDTH }, (_, x) => {
              const land = getLandByPosition(x, y);
              const landId = y * GRID_WIDTH + x;
              const landKey = `${x}-${y}`;
              const isDisabled = isMiningLocked || !land;
              const isClicked = clickedLand === landKey;

              return (
                <button
                  key={landKey}
                  onClick={() => {
                    if (land && !isDisabled) {
                      handleLandClick(land);
                    }
                  }}
                  className={`aspect-square rounded border-2 transition-all duration-200 flex items-center justify-center text-xs land-click-feedback ${
                    isDisabled ? "hover:scale-100" : "hover:scale-110"
                  } ${getLandColor(isDisabled, isClicked)}`}
                  title={`土地 #${landId} (${x}, ${y}) - ${
                    isMiningLocked
                      ? "角色死亡或挖矿中，无法操作"
                      : "空置土地，可挖矿"
                  }`}
                  disabled={isDisabled}
                  type="button"
                >
                  <span className="text-xs leading-none">
                    {getLandIcon(isDisabled)}
                  </span>
                </button>
              );
            }),
          ).flat()}
        </div>
      </div>

      {/* Mining Info */}
      <div className="mt-4 bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-3 border border-gray-500">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🔒</span>
          <div>
            <p className="text-dark-text font-bold global-font text-xs">
              游戏挖矿系统
            </p>
            <p className="text-dark-text-secondary text-xs global-font">
              所有挖矿结果、角色状态、金币数量由系统生成，每块土地可无限次挖矿，每次都有新的随机结果
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
