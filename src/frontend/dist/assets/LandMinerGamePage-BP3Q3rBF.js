import { c as createLucideIcon, j as jsxRuntimeExports, A as ArrowLeft, x as Pickaxe, w as TriangleAlert, R as RefreshCw, r as reactExports, m as useGetMiningLoggingEnabled, C as Coins, X, h as reactDomExports, y as Heart, z as useInternetIdentity, u as useActor } from "./index-C0vAz2PO.js";
import { u as useGetPlayerGold, a as useRefreshPlayerGold, C as Clock, b as useGetAllLands, c as useGetUserGameState, d as useGetGameStatistics, e as useMineLand, f as useReviveCharacter, g as useRefreshUserGameState } from "./useLandMinerQueries-CQDpUjU4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function GameAuthRequired({ onBack }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20, className: "text-dark-text" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { size: 24, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-dark-text global-font", children: "⛏️ 土地矿工" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary font-medium global-font", children: "虚拟土地挖矿游戏" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 40, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-dark-text mb-4 global-font", children: "🔐 需要登录" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-lg mb-6 global-font", children: "请先登录您的账户才能参与土地矿工游戏" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font",
          children: "返回首页登录"
        }
      )
    ] })
  ] }) });
}
function GameConnectionError({
  onBack,
  onRetry,
  error
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20, className: "text-dark-text" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { size: 24, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-dark-text global-font", children: "⛏️ 土地矿工" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary font-medium global-font", children: "虚拟土地挖矿游戏" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 40, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-dark-text mb-4 global-font", children: "🚫 游戏服务器连接失败" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-lg mb-6 global-font", children: error || "无法连接到游戏服务器，游戏模块可能尚未部署或接口不匹配" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/20 border-2 border-red-500 rounded-xl p-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 20, className: "text-red-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 font-bold text-sm global-font mb-2", children: "可能的问题：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-red-500 text-sm global-font space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 游戏服务器尚未部署" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 游戏接口未正确配置" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 网络连接问题" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 游戏系统未正确初始化" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 服务器配置错误" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onBack,
            className: "px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font",
            children: "返回首页"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: onRetry,
            className: "px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font flex items-center space-x-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "重试连接" })
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function GameLoadingState({ onBack }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20, className: "text-dark-text" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { size: 24, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-dark-text global-font", children: "⛏️ 土地矿工" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary font-medium global-font", children: "虚拟土地挖矿游戏" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { size: 40, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-dark-text mb-4 global-font", children: "🎮 正在连接游戏服务器" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-lg mb-6 global-font", children: "正在从游戏服务器加载土地矿工游戏数据，请稍候..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-theme-primary border-t-transparent mx-auto" })
    ] })
  ] }) });
}
function GameWelcomeSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white border-3 border-gray-500 mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { size: 32, className: "text-white" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-4 global-font", children: "🌟 欢迎来到土地矿工世界" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/90 text-lg leading-relaxed global-font mb-6", children: "在这个神秘的世界中，有1000块空置土地等待勇敢的矿工来探索。点击任意土地后将立即开始10秒挖矿倒计时，系统将生成挖矿结果。每块土地都可以无限次挖矿，每次都有新的机会！挖矿结果将通过弹窗清晰显示，包括具体的金币数量和实时余额更新。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-xl p-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-bold mb-3 global-font flex items-center", children: "📋 游戏规则详解" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-lg p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-bold mb-2 flex items-center", children: "🏞️ 土地挖矿机制" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-white/90 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 游戏包含1000块空置土地，每块都有唯一编号" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 点击任意土地即可开始挖矿，无需占领" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 点击后立即开始10秒挖矿倒计时" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 每块土地可以无限次挖矿，每次都有新机会" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-lg p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-bold mb-2 flex items-center", children: "⛏️ 游戏挖矿系统" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-white/90 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 所有挖矿结果由系统随机生成" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 角色状态、金币数量完全由系统管理" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 前端不保存任何游戏数据，实时从系统获取" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 每次挖矿都是独立的随机事件" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-lg p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-bold mb-2 flex items-center", children: "🎲 概率系统" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-white/90 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 30% 概率什么都没挖到" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 65% 概率获得1-10枚金币" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 5% 概率挖到黑暗物质" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 所有概率由系统算法控制" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-lg p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-bold mb-2 flex items-center", children: "💰 实时金币显示" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-white/90 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 挖矿结果通过弹窗清晰显示" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 获得金币时突出显示具体数量" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 金币余额实时更新" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 每次挖矿后立即刷新最新余额" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-lg p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg mb-2 block", children: "💰" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "挖到金币" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80", children: "随机生成1-10枚金币奖励，弹窗显示具体数量，余额立即更新" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-lg p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg mb-2 block", children: "🕳️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "空手而归" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80", children: "这次运气不好，可以再次挖矿" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-lg p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg mb-2 block", children: "💀" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "黑暗物质" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80", children: "角色死亡，金币清零，需要复活才能继续" })
        ] })
      ] })
    ] })
  ] }) });
}
function LandMap({
  lands,
  onLandClick,
  isLoading,
  isMiningLocked = false
}) {
  const [clickedLand, setClickedLand] = reactExports.useState(null);
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();
  const GRID_WIDTH = 40;
  const GRID_HEIGHT = 25;
  const conditionalLog = (message, ...args) => {
    if (loggingEnabled) {
      console.log(message, ...args);
    }
  };
  conditionalLog(
    "土地地图: 渲染地图，土地数量:",
    lands.length,
    "挖矿锁定:",
    isMiningLocked
  );
  const getLandByPosition = (x, y) => {
    return lands.find((land) => land.x === x && land.y === y);
  };
  const getLandColor = (isDisabled, isClicked) => {
    const baseClasses = isClicked ? "transform scale-110 shadow-lg" : "";
    if (isDisabled) {
      return `bg-gray-500 hover:bg-gray-500 border-gray-600 cursor-not-allowed ${baseClasses}`;
    }
    return `bg-green-500 hover:bg-green-400 border-green-600 cursor-pointer ${baseClasses} ${isClicked ? "ring-4 ring-green-300" : ""}`;
  };
  const getLandIcon = (isDisabled) => {
    if (isDisabled) {
      return "🌫️";
    }
    return "🌱";
  };
  const handleLandClick = (land) => {
    const isDisabled = isMiningLocked;
    if (isDisabled) {
      if (isMiningLocked) {
        conditionalLog("土地地图: 挖矿锁定期间无法操作土地");
      }
      return;
    }
    const landKey = `${land.x}-${land.y}`;
    setClickedLand(landKey);
    setTimeout(() => {
      setClickedLand(null);
    }, 300);
    conditionalLog("土地地图: 点击土地", land.id.toString());
    onLandClick(land);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl border-3 border-gray-500 p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-theme-primary border-t-transparent mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text font-bold global-font", children: "加载土地地图中..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl border-3 border-gray-500 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-lg", children: "🗺️" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-dark-text global-font", children: "土地地图" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-sm global-font", children: "1000块土地，每块都可以无限次挖矿，结果由系统生成" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 text-sm mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 bg-green-500 rounded border border-green-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-dark-text-secondary global-font", children: "空置土地（可挖矿）" })
        ] }),
        isMiningLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 bg-gray-500 rounded border border-gray-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-dark-text-secondary global-font", children: "操作禁用" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border-2 border-gray-500 rounded-xl bg-dark-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid gap-1 w-full",
        style: {
          gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))`,
          aspectRatio: `${GRID_WIDTH} / ${GRID_HEIGHT}`
        },
        children: Array.from(
          { length: GRID_HEIGHT },
          (_, y) => Array.from({ length: GRID_WIDTH }, (_2, x) => {
            const land = getLandByPosition(x, y);
            const landId = y * GRID_WIDTH + x;
            const landKey = `${x}-${y}`;
            const isDisabled = isMiningLocked || !land;
            const isClicked = clickedLand === landKey;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  if (land && !isDisabled) {
                    handleLandClick(land);
                  }
                },
                className: `aspect-square rounded border-2 transition-all duration-200 flex items-center justify-center text-xs land-click-feedback ${isDisabled ? "hover:scale-100" : "hover:scale-110"} ${getLandColor(isDisabled, isClicked)}`,
                title: `土地 #${landId} (${x}, ${y}) - ${isMiningLocked ? "角色死亡或挖矿中，无法操作" : "空置土地，可挖矿"}`,
                disabled: isDisabled,
                type: "button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs leading-none", children: getLandIcon(isDisabled) })
              },
              landKey
            );
          })
        ).flat()
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-3 border border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🔒" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text font-bold global-font text-xs", children: "游戏挖矿系统" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-xs global-font", children: "所有挖矿结果、角色状态、金币数量由系统生成，每块土地可无限次挖矿，每次都有新的随机结果" })
      ] })
    ] }) })
  ] });
}
function MiningResultPopup({
  result,
  currentGoldBalance,
  onClose
}) {
  reactExports.useEffect(() => {
    if (result.outcome === "gold") {
      console.log(
        "显示金币获得结果弹窗，金币数量:",
        result.goldCoins,
        "当前余额:",
        currentGoldBalance
      );
      document.body.classList.add("gold-celebration-active");
      const timer = setTimeout(() => {
        document.body.classList.remove("gold-celebration-active");
      }, 3e3);
      return () => {
        clearTimeout(timer);
        document.body.classList.remove("gold-celebration-active");
      };
    }
  }, [result.outcome, result.goldCoins, currentGoldBalance]);
  const getResultIcon = () => {
    switch (result.outcome) {
      case "gold":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl animate-bounce gold-sparkle", children: "💰" });
      case "empty":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl animate-pulse", children: "🕳️" });
      case "dark_matter":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl animate-bounce dark-matter-warning", children: "💀" });
    }
  };
  const getResultColor = () => {
    switch (result.outcome) {
      case "gold":
        return "from-yellow-500 to-orange-500";
      case "empty":
        return "from-gray-500 to-gray-600";
      case "dark_matter":
        return "from-red-500 to-red-600";
    }
  };
  const getResultTitle = () => {
    switch (result.outcome) {
      case "gold":
        return `🎉 恭喜！获得 ${result.goldCoins} 枚金币！`;
      case "empty":
        return "😔 什么都没挖到";
      case "dark_matter":
        return "💀 危险！挖到黑暗物质！";
    }
  };
  const getResultDescription = () => {
    switch (result.outcome) {
      case "gold":
        return `您在土地 #${result.landId} 成功挖到了 ${result.goldCoins} 枚珍贵的金币！这块土地还可以继续挖矿获得更多财富。您的金币余额已实时更新至 ${currentGoldBalance} 枚，请查看游戏控制台中的最新余额显示。`;
      case "empty":
        return `土地 #${result.landId} 这次没有收获，不要灰心，可以再次挖矿试试运气！`;
      case "dark_matter":
        return `土地 #${result.landId} 潜藏着危险的黑暗物质，您的角色已死亡，金币已清零。需要复活后重新开始游戏。`;
    }
  };
  const modalContent = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-modal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500 w-full max-w-md animate-bounce-fun ${result.outcome === "gold" ? "ring-4 ring-yellow-300 shadow-yellow-500/50" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `p-6 border-b-4 border-gray-500 bg-gradient-to-r ${getResultColor()} rounded-t-3xl ${result.outcome === "gold" ? "animate-pulse" : ""}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-lg ${result.outcome === "gold" ? "animate-bounce" : ""}`,
                    children: [
                      result.outcome === "gold" && /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 24, className: "text-white" }),
                      result.outcome === "empty" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xl", children: "🕳️" }),
                      result.outcome === "dark_matter" && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24, className: "text-white" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white global-font", children: "⛏️ 挖矿结果" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/90 font-medium global-font", children: [
                    "土地 #",
                    result.landId
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "p-2 hover:bg-white/20 rounded-full transition-all duration-300 border-2 border-white/30 bg-white/10 shadow-lg hover:shadow-xl hover:scale-110",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18, className: "text-white" })
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: getResultIcon() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-bold text-dark-text mb-3 global-font", children: getResultTitle() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-lg leading-relaxed global-font", children: getResultDescription() })
          ] }),
          result.outcome === "gold" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-yellow-400 to-orange-400 border-4 border-yellow-500 rounded-2xl p-6 shadow-2xl animate-pulse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 32, className: "text-white animate-spin" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white font-bold text-4xl global-font elegant-numbers mb-2 animate-bounce", children: [
                  "+",
                  result.goldCoins,
                  " 金币"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/90 text-xl font-bold global-font mb-1 animate-pulse", children: "🎉 挖矿成功！" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm global-font", children: "系统随机生成，已添加到您的账户" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/90 text-lg global-font font-bold mt-3 bg-white/20 rounded-lg p-3", children: [
                  "💰 当前金币余额: ",
                  currentGoldBalance,
                  " 枚"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/90 text-sm global-font font-bold mt-2 bg-white/20 rounded-lg p-2", children: "✨ 余额已实时更新！请查看游戏控制台" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-center space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-3xl animate-bounce",
                  style: { animationDelay: "0s" },
                  children: "💰"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-3xl animate-bounce",
                  style: { animationDelay: "0.2s" },
                  children: "✨"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-3xl animate-bounce",
                  style: { animationDelay: "0.4s" },
                  children: "💰"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-3xl animate-bounce",
                  style: { animationDelay: "0.6s" },
                  children: "🎉"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-3xl animate-bounce",
                  style: { animationDelay: "0.8s" },
                  children: "💰"
                }
              )
            ] })
          ] }),
          result.outcome === "empty" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500/20 border-2 border-blue-500 rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500 text-2xl", children: "🔄" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-500 font-bold text-lg global-font", children: "可以再次挖矿" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-sm global-font", children: "每次挖矿都是新的随机机会！" })
            ] })
          ] }) }),
          result.outcome === "dark_matter" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/20 border-2 border-red-500 rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24, className: "text-red-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 font-bold text-lg global-font", children: "角色死亡，金币清零" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-sm global-font", children: "系统随机事件，您需要复活角色才能继续游戏" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: `w-full bg-gradient-to-r ${getResultColor()} hover:opacity-90 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font text-lg ${result.outcome === "gold" ? "animate-pulse" : ""}`,
              children: result.outcome === "dark_matter" ? "💀 确认死亡状态" : result.outcome === "gold" ? `✅ 确认收获 ${result.goldCoins} 金币` : "✅ 确认"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `p-4 bg-gradient-to-r ${getResultColor()}/20 border-t-4 border-gray-500 rounded-b-3xl`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-dark-text-secondary text-sm font-medium global-font", children: [
              result.outcome === "gold" && `🎉 继续挖矿获得更多金币！每块土地都可以多次挖矿！您的金币余额已实时更新至 ${currentGoldBalance} 枚，请查看游戏控制台！`,
              result.outcome === "empty" && "💪 不要放弃，再次挖矿一定会有奖励！",
              result.outcome === "dark_matter" && "⚠️ 挖矿有风险，探索需谨慎！复活后可以重新开始！"
            ] }) })
          }
        )
      ]
    }
  ) });
  return typeof document !== "undefined" ? reactDomExports.createPortal(modalContent, document.body) : null;
}
function UnifiedGameStatus({
  gameState,
  gameStatistics,
  selectedLand,
  onMineLand,
  onReviveCharacter,
  isLoading,
  isMining,
  miningCountdown
}) {
  const [isMiningLand, setIsMiningLand] = reactExports.useState(false);
  const [isReviving, setIsReviving] = reactExports.useState(false);
  const [operationError, setOperationError] = reactExports.useState(null);
  const [previousGoldAmount, setPreviousGoldAmount] = reactExports.useState(
    null
  );
  const [showGoldIncrease, setShowGoldIncrease] = reactExports.useState(false);
  const { data: playerGold, refetch: refetchPlayerGold } = useGetPlayerGold();
  const refreshPlayerGold = useRefreshPlayerGold();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();
  const currentGoldCoins = playerGold !== void 0 ? playerGold : (gameState == null ? void 0 : gameState.goldCoins) || 0;
  const conditionalLog = reactExports.useCallback(
    (message, ...args) => {
      if (loggingEnabled) {
        console.log(message, ...args);
      }
    },
    [loggingEnabled]
  );
  reactExports.useEffect(() => {
    if (previousGoldAmount !== null && currentGoldCoins > previousGoldAmount) {
      conditionalLog("检测到金币增加，显示视觉反馈", {
        previous: previousGoldAmount,
        current: currentGoldCoins,
        increase: currentGoldCoins - previousGoldAmount
      });
      setShowGoldIncrease(true);
      setTimeout(() => setShowGoldIncrease(false), 3e3);
    }
    setPreviousGoldAmount(currentGoldCoins);
  }, [currentGoldCoins, conditionalLog, previousGoldAmount]);
  const handleMineLand = async () => {
    if (!selectedLand || isMiningLand || isMining) return;
    if (gameState && !gameState.isAlive) {
      conditionalLog("角色死亡，无法挖矿");
      setOperationError("角色已死亡，请先复活后再进行挖矿");
      return;
    }
    conditionalLog("开始挖矿", selectedLand.id.toString());
    setIsMiningLand(true);
    setOperationError(null);
    try {
      await onMineLand(selectedLand.id);
      conditionalLog("挖矿请求成功，刷新金币余额");
      await Promise.all([refetchPlayerGold(), refreshPlayerGold()]);
      conditionalLog("挖矿完成后，已获取最新金币余额");
    } catch (error) {
      conditionalLog("挖矿失败:", error);
      const errorMessage = error instanceof Error ? error.message : "挖矿失败，请重试";
      setOperationError(errorMessage);
      if (errorMessage.includes("不可用") || errorMessage.includes("not found") || errorMessage.includes("not yet implemented")) {
        setOperationError("挖矿功能暂时不可用，请稍后重试");
      }
    } finally {
      setIsMiningLand(false);
    }
  };
  const handleReviveCharacter = async () => {
    if (!gameState || gameState.isAlive || isReviving) return;
    conditionalLog("请求复活角色");
    setIsReviving(true);
    setOperationError(null);
    try {
      await onReviveCharacter();
      conditionalLog("角色复活成功，刷新金币余额");
      await Promise.all([refetchPlayerGold(), refreshPlayerGold()]);
    } catch (error) {
      conditionalLog("复活失败:", error);
      const errorMessage = error instanceof Error ? error.message : "复活失败，请重试";
      setOperationError(errorMessage);
      if (errorMessage.includes("不可用") || errorMessage.includes("not found") || errorMessage.includes("not yet implemented")) {
        setOperationError("复活功能暂时不可用，请稍后重试");
      }
    } finally {
      setIsReviving(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl border-3 border-gray-500 p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-theme-primary border-t-transparent mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary global-font", children: "加载游戏状态中..." })
    ] });
  }
  const isCharacterDead = gameState ? !gameState.isAlive : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl border-3 border-gray-500 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xl", children: "🎮" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-dark-text global-font", children: "游戏控制台" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-sm global-font", children: "挖矿操作中心" })
      ] })
    ] }),
    gameState && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `mb-4 p-4 rounded-xl border-2 ${gameState.isAlive ? "bg-green-500/20 border-green-500" : "bg-red-500/20 border-red-500"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Heart,
              {
                size: 20,
                className: gameState.isAlive ? "text-green-500" : "text-red-500"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-bold global-font text-sm ${gameState.isAlive ? "text-green-500" : "text-red-500"}`,
                children: gameState.isAlive ? "🌟 角色存活" : "💀 角色死亡"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `bg-gradient-to-r from-yellow-400 to-orange-400 border-2 border-yellow-500 rounded-xl px-4 py-2 shadow-lg transition-all duration-500 ${showGoldIncrease ? "scale-110 shadow-2xl ring-4 ring-yellow-300 animate-pulse" : ""}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `text-2xl font-bold text-white elegant-numbers flex items-center space-x-1 ${showGoldIncrease ? "animate-bounce" : ""}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Coins,
                          {
                            size: 20,
                            className: `text-white ${showGoldIncrease ? "animate-spin" : ""}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: showGoldIncrease ? "gold-celebration" : "",
                            children: currentGoldCoins
                          }
                        ),
                        showGoldIncrease && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg animate-bounce ml-2", children: "✨" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/90 global-font font-bold", children: showGoldIncrease ? "🎉 金币已更新！" : "游戏金币" })
                ] })
              }
            ),
            !gameState.isAlive && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleReviveCharacter,
                disabled: isReviving,
                className: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center space-x-2 global-font text-sm touch-target",
                children: isReviving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "复活中..." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✨ 复活" })
                ] })
              }
            )
          ] })
        ] })
      }
    ),
    selectedLand && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card rounded-xl p-3 border-2 border-gray-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-dark-text font-bold global-font text-sm", children: [
            "土地 #",
            selectedLand.id.toString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-dark-text-secondary text-xs global-font", children: [
            "(",
            selectedLand.x,
            ", ",
            selectedLand.y,
            ") - 可无限次挖矿"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-500", children: "🌱" })
      ] }),
      operationError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 bg-red-500/20 border border-red-500 rounded p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12, className: "text-red-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 font-bold text-xs global-font", children: operationError })
      ] }) }),
      isCharacterDead && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 bg-red-500/20 border border-red-500 rounded p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 text-sm", children: "💀" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 font-bold text-xs global-font", children: "角色死亡，无法挖矿。请先复活角色。" })
      ] }) }),
      isMining && miningCountdown !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 bg-amber-500/20 border border-amber-500 rounded p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, className: "text-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-amber-500 font-bold text-xs global-font", children: [
          "等待挖矿结果... ",
          miningCountdown,
          "秒"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleMineLand,
          disabled: isMiningLand || isLoading || isMining || isCharacterDead,
          className: `w-full py-2 px-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 global-font text-sm touch-target ${isCharacterDead ? "bg-gray-500 text-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"}`,
          type: "button",
          title: isCharacterDead ? "角色死亡，无法挖矿" : "在此土地上挖矿",
          children: isMiningLand ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "挖矿请求中..." })
          ] }) : isMining ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "等待结果" })
          ] }) : isCharacterDead ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "💀" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "角色死亡" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "开始挖矿" })
          ] })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mb-4", children: gameState && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card rounded-lg p-2 border border-gray-500 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-purple-500 elegant-numbers", children: gameState.miningCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-dark-text-secondary global-font", children: "挖矿" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card rounded-lg p-2 border border-gray-500 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-green-500 elegant-numbers", children: gameState.totalEarnings }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-dark-text-secondary global-font", children: "收益" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-500 rounded-lg p-2 text-center shadow-lg transition-all duration-500 ${showGoldIncrease ? "scale-110 shadow-2xl ring-2 ring-yellow-300 bg-gradient-to-r from-yellow-400/40 to-orange-400/40" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `text-xl font-bold text-yellow-500 elegant-numbers flex items-center justify-center space-x-1 ${showGoldIncrease ? "animate-bounce" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Coins,
                    {
                      size: 16,
                      className: `text-yellow-500 ${showGoldIncrease ? "animate-spin" : ""}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: showGoldIncrease ? "gold-celebration" : "", children: currentGoldCoins }),
                  showGoldIncrease && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm animate-bounce", children: "✨" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `text-xs global-font font-bold ${showGoldIncrease ? "text-yellow-400 animate-pulse" : "text-yellow-600"}`,
                children: showGoldIncrease ? "🎉 实时更新！" : "游戏金币"
              }
            )
          ]
        }
      )
    ] }) }),
    showGoldIncrease && previousGoldAmount !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 border-3 border-yellow-500 rounded-xl p-4 shadow-2xl animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-spin", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 24, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-lg global-font", children: "🎉 金币余额已更新！" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/90 text-sm global-font", children: [
          "+",
          currentGoldCoins - previousGoldAmount,
          " 金币 → 总计",
          " ",
          currentGoldCoins,
          " 金币"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs global-font", children: "✨ 余额已同步最新状态" })
      ] })
    ] }) }),
    gameStatistics && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 14, className: "text-purple-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-dark-text global-font", children: "📊 服务器统计" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card rounded-lg p-2 border border-gray-500 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-purple-500 elegant-numbers", children: gameStatistics.totalMiners }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-dark-text-secondary global-font", children: "矿工" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card rounded-lg p-2 border border-gray-500 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-orange-500 elegant-numbers", children: gameStatistics.totalMiningOperations }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-dark-text-secondary global-font", children: "挖矿" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-2 border border-yellow-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 14, className: "text-yellow-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-yellow-500 font-bold global-font text-xs", children: [
            "全服总金币: ",
            gameStatistics.totalGoldMined
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-xs global-font", children: "所有矿工累计挖掘金币" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-lg p-3 border border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm shrink-0", children: "🔒" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text font-bold global-font text-xs mb-1", children: "游戏操作指南" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-xs global-font", children: isCharacterDead ? "角色已死亡，金币已清零，请先点击复活按钮恢复生命" : isMining ? "正在生成挖矿结果，请等待完成" : "点击任意土地开始挖矿，所有结果由系统生成。每块土地可无限次挖矿！挖矿结果将通过弹窗显示，包括具体的金币数量。每次挖矿后都会立即获取最新金币余额并在界面上显示。当前显示的金币数量直接来自游戏系统，确保数据准确性。" }),
        operationError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 bg-red-500/20 border border-red-500 rounded p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-500 font-bold text-xs global-font", children: [
          "⚠️ ",
          operationError
        ] }) })
      ] })
    ] }) })
  ] });
}
function LandMinerGamePage({
  navigate
}) {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();
  const [selectedLand, setSelectedLand] = reactExports.useState(null);
  const [miningCountdown, setMiningCountdown] = reactExports.useState(null);
  const [miningResult, setMiningResult] = reactExports.useState(null);
  const [showResultPopup, setShowResultPopup] = reactExports.useState(false);
  const [isMiningInProgress, setIsMiningInProgress] = reactExports.useState(false);
  const [backendConnectionError, setBackendConnectionError] = reactExports.useState(null);
  const {
    data: lands,
    isLoading: landsLoading,
    error: landsError,
    refetch: refetchLands
  } = useGetAllLands();
  const {
    data: userGameStateData,
    isLoading: gameStateLoading,
    refetch: refetchGameState
  } = useGetUserGameState();
  const {
    data: gameStatisticsData,
    isLoading: statisticsLoading,
    refetch: refetchStatistics
  } = useGetGameStatistics();
  const { data: playerGold, refetch: refetchPlayerGold } = useGetPlayerGold();
  const refreshPlayerGold = useRefreshPlayerGold();
  const mineLand = useMineLand();
  const reviveCharacter = useReviveCharacter();
  const refreshUserGameState = useRefreshUserGameState();
  const isAuthenticated = !!identity;
  const isLoading = landsLoading || gameStateLoading || statisticsLoading;
  const currentGoldBalance = playerGold !== void 0 ? playerGold : (userGameStateData == null ? void 0 : userGameStateData.goldCoins) || 0;
  const userGameState = userGameStateData ?? null;
  const gameStatistics = gameStatisticsData ?? null;
  const conditionalLog = reactExports.useCallback(
    (message, ...args) => {
      if (loggingEnabled) {
        console.log(message, ...args);
      }
    },
    [loggingEnabled]
  );
  conditionalLog("土地矿工游戏: 组件已加载", {
    isAuthenticated,
    landsCount: lands == null ? void 0 : lands.length,
    userGameState,
    gameStatistics,
    currentGoldBalance,
    playerGold,
    backendConnectionError,
    actorAvailable: !!actor,
    actorFetching
  });
  reactExports.useEffect(() => {
    if (landsError) {
      conditionalLog("土地矿工游戏: 连接错误:", landsError);
      setBackendConnectionError(
        "无法连接到游戏服务器，请检查网络连接或联系管理员"
      );
    } else if (!actor && !actorFetching) {
      conditionalLog("土地矿工游戏: 游戏服务器不可用");
      setBackendConnectionError("游戏服务器尚未部署或配置错误，请联系管理员");
    } else {
      setBackendConnectionError(null);
    }
  }, [landsError, actor, actorFetching, conditionalLog]);
  reactExports.useEffect(() => {
    let interval;
    if (miningCountdown !== null && miningCountdown > 0) {
      interval = setInterval(() => {
        setMiningCountdown((prev) => {
          if (prev === null || prev <= 1) {
            requestMiningResult();
            return null;
          }
          return prev - 1;
        });
      }, 1e3);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [miningCountdown]);
  const requestMiningResult = async () => {
    if (!selectedLand) return;
    conditionalLog("挖矿倒计时完成，请求挖矿结果");
    try {
      const result = await mineLand.mutateAsync(selectedLand.id);
      conditionalLog("收到挖矿结果:", result);
      const resultWithLandId = {
        ...result,
        landId: Number(selectedLand.id)
      };
      setMiningResult(resultWithLandId);
      setShowResultPopup(true);
      setIsMiningInProgress(false);
      conditionalLog("挖矿结果已收到，刷新游戏数据");
      await Promise.all([
        refetchGameState(),
        refetchStatistics(),
        refetchPlayerGold(),
        refreshPlayerGold()
      ]);
      refreshUserGameState();
      conditionalLog("挖矿完成后，已获取最新游戏数据");
    } catch (error) {
      conditionalLog("请求挖矿结果失败:", error);
      setIsMiningInProgress(false);
      const errorResult = {
        outcome: "empty",
        goldCoins: 0,
        message: error instanceof Error ? error.message : "挖矿请求失败，请重试",
        landId: Number(selectedLand.id)
      };
      setMiningResult(errorResult);
      setShowResultPopup(true);
    }
  };
  const handleCloseResultPopup = async () => {
    conditionalLog("关闭挖矿结果弹窗，确保金币余额最新");
    setShowResultPopup(false);
    setMiningResult(null);
    await Promise.all([
      refetchGameState(),
      refetchStatistics(),
      refetchPlayerGold(),
      refreshPlayerGold()
    ]);
    refreshUserGameState();
    conditionalLog("弹窗关闭后，金币余额已强制刷新");
  };
  const handleBack = () => {
    navigate("/");
  };
  const handleLandClick = (land) => {
    const isDisabled = isMiningInProgress || userGameState && !userGameState.isAlive;
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
  const handleMineLand = async (landId) => {
    conditionalLog("土地矿工游戏: 开始挖矿", landId.toString());
    if (isMiningInProgress || userGameState && !userGameState.isAlive) {
      if (userGameState && !userGameState.isAlive) {
        conditionalLog("土地矿工游戏: 角色死亡状态，无法进行挖矿操作");
        throw new Error("角色已死亡，请先复活后再进行挖矿");
      }
      conditionalLog("土地矿工游戏: 正在挖矿中，无法进行新的操作");
      throw new Error("正在挖矿中，请等待当前挖矿完成");
    }
    try {
      setIsMiningInProgress(true);
      setMiningCountdown(10);
      setMiningResult(null);
      setShowResultPopup(false);
      setBackendConnectionError(null);
      conditionalLog("土地矿工游戏: 开始10秒挖矿倒计时");
    } catch (error) {
      conditionalLog("土地矿工游戏: 挖矿失败:", error);
      setBackendConnectionError(
        error instanceof Error ? error.message : "挖矿操作失败"
      );
      throw error;
    }
  };
  const handleReviveCharacter = async () => {
    conditionalLog("土地矿工游戏: 请求复活角色");
    if (!userGameState || userGameState.isAlive) {
      conditionalLog("土地矿工游戏: 角色未死亡，无需复活");
      return;
    }
    try {
      conditionalLog("土地矿工游戏: 发送复活请求");
      await reviveCharacter.mutateAsync();
      setMiningCountdown(null);
      setMiningResult(null);
      setSelectedLand(null);
      setShowResultPopup(false);
      setIsMiningInProgress(false);
      setBackendConnectionError(null);
      await Promise.all([
        refetchGameState(),
        refetchStatistics(),
        refetchLands(),
        refetchPlayerGold(),
        refreshPlayerGold()
      ]);
      refreshUserGameState();
      conditionalLog(
        "土地矿工游戏: 角色复活完成，UI状态已重置，游戏数据已刷新"
      );
    } catch (error) {
      conditionalLog("土地矿工游戏: 复活失败:", error);
      setBackendConnectionError(
        error instanceof Error ? error.message : "复活操作失败"
      );
      throw error;
    }
  };
  const handleRetryInit = () => {
    conditionalLog("土地矿工游戏: 重试初始化");
    setBackendConnectionError(null);
    refetchLands();
    refetchGameState();
    refetchStatistics();
    refetchPlayerGold();
  };
  if (backendConnectionError || landsError || !actor && !actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      GameConnectionError,
      {
        onBack: handleBack,
        onRetry: handleRetryInit,
        error: backendConnectionError
      }
    );
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GameAuthRequired, { onBack: handleBack });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GameLoadingState, { onBack: handleBack });
  }
  const isCharacterDead = userGameState ? !userGameState.isAlive : false;
  const isMiningDisabled = isCharacterDead || isMiningInProgress;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500", children: [
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { size: 24, className: "text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-dark-text global-font", children: "⛏️ 土地矿工" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary font-medium global-font", children: "在任意土地上开始您的挖矿冒险之旅！所有挖矿结果由系统随机生成，金币余额实时更新" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-500 rounded-xl px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-bold text-yellow-500 elegant-numbers flex items-center space-x-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 18, className: "text-yellow-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: currentGoldBalance })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-yellow-600 global-font font-bold", children: "当前金币余额" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-yellow-700 global-font", children: "(实时同步)" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GameWelcomeSection, {}),
        backendConnectionError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/20 border-2 border-red-500 rounded-2xl p-6 mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-red-500 font-bold text-lg global-font mb-2", children: "游戏服务器连接问题" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary global-font mb-4", children: backendConnectionError }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleRetryInit,
                className: "bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font flex items-center space-x-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "重试连接" })
                ]
              }
            )
          ] })
        ] }) }),
        userGameState && !userGameState.isAlive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/20 border-2 border-red-500 rounded-2xl p-6 mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-2xl", children: "💀" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-red-500 font-bold text-lg global-font mb-2", children: "角色已死亡，金币已清零" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary global-font mb-4", children: "您的角色遇到了黑暗物质而死亡，所有金币已清零。必须先复活角色才能继续挖矿。" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleReviveCharacter,
                disabled: reviveCharacter.isPending,
                className: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font flex items-center space-x-2 disabled:opacity-50",
                children: reviveCharacter.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "复活中..." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "✨" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "复活角色" })
                ] })
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            LandMap,
            {
              lands: lands || [],
              onLandClick: handleLandClick,
              isLoading,
              isMiningLocked: isMiningDisabled
            }
          ) }),
          isMiningInProgress && miningCountdown !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white border-3 border-gray-500 animate-pulse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { size: 32, className: "text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-2 global-font", children: "⛏️ 正在挖矿中..." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/90 text-lg global-font", children: [
                    "土地 #",
                    selectedLand == null ? void 0 : selectedLand.id.toString(),
                    " - 等待系统生成挖矿结果"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-bold mb-2 elegant-numbers", children: miningCountdown }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm global-font", children: "秒后获得结果" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 bg-white/20 rounded-full h-3 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-white h-full transition-all duration-1000 ease-linear",
                style: { width: `${(10 - miningCountdown) / 10 * 100}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            UnifiedGameStatus,
            {
              gameState: userGameState,
              gameStatistics,
              selectedLand,
              onMineLand: handleMineLand,
              onReviveCharacter: handleReviveCharacter,
              isLoading,
              isMining: isMiningInProgress,
              miningCountdown
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-6 border-2 border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl shrink-0", children: "🔒" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text font-bold global-font text-sm mb-2", children: "游戏系统说明" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-xs global-font", children: "所有挖矿结果、角色状态、金币数量、死亡复活等游戏逻辑完全由系统控制。前端不保存任何游戏数据，所有状态信息实时同步。每块土地可以无限次挖矿，每次挖矿都会获得新的随机结果。点击土地后将立即开始10秒挖矿倒计时，倒计时结束后获取挖矿结果。挖矿结果将通过弹窗清晰显示，获得金币时会突出显示具体数量，金币余额会实时更新。角色死亡时金币会自动清零，复活后可以重新开始游戏。所有游戏数据安全存储在区块链上。" })
          ] })
        ] }) })
      ] })
    ] }),
    showResultPopup && miningResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MiningResultPopup,
      {
        result: miningResult,
        currentGoldBalance,
        onClose: handleCloseResultPopup
      }
    )
  ] });
}
export {
  LandMinerGamePage as default
};
