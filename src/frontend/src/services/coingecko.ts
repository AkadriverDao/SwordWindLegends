// Advanced Cache-First CoinGecko API Service with Complete Backend Integration
// Handles all API interactions with CoinGecko for cryptocurrency data without requiring API keys
// Now completely integrated with backend for all trading pair and coinId configurations

export interface CoinGeckoPrice {
  timestamp: number;
  price: number;
  volume?: number;
  market_cap?: number;
}

export interface CoinGeckoPriceResponse {
  [coinId: string]: {
    usd: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
    last_updated_at?: number;
  };
}

export interface CoinGeckoMarketChartRangeResponse {
  prices: Array<[number, number]>;
  market_caps?: Array<[number, number]>;
  total_volumes?: Array<[number, number]>;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  tradingPair: string;
  version: number;
}

interface RequestQueueItem {
  tradingPair: string;
  timestamp: number;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  requestType: "price" | "chart";
}

interface TradingPairConfig {
  symbol: string;
  coinId: string;
  enabled: boolean;
}

class CoinGeckoService {
  private priceCache = new Map<string, CacheEntry<CoinGeckoPrice>>();
  private chartCache = new Map<string, CacheEntry<CoinGeckoPrice[]>>();
  private lastRequestTime = new Map<string, number>();
  private requestQueues = new Map<string, RequestQueueItem[]>();
  private processingQueues = new Set<string>();
  private backgroundRefreshInProgress = new Set<string>();
  private staggeredFetchQueue: string[] = [];
  private staggeredFetchInProgress = false;

  // Dynamic configuration from backend - completely backend-driven
  private tradingPairConfigs = new Map<string, TradingPairConfig>();
  private configurationLoaded = false;
  private configurationLoading = false;
  private configurationCallbacks: Array<() => void> = [];

  private readonly CACHE_VERSION = 9; // Increment for complete backend integration
  private readonly CACHE_DURATION = 10000; // 10 seconds cache per trading pair
  private readonly REQUEST_INTERVAL = 10000; // Strict 10 seconds minimum between requests per trading pair
  private readonly STAGGER_DELAY = 2000; // 2 seconds between staggered requests
  private readonly BASE_URL = "https://api.coingecko.com/api/v3";
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second base delay
  private readonly STORAGE_KEY_PREFIX = "coingecko_cache_v";
  private readonly MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit for localStorage

  constructor() {
    // Initialize persistent cache from localStorage with enhanced error handling
    this.loadCacheFromStorage();

    // Load configuration from backend on initialization
    this.loadConfigurationFromBackend();
  }

  // Load complete trading pair configuration including coinIds from backend
  private async loadConfigurationFromBackend(): Promise<void> {
    if (this.configurationLoading || this.configurationLoaded) {
      return;
    }

    this.configurationLoading = true;
    console.log("开始从后端加载完整交易对配置，包括 symbol 和 coinId 映射");

    try {
      // Import the actor hook dynamically to avoid circular dependencies
      const { createActorWithConfig } = await import("../config");
      const actor = await createActorWithConfig();

      if (!actor) {
        throw new Error("无法创建后端 actor");
      }

      // Get all trading pairs with complete data from backend
      const backendTradingPairs = await actor.getAllTradingPairs();
      console.log("从后端获取到完整交易对配置:", backendTradingPairs);

      // Clear existing configuration
      this.tradingPairConfigs.clear();
      this.requestQueues.clear();

      // Process backend trading pairs and build complete configuration
      for (const [symbol, tradingPair] of backendTradingPairs) {
        // Validate that we have both symbol and coinId from backend
        if (!tradingPair.coinId || tradingPair.coinId.trim() === "") {
          console.warn(`交易对 ${symbol} 缺少 coinId，跳过配置`);
          continue;
        }

        const config: TradingPairConfig = {
          symbol: tradingPair.symbol,
          coinId: tradingPair.coinId,
          enabled: tradingPair.enabled,
        };

        this.tradingPairConfigs.set(symbol, config);
        this.requestQueues.set(symbol, []);

        console.log(
          `配置交易对: ${symbol} -> ${tradingPair.coinId} (${tradingPair.enabled ? "启用" : "禁用"})`,
        );
      }

      this.configurationLoaded = true;
      console.log(
        `成功加载 ${this.tradingPairConfigs.size} 个完整交易对配置，包括 coinId 映射`,
      );

      // Execute any pending callbacks
      for (const callback of this.configurationCallbacks) {
        callback();
      }
      this.configurationCallbacks = [];
    } catch (error) {
      console.error("从后端加载交易对配置失败:", error);

      // No fallback - completely backend-driven
      console.log("无法加载后端配置，服务将等待后端可用");
      this.tradingPairConfigs.clear();
      this.requestQueues.clear();
    } finally {
      this.configurationLoading = false;
    }
  }

  // Wait for configuration to be loaded
  private async waitForConfiguration(): Promise<void> {
    if (this.configurationLoaded) {
      return;
    }

    if (!this.configurationLoading) {
      this.loadConfigurationFromBackend();
    }

    return new Promise<void>((resolve) => {
      if (this.configurationLoaded) {
        resolve();
        return;
      }

      this.configurationCallbacks.push(resolve);
    });
  }

