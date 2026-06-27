import {
  AlertCircleIcon,
  CheckCircleIcon,
  RefreshCwIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import React from "react";

interface CryptoPriceDisplayProps {
  selectedTradingPair: string;
  currentPrice: number | null;
  priceChange: number | null;
  cacheStatus: "cached" | "refreshing" | "unavailable";
  error: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function CryptoPriceDisplay({
  selectedTradingPair,
  currentPrice,
  priceChange,
  cacheStatus,
  error,
  isRefreshing,
  onRefresh,
}: CryptoPriceDisplayProps) {
  const formatPrice = (price: number) => {
    if (selectedTradingPair.includes("BTC")) {
      return `$${price.toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    if (
      selectedTradingPair.includes("ETH") ||
      selectedTradingPair.includes("SOL")
    ) {
      return `$${price.toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    if (selectedTradingPair.includes("ADA")) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toFixed(4)}`;
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div className="flex items-center space-x-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="text-2xl font-bold text-dark-text global-font">
              {selectedTradingPair}
            </h4>
            {currentPrice && (
              <span className="text-2xl font-bold text-dark-text elegant-numbers">
                {formatPrice(currentPrice)}
              </span>
            )}
            <div
              className={`px-3 py-1 rounded-full border-2 border-gray-500 ${
                cacheStatus === "cached"
                  ? "bg-gradient-to-r from-dark-success/20 to-dark-primary/20"
                  : cacheStatus === "refreshing"
                    ? "bg-gradient-to-r from-dark-warning/20 to-dark-accent/20"
                    : "bg-gradient-to-r from-dark-error/20 to-dark-warning/20"
              }`}
            >
              <div className="flex items-center space-x-2">
                {cacheStatus === "cached" && (
                  <CheckCircleIcon size={14} className="text-dark-success" />
                )}
                {cacheStatus === "refreshing" && (
                  <RefreshCwIcon
                    size={14}
                    className="text-dark-warning animate-spin"
                  />
                )}
                {cacheStatus === "unavailable" && (
                  <AlertCircleIcon size={14} className="text-dark-error" />
                )}
                <span
                  className={`font-bold text-sm global-font ${
                    cacheStatus === "cached"
                      ? "text-dark-success"
                      : cacheStatus === "refreshing"
                        ? "text-dark-warning"
                        : "text-dark-error"
                  }`}
                >
                  {cacheStatus === "cached" && "缓存数据"}
                  {cacheStatus === "refreshing" && "后台刷新中"}
                  {cacheStatus === "unavailable" &&
                    (error || "数据暂时获取不到")}
                </span>
              </div>
            </div>
          </div>
          {priceChange !== null && (
            <div
              className={`flex items-center space-x-2 ${priceChange >= 0 ? "text-dark-success" : "text-dark-error"}`}
            >
              {priceChange >= 0 ? (
                <TrendingUpIcon size={16} />
              ) : (
                <TrendingDownIcon size={16} />
              )}
              <span className="font-bold elegant-numbers global-font">
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)}%
              </span>
              <span className="text-dark-text-secondary text-sm global-font">
                (30天)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 bg-dark-surface hover:bg-dark-hover rounded-xl border-2 border-gray-500 transition-all duration-300 disabled:opacity-50"
          title={`刷新 ${selectedTradingPair} 数据`}
        >
          <RefreshCwIcon
            size={16}
            className={`text-dark-text ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
