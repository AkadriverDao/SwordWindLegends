import { c as createLucideIcon, u as useActor, D as useQuery, z as useInternetIdentity, a as useQueryClient, G as useMutation, m as useGetMiningLoggingEnabled, r as reactExports, j as jsxRuntimeExports, A as ArrowLeft, w as TriangleAlert, C as Coins } from "./index-C0vAz2PO.js";
import { u as useGetPlayerGold, C as Clock } from "./useLandMinerQueries-CQDpUjU4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m16 3 4 4-4 4", key: "1x1c3m" }],
  ["path", { d: "M20 7H4", key: "zbl0bi" }],
  ["path", { d: "m8 21-4-4 4-4", key: "h9nckh" }],
  ["path", { d: "M4 17h16", key: "g4d7ey" }]
];
const ArrowRightLeft = createLucideIcon("arrow-right-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
async function conditionalLog(actor, message, ...args) {
  try {
    if (actor) {
      const logEnabled = await actor.getLogEnabled();
      if (logEnabled) {
        console.log(message, ...args);
      }
    }
  } catch (_error) {
  }
}
function useGetExchangeRate() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["exchangeRate"],
    queryFn: async () => {
      if (!actor) return 100;
      try {
        await conditionalLog(actor, "获取金币兑换汇率");
        return 100;
      } catch (error) {
        await conditionalLog(actor, "获取兑换汇率失败:", error);
        return 100;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    refetchInterval: 5 * 60 * 1e3
  });
}
function useGetExchangeHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["exchangeHistory", identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      try {
        await conditionalLog(actor, "获取金币兑换历史");
        return [
          {
            exchangeId: 1,
            goldAmount: 500,
            icpAmount: 5,
            timestamp: Date.now() - 864e5,
            status: "completed"
          },
          {
            exchangeId: 2,
            goldAmount: 200,
            icpAmount: 2,
            timestamp: Date.now() - 1728e5,
            status: "completed"
          }
        ];
      } catch (error) {
        await conditionalLog(actor, "获取兑换历史失败:", error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 2 * 60 * 1e3,
    // 2 minutes
    refetchInterval: 2 * 60 * 1e3
  });
}
function useExchangeGoldForICP() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      goldAmount
    }) => {
      if (!actor) throw new Error("Actor not available");
      if (!identity) throw new Error("User not authenticated");
      await conditionalLog(actor, "开始金币兑换:", goldAmount);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2e3));
        const icpAmount = goldAmount / 100;
        return {
          success: true,
          message: `成功兑换 ${goldAmount} 金币为 ${icpAmount.toFixed(4)} ICP`,
          transactionId: `tx_${Date.now()}`
        };
      } catch (error) {
        await conditionalLog(actor, "金币兑换失败:", error);
        if (error instanceof Error) {
          if (error.message.includes("Insufficient balance") || error.message.includes("余额不足")) {
            throw new Error("金币余额不足，请先通过挖矿获得更多金币");
          }
          if (error.message.includes("Invalid amount") || error.message.includes("无效数量")) {
            throw new Error("兑换数量无效，请输入有效的金币数量");
          }
          if (error.message.includes("Unauthorized") || error.message.includes("权限不足")) {
            throw new Error("权限不足，请确保已登录");
          }
        }
        throw new Error("兑换失败，请重试");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchangeHistory"] });
      queryClient.invalidateQueries({ queryKey: ["landMiner_playerGold"] });
      queryClient.invalidateQueries({ queryKey: ["landMiner_userGameState"] });
      queryClient.invalidateQueries({ queryKey: ["miningLeaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
      queryClient.refetchQueries({ queryKey: ["exchangeHistory"] });
      queryClient.refetchQueries({ queryKey: ["landMiner_playerGold"] });
      queryClient.refetchQueries({ queryKey: ["landMiner_userGameState"] });
      queryClient.refetchQueries({ queryKey: ["miningLeaderboard"] });
      queryClient.refetchQueries({ queryKey: ["tokenBalance"] });
    },
    onError: (error) => {
      console.error("金币兑换失败:", error);
    }
  });
}
function GoldExchangePage({ navigate }) {
  const { identity } = useInternetIdentity();
  const { data: playerGold, isLoading: goldLoading } = useGetPlayerGold();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();
  const { data: exchangeRate } = useGetExchangeRate();
  const { data: exchangeHistory, isLoading: historyLoading } = useGetExchangeHistory();
  const exchangeGoldForICP = useExchangeGoldForICP();
  const [exchangeAmount, setExchangeAmount] = reactExports.useState("");
  const [exchangeError, setExchangeError] = reactExports.useState(null);
  const [exchangeSuccess, setExchangeSuccess] = reactExports.useState(null);
  const isAuthenticated = !!identity;
  const currentGoldBalance = playerGold || 0;
  const currentExchangeRate = exchangeRate || 100;
  const conditionalLog2 = (message, ...args) => {
    if (loggingEnabled) {
      console.log(message, ...args);
    }
  };
  const handleBack = () => {
    conditionalLog2("GoldExchangePage: 返回首页");
    navigate("/");
  };
  const calculateICPAmount = (goldAmount) => {
    return goldAmount / currentExchangeRate;
  };
  const handleExchangeAmountChange = (value) => {
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
    conditionalLog2("GoldExchangePage: 开始兑换", {
      goldAmount,
      icpAmount: calculateICPAmount(goldAmount)
    });
    setExchangeError(null);
    setExchangeSuccess(null);
    try {
      const result = await exchangeGoldForICP.mutateAsync({ goldAmount });
      conditionalLog2("GoldExchangePage: 兑换成功", result);
      setExchangeSuccess(result.message);
      setExchangeAmount("");
      setTimeout(() => setExchangeSuccess(null), 5e3);
    } catch (error) {
      conditionalLog2("GoldExchangePage: 兑换失败:", error);
      setExchangeError(
        error instanceof Error ? error.message : "兑换失败，请重试"
      );
    }
  };
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16, className: "text-green-500" });
      case "pending":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: "text-yellow-500" });
      case "failed":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16, className: "text-red-500" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: "text-gray-500" });
    }
  };
  const getStatusText = (status) => {
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
  const getStatusColor = (status) => {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleBack,
            className: "p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20, className: "text-dark-text" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 24, className: "text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-dark-text global-font", children: "💱 金币兑换" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary font-medium global-font", children: "将挖矿金币兑换成ICP代币" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 40, className: "text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-dark-text mb-4 global-font", children: "🔐 需要登录" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-lg mb-6 global-font", children: "请先登录您的账户才能使用金币兑换功能" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleBack,
            className: "px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font",
            children: "返回首页登录"
          }
        )
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleBack,
          className: "p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20, className: "text-dark-text" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 24, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-dark-text global-font", children: "💱 金币兑换" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary font-medium global-font", children: "将您挖矿获得的金币兑换成ICP代币，安全便捷的区块链资产转换" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-8", children: [
      exchangeSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-500/20 border-2 border-green-500 rounded-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 24, className: "text-green-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-500 font-bold text-lg global-font", children: "🎉 兑换成功！" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary global-font", children: exchangeSuccess })
        ] })
      ] }) }),
      exchangeError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/20 border-2 border-red-500 rounded-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24, className: "text-red-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 font-bold text-lg global-font", children: "⚠️ 兑换失败" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary global-font", children: exchangeError })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-3 border-yellow-500 rounded-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 32, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-dark-text mb-2 global-font", children: "💰 当前金币余额" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary global-font", children: "通过土地挖矿获得的金币积分" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-bold text-yellow-500 elegant-numbers global-font", children: goldLoading ? "..." : currentGoldBalance }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-yellow-600 global-font font-bold", children: "金币" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-green-500/20 to-blue-500/20 border-3 border-green-500 rounded-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 24, className: "text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-dark-text mb-2 global-font", children: "📊 当前兑换汇率" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-surface rounded-xl p-3 border-2 border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-yellow-500 elegant-numbers", children: currentExchangeRate }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-dark-text-secondary global-font", children: "金币" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 20, className: "text-green-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-surface rounded-xl p-3 border-2 border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-500 elegant-numbers", children: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-dark-text-secondary global-font", children: "ICP" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-sm global-font mt-2", children: "汇率实时更新，兑换即时到账" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl border-3 border-gray-500 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 20, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-dark-text global-font", children: "💱 金币兑换" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-sm global-font", children: "输入要兑换的金币数量，系统将自动计算对应的ICP数量" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "exchange-amount",
                className: "block text-sm font-bold text-dark-text mb-2 global-font",
                children: "兑换数量（金币）"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "exchange-amount",
                  type: "text",
                  value: exchangeAmount,
                  onChange: (e) => handleExchangeAmountChange(e.target.value),
                  className: "w-full px-4 py-3 border-2 border-gray-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-theme-primary/30 focus:border-theme-primary bg-dark-card text-dark-text global-font text-lg elegant-numbers",
                  placeholder: "请输入金币数量",
                  disabled: exchangeGoldForICP.isPending
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleMaxClick,
                  disabled: exchangeGoldForICP.isPending || currentGoldBalance === 0,
                  className: "absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-theme-primary text-white rounded-lg text-sm font-bold hover:bg-theme-primary/80 transition-colors disabled:opacity-50",
                  children: "最大"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-dark-text-secondary text-sm global-font", children: [
                "可用余额: ",
                currentGoldBalance,
                " 金币"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-dark-text-secondary text-sm global-font", children: [
                "最少兑换: ",
                currentExchangeRate,
                " 金币"
              ] })
            ] })
          ] }),
          exchangeAmount && Number.parseInt(exchangeAmount) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card rounded-xl p-4 border-2 border-gray-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-md font-bold text-dark-text mb-3 global-font", children: "📋 兑换预览" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-yellow-500 elegant-numbers", children: exchangeAmount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-dark-text-secondary global-font", children: "金币" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ArrowRightLeft,
                {
                  size: 20,
                  className: "text-green-500 mx-auto"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-blue-500 elegant-numbers", children: calculateICPAmount(
                  Number.parseInt(exchangeAmount)
                ).toFixed(4) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-dark-text-secondary global-font", children: "ICP" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleExchange,
              disabled: exchangeGoldForICP.isPending || !exchangeAmount || Number.parseInt(exchangeAmount) <= 0 || Number.parseInt(exchangeAmount) > currentGoldBalance || Number.parseInt(exchangeAmount) < currentExchangeRate,
              className: "w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 global-font text-lg",
              children: exchangeGoldForICP.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "兑换处理中..." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 20 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💱 立即兑换" })
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl border-3 border-gray-500 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 20, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-dark-text global-font", children: "📋 兑换历史" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-sm global-font", children: "查看您的金币兑换记录和状态" })
          ] })
        ] }),
        historyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-theme-primary border-t-transparent mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary global-font", children: "加载兑换历史中..." })
        ] }) : exchangeHistory && exchangeHistory.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: exchangeHistory.map((record) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-dark-card rounded-xl p-4 border-2 border-gray-500",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ArrowRightLeft,
                  {
                    size: 20,
                    className: "text-white"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-dark-text font-bold global-font", children: [
                      record.goldAmount,
                      " 金币 → ",
                      record.icpAmount,
                      " ICP"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
                      getStatusIcon(record.status),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `text-sm font-bold global-font ${getStatusColor(record.status)}`,
                          children: getStatusText(record.status)
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-sm global-font", children: formatDate(record.timestamp) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-bold text-blue-500 elegant-numbers", children: [
                  "+",
                  record.icpAmount,
                  " ICP"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-dark-text-secondary global-font", children: record.status === "completed" ? "已到账" : record.status === "pending" ? "处理中" : "失败" })
              ] })
            ] })
          },
          record.exchangeId
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 32, className: "text-gray-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text text-lg font-bold mb-2 global-font", children: "暂无兑换记录" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary global-font", children: "开始您的第一次金币兑换吧！" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-6 border-2 border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-2xl", children: "💡" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-bold text-dark-text mb-3 global-font", children: "🔄 兑换说明" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-bold text-dark-text global-font", children: "兑换规则：" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-dark-text-secondary text-sm global-font space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "• 💰 当前汇率：",
                  currentExchangeRate,
                  " 金币 = 1 ICP"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "• 🔢 最少兑换：",
                  currentExchangeRate,
                  " 金币"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• ⚡ 即时到账：兑换后立即转入您的钱包" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 🔒 安全保障：所有交易在区块链上记录" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-bold text-dark-text global-font", children: "注意事项：" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-dark-text-secondary text-sm global-font space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 📝 兑换操作不可撤销，请仔细确认数量" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• ⛏️ 金币通过土地挖矿获得" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 💀 角色死亡时金币会清零" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 🏆 兑换不影响挖矿排行榜排名" })
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate("/landminer"),
            className: "bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center group border-2 border-gray-500",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "⛏️" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-bold text-white global-font", children: "去挖矿赚金币" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm global-font", children: "在土地矿工游戏中获得更多金币" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate("/leaderboard"),
            className: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center group border-2 border-gray-500",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🏆" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-bold text-white global-font", children: "查看排行榜" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm global-font", children: "查看挖矿金币排名" })
              ] })
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  GoldExchangePage as default
};