  // Get coinId for trading pair from backend configuration
  private getCoinId(tradingPair: string): string | null {
    const config = this.tradingPairConfigs.get(tradingPair);
    return config?.coinId || null;
  }

  // Check if trading pair is enabled
  private isTradingPairEnabled(tradingPair: string): boolean {
    const config = this.tradingPairConfigs.get(tradingPair);
    return config?.enabled || false;
  }

  // Refresh configuration from backend
  public async refreshConfiguration(): Promise<void> {
    console.log("刷新后端交易对配置，包括 coinId 映射");
    this.configurationLoaded = false;
    this.configurationLoading = false;
    await this.loadConfigurationFromBackend();
  }

  // Enhanced persistent cache loading with robust error handling and validation
  private loadCacheFromStorage(): void {
    try {
      const priceStorageKey = `${this.STORAGE_KEY_PREFIX}${this.CACHE_VERSION}_price`;
      const chartStorageKey = `${this.STORAGE_KEY_PREFIX}${this.CACHE_VERSION}_chart`;

      // Load price cache with validation
      const priceCacheData = localStorage.getItem(priceStorageKey);
      if (priceCacheData) {
        try {
          const parsedPriceCache = JSON.parse(priceCacheData);
          if (this.validateCacheStructure(parsedPriceCache, "price")) {
            for (const [key, value] of Object.entries(parsedPriceCache)) {
              const cacheEntry = value as CacheEntry<CoinGeckoPrice>;
              if (this.validateCacheEntry(cacheEntry, "price")) {
                this.priceCache.set(key, cacheEntry);
              }
            }
            console.log("CoinGecko 价格缓存已从持久存储加载，立即可用");
          } else {
            console.warn("价格缓存结构验证失败，清空缓存");
            localStorage.removeItem(priceStorageKey);
          }
        } catch (parseError) {
          console.warn("解析价格缓存失败，清空缓存:", parseError);
          localStorage.removeItem(priceStorageKey);
        }
      }

      // Load chart cache with validation
      const chartCacheData = localStorage.getItem(chartStorageKey);
      if (chartCacheData) {
        try {
          const parsedChartCache = JSON.parse(chartCacheData);
          if (this.validateCacheStructure(parsedChartCache, "chart")) {
            for (const [key, value] of Object.entries(parsedChartCache)) {
              const cacheEntry = value as CacheEntry<CoinGeckoPrice[]>;
              if (this.validateCacheEntry(cacheEntry, "chart")) {
                this.chartCache.set(key, cacheEntry);
              }
            }
            console.log("CoinGecko 图表缓存已从持久存储加载，立即可用");
          } else {
            console.warn("图表缓存结构验证失败，清空缓存");
            localStorage.removeItem(chartStorageKey);
          }
        } catch (parseError) {
          console.warn("解析图表缓存失败，清空缓存:", parseError);
          localStorage.removeItem(chartStorageKey);
        }
      }
    } catch (error) {
      console.warn("加载 CoinGecko 持久缓存失败，使用空缓存:", error);
      this.clearAllStorageCache();
    }
  }

  // Validate cache structure to ensure compatibility
  private validateCacheStructure(cache: any, type: "price" | "chart"): boolean {
    if (!cache || typeof cache !== "object") return false;

    // Check if it's an object with string keys
    for (const [key, value] of Object.entries(cache)) {
      if (typeof key !== "string" || !this.validateCacheEntry(value, type)) {
        return false;
      }
    }

    return true;
  }

  // Validate individual cache entry
  private validateCacheEntry(entry: any, type: "price" | "chart"): boolean {
    if (!entry || typeof entry !== "object") return false;

    const requiredFields = ["data", "timestamp", "tradingPair", "version"];
    for (const field of requiredFields) {
      if (!(field in entry)) return false;
    }

    // Check version compatibility
    if (entry.version !== this.CACHE_VERSION) return false;

    // Validate data structure based on type
    if (type === "price") {
      const data = entry.data;
      return (
        data &&
        typeof data === "object" &&
        typeof data.timestamp === "number" &&
        typeof data.price === "number" &&
        data.price > 0
      );
    }
    if (type === "chart") {
      const data = entry.data;
      return (
        Array.isArray(data) &&
        data.every(
          (item) =>
            item &&
            typeof item === "object" &&
            typeof item.timestamp === "number" &&
            typeof item.price === "number" &&
            item.price > 0,
        )
      );
    }

    return false;
  }

