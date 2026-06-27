import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  CoinsIcon,
  XCircleIcon,
} from "lucide-react";
import React, { useState } from "react";
import {
  useExchangeGoldForICP,
  useGetExchangeHistory,
  useGetExchangeRate,
} from "../hooks/useGoldExchangeQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetPlayerGold } from "../hooks/useLandMinerQueries";
import { useGetMiningLoggingEnabled } from "../hooks/useMiningConfigQueries";

interface GoldExchangePageProps {
  navigate: (
    route:
      | "/"
      | "/profile"
      | "/leaderboard"
      | "/customize"
      | "/article"
      | "/management"
      | "/category"
      | "/landminer"
      | "/goldexchange",
    params?: any,
  ) => void;
}

export default function GoldExchangePage({ navigate }: GoldExchangePageProps) {
  const { identity } = useInternetIdentity();
  const { data: playerGold, isLoading: goldLoading } = useGetPlayerGold();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();
  const { data: exchangeRate } = useGetExchangeRate();
  const { data: exchangeHistory, isLoading: historyLoading } =
    useGetExchangeHistory();
  const exchangeGoldForICP = useExchangeGoldForICP();

  const [exchangeAmount, setExchangeAmount] = useState<string>("");
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [exchangeSuccess, setExchangeSuccess] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const currentGoldBalance = playerGold || 0;
  const currentExchangeRate = exchangeRate || 100; // Default: 100 gold = 1 ICP

  // Conditional logging based on backend log switch
  const conditionalLog = (message: string, ...args: any[]) => {
    if (loggingEnabled) {
      console.log(message, ...args);
    }
  };

  const handleBack = () => {
    conditionalLog("GoldExchangePage: 返回首页");
    navigate("/");
  };

  const calculateICPAmount = (goldAmount: number): number => {
    return goldAmount / currentExchangeRate;
  };

  const handleExchangeAmountChange = (value: string) => {
    // Only allow positive integers
    const numericValue = value.replace(/[^0-9]/g, "");
    setExchangeAmount(numericValue);
    setExchangeError(null);
    setExchangeSuccess(null);
  };

  const handleMaxClick = () => {
    setExchangeAmount(currentGoldBalance.toString());
    setExchangeError(null);
    setExchangeSuccess(null);
  };

  const handleExchange = async () => {
    const goldAmount = Number.parseInt(exchangeAmount);

    if (!goldAmount || goldAmount <= 0) {
      setExchangeError("请输入有效的兑换数量");
      return;
    }

    if (goldAmount > currentGoldBalance) {
      setExchangeError("兑换数量不能超过当前金币余额");
      return;
    }

    if (goldAmount < currentExchangeRate) {
      setExchangeError(`最少需要 ${currentExchangeRate} 金币才能兑换`);
      return;
    }

    conditionalLog("GoldExchangePage: 开始兑换", {
      goldAmount,
      icpAmount: calculateICPAmount(goldAmount),
    });
    setExchangeError(null);
    setExchangeSuccess(null);

    try {
      const result = await exchangeGoldForICP.mutateAsync({ goldAmount });

      conditionalLog("GoldExchangePage: 兑换成功", result);
      setExchangeSuccess(result.message);
      setExchangeAmount("");

      // Auto-hide success message
      setTimeout(() => setExchangeSuccess(null), 5000);
    } catch (error) {
      conditionalLog("GoldExchangePage: 兑换失败:", error);
      setExchangeError(
        error instanceof Error ? error.message : "兑换失败，请重试",
      );
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case "pending":
        return <ClockIcon size={16} className="text-yellow-500" />;
      case "failed":
        return <XCircleIcon size={16} className="text-red-500" />;
      default:
        return <ClockIcon size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成";
      case "pending":
        return "处理中";
      case "failed":
        return "失败";
      default:
        return "未知";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
          <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ArrowLeftIcon size={20} className="text-dark-text" />
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <ArrowRightLeftIcon size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark-text global-font">
                    💱 金币兑换
                  </h2>
                </div>
                <p className="text-dark-text-secondary font-medium global-font">
                  将挖矿金币兑换成ICP代币
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ArrowRightLeftIcon size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-text mb-4 global-font">
              🔐 需要登录
            </h3>
            <p className="text-dark-text-secondary text-lg mb-6 global-font">
              请先登录您的账户才能使用金币兑换功能
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font"
            >
              返回首页登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <ArrowRightLeftIcon size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-dark-text global-font">
                  💱 金币兑换
                </h2>
              </div>
              <p className="text-dark-text-secondary font-medium global-font">
                将您挖矿获得的金币兑换成ICP代币，安全便捷的区块链资产转换
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Success/Error Messages */}
          {exchangeSuccess && (
            <div className="bg-green-500/20 border-2 border-green-500 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon size={24} className="text-green-500" />
                <div>
                  <p className="text-green-500 font-bold text-lg global-font">
                    🎉 兑换成功！
                  </p>
                  <p className="text-dark-text-secondary global-font">
                    {exchangeSuccess}
                  </p>
                </div>
              </div>
            </div>
          )}

          {exchangeError && (
            <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangleIcon size={24} className="text-red-500" />
                <div>
                  <p className="text-red-500 font-bold text-lg global-font">
                    ⚠️ 兑换失败
                  </p>
                  <p className="text-dark-text-secondary global-font">
                    {exchangeError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Balance Display */}
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-3 border-yellow-500 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <CoinsIcon size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark-text mb-2 global-font">
                    💰 当前金币余额
                  </h3>
                  <p className="text-dark-text-secondary global-font">
                    通过土地挖矿获得的金币积分
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-yellow-500 elegant-numbers global-font">
                  {goldLoading ? "..." : currentGoldBalance}
                </div>
                <div className="text-sm text-yellow-600 global-font font-bold">
                  金币
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Rate Information */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-3 border-green-500 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <ArrowRightLeftIcon size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-dark-text mb-2 global-font">
                  📊 当前兑换汇率
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="bg-dark-surface rounded-xl p-3 border-2 border-gray-500">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500 elegant-numbers">
                        {currentExchangeRate}
                      </div>
                      <div className="text-xs text-dark-text-secondary global-font">
                        金币
                      </div>
                    </div>
                  </div>
                  <ArrowRightLeftIcon size={20} className="text-green-500" />
                  <div className="bg-dark-surface rounded-xl p-3 border-2 border-gray-500">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500 elegant-numbers">
                        1
                      </div>
                      <div className="text-xs text-dark-text-secondary global-font">
                        ICP
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-dark-text-secondary text-sm global-font mt-2">
                  汇率实时更新，兑换即时到账
                </p>
              </div>
            </div>
          </div>

          {/* Exchange Form */}
          <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <ArrowRightLeftIcon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-text global-font">
                  💱 金币兑换
                </h3>
                <p className="text-dark-text-secondary text-sm global-font">
                  输入要兑换的金币数量，系统将自动计算对应的ICP数量
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Exchange Amount Input */}
              <div>
                <label
                  htmlFor="exchange-amount"
                  className="block text-sm font-bold text-dark-text mb-2 global-font"
                >
                  兑换数量（金币）
                </label>
                <div className="relative">
                  <input
                    id="exchange-amount"
                    type="text"
                    value={exchangeAmount}
                    onChange={(e) => handleExchangeAmountChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-theme-primary/30 focus:border-theme-primary bg-dark-card text-dark-text global-font text-lg elegant-numbers"
                    placeholder="请输入金币数量"
                    disabled={exchangeGoldForICP.isPending}
                  />
                  <button
                    type="button"
                    onClick={handleMaxClick}
                    disabled={
                      exchangeGoldForICP.isPending || currentGoldBalance === 0
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-theme-primary text-white rounded-lg text-sm font-bold hover:bg-theme-primary/80 transition-colors disabled:opacity-50"
                  >
                    最大
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-dark-text-secondary text-sm global-font">
                    可用余额: {currentGoldBalance} 金币
                  </p>
                  <p className="text-dark-text-secondary text-sm global-font">
                    最少兑换: {currentExchangeRate} 金币
                  </p>
                </div>
              </div>

              {/* Exchange Preview */}
              {exchangeAmount && Number.parseInt(exchangeAmount) > 0 && (
                <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
                  <h4 className="text-md font-bold text-dark-text mb-3 global-font">
                    📋 兑换预览
                  </h4>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-500 elegant-numbers">
                        {exchangeAmount}
                      </div>
                      <div className="text-xs text-dark-text-secondary global-font">
                        金币
                      </div>
                    </div>
                    <div className="text-center">
                      <ArrowRightLeftIcon
                        size={20}
                        className="text-green-500 mx-auto"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-500 elegant-numbers">
                        {calculateICPAmount(
                          Number.parseInt(exchangeAmount),
                        ).toFixed(4)}
                      </div>
                      <div className="text-xs text-dark-text-secondary global-font">
                        ICP
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Exchange Button */}
              <button
                type="button"
                onClick={handleExchange}
                disabled={
                  exchangeGoldForICP.isPending ||
                  !exchangeAmount ||
                  Number.parseInt(exchangeAmount) <= 0 ||
                  Number.parseInt(exchangeAmount) > currentGoldBalance ||
                  Number.parseInt(exchangeAmount) < currentExchangeRate
                }
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 global-font text-lg"
              >
                {exchangeGoldForICP.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>兑换处理中...</span>
                  </>
                ) : (
                  <>
                    <ArrowRightLeftIcon size={20} />
                    <span>💱 立即兑换</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Exchange History */}
          <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <ClockIcon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-text global-font">
                  📋 兑换历史
                </h3>
                <p className="text-dark-text-secondary text-sm global-font">
                  查看您的金币兑换记录和状态
                </p>
              </div>
            </div>

            {historyLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-theme-primary border-t-transparent mx-auto mb-4" />
                <p className="text-dark-text-secondary global-font">
                  加载兑换历史中...
                </p>
              </div>
            ) : exchangeHistory && exchangeHistory.length > 0 ? (
              <div className="space-y-4">
                {exchangeHistory.map((record) => (
                  <div
                    key={record.exchangeId}
                    className="bg-dark-card rounded-xl p-4 border-2 border-gray-500"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <ArrowRightLeftIcon
                            size={20}
                            className="text-white"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-dark-text font-bold global-font">
                              {record.goldAmount} 金币 → {record.icpAmount} ICP
                            </span>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(record.status)}
                              <span
                                className={`text-sm font-bold global-font ${getStatusColor(record.status)}`}
                              >
                                {getStatusText(record.status)}
                              </span>
                            </div>
                          </div>
                          <p className="text-dark-text-secondary text-sm global-font">
                            {formatDate(record.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-500 elegant-numbers">
                          +{record.icpAmount} ICP
                        </div>
                        <div className="text-xs text-dark-text-secondary global-font">
                          {record.status === "completed"
                            ? "已到账"
                            : record.status === "pending"
                              ? "处理中"
                              : "失败"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon size={32} className="text-gray-400" />
                </div>
                <p className="text-dark-text text-lg font-bold mb-2 global-font">
                  暂无兑换记录
                </p>
                <p className="text-dark-text-secondary global-font">
                  开始您的第一次金币兑换吧！
                </p>
              </div>
            )}
          </div>

          {/* Exchange Information */}
          <div className="bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-6 border-2 border-gray-500">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg shrink-0">
                <span className="text-white text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-dark-text mb-3 global-font">
                  🔄 兑换说明
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-bold text-dark-text global-font">
                      兑换规则：
                    </h5>
                    <ul className="text-dark-text-secondary text-sm global-font space-y-1">
                      <li>• 💰 当前汇率：{currentExchangeRate} 金币 = 1 ICP</li>
                      <li>• 🔢 最少兑换：{currentExchangeRate} 金币</li>
                      <li>• ⚡ 即时到账：兑换后立即转入您的钱包</li>
                      <li>• 🔒 安全保障：所有交易在区块链上记录</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-dark-text global-font">
                      注意事项：
                    </h5>
                    <ul className="text-dark-text-secondary text-sm global-font space-y-1">
                      <li>• 📝 兑换操作不可撤销，请仔细确认数量</li>
                      <li>• ⛏️ 金币通过土地挖矿获得</li>
                      <li>• 💀 角色死亡时金币会清零</li>
                      <li>• 🏆 兑换不影响挖矿排行榜排名</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => navigate("/landminer")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center group border-2 border-gray-500"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⛏️</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white global-font">
                    去挖矿赚金币
                  </h4>
                  <p className="text-white/80 text-sm global-font">
                    在土地矿工游戏中获得更多金币
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/leaderboard")}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center group border-2 border-gray-500"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white global-font">
                    查看排行榜
                  </h4>
                  <p className="text-white/80 text-sm global-font">
                    查看挖矿金币排名
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
