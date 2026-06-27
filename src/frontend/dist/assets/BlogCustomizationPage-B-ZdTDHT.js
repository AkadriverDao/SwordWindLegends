import { c as createLucideIcon, o as useCustomizationContext, r as reactExports, p as THEME_COLORS, F as FONT_STYLES, q as BACKGROUND_STYLES, s as ACCENT_COLORS, j as jsxRuntimeExports, A as ArrowLeft, P as Palette, E as Eye, R as RefreshCw } from "./index-C0vAz2PO.js";
import { I as Image, S as Save } from "./save-Bqc25KJ7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 4v16", key: "1654pz" }],
  ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2", key: "e0r10z" }],
  ["path", { d: "M9 20h6", key: "s66wpe" }]
];
const Type = createLucideIcon("type", __iconNode);
function BlogCustomizationPage({
  navigate
}) {
  const { customization, updateCustomization, resetCustomization } = useCustomizationContext();
  const [previewMode, setPreviewMode] = reactExports.useState(false);
  const [tempCustomization, setTempCustomization] = reactExports.useState(customization);
  const handleBack = () => {
    navigate("/");
  };
  const handlePreviewToggle = () => {
    if (previewMode) {
      updateCustomization(tempCustomization);
    }
    setPreviewMode(!previewMode);
  };
  const handleReset = () => {
    resetCustomization();
    setTempCustomization(customization);
  };
  const handleTempUpdate = (updates) => {
    const newTemp = { ...tempCustomization, ...updates };
    setTempCustomization(newTemp);
    if (previewMode) {
      updateCustomization(newTemp);
    }
  };
  const handleSaveAndExit = () => {
    updateCustomization(tempCustomization);
    navigate("/");
  };
  const currentTheme = THEME_COLORS.find((t) => t.value === tempCustomization.themeColor) || THEME_COLORS[0];
  const currentFont = FONT_STYLES.find((f) => f.value === tempCustomization.fontStyle) || FONT_STYLES[0];
  const currentBackground = BACKGROUND_STYLES.find(
    (b) => b.value === tempCustomization.backgroundStyle
  ) || BACKGROUND_STYLES[0];
  const currentAccent = ACCENT_COLORS.find((a) => a.value === tempCustomization.accentColor) || ACCENT_COLORS[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 24, className: "text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-dark-text", children: "自定义" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary font-medium", children: "个性化您的博客外观和风格" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handlePreviewToggle,
              className: `px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2 ${previewMode ? "bg-gradient-to-r from-dark-success to-dark-primary text-white" : "bg-gradient-to-r from-theme-primary to-theme-secondary text-white"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: previewMode ? "应用更改" : "实时预览" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleReset,
              className: "px-4 py-2 bg-gradient-to-r from-dark-warning to-dark-error text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "重置" })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-theme-accent to-theme-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm font-bold", children: "⚔️" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-dark-text", children: "博客标题" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: tempCustomization.blogTitle,
              onChange: (e) => handleTempUpdate({ blogTitle: e.target.value }),
              className: "w-full px-6 py-4 border-3 border-gray-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-theme-primary/30 focus:border-theme-primary bg-dark-surface text-lg font-medium shadow-lg text-dark-text",
              placeholder: "输入您的博客标题"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 16, className: "text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-dark-text", children: "主题色彩" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: THEME_COLORS.map((theme) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleTempUpdate({ themeColor: theme.value }),
              className: `p-4 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${tempCustomization.themeColor === theme.value ? "border-theme-accent bg-theme-primary/20" : "border-gray-500 bg-dark-surface hover:border-theme-primary/50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-6 h-6 rounded-full shadow-lg",
                      style: {
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-dark-text font-bold text-sm", children: theme.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-4 h-4 rounded",
                      style: { backgroundColor: theme.primary }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-4 h-4 rounded",
                      style: { backgroundColor: theme.secondary }
                    }
                  )
                ] })
              ]
            },
            theme.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-theme-secondary to-theme-accent rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { size: 16, className: "text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-dark-text", children: "字体风格" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: FONT_STYLES.map((font) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleTempUpdate({ fontStyle: font.value }),
              className: `p-4 rounded-2xl border-3 transition-all duration-300 hover:scale-105 text-center ${tempCustomization.fontStyle === font.value ? "border-theme-accent bg-theme-primary/20" : "border-gray-500 bg-dark-surface hover:border-theme-primary/50"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-dark-text font-bold", children: font.name }) })
            },
            font.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-theme-accent to-theme-secondary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 16, className: "text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-dark-text", children: "背景样式" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: BACKGROUND_STYLES.map((bg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleTempUpdate({ backgroundStyle: bg.value }),
              className: `p-4 rounded-2xl border-3 transition-all duration-300 hover:scale-105 text-left ${tempCustomization.backgroundStyle === bg.value ? "border-theme-accent bg-theme-primary/20" : "border-gray-500 bg-dark-surface hover:border-theme-primary/50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-dark-text font-bold", children: bg.name }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-dark-text-secondary text-sm", children: bg.description })
              ]
            },
            bg.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-theme-primary to-theme-accent rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm font-bold", children: "✨" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-dark-text", children: "强调色彩" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: ACCENT_COLORS.map((accent) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleTempUpdate({ accentColor: accent.value }),
              className: `px-4 py-3 rounded-xl border-3 transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${tempCustomization.accentColor === accent.value ? "border-theme-accent bg-theme-primary/20" : "border-gray-500 bg-dark-surface hover:border-theme-primary/50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-4 h-4 rounded-full shadow-lg",
                    style: { backgroundColor: accent.color }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-dark-text font-medium text-sm", children: accent.name })
              ]
            },
            accent.value
          )) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500 sticky top-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16, className: "text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-dark-text", children: "实时预览" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl p-4 border-2 border-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-full flex items-center justify-center shadow-lg",
                style: {
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm", children: "⚔️" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h4",
              {
                className: "text-lg font-bold text-dark-text",
                style: { fontFamily: currentFont.fontFamily },
                children: tempCustomization.blogTitle
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-sm", children: "博客标题预览" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl p-4 border-2 border-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-4 h-4 rounded-full",
                  style: { backgroundColor: currentTheme.primary }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-4 h-4 rounded-full",
                  style: { backgroundColor: currentTheme.secondary }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-4 h-4 rounded-full",
                  style: { backgroundColor: currentAccent.color }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text font-bold text-sm", children: currentTheme.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-xs", children: "主题色彩预览" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl p-4 border-2 border-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-dark-text mb-2",
              style: { fontFamily: currentFont.fontFamily },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-lg mb-1", children: "文章标题示例" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "这是正文内容的字体预览效果。" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-xs", children: currentFont.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-surface rounded-2xl p-4 border-2 border-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-full h-12 rounded-lg bg-${tempCustomization.backgroundStyle} border border-gray-500`
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text font-bold text-sm", children: currentBackground.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-dark-text-secondary text-xs", children: currentBackground.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleSaveAndExit,
            className: "w-full bg-gradient-to-r from-theme-primary to-theme-secondary hover:from-theme-primary/80 hover:to-theme-secondary/80 text-white py-3 px-6 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "保存设置" })
            ]
          }
        )
      ] })
    ] }) })
  ] }) });
}
export {
  BlogCustomizationPage as default
};