  // Enhanced persistent storage management with quota checking and cleanup
  private saveCacheToStorage(): void {
    try {
      const priceStorageKey = `${this.STORAGE_KEY_PREFIX}${this.CACHE_VERSION}_price`;
      const chartStorageKey = `${this.STORAGE_KEY_PREFIX}${this.CACHE_VERSION}_chart`;

      const priceCache = Object.fromEntries(this.priceCache.entries());
      const chartCache = Object.fromEntries(this.chartCache.entries());

      const priceCacheString = JSON.stringify(priceCache);
      const chartCacheString = JSON.stringify(chartCache);

      // Check storage quota before saving
      const totalSize = priceCacheString.length + chartCacheString.length;

      if (totalSize > this.MAX_STORAGE_SIZE) {
        console.warn("缓存大小超出限制，清理旧缓存条目");
        this.evictOldestCacheEntries();

        // Retry with cleaned cache
        const cleanedPriceCache = Object.fromEntries(this.priceCache.entries());
        const cleanedChartCache = Object.fromEntries(this.chartCache.entries());

        localStorage.setItem(
          priceStorageKey,
          JSON.stringify(cleanedPriceCache),
        );
        localStorage.setItem(
          chartStorageKey,
          JSON.stringify(cleanedChartCache),
        );
      } else {
        localStorage.setItem(priceStorageKey, priceCacheString);
        localStorage.setItem(chartStorageKey, chartCacheString);
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        console.warn("浏览器存储配额已满，清理缓存");
        this.evictOldestCacheEntries();
        try {
          // Retry after cleanup
          const priceCache = Object.fromEntries(this.priceCache.entries());
          const chartCache = Object.fromEntries(this.chartCache.entries());

          localStorage.setItem(
            `${this.STORAGE_KEY_PREFIX}${this.CACHE_VERSION}_price`,
            JSON.stringify(priceCache),
          );
          localStorage.setItem(
            `${this.STORAGE_KEY_PREFIX}${this.CACHE_VERSION}_chart`,
            JSON.stringify(chartCache),
          );
        } catch (retryError) {
          console.error("重试保存缓存失败:", retryError);
          this.clearAllStorageCache();
        }
      } else {
        console.warn("保存 CoinGecko 持久缓存失败:", error);
      }
    }
  }

  // Evict oldest cache entries to make room for new data
  private evictOldestCacheEntries(): void {
    const allEntries: Array<{
      key: string;
      timestamp: number;
      type: "price" | "chart";
    }> = [];

    // Collect all cache entries with timestamps
    for (const [key, entry] of this.priceCache.entries()) {
      allEntries.push({ key, timestamp: entry.timestamp, type: "price" });
    }

    for (const [key, entry] of this.chartCache.entries()) {
      allEntries.push({ key, timestamp: entry.timestamp, type: "chart" });
    }

    // Sort by timestamp (oldest first)
    allEntries.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest 25% of entries
    const entriesToRemove = Math.ceil(allEntries.length * 0.25);

    for (let i = 0; i < entriesToRemove && i < allEntries.length; i++) {
      const entry = allEntries[i];
      if (entry.type === "price") {
        this.priceCache.delete(entry.key);
      } else {
        this.chartCache.delete(entry.key);
      }
    }

    console.log(`清理了 ${entriesToRemove} 个旧缓存条目`);
  }

