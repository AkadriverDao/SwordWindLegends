import {
  ArrowLeftIcon,
  BookOpenIcon,
  HeartIcon,
  TrendingUpIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import {
  useGetAllTradingPairs,
  useGetArticlesByCategory,
} from "../hooks/useQueries";
import type { Article } from "../types/backend";
import ArticleList from "./ArticleList";
import CommentSection from "./CommentSection";
import CryptocurrencyList from "./CryptocurrencyList";

interface CategoryPageProps {
  categoryName?: string;
  navigate: (
    route:
      | "/"
      | "/profile"
      | "/leaderboard"
      | "/customize"
      | "/article"
      | "/management"
      | "/category",
    params?: any,
  ) => void;
}

const categoryInfo: Record<
  string,
  {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    description: string;
    color: string;
    emoji: string;
    content: string;
  }
> = {
  加密趋势: {
    icon: TrendingUpIcon,
    description: "探索最新的加密货币和区块链趋势",
    color: "from-dark-warning to-dark-accent",
    emoji: "₿",
    content:
      "这里将展示与加密货币、区块链技术、DeFi、NFT等相关的最新趋势和深度分析文章。",
  },
  技术分享: {
    icon: ZapIcon,
    description: "分享编程技术和开发经验",
    color: "from-dark-primary to-dark-secondary",
    emoji: "💻",
    content:
      "程序员和开发者分享编程技巧、框架使用心得、项目经验和技术见解的专区。",
  },
  人生经历: {
    icon: HeartIcon,
    description: "记录生活中的点点滴滴",
    color: "from-dark-error to-dark-warning",
    emoji: "💭",
    content: "分享生活中的感悟、思考、成长经历和人生体验的温馨角落。",
  },
  学习笔记: {
    icon: BookOpenIcon,
    description: "整理学习过程中的知识要点",
    color: "from-dark-success to-dark-primary",
    emoji: "📚",
    content: "学习者整理和分享各种学科知识、学习方法和读书笔记的知识宝库。",
  },
  社区讨论: {
    icon: UsersIcon,
    description: "参与社区热门话题讨论",
    color: "from-dark-secondary to-dark-accent",
    emoji: "💬",
    content: "社区成员就热门话题进行深入讨论和交流的互动平台。",
  },
};

// Special article ID for crypto trends community comments - matches the one used in useQueries.ts
const CRYPTO_TRENDS_ARTICLE_ID = "999999";

export default function CategoryPage({
  categoryName,
  navigate,
}: CategoryPageProps) {
  const { data: backendTradingPairs, isLoading: tradingPairsLoading } =
    useGetAllTradingPairs();
  const { data: categoryArticles, isLoading: articlesLoading } =
    useGetArticlesByCategory(categoryName || "");

  // 排序：置顶文章（pinned === true）按 pinOrder 升序优先，其余按 createdAt 倒序
  const sortedCategoryArticles = useMemo(() => {
    if (!categoryArticles) return [] as Array<[bigint, Article]>;
    return [...categoryArticles].sort((a, b) => {
      const aPinned = a[1].pinned === true;
      const bPinned = b[1].pinned === true;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      if (aPinned && bPinned) {
        return Number(a[1].pinOrder - b[1].pinOrder);
      }
      return Number(b[1].createdAt - a[1].createdAt);
    });
  }, [categoryArticles]);

  const handleBack = () => {
    navigate("/");
  };

  const handleReadArticle = (article: {
    id: bigint;
    title: string;
    content: string;
    author: any;
    createdAt: bigint;
    updatedAt: bigint;
    coverImage?: string;
  }) => {
    console.log("CategoryPage: 准备导航到文章阅读页面", {
      articleId: article.id.toString(),
      title: article.title,
    });

    navigate("/article", { articleId: article.id.toString() });
  };

  const category = categoryName ? categoryInfo[categoryName] : null;
  const IconComponent = category?.icon || BookOpenIcon;

  if (!categoryName || !category) {
    return (
      <div className="text-center py-16">
        <div className="bg-dark-card backdrop-blur-sm rounded-3xl p-12 border-4 border-gray-500 shadow-2xl inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-dark-error to-dark-warning rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-3xl">❓</span>
          </div>
          <p className="text-dark-text text-xl font-bold mb-4">分类不存在</p>
          <p className="text-dark-text-secondary text-lg mb-6">
            抱歉，您访问的分类页面不存在
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
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
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white text-2xl">{category.emoji}</span>
                </div>
                <h2 className="text-2xl font-bold text-dark-text global-font">
                  {categoryName}
                </h2>
              </div>
              <p className="text-dark-text-secondary font-medium global-font">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Category Content */}
        <div className="p-8 space-y-8">
          {/* Category Introduction */}
          <div
            className={`bg-gradient-to-r ${category.color} rounded-2xl p-8 text-white border-3 border-gray-500`}
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg shrink-0">
                <IconComponent size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4 global-font">
                  欢迎来到 {categoryName} 专区
                </h3>
                <p className="text-white/90 text-lg leading-relaxed global-font">
                  {category.content}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Crypto Trends Data Display Section */}
          {categoryName === "加密趋势" && (
            <div className="space-y-8">
              {/* Check if there are any backend-configured enabled trading pairs */}
              {tradingPairsLoading ? (
                <div className="bg-dark-surface rounded-2xl p-8 border-3 border-gray-500 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-theme-primary border-t-transparent mx-auto mb-6" />
                  <p className="text-dark-text text-xl font-bold global-font">
                    加载交易对配置中...
                  </p>
                </div>
              ) : !backendTradingPairs || backendTradingPairs.length === 0 ? (
                <div className="bg-dark-surface rounded-2xl p-8 border-3 border-gray-500 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-dark-warning to-dark-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white text-3xl">⚙️</span>
                  </div>
                  <p className="text-dark-text text-xl font-bold mb-4 global-font">
                    暂无交易对配置
                  </p>
                  <p className="text-dark-text-secondary text-lg mb-6 global-font">
                    超级管理员尚未配置任何交易对。加密趋势分析功能需要在管理系统中配置交易对后才能使用。
                  </p>
                  <div className="bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-4 border-2 border-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="text-dark-text font-bold global-font text-sm">
                          完全由后端管理
                        </p>
                        <p className="text-dark-text-secondary text-xs global-font">
                          包括 ICP/USDT
                          在内的所有交易对都需要超级管理员在管理系统中配置并启用后才会显示。这确保了所有用户看到的交易对列表完全一致。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : backendTradingPairs.filter(([_, pair]) => pair.enabled)
                  .length === 0 ? (
                <div className="bg-dark-surface rounded-2xl p-8 border-3 border-gray-500 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-dark-warning to-dark-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white text-3xl">🔒</span>
                  </div>
                  <p className="text-dark-text text-xl font-bold mb-4 global-font">
                    暂无启用的交易对
                  </p>
                  <p className="text-dark-text-secondary text-lg mb-6 global-font">
                    所有交易对都已被禁用。加密趋势分析功能需要超级管理员启用至少一个交易对。
                  </p>
                  <div className="bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-4 border-2 border-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="text-dark-text font-bold global-font text-sm">
                          启用/禁用控制
                        </p>
                        <p className="text-dark-text-secondary text-xs global-font">
                          超级管理员可以在管理系统中启用或禁用交易对。只有启用状态的交易对才会在加密趋势模块中显示。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cryptocurrency List Section */}
                  <div className="bg-dark-surface rounded-2xl p-8 border-3 border-gray-500">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-dark-success to-dark-primary rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">💰</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-dark-text mb-2 global-font">
                          💰 加密货币列表
                        </h3>
                        <p className="text-dark-text-secondary font-medium global-font">
                          查看启用的交易对价格信息（仅显示启用的交易对）
                        </p>
                      </div>
                    </div>

                    <CryptocurrencyList />
                  </div>

                  {/* Integrated Comment Section using existing CommentSection component */}
                  <div className="bg-dark-surface rounded-2xl border-3 border-gray-500">
                    <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-2xl">💬</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-dark-text mb-2 global-font">
                            💬 加密趋势社区讨论
                          </h3>
                          <p className="text-dark-text-secondary font-medium global-font">
                            与社区成员分享您对加密货币和区块链趋势的看法，支持分层回复和互动
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Use the existing CommentSection component with the special crypto trends article ID */}
                    <CommentSection articleId={CRYPTO_TRENDS_ARTICLE_ID} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Category Articles Section for 技术分享, 学习笔记, 人生经历 with Flexible Approval Logic */}
          {(categoryName === "技术分享" ||
            categoryName === "学习笔记" ||
            categoryName === "人生经历") && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-dark-text flex items-center">
                  📚 {categoryName}文章
                </h3>
                <div className="text-dark-text-secondary text-sm">
                  {articlesLoading
                    ? "加载中..."
                    : `共 ${categoryArticles?.length || 0} 篇文章`}
                </div>
              </div>

              {articlesLoading ? (
                <div className="bg-dark-surface rounded-2xl p-8 border-3 border-gray-500 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-theme-primary border-t-transparent mx-auto mb-6" />
                  <p className="text-dark-text text-xl font-bold global-font">
                    加载文章中...
                  </p>
                </div>
              ) : categoryArticles && categoryArticles.length > 0 ? (
                <>
                  {/* Information about display rules */}
                  <div className="bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-4 border-2 border-gray-500 mb-6">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="text-dark-text font-bold global-font text-sm">
                          分类页面显示规则
                        </p>
                        <p className="text-dark-text-secondary text-xs global-font">
                          所有可见文章均在此显示，置顶文章排在最前。
                        </p>
                      </div>
                    </div>
                  </div>

                  <ArticleList
                    articles={sortedCategoryArticles}
                    showAuthor={true}
                    onRead={handleReadArticle}
                    isOwner={false}
                  />
                </>
              ) : (
                <div className="bg-dark-surface rounded-2xl p-8 border-3 border-gray-500 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-dark-primary to-dark-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white text-3xl">
                      {category.emoji}
                    </span>
                  </div>
                  <p className="text-dark-text text-xl font-bold mb-4 global-font">
                    暂无{categoryName}文章
                  </p>
                  <p className="text-dark-text-secondary text-lg mb-6 global-font">
                    还没有用户发布{categoryName}
                    类型的文章，快来成为第一个分享者吧！
                  </p>
                  <div className="bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-4 border-2 border-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="text-dark-text font-bold global-font text-sm">
                          如何发布{categoryName}文章？
                        </p>
                        <p className="text-dark-text-secondary text-xs global-font">
                          在个人页面创作文章时，选择"{categoryName}
                          "分类标签。文章创建后即可在此分类页面中查看，无需等待审核。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coming Soon Section for other categories */}
          {categoryName !== "加密趋势" &&
            categoryName !== "技术分享" &&
            categoryName !== "学习笔记" &&
            categoryName !== "人生经历" && (
              <div className="bg-dark-surface rounded-2xl p-8 border-3 border-gray-500 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-dark-primary to-dark-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl">🚧</span>
                </div>
                <h3 className="text-2xl font-bold text-dark-text mb-4 global-font">
                  内容正在建设中
                </h3>
                <p className="text-dark-text-secondary text-lg mb-6 global-font">
                  {categoryName}{" "}
                  专区的内容正在精心准备中，敬请期待更多精彩内容！
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-dark-card rounded-xl p-6 border-2 border-gray-500">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">📝</span>
                      <h4 className="text-lg font-bold text-dark-text global-font">
                        专题文章
                      </h4>
                    </div>
                    <p className="text-dark-text-secondary text-sm global-font">
                      即将推出与 {categoryName} 相关的深度文章和专业分析
                    </p>
                  </div>

                  <div className="bg-dark-card rounded-xl p-6 border-2 border-gray-500">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">💬</span>
                      <h4 className="text-lg font-bold text-dark-text global-font">
                        互动讨论
                      </h4>
                    </div>
                    <p className="text-dark-text-secondary text-sm global-font">
                      社区成员可以在这里就 {categoryName} 话题进行深入交流
                    </p>
                  </div>

                  <div className="bg-dark-card rounded-xl p-6 border-2 border-gray-500">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">⛓️</span>
                      <h4 className="text-lg font-bold text-dark-text global-font">
                        数据分析
                      </h4>
                    </div>
                    <p className="text-dark-text-secondary text-sm global-font">
                      提供 {categoryName} 领域的最新数据和趋势分析
                    </p>
                  </div>

                  <div className="bg-dark-card rounded-xl p-6 border-2 border-gray-500">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">🎯</span>
                      <h4 className="text-lg font-bold text-dark-text global-font">
                        精选推荐
                      </h4>
                    </div>
                    <p className="text-dark-text-secondary text-sm global-font">
                      为您推荐 {categoryName} 相关的优质内容和资源
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Back to Categories */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-4 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font"
            >
              返回社区首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
