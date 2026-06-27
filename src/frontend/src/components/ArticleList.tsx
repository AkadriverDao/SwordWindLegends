import React, { useState, useMemo } from "react";
import type { Article } from "../types/backend";
import ArticleCard from "./article/ArticleCard";

interface ArticleListProps {
  articles: Array<[bigint, Article]>;
  onEdit?: (
    id: bigint,
    title: string,
    content: string,
    coverImage?: string,
    categories?: string[],
  ) => void;
  onRead?: (article: {
    id: bigint;
    title: string;
    content: string;
    author: any;
    createdAt: bigint;
    updatedAt: bigint;
    coverImage?: string;
  }) => void;
  showAuthor?: boolean;
  isOwner?: boolean;
}

const ITEMS_PER_PAGE = 10;

// 排序规则：置顶文章按 pinOrder 升序优先，其余按 createdAt 倒序
function sortArticles(
  entries: Array<[bigint, Article]>,
): Array<[bigint, Article]> {
  return [...entries].sort((a, b) => {
    const aPinned = a[1].pinned === true;
    const bPinned = b[1].pinned === true;
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    if (aPinned && bPinned) {
      return Number(a[1].pinOrder - b[1].pinOrder);
    }
    return Number(b[1].createdAt - a[1].createdAt);
  });
}

export default function ArticleList({
  articles,
  onEdit,
  onRead,
  showAuthor = false,
  isOwner = false,
}: ArticleListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedArticles = useMemo(() => {
    return sortArticles(articles);
  }, [articles]);

  const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedArticles.slice(startIndex, endIndex);
  }, [sortedArticles, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-dark-card backdrop-blur-sm rounded-3xl p-12 border-4 border-gray-500 shadow-2xl inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-dark-primary to-dark-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-3xl">📝</span>
          </div>
          <p className="text-dark-text text-xl font-bold mb-2 global-font">
            🎨 您还没有发布任何经历
          </p>
          <p className="text-dark-text-secondary text-lg global-font">
            点击上方按钮开始创作吧！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-4 sm:space-y-6">
        {paginatedArticles.map(([id, article]) => (
          <ArticleCard
            key={id.toString()}
            id={id}
            article={article}
            onEdit={onEdit}
            onRead={onRead}
            showAuthor={showAuthor}
            isOwner={isOwner}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-dark-card border-2 border-dark-border text-dark-text font-medium transition-all duration-200 hover:bg-dark-hover hover:border-dark-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-dark-card disabled:hover:border-dark-border"
            data-ocid="article.pagination_prev"
          >
            上一页
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                  page === currentPage
                    ? "bg-dark-primary text-white shadow-lg shadow-dark-primary/30"
                    : "bg-dark-card border-2 border-dark-border text-dark-text hover:bg-dark-hover hover:border-dark-primary"
                }`}
                data-ocid={`article.pagination.page.${page}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-dark-card border-2 border-dark-border text-dark-text font-medium transition-all duration-200 hover:bg-dark-hover hover:border-dark-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-dark-card disabled:hover:border-dark-border"
            data-ocid="article.pagination_next"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
