import React, { useMemo } from "react";
import { useGetAllArticles } from "../hooks/useArticleQueries";
import { useGetMiningLoggingEnabled } from "../hooks/useMiningConfigQueries";
import ArticleList from "./ArticleList";
import CommunityCategories from "./CommunityCategories";

interface BlogDashboardProps {
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

export default function BlogDashboard({ navigate }: BlogDashboardProps) {
  const { data: allArticles, isLoading } = useGetAllArticles();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  const visibleArticles = useMemo(() => {
    if (!allArticles) return [];

    // 默认可见：visible !== false。作者本人可看到自己被隐藏的文章（后端已处理），
    // 前端只需确保不过滤掉 visible === false 的文章即可。
    const visible = allArticles.filter(([_id, article]) => {
      return article.visible !== false;
    });

    // 排序：置顶文章按 pinOrder 升序优先，其余按 createdAt 倒序
    return visible.sort((a, b) => {
      const aPinned = a[1].pinned === true;
      const bPinned = b[1].pinned === true;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      if (aPinned && bPinned) {
        return Number(a[1].pinOrder - b[1].pinOrder);
      }
      return Number(b[1].createdAt - a[1].createdAt);
    });
  }, [allArticles]);

  const handleReadArticle = (article: {
    id: bigint;
    title: string;
    content: string;
    author: any;
    createdAt: bigint;
    updatedAt: bigint;
    coverImage?: string;
  }) => {
    if (loggingEnabled) {
      console.log("BlogDashboard: 准备导航到文章阅读页面", {
        articleId: article.id.toString(),
        title: article.title,
      });
    }

    navigate("/article", { articleId: article.id.toString() });
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="bg-dark-card backdrop-blur-sm rounded-3xl p-12 border-4 border-gray-500 shadow-2xl inline-block">
          <div className="animate-bounce rounded-full h-12 w-12 bg-gradient-to-r from-theme-primary to-theme-secondary mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-xl">📖</span>
          </div>
          <p className="text-dark-text text-xl font-bold">加载社区文章中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl p-8 border-4 border-gray-500 shadow-2xl text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <div className="sword-logo text-white text-2xl">⚔️</div>
        </div>
        <h2 className="text-2xl font-bold text-dark-text mb-2">
          🌟 Welcome to the Sword Wind Legends community
        </h2>
        <p className="text-dark-text-secondary text-lg font-medium">
          探索社区成员分享的精彩经历
        </p>
      </div>

      <CommunityCategories navigate={navigate} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-dark-text flex items-center">
            📚 社区精选文章
          </h3>
          <div className="text-dark-text-secondary text-sm">
            所有可见文章均在此显示，置顶文章排在最前
          </div>
        </div>

        {visibleArticles && visibleArticles.length > 0 ? (
          <ArticleList
            articles={visibleArticles}
            showAuthor={true}
            onRead={handleReadArticle}
            isOwner={false}
          />
        ) : (
          <div className="text-center py-16">
            <div className="bg-dark-surface backdrop-blur-sm rounded-3xl p-12 border-3 border-gray-500 shadow-lg inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-dark-primary to-dark-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-3xl">📝</span>
              </div>
              <p className="text-dark-text text-xl font-bold mb-2">
                🎨 暂无社区文章
              </p>
              <p className="text-dark-text-secondary text-lg">
                社区还没有文章，快来成为第一个分享者吧
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