  // Clear all storage cache
  private clearAllStorageCache(): void {
    try {
      // Remove all versions of cache
      for (let version = 1; version <= this.CACHE_VERSION; version++) {
        localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}${version}_price`);
        localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}${version}_chart`);
      }
    } catch (error) {
      console.warn("清理存储缓存失败:", error);
    }
  }

  // Symbol-specific cache key generation with strict isolation
  private getPriceCacheKey(tradingPair: string): string {
    return `price_${tradingPair}_isolated`;
  }

  private getChartCacheKey(tradingPair: string): string {
    return `chart_${tradingPair}_30d_isolated`;
  }

  // Enhanced cache validity check with immediate serving strategy
  private isCacheValid<T>(
    cache: Map<string, CacheEntry<T>>,
    cacheKey: string,
  ): boolean {
    const cached = cache.get(cacheKey);
    if (!cached) return false;

    // Check version compatibility
    if (cached.version !== this.CACHE_VERSION) {
      cache.delete(cacheKey);
      this.saveCacheToStorage();
      return false;
    }

    // For cache-first strategy, we consider cache valid for longer periods
    // but still trigger background refresh when appropriate
    const isValid = Date.now() - cached.timestamp < this.CACHE_DURATION;

    return isValid;
  }

  // Check if cache exists (regardless of validity) for immediate serving with strict symbol validation
  private hasCachedData<T>(
    cache: Map<string, CacheEntry<T>>,
    cacheKey: string,
    expectedTradingPair: string,
  ): boolean {
    const cached = cache.get(cacheKey);
    if (!cached) return false;

    // Check version compatibility
    if (cached.version !== this.CACHE_VERSION) {
      cache.delete(cacheKey);
      this.saveCacheToStorage();
      return false;
    }

    // Strict symbol validation - ensure cached data matches exactly the requested trading pair
    if (cached.tradingPair !== expectedTradingPair) {
      console.warn(
        `缓存数据交易对不匹配: 期望 ${expectedTradingPair}, 实际 ${cached.tradingPair}`,
      );
      cache.delete(cacheKey);
      this.saveCacheToStorage();
      return false;
    }

    return true;
  }

  // Enhanced staggered request processing to avoid rate limits
  private async processStaggeredFetch(): Promise<void> {
    if (
      this.staggeredFetchInProgress ||
      this.staggeredFetchQueue.length === 0
    ) {
      return;
    }

    this.staggeredFetchInProgress = true;
    console.log("开始分批处理交易对数据获取，避免频率限制");

    try {
      while (this.staggeredFetchQueue.length > 0) {
        const tradingPair = this.staggeredFetchQueue.shift();
        if (!tradingPair) break;

        console.log(`分批处理: ${tradingPair}`);

        // Process both price and chart data for this trading pair
        try {
          await Promise.all([
            this.fetchFreshPriceDataStaggered(tradingPair),
            this.fetchFreshChartDataStaggered(tradingPair),
          ]);
          console.log(`${tradingPair} 分批数据获取成功`);
        } catch (error) {
          console.warn(`${tradingPair} 分批数据获取失败:`, error);
        }

        // Wait before processing next trading pair to avoid rate limits
        if (this.staggeredFetchQueue.length > 0) {
          console.log(`等待 ${this.STAGGER_DELAY}ms 后处理下一个交易对`);
          await this.sleep(this.STAGGER_DELAY);
        }
      }
    } finally {
      this.staggeredFetchInProgress = false;
      console.log("分批处理完成");
    }
  }

  // Add trading pair to staggered fetch queue
  private addToStaggeredQueue(tradingPair: string): void {
    if (!this.staggeredFetchQueue.includes(tradingPair)) {
      this.staggeredFetchQueue.push(tradingPair);
      console.log(`${tradingPair} 已添加到分批获取队列`);

      // Start processing if not already in progress
      this.processStaggeredFetch();
    }
  }

  // Enhanced request queue management for per-trading-pair rate limiting
  private async queueRequest<T>(
    tradingPair: string,
    requestType: "price" | "chart",
    requestFn: () => Promise<T>,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const queue = this.requestQueues.get(tradingPair) || [];

      queue.push({
        tradingPair,
        timestamp: Date.now(),
        resolve,
        reject,
        requestType,
      });

      this.requestQueues.set(tradingPair, queue);

      // Process queue if not already processing
      if (!this.processingQueues.has(tradingPair)) {
        this.processRequestQueue(tradingPair, requestFn);
      }
    });
  }

  // Process request queue with strict rate limiting
  private async processRequestQueue<T>(
    tradingPair: string,
    requestFn: () => Promise<T>,
  ): Promise<void> {
    this.processingQueues.add(tradingPair);

    try {
      const queue = this.requestQueues.get(tradingPair) || [];

      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;

        try {
          // Check rate limiting
          const lastRequest = this.lastRequestTime.get(tradingPair);
          if (lastRequest) {
            const timeSinceLastRequest = Date.now() - lastRequest;
            if (timeSinceLastRequest < this.REQUEST_INTERVAL) {
              const waitTime = this.REQUEST_INTERVAL - timeSinceLastRequest;
              console.log(
                `${tradingPair} 后台刷新等待 ${Math.ceil(waitTime / 1000)} 秒`,
              );
              await this.sleep(waitTime);
            }
          }

          // Update request time before making request
          this.lastRequestTime.set(tradingPair, Date.now());

          // Execute request
          const result = await requestFn();
          item.resolve(result);
        } catch (error) {
          console.warn(`${tradingPair} 后台刷新失败:`, error);
          item.reject(error);
        }
      }
    } finally {
      this.processingQueues.delete(tradingPair);
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Enhanced request method with robust error handling and validation
  private async makeRequestWithRetry<T>(
    endpoint: string,
    params: URLSearchParams,
    tradingPair: string,
    retryCount = 0,
  ): Promise<T> {
    const url = `${this.BASE_URL}${endpoint}?${params.toString()}`;

    try {
      console.log(`${tradingPair} 后台API请求: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "CryptoTrendsApp/1.0",
        },
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit hit, implement exponential backoff
          if (retryCount < this.MAX_RETRIES) {
            const delay = this.RETRY_DELAY * 2 ** retryCount;
            console.warn(
              `${tradingPair} 后台API请求频率超限，${delay}ms 后重试 (尝试 ${retryCount + 1}/${this.MAX_RETRIES})`,
            );
            await this.sleep(delay);
            return this.makeRequestWithRetry<T>(
              endpoint,
              params,
              tradingPair,
              retryCount + 1,
            );
          }
          throw new Error(`${tradingPair} 后台API请求频率超限，请稍后重试`);
        }
        if (response.status >= 500 && retryCount < this.MAX_RETRIES) {
          // Server error, retry with exponential backoff
          const delay = this.RETRY_DELAY * 2 ** retryCount;
          console.warn(
            `${tradingPair} 后台服务器错误 ${response.status}，${delay}ms 后重试 (尝试 ${retryCount + 1}/${this.MAX_RETRIES})`,
          );
          await this.sleep(delay);
          return this.makeRequestWithRetry<T>(
            endpoint,
            params,
            tradingPair,
            retryCount + 1,
          );
        }
        throw new Error(
          `${tradingPair} 后台API请求失败: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Enhanced data validation with detailed checks
      if (!data || typeof data !== "object") {
        throw new Error(
          `${tradingPair} 后台API返回数据格式无效：数据不是有效的对象`,
        );
      }

      console.log(`${tradingPair} 后台API请求成功`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError" || error.message.includes("timeout")) {
          if (retryCount < this.MAX_RETRIES) {
            console.warn(
              `${tradingPair} 后台请求超时，重试中 (尝试 ${retryCount + 1}/${this.MAX_RETRIES})`,
            );
            await this.sleep(this.RETRY_DELAY);
            return this.makeRequestWithRetry<T>(
              endpoint,
              params,
              tradingPair,
              retryCount + 1,
            );
          }
          throw new Error(`${tradingPair} 后台请求超时，请检查网络连接`);
        }
        throw error;
      }
      throw new Error(`${tradingPair} 后台网络请求失败，请检查网络连接`);
    }
  }

  // Enhanced getCurrentPrice with cache-first strategy, background refresh, and complete backend integration
  public async getCurrentPrice(
    tradingPair = "ICP/USDT",
  ): Promise<CoinGeckoPrice | null> {
    // Wait for configuration to be loaded
    await this.waitForConfiguration();

    const coinId = this.getCoinId(tradingPair);

    if (!coinId) {
      console.warn(
        `不支持的交易对: ${tradingPair}，支持的交易对: ${this.getSupportedTradingPairs().join(", ")}`,
      );
      return null;
    }

    // Check if trading pair is enabled
    if (!this.isTradingPairEnabled(tradingPair)) {
      console.warn(`交易对 ${tradingPair} 已被禁用`);
      return null;
    }

    const cacheKey = this.getPriceCacheKey(tradingPair);

    // Cache-first strategy with strict symbol validation: Always return cached data immediately if available and matches symbol
    const cached = this.priceCache.get(cacheKey);
    if (cached && cached.tradingPair === tradingPair) {
      console.log(`立即使用 ${tradingPair} 价格缓存数据`);

      // Start background refresh if cache is getting old or invalid
      if (
        !this.isCacheValid(this.priceCache, cacheKey) &&
        !this.backgroundRefreshInProgress.has(`price_${tradingPair}`)
      ) {
        console.log(`${tradingPair} 缓存已过期，启动后台刷新`);
        this.backgroundRefreshInProgress.add(`price_${tradingPair}`);
        this.fetchFreshPriceDataBackground(tradingPair, coinId).finally(() => {
          this.backgroundRefreshInProgress.delete(`price_${tradingPair}`);
        });
      }

      return cached.data;
    }

    // No cached data available or symbol mismatch, fetch fresh data (this should be rare with persistent cache)
    console.log(`${tradingPair} 无缓存数据或符号不匹配，获取新数据`);
    return this.queueRequest(tradingPair, "price", () =>
      this.fetchFreshPriceData(tradingPair, coinId),
    );
  }

  // Background fetch for cache refresh
  private async fetchFreshPriceDataBackground(
    tradingPair: string,
    coinId: string,
  ): Promise<void> {
    try {
      await this.queueRequest(tradingPair, "price", () =>
        this.fetchFreshPriceData(tradingPair, coinId),
      );
      console.log(`${tradingPair} 后台价格刷新成功`);
    } catch (error) {
      console.warn(`${tradingPair} 后台价格刷新失败:`, error);
    }
  }

  // Staggered fetch for price data
  private async fetchFreshPriceDataStaggered(
    tradingPair: string,
  ): Promise<void> {
    const coinId = this.getCoinId(tradingPair);
    if (!coinId) return;

    try {
      await this.fetchFreshPriceData(tradingPair, coinId);
      console.log(`${tradingPair} 分批价格获取成功`);
    } catch (error) {
      console.warn(`${tradingPair} 分批价格获取失败:`, error);
    }
  }

  // Enhanced fresh price data fetching with robust validation and strict symbol association using backend coinId
  private async fetchFreshPriceData(
    tradingPair: string,
    coinId: string,
  ): Promise<CoinGeckoPrice | null> {
    const params = new URLSearchParams({
      ids: coinId,
      vs_currencies: "usd",
      include_market_cap: "true",
      include_24hr_vol: "true",
      include_last_updated_at: "true",
    });

    try {
      console.log(
        `后台获取 ${tradingPair} 当前价格，使用后端提供的币种ID: ${coinId}`,
      );

      const response = await this.makeRequestWithRetry<CoinGeckoPriceResponse>(
        "/simple/price",
        params,
        tradingPair,
      );

      // Enhanced response validation
      if (!response || typeof response !== "object") {
        throw new Error(`${tradingPair} 后台API响应格式无效`);
      }

      const coinData = response[coinId];
      if (!coinData || typeof coinData !== "object") {
        throw new Error(`${tradingPair} 后台未找到币种数据，币种ID: ${coinId}`);
      }

      if (
        typeof coinData.usd !== "number" ||
        coinData.usd <= 0 ||
        !Number.isFinite(coinData.usd)
      ) {
        throw new Error(`${tradingPair} 后台价格数据无效: ${coinData.usd}`);
      }

      const priceData: CoinGeckoPrice = {
        timestamp: coinData.last_updated_at
          ? coinData.last_updated_at * 1000
          : Date.now(),
        price: coinData.usd,
        volume:
          coinData.usd_24h_vol &&
          Number.isFinite(coinData.usd_24h_vol) &&
          coinData.usd_24h_vol > 0
            ? coinData.usd_24h_vol
            : undefined,
        market_cap:
          coinData.usd_market_cap &&
          Number.isFinite(coinData.usd_market_cap) &&
          coinData.usd_market_cap > 0
            ? coinData.usd_market_cap
            : undefined,
      };

      // Cache the result with version and strict symbol association
      const cacheKey = this.getPriceCacheKey(tradingPair);
      this.priceCache.set(cacheKey, {
        data: priceData,
        timestamp: Date.now(),
        tradingPair: tradingPair, // Strict symbol association
        version: this.CACHE_VERSION,
      });
      this.saveCacheToStorage();

      console.log(
        `${tradingPair} 后台当前价格获取成功: $${coinData.usd}，使用后端 coinId: ${coinId}`,
      );
      return priceData;
    } catch (error) {
      console.error(`后台获取 ${tradingPair} 当前价格失败:`, error);
      return null;
    }
  }

  // Enhanced getHistoricalData with cache-first strategy, background refresh, and complete backend integration
  public async getHistoricalData(
    tradingPair = "ICP/USDT",
  ): Promise<CoinGeckoPrice[] | null> {
    // Wait for configuration to be loaded
    await this.waitForConfiguration();

    const cacheKey = this.getChartCacheKey(tradingPair);

    // Cache-first strategy with strict symbol validation: Always return cached data immediately if available and matches symbol
    const cached = this.chartCache.get(cacheKey);
    if (cached && cached.tradingPair === tradingPair) {
      console.log(`立即使用 ${tradingPair} 图表缓存数据`);

      // Start background refresh if cache is getting old or invalid
      if (
        !this.isCacheValid(this.chartCache, cacheKey) &&
        !this.backgroundRefreshInProgress.has(`chart_${tradingPair}`)
      ) {
        console.log(`${tradingPair} 图表缓存已过期，启动后台刷新`);
        this.backgroundRefreshInProgress.add(`chart_${tradingPair}`);
        this.fetchFreshChartDataBackground(tradingPair).finally(() => {
          this.backgroundRefreshInProgress.delete(`chart_${tradingPair}`);
        });
      }

      return cached.data;
    }

    // No cached data available or symbol mismatch, fetch fresh data (this should be rare with persistent cache)
    console.log(`${tradingPair} 无图表缓存数据或符号不匹配，获取新数据`);
    return this.queueRequest(tradingPair, "chart", () =>
      this.fetchFreshChartData(tradingPair),
    );
  }

  // Background fetch for expired chart cache
  private async fetchFreshChartDataBackground(
    tradingPair: string,
  ): Promise<void> {
    try {
      await this.queueRequest(tradingPair, "chart", () =>
        this.fetchFreshChartData(tradingPair),
      );
      console.log(`${tradingPair} 后台图表刷新成功`);
    } catch (error) {
      console.warn(`${tradingPair} 后台图表刷新失败:`, error);
    }
  }

  // Staggered fetch for chart data
  private async fetchFreshChartDataStaggered(
    tradingPair: string,
  ): Promise<void> {
    try {
      await this.fetchFreshChartData(tradingPair);
      console.log(`${tradingPair} 分批图表获取成功`);
    } catch (error) {
      console.warn(`${tradingPair} 分批图表获取失败:`, error);
    }
  }

  // Enhanced fresh chart data fetching with robust validation and complete backend integration
  private async fetchFreshChartData(
    tradingPair: string,
  ): Promise<CoinGeckoPrice[] | null> {
    const coinId = this.getCoinId(tradingPair);

    if (!coinId) {
      console.warn(
        `不支持的交易对: ${tradingPair}，支持的交易对: ${this.getSupportedTradingPairs().join(", ")}`,
      );
      return null;
    }

    // Check if trading pair is enabled
    if (!this.isTradingPairEnabled(tradingPair)) {
      console.warn(`交易对 ${tradingPair} 已被禁用`);
      return null;
    }

    try {
      const config = this.getFixed30DayConfig();
      const { fromTimestamp, toTimestamp } = config;

      const params = new URLSearchParams({
        vs_currency: "usd",
        from: fromTimestamp.toString(),
        to: toTimestamp.toString(),
      });

      console.log(
        `后台获取 ${tradingPair} CoinGecko 固定30天历史数据，使用后端提供的币种ID: ${coinId}`,
      );

      const response =
        await this.makeRequestWithRetry<CoinGeckoMarketChartRangeResponse>(
          `/coins/${coinId}/market_chart/range`,
          params,
          tradingPair,
        );

      // Enhanced response validation
      if (!response || typeof response !== "object") {
        throw new Error(`${tradingPair} 后台API响应格式无效`);
      }

      if (
        !response.prices ||
        !Array.isArray(response.prices) ||
        response.prices.length === 0
      ) {
        throw new Error(`${tradingPair} 后台未获取到历史价格数据`);
      }

      // Validate and filter price data with enhanced checks
      const validPrices = response.prices.filter(([timestamp, price]) => {
        return (
          Array.isArray([timestamp, price]) &&
          typeof timestamp === "number" &&
          typeof price === "number" &&
          timestamp > 0 &&
          price > 0 &&
          Number.isFinite(timestamp) &&
          Number.isFinite(price) &&
          timestamp >= fromTimestamp * 1000 && // Ensure timestamp is within expected range
          timestamp <= toTimestamp * 1000
        );
      });

      if (validPrices.length === 0) {
        throw new Error(`${tradingPair} 后台历史价格数据格式无效或为空`);
      }

      // Convert CoinGecko data format to our format with enhanced validation
      const historicalData: CoinGeckoPrice[] = validPrices.map(
        ([timestamp, price], index) => {
          const volume = response.total_volumes?.[index]?.[1];
          const marketCap = response.market_caps?.[index]?.[1];

          return {
            timestamp,
            price,
            volume:
              volume && Number.isFinite(volume) && volume > 0
                ? volume
                : undefined,
            market_cap:
              marketCap && Number.isFinite(marketCap) && marketCap > 0
                ? marketCap
                : undefined,
          };
        },
      );

      // Sort by timestamp to ensure chronological order
      historicalData.sort((a, b) => a.timestamp - b.timestamp);

      // Additional validation: ensure we have reasonable data coverage
      if (historicalData.length < 10) {
        console.warn(
          `${tradingPair} 后台历史数据点过少: ${historicalData.length}`,
        );
      }

      console.log(
        `${tradingPair} 后台成功获取 ${historicalData.length} 个真实数据点，固定30天时间范围，使用后端 coinId: ${coinId}`,
      );

      // Cache the result with version and strict symbol association
      const cacheKey = this.getChartCacheKey(tradingPair);
      this.chartCache.set(cacheKey, {
        data: historicalData,
        timestamp: Date.now(),
        tradingPair: tradingPair, // Strict symbol association
        version: this.CACHE_VERSION,
      });
      this.saveCacheToStorage();

      return historicalData;
    } catch (error) {
      console.error(`后台获取 ${tradingPair} 历史数据失败:`, error);
      return null;
    }
  }

  private getFixed30DayConfig(): {
    fromTimestamp: number;
    toTimestamp: number;
  } {
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const fromTimestamp = now - 30 * 24 * 60 * 60; // 30 days ago

    return {
      fromTimestamp,
      toTimestamp: now,
    };
  }

  // Enhanced trading pair validation with complete backend integration
  public async validateTradingPair(tradingPair: string): Promise<boolean> {
    // Wait for configuration to be loaded
    await this.waitForConfiguration();

    const coinId = this.getCoinId(tradingPair);
    if (!coinId) {
      console.warn(
        `不支持的交易对: ${tradingPair}，支持的交易对: ${this.getSupportedTradingPairs().join(", ")}`,
      );
      return false;
    }

    // Check if trading pair is enabled
    if (!this.isTradingPairEnabled(tradingPair)) {
      console.warn(`交易对 ${tradingPair} 已被禁用`);
      return false;
    }

    try {
      // Use a simple ping endpoint to validate the trading pair
      const params = new URLSearchParams({
        ids: coinId,
        vs_currencies: "usd",
      });

      const response = await this.makeRequestWithRetry<CoinGeckoPriceResponse>(
        "/simple/price",
        params,
        tradingPair,
      );

      // Enhanced validation of API response structure
      if (!response || typeof response !== "object") {
        console.warn(`${tradingPair} 验证失败：API 响应格式无效`);
        return false;
      }

      const coinData = response[coinId];
      if (!coinData || typeof coinData !== "object") {
        console.warn(
          `${tradingPair} 验证失败：未找到币种数据，币种ID: ${coinId}`,
        );
        return false;
      }

      if (
        typeof coinData.usd !== "number" ||
        coinData.usd <= 0 ||
        !Number.isFinite(coinData.usd)
      ) {
        console.warn(`${tradingPair} 验证失败：价格数据无效`);
        return false;
      }

      console.log(
        `${tradingPair} 交易对验证成功，使用后端提供的币种ID: ${coinId}`,
      );
      return true;
    } catch (error) {
      console.error(`验证交易对 ${tradingPair} 失败:`, error);
      return false;
    }
  }

  // Get supported trading pairs from backend configuration
  public getSupportedTradingPairs(): string[] {
    if (!this.configurationLoaded) {
      return [];
    }

    return Array.from(this.tradingPairConfigs.keys());
  }

  // Get enabled trading pairs from backend configuration
  public getEnabledTradingPairs(): string[] {
    if (!this.configurationLoaded) {
      return [];
    }

    return Array.from(this.tradingPairConfigs.entries())
      .filter(([_, config]) => config.enabled)
      .map(([symbol, _]) => symbol);
  }

  // Enhanced cache clearing with storage cleanup
  public clearCache(tradingPair?: string): void {
    if (tradingPair) {
      // Clear cache for specific trading pair
      const priceKey = this.getPriceCacheKey(tradingPair);
      const chartKey = this.getChartCacheKey(tradingPair);

      this.priceCache.delete(priceKey);
      this.chartCache.delete(chartKey);
      this.lastRequestTime.delete(tradingPair);

      // Clear request queue
      this.requestQueues.set(tradingPair, []);

      console.log(`${tradingPair} 缓存已清空`);
    } else {
      // Clear all cache
      this.priceCache.clear();
      this.chartCache.clear();
      this.lastRequestTime.clear();

      // Clear all request queues
      for (const pair of this.getSupportedTradingPairs()) {
        this.requestQueues.set(pair, []);
      }

      console.log("所有 CoinGecko 缓存已清空");
    }

    this.saveCacheToStorage();
  }

  // Get cache status for debugging
  public getCacheStatus(): {
    priceCache: number;
    chartCache: number;
    lastRequests: number;
    queueSizes: Record<string, number>;
    storageUsage: string;
    backgroundRefresh: string[];
    staggeredQueue: string[];
    supportedPairs: string[];
    enabledPairs: string[];
    configurationLoaded: boolean;
    tradingPairConfigs: number;
  } {
    const queueSizes: Record<string, number> = {};
    for (const [pair, queue] of this.requestQueues.entries()) {
      queueSizes[pair] = queue.length;
    }

    // Estimate storage usage
    let storageUsage = "未知";
    try {
      const priceCache = JSON.stringify(
        Object.fromEntries(this.priceCache.entries()),
      );
      const chartCache = JSON.stringify(
        Object.fromEntries(this.chartCache.entries()),
      );
      const totalBytes = priceCache.length + chartCache.length;
      storageUsage = `${(totalBytes / 1024).toFixed(2)} KB`;
    } catch (error) {
      console.warn("计算存储使用量失败:", error);
    }

    return {
      priceCache: this.priceCache.size,
      chartCache: this.chartCache.size,
      lastRequests: this.lastRequestTime.size,
      queueSizes,
      storageUsage,
      backgroundRefresh: Array.from(this.backgroundRefreshInProgress),
      staggeredQueue: [...this.staggeredFetchQueue],
      supportedPairs: this.getSupportedTradingPairs(),
      enabledPairs: this.getEnabledTradingPairs(),
      configurationLoaded: this.configurationLoaded,
      tradingPairConfigs: this.tradingPairConfigs.size,
    };
  }

  // Enhanced batch fetch with immediate cache serving, background refresh, and complete backend integration
  public async fetchAllTradingPairs(tradingPairs: string[]): Promise<void> {
    console.log(
      "立即批量获取所有交易对缓存数据，启动分批后台刷新:",
      tradingPairs,
    );

    // Wait for configuration to be loaded
    await this.waitForConfiguration();

    // Filter to only supported and enabled trading pairs
    const supportedPairs = tradingPairs.filter(
      (pair) => this.getCoinId(pair) && this.isTradingPairEnabled(pair),
    );
    const unsupportedPairs = tradingPairs.filter(
      (pair) => !this.getCoinId(pair),
    );
    const disabledPairs = tradingPairs.filter(
      (pair) => this.getCoinId(pair) && !this.isTradingPairEnabled(pair),
    );

    if (unsupportedPairs.length > 0) {
      console.warn(
        "发现不支持的交易对:",
        unsupportedPairs,
        "支持的交易对:",
        this.getSupportedTradingPairs(),
      );
    }

    if (disabledPairs.length > 0) {
      console.warn("发现已禁用的交易对:", disabledPairs);
    }

    // First, try to serve all data from cache immediately with strict symbol validation
    const cacheResults = supportedPairs.map((pair) => {
      const priceKey = this.getPriceCacheKey(pair);
      const chartKey = this.getChartCacheKey(pair);

      const hasPrice = this.hasCachedData(this.priceCache, priceKey, pair);
      const hasChart = this.hasCachedData(this.chartCache, chartKey, pair);

      return { pair, hasPrice, hasChart };
    });

    const cachedPairs = cacheResults.filter(
      (r) => r.hasPrice && r.hasChart,
    ).length;
    console.log(
      `立即从缓存提供 ${cachedPairs}/${supportedPairs.length} 个交易对数据`,
    );

    // Add all supported and enabled trading pairs to staggered fetch queue for background refresh
    for (const pair of supportedPairs) {
      this.addToStaggeredQueue(pair);
    }
  }

  // Get cache data status for UI display with strict symbol validation and complete backend integration
  public getCacheDataStatus(tradingPair: string): {
    hasPrice: boolean;
    hasChart: boolean;
    priceAge?: number;
    chartAge?: number;
    status: "cached" | "refreshing" | "unavailable";
  } {
    const priceKey = this.getPriceCacheKey(tradingPair);
    const chartKey = this.getChartCacheKey(tradingPair);

    const priceCache = this.priceCache.get(priceKey);
    const chartCache = this.chartCache.get(chartKey);

    // Strict symbol validation for cached data
    const hasPrice = !!priceCache && priceCache.tradingPair === tradingPair;
    const hasChart = !!chartCache && chartCache.tradingPair === tradingPair;

    const priceAge =
      hasPrice && priceCache ? Date.now() - priceCache.timestamp : undefined;
    const chartAge =
      hasChart && chartCache ? Date.now() - chartCache.timestamp : undefined;

    const isRefreshing =
      this.backgroundRefreshInProgress.has(`price_${tradingPair}`) ||
      this.backgroundRefreshInProgress.has(`chart_${tradingPair}`) ||
      this.staggeredFetchQueue.includes(tradingPair) ||
      this.staggeredFetchInProgress;

    let status: "cached" | "refreshing" | "unavailable";
    if (hasPrice && hasChart) {
      status = isRefreshing ? "refreshing" : "cached";
    } else {
      status = "unavailable";
    }

    return {
      hasPrice,
      hasChart,
      priceAge,
      chartAge,
      status,
    };
  }
}

// Export singleton instance
export const coinGeckoService = new CoinGeckoService();

// Export types and service
export default coinGeckoService;
