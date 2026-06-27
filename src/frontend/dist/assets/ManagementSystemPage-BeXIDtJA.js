import { c as createLucideIcon, t as useGetAllArticles, j as jsxRuntimeExports, B as BookOpen, n as ArticleList, v as useIsSuperUser, w as TriangleAlert, A as ArrowLeft } from "./index-C0vAz2PO.js";
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode);
function ArticleManager({ onReadArticle }) {
  const { data: allArticles, isLoading } = useGetAllArticles();
  const articles = allArticles ?? [];
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-bounce rounded-full h-12 w-12 bg-gradient-to-r from-dark-warning to-dark-accent mx-auto mb-6 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text text-xl font-bold", children: "加载文章列表中..." })
    ] });
  }
  if (articles.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 32, className: "text-gray-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text text-xl font-bold mb-2", children: "暂无社区文章" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-lg", children: "社区中暂无任何文章，等待用户开始创作" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold text-dark-text flex items-center", children: [
        "📋 文章管理",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-sm font-normal text-dark-text-secondary", children: "(全部)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-dark-text-secondary text-sm", children: [
        "共 ",
        articles.length,
        " 篇文章"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ArticleList,
      {
        articles,
        showAuthor: true,
        onRead: onReadArticle,
        isOwner: false
      }
    )
  ] });
}
function ManagementSystemPage({
  navigate
}) {
  const { isSuperUser } = useIsSuperUser();
  const handleBack = () => {
    navigate("/");
  };
  const handleReadArticle = (article) => {
    navigate("/article", { articleId: article.id.toString() });
  };
  if (!isSuperUser) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl p-12 border-4 border-gray-500 shadow-2xl inline-block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-dark-error to-dark-warning rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 40, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text text-xl font-bold mb-4", children: "访问被拒绝" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-lg mb-6", children: "您没有权限访问管理系统" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleBack,
          "data-ocid": "management.back_button",
          className: "px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105",
          children: "返回首页"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleBack,
          "data-ocid": "management.back_button",
          className: "p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20, className: "text-dark-text" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-dark-error to-dark-warning rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-dark-text", children: "⚙️ 超级管理员控制台" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary font-medium", children: "文章管理" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b-2 border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-dark-success/20 to-dark-primary/20 rounded-2xl p-4 border-3 border-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-dark-success to-dark-primary rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 20, className: "text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-dark-text mb-1", children: "🛡️ 超级管理员身份已确认" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary font-medium", children: "您拥有完整的文章管理权限" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center space-x-2 bg-dark-primary/20 px-4 py-2 rounded-xl border-2 border-gray-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16, className: "text-dark-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-dark-primary font-bold", children: "超级管理员" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleManager, { onReadArticle: handleReadArticle }) })
  ] }) });
}
export {
  ManagementSystemPage as default
};
