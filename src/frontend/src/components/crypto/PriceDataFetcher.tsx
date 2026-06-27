import React, { useState, useEffect, useCallback } from "react";
import coinGeckoService, {
  type CoinGeckoPrice,
} from "../../services/coingecko";

interface PriceDataState {
  priceData: CoinGeckoPrice[];
  currentPrice: number | null;
  priceChange: number | null;
  isInitialLoading: boolean;
  error: string | null;
  cacheStatus: "cached" | "refreshing" | "unavailable";
}

interface PriceDataFetcherProps {
  selectedTradingPair: string;
  onDataUpdate: (data: PriceDataState) => void;
}

export default function PriceDataFetcher({
  selectedTradingPair,
  onDataUpdate,
}: PriceDataFetcherProps) {
  const [currentSymbol, setCurrentSymbol] =
    useState<string>(selectedTradingPair);

  // Enhanced data fetching with cache-first strategy and strict symbol isolation
  const fetchPriceData = useCallback(async () => {
    try {
      console.log(
        `从缓存优先获取 ${selectedTradingPair} 数据，确保严格符号隔离`,
      );

      // Get cache status first with strict symbol validation
      const dataStatus =
        coinGeckoService.getCacheDataStatus(selectedTradingPair);

      // Validate trading pair first - check if it's supported
      const supportedPairs = coinGeckoService.getSupportedTradingPairs();
      if (!supportedPairs.includes(selectedTradingPair)) {
        console.warn(
          `不支持的交易对: ${selectedTradingPair}，支持的交易对: ${supportedPairs.join(", ")}`,
        );
        onDataUpdate({
          priceData: [],
          currentPrice: null,
          priceChange: null,
          isInitialLoading: false,
          error: `不支持的交易对: ${selectedTradingPair}`,
          cacheStatus: "unavailable",
        });
        return;
      }

      // Validate with API if needed
      const isValidPair =
        await coinGeckoService.validateTradingPair(selectedTradingPair);
      if (!isValidPair) {
        console.warn(`交易对验证失败: ${selectedTradingPair}`);
        onDataUpdate({
          priceData: [],
          currentPrice: null,
          priceChange: null,
          isInitialLoading: false,
          error: `交易对验证失败: ${selectedTradingPair}`,
          cacheStatus: "unavailable",
        });
        return;
      }

      // Cache-first data fetching with strict symbol validation
      const [chartData, priceDataResult] = await Promise.all([
        coinGeckoService.getHistoricalData(selectedTradingPair),
        coinGeckoService.getCurrentPrice(selectedTradingPair),
      ]);

      // Validate that we're still on the same trading pair
      if (selectedTradingPair !== currentSymbol) {
        console.log(
          `交易对已切换，忽略 ${selectedTradingPair} 的数据以确保符号隔离`,
        );
        return;
      }

      let newPriceData: CoinGeckoPrice[] = [];
      let newCurrentPrice: number | null = null;
      let newPriceChange: number | null = null;
      let newIsInitialLoading = false;
      let newError: string | null = null;

      // Handle chart data with strict symbol validation
      if (chartData && Array.isArray(chartData) && chartData.length > 0) {
        const validData = chartData.filter(
          (point) =>
            point &&
            typeof point.price === "number" &&
            typeof point.timestamp === "number" &&
            point.price > 0 &&
            Number.isFinite(point.price) &&
            point.timestamp > 0,
        );

        if (validData.length > 0) {
          newPriceData = validData;

          // Calculate price change from chart data
          const latest = validData[validData.length - 1];
          const earliest = validData[0];

          if (latest && earliest && latest.price > 0 && earliest.price > 0) {
            newPriceChange =
              ((latest.price - earliest.price) / earliest.price) * 100;
          }

          console.log(
            `立即显示 ${validData.length} 个缓存图表数据点，币种: ${selectedTradingPair}，确保符号隔离`,
          );
        } else {
          console.log(
            `${selectedTradingPair} 图表数据格式无效，显示空图表以确保符号隔离`,
          );
          newIsInitialLoading = true;
        }
      } else {
        console.log(
          `${selectedTradingPair} 暂无图表数据，显示空图表以确保符号隔离`,
        );
        newIsInitialLoading = true;
      }

      // Handle current price data with strict symbol validation
      if (
        priceDataResult &&
        typeof priceDataResult.price === "number" &&
        priceDataResult.price > 0
      ) {
        newCurrentPrice = priceDataResult.price;
        console.log(
          `立即显示 ${selectedTradingPair} 缓存当前价格: $${priceDataResult.price}，确保符号隔离`,
        );
      } else {
        console.log(
          `${selectedTradingPair} 暂无当前价格数据，清空价格显示以确保符号隔离`,
        );
      }

      onDataUpdate({
        priceData: newPriceData,
        currentPrice: newCurrentPrice,
        priceChange: newPriceChange,
        isInitialLoading: newIsInitialLoading,
        error: newError,
        cacheStatus: dataStatus.status,
      });
    } catch (err) {
      console.error(`获取 ${selectedTradingPair} 数据失败:`, err);

      // Try to get cached data even if refresh failed
      try {
        const cachedChartData =
          await coinGeckoService.getHistoricalData(selectedTradingPair);
        const cachedPriceData =
          await coinGeckoService.getCurrentPrice(selectedTradingPair);

        if (selectedTradingPair === currentSymbol) {
          let cachedPriceDataArray: CoinGeckoPrice[] = [];
          let cachedCurrentPrice: number | null = null;

          if (
            cachedChartData &&
            Array.isArray(cachedChartData) &&
            cachedChartData.length > 0
          ) {
            cachedPriceDataArray = cachedChartData;
            console.log(
              `显示 ${selectedTradingPair} 缓存数据，后台刷新失败，确保符号隔离`,
            );
          }

          if (cachedPriceData && cachedPriceData.price > 0) {
            cachedCurrentPrice = cachedPriceData.price;
          }

          onDataUpdate({
            priceData: cachedPriceDataArray,
            currentPrice: cachedCurrentPrice,
            priceChange: null,
            isInitialLoading: cachedPriceDataArray.length === 0,
            error: "数据暂时获取不到",
            cacheStatus: "unavailable",
          });
        }
      } catch (_cacheError) {
        if (selectedTradingPair === currentSymbol) {
          onDataUpdate({
            priceData: [],
            currentPrice: null,
            priceChange: null,
            isInitialLoading: false,
            error: "数据暂时获取不到",
            cacheStatus: "unavailable",
          });
        }
      }

      console.log(
        `${selectedTradingPair} 显示缓存数据或"数据暂时获取不到"状态，确保符号隔离`,
      );
    }
  }, [selectedTradingPair, currentSymbol, onDataUpdate]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onDataUpdate is stable callback
  useEffect(() => {
    if (currentSymbol !== selectedTradingPair) {
      console.log(`交易对切换: ${currentSymbol} -> ${selectedTradingPair}`);
      setCurrentSymbol(selectedTradingPair);

      // Clear previous trading pair's data immediately
      onDataUpdate({
        priceData: [],
        currentPrice: null,
        priceChange: null,
        isInitialLoading: false,
        error: null,
        cacheStatus: "unavailable",
      });
    }

    fetchPriceData();
  }, [selectedTradingPair, currentSymbol, fetchPriceData]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPriceData();
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [fetchPriceData]);

  // This component doesn't render anything, it's just for data fetching
  return null;
}

export type { PriceDataState };
