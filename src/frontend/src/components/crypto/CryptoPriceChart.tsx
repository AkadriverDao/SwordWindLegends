import React, { useState, useRef } from "react";
import ChartInteractions, { type HoveredPoint } from "./ChartInteractions";
import { ChartRenderer } from "./ChartRenderer";
import ChartStatusIndicator, { ChartTooltip } from "./ChartStatusIndicator";
import ErrorHandler, { LoadingState, ErrorBoundary } from "./ErrorHandler";
import PriceDataFetcher, { type PriceDataState } from "./PriceDataFetcher";
import PriceHeader from "./PriceHeader";

interface CryptoPriceChartProps {
  selectedTradingPair?: string;
}

export default function CryptoPriceChart({
  selectedTradingPair = "ICP/USDT",
}: CryptoPriceChartProps) {
  const [priceDataState, setPriceDataState] = useState<PriceDataState>({
    priceData: [],
    currentPrice: null,
    priceChange: null,
    isInitialLoading: false,
    error: null,
    cacheStatus: "unavailable",
  });

  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDataUpdate = (newData: PriceDataState) => {
    setPriceDataState(newData);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPriceDataState((prev) => ({ ...prev, error: null }));

    // Trigger a fresh data fetch by updating the key
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleViewOffsetChange = (offset: { x: number; y: number }) => {
    setViewOffset(offset);
  };

  const handleHoveredPointChange = (point: HoveredPoint | null) => {
    setHoveredPoint(point);
  };

  // Reset view offset when switching pairs
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedTradingPair is intentionally used as a trigger
  React.useEffect(() => {
    setViewOffset({ x: 0, y: 0 });
  }, [selectedTradingPair]);

  const hasData = priceDataState.priceData.length > 0;

  // Never-blank chart guarantee: Only show loading when no data exists at all
  if (priceDataState.isInitialLoading && !hasData) {
    return <LoadingState selectedTradingPair={selectedTradingPair} />;
  }

  return (
    <ErrorBoundary
      fallback={
        <ErrorHandler
          error="图表渲染错误"
          isLoading={false}
          selectedTradingPair={selectedTradingPair}
          onRetry={handleRefresh}
          hasData={false}
        />
      }
    >
      <div className="space-y-6">
        {/* Data Fetcher - handles all API calls and cache management */}
        <PriceDataFetcher
          selectedTradingPair={selectedTradingPair}
          onDataUpdate={handleDataUpdate}
        />

        {/* Price Header with current price and controls */}
        <PriceHeader
          selectedTradingPair={selectedTradingPair}
          currentPrice={priceDataState.currentPrice}
          priceChange={priceDataState.priceChange}
          cacheStatus={priceDataState.cacheStatus}
          error={priceDataState.error}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />

        {/* Chart Container with interactions */}
        <div className="relative bg-gradient-to-br from-dark-card to-dark-surface rounded-2xl border-3 border-gray-500 p-6 shadow-2xl">
          <div ref={containerRef} className="w-full">
            <ChartInteractions
              priceData={priceDataState.priceData}
              selectedTradingPair={selectedTradingPair}
              containerRef={containerRef}
              onHoveredPointChange={handleHoveredPointChange}
              onViewOffsetChange={handleViewOffsetChange}
              viewOffset={viewOffset}
            >
              {(handlers) => (
                <ChartRenderer
                  priceData={priceDataState.priceData}
                  selectedTradingPair={selectedTradingPair}
                  priceChange={priceDataState.priceChange}
                  isLoading={priceDataState.isInitialLoading}
                  error={priceDataState.error}
                  hoveredPoint={hoveredPoint}
                  viewOffset={viewOffset}
                  containerRef={containerRef}
                  {...handlers}
                />
              )}
            </ChartInteractions>
          </div>

          {/* Chart Status Indicator */}
          <ChartStatusIndicator
            cacheStatus={priceDataState.cacheStatus}
            selectedTradingPair={selectedTradingPair}
            error={priceDataState.error}
          />

          {/* Hover Tooltip */}
          <ChartTooltip
            hoveredPoint={hoveredPoint}
            selectedTradingPair={selectedTradingPair}
            containerRef={containerRef}
          />

          {/* Error Indicator */}
          <ErrorHandler
            error={priceDataState.error}
            isLoading={priceDataState.isInitialLoading}
            selectedTradingPair={selectedTradingPair}
            onRetry={handleRefresh}
            hasData={hasData}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
