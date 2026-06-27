import { AlertCircleIcon, CheckCircleIcon, RefreshCwIcon } from "lucide-react";
import type React from "react";

interface ChartStatusIndicatorProps {
  cacheStatus: "cached" | "refreshing" | "unavailable";
  selectedTradingPair: string;
  error: string | null;
}

export default function ChartStatusIndicator({
  cacheStatus,
  selectedTradingPair,
  error,
}: ChartStatusIndicatorProps) {
  return (
    <div className="absolute top-4 left-4 bg-dark-surface/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-500">
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            cacheStatus === "cached"
              ? "bg-dark-success"
              : cacheStatus === "refreshing"
                ? "bg-dark-warning animate-pulse"
                : "bg-dark-error"
          }`}
        />
        <span className="text-dark-text-secondary text-xs font-medium global-font">
          {cacheStatus === "cached" &&
            `${selectedTradingPair} 缓存数据 (10秒刷新)`}
          {cacheStatus === "refreshing" &&
            `${selectedTradingPair} 后台刷新中...`}
          {cacheStatus === "unavailable" &&
            `${selectedTradingPair} ${error || "数据暂时获取不到"}`}
        </span>
      </div>
    </div>
  );
}

export function ChartTooltip({
  hoveredPoint,
  selectedTradingPair,
  containerRef,
}: {
  hoveredPoint: any;
  selectedTradingPair: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (!hoveredPoint || !containerRef.current) return null;

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes("BTC")) {
      return `$${price.toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    if (symbol.includes("ETH") || symbol.includes("SOL")) {
      return `$${price.toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    if (symbol.includes("ADA")) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toFixed(4)}`;
  };

  return (
    <div
      className="absolute bg-dark-card border-3 border-theme-primary rounded-xl p-4 shadow-2xl pointer-events-none z-10 backdrop-blur-sm"
      style={{
        left: `${hoveredPoint.x + 15}px`,
        top: `${hoveredPoint.y - 80}px`,
        transform:
          hoveredPoint.x > containerRef.current.clientWidth - 250
            ? "translateX(-100%)"
            : "none",
      }}
    >
      <div className="space-y-2">
        <div className="text-dark-text font-bold text-lg elegant-numbers global-font">
          {formatPrice(hoveredPoint.price, selectedTradingPair)}
        </div>
        <div className="text-dark-text-secondary text-sm global-font">
          {hoveredPoint.time}
        </div>
        <div className="flex items-center space-x-2 text-xs text-theme-primary global-font">
          <span>💡</span>
          <span>拖拽图表查看更多 {selectedTradingPair} 数据</span>
        </div>
      </div>
    </div>
  );
}
