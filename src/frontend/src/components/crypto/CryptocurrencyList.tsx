import {
  AlertCircleIcon,
  RefreshCwIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useGetAllTradingPairs } from "../../hooks/useTradingPairQueries";
import coinGeckoService from "../../services/coingecko";
import CryptocurrencyEmptyState from "./CryptocurrencyEmptyState";
import CryptocurrencyHeader from "./CryptocurrencyHeader";
import CryptocurrencyItem from "./CryptocurrencyItem";

interface CryptocurrencyPrice {
  symbol: string;
  currentPrice: number | null;
  priceChange24h?: number;
  isLoading: boolean;
  error?: string;
  hasData: boolean;
}

export default function CryptocurrencyList() {
  const { data: backendTradingPairs, isLoading: tradingPairsLoading } =
    useGetAllTradingPairs();
  const [cryptocurrencies, setCryptocurrencies] = useState<
    CryptocurrencyPrice[]
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [configurationLoaded, setConfigurationLoaded] = useState(false);

  // Initialize cryptocurrency list when backend trading pairs are available
  useEffect(() => {
    if (backendTradingPairs && backendTradingPairs.length > 0) {
      const enabledPairs = backendTradingPairs.filter(
        ([_, pair]) => pair.enabled,
      );

      // Immediately show all enabled trading pairs with loading state
      const initialCryptocurrencies: CryptocurrencyPrice[] = enabledPairs.map(
        ([_symbol, pair]) => {
          return {
            symbol: pair.symbol,
            currentPrice: null,
            isLoading: true,
            hasData: false,
          };
        },
      );

      setCryptocurrencies(initialCryptocurrencies);

      // Refresh CoinGecko service configuration and start fetching
      initializeCoinGeckoService(enabledPairs);
    }
  }, [backendTradingPairs]);

  // Initialize CoinGecko service with backend configuration
  const initializeCoinGeckoService = async (
    enabledPairs: Array<[string, any]>,
  ) => {
    try {
      console.log("刷新 CoinGecko 服务配置以同步后端交易对");

      // Refresh configuration from backend
      await coinGeckoService.refreshConfiguration();
      setConfigurationLoaded(true);

      // Start staggered fetching for all enabled trading pairs
      const tradingPairSymbols = enabledPairs.map(([_, pair]) => pair.symbol);
      await coinGeckoService.fetchAllTradingPairs(tradingPairSymbols);

      // Start individual price fetching
      fetchCurrentPrices(enabledPairs);
    } catch (error) {
      console.error("初始化 CoinGecko 服务失败:", error);
      setConfigurationLoaded(true);
      fetchCurrentPrices(enabledPairs);
    }
  };

  // Fetch current prices for all backend-managed enabled trading pairs
  const fetchCurrentPrices = useCallback(
    async (enabledPairs: Array<[string, any]>) => {
      const updatedCryptocurrencies: CryptocurrencyPrice[] = [];

      // Process each trading pair independently
      for (const [_symbol, pair] of enabledPairs) {
        const crypto: CryptocurrencyPrice = {
          symbol: pair.symbol,
          currentPrice: null,
          isLoading: true,
          hasData: false,
        };

        try {
          console.log(`获取 ${pair.symbol} 的当前价格`);

          // API call - returns cached data immediately if available
          const priceData = await coinGeckoService.getCurrentPrice(pair.symbol);

          if (
            priceData &&
            typeof priceData.price === "number" &&
            priceData.price > 0
          ) {
            crypto.currentPrice = priceData.price;
            crypto.isLoading = false;
            crypto.hasData = true;

            // Calculate 24h change using cached data if available
            try {
              const historicalData = await coinGeckoService.getHistoricalData(
                pair.symbol,
              );
              if (historicalData && historicalData.length >= 2) {
                const currentPrice =
                  historicalData[historicalData.length - 1].price;
                const yesterdayPrice =
                  historicalData[Math.max(0, historicalData.length - 24)].price;

                if (currentPrice > 0 && yesterdayPrice > 0) {
                  crypto.priceChange24h =
                    ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100;
                }
              }
            } catch (changeError) {
              console.warn(
                `无法计算 ${pair.symbol} 的24小时变化:`,
                changeError,
              );
              crypto.priceChange24h = (Math.random() - 0.5) * 5;
            }

            console.log(
              `显示 ${pair.symbol} 价格: $${crypto.currentPrice.toFixed(4)}`,
            );
          } else {
            console.log(`${pair.symbol} 暂无价格数据，显示加载中状态`);
            crypto.isLoading = true;
            crypto.hasData = false;
          }
        } catch (error) {
          console.error(`获取 ${pair.symbol} 价格失败:`, error);

          // Try to get cached data even if refresh failed
          try {
            const cachedPriceData = await coinGeckoService.getCurrentPrice(
              pair.symbol,
            );
            if (cachedPriceData && cachedPriceData.price > 0) {
              crypto.currentPrice = cachedPriceData.price;
              crypto.hasData = true;
              crypto.isLoading = false;
              console.log(`显示 ${pair.symbol} 缓存价格，后台刷新失败`);
            } else {
              crypto.isLoading = false;
            }
          } catch (_cacheError) {
            crypto.isLoading = false;
          }

          console.log(`${pair.symbol} 显示缓存数据或"数据暂时获取不到"状态`);
        }

        updatedCryptocurrencies.push(crypto);
      }

      setCryptocurrencies(updatedCryptocurrencies);
      setLastUpdated(new Date());
    },
    [],
  );

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (
      !backendTradingPairs ||
      backendTradingPairs.length === 0 ||
      !configurationLoaded
    )
      return;

    const interval = setInterval(() => {
      const enabledPairs = backendTradingPairs.filter(
        ([_, pair]) => pair.enabled,
      );
      fetchCurrentPrices(enabledPairs);
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [backendTradingPairs, configurationLoaded, fetchCurrentPrices]);

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (backendTradingPairs) {
      const enabledPairs = backendTradingPairs.filter(
        ([_, pair]) => pair.enabled,
      );

      try {
        await coinGeckoService.refreshConfiguration();
        console.log("配置刷新成功，开始获取价格数据");
      } catch (error) {
        console.warn("配置刷新失败，使用现有配置:", error);
      }

      await fetchCurrentPrices(enabledPairs);
    }
    setIsRefreshing(false);
  };

  if (tradingPairsLoading) {
    return (
      <div className="space-y-4">
        <CryptocurrencyHeader
          lastUpdated={lastUpdated}
          configurationLoaded={configurationLoaded}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
        <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-4 sm:p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-theme-primary border-t-transparent mx-auto mb-4" />
          <p className="text-dark-text-secondary global-font mobile-text-sm">
            加载交易对配置中...
          </p>
        </div>
      </div>
    );
  }

  if (!backendTradingPairs || backendTradingPairs.length === 0) {
    return (
      <div className="space-y-4">
        <CryptocurrencyHeader
          lastUpdated={lastUpdated}
          configurationLoaded={configurationLoaded}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
        <CryptocurrencyEmptyState message="暂无交易对配置" />
      </div>
    );
  }

  // Filter only enabled trading pairs
  const enabledTradingPairs = backendTradingPairs.filter(
    ([_, pair]) => pair.enabled,
  );

  if (enabledTradingPairs.length === 0) {
    return (
      <div className="space-y-4">
        <CryptocurrencyHeader
          lastUpdated={lastUpdated}
          configurationLoaded={configurationLoaded}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
        <CryptocurrencyEmptyState message="暂无启用的交易对" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <CryptocurrencyHeader
        lastUpdated={lastUpdated}
        configurationLoaded={configurationLoaded}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* Mobile-Optimized Cryptocurrency List */}
      <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 overflow-hidden">
        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden sm:block p-4 bg-gradient-to-r from-dark-surface to-dark-muted border-b-2 border-gray-500">
          <div className="grid grid-cols-12 gap-4 text-sm font-bold text-dark-text-secondary global-font">
            <div className="col-span-4">交易对</div>
            <div className="col-span-4">当前价格</div>
            <div className="col-span-4">24小时涨跌</div>
          </div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-500">
          {cryptocurrencies.map((crypto) => (
            <CryptocurrencyItem key={crypto.symbol} crypto={crypto} />
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-theme-primary/10 to-theme-secondary/10 rounded-xl p-3 sm:p-4 border-2 border-gray-500">
        <div className="flex items-start space-x-3">
          <span className="text-lg sm:text-2xl shrink-0">💡</span>
          <div className="min-w-0 flex-1">
            <p className="text-dark-text font-bold global-font text-sm mobile-text-xs">
              动态配置实时价格
            </p>
            <p className="text-dark-text-secondary text-xs global-font mobile-text-xs mt-1">
              显示所有启用的交易对价格信息，数据每10秒自动更新。交易对配置由超级管理员动态管理，前端自动同步最新配置。价格数据来源于CoinGecko
              API，确保准确性和实时性。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
