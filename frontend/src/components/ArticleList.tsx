import React from 'react';
import { type ArticleWithStatus } from '../hooks/useArticleQueries';
import type { Article } from '../backend';
import ArticleCard from './article/ArticleCard';

interface ArticleListProps {
  articles: Array<[bigint, Article]> | ArticleWithStatus[];
  onEdit?: (id: bigint, title: string, content: string, coverImage?: string, submittedForReview?: boolean, categories?: string[]) => void;
  onRead?: (article: { id: bigint; title: string; content: string; author: any; createdAt: bigint; updatedAt: bigint; coverImage?: string }) => void;
  showAuthor?: boolean;
  isOwner?: boolean;
  showApprovalStatus?: boolean;
  showReviewActions?: boolean;
}

export default function ArticleList({ 
  articles, 
  onEdit, 
  onRead, 
  showAuthor = false, 
  isOwner = false,
  showApprovalStatus = false,
  showReviewActions = false
}: ArticleListProps) {
  const isArticleWithStatus = articles.length > 0 && 'status' in articles[0];

  const sortedArticles = React.useMemo(() => {
    if (isArticleWithStatus) {
      const articlesWithStatus = articles as ArticleWithStatus[];
      return [...articlesWithStatus].sort((a, b) => {
        return Number(b.createdAt - a.createdAt);
      });
    } else {
      const regularArticles = articles as Array<[bigint, Article]>;
      return [...regularArticles].sort((a, b) => {
        return Number(b[1].createdAt - a[1].createdAt);
      });
    }
  }, [articles, isArticleWithStatus]);

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-dark-card backdrop-blur-sm rounded-3xl p-12 border-4 border-gray-500 shadow-2xl inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-dark-primary to-dark-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-3xl">📝</span>
          </div>
          <p className="text-dark-text text-xl font-bold mb-2 global-font">
            {showReviewActions ? '🎨 暂无待审核文章' : '🎨 您还没有发布任何经历'}
          </p>
          <p className="text-dark-text-secondary text-lg global-font">
            {showReviewActions ? '所有文章都已审核完成' : '点击上方按钮开始创作吧！'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {sortedArticles.map((item) => {
        if (isArticleWithStatus) {
          const articleWithStatus = item as ArticleWithStatus;
          return (
            <ArticleCard
              key={articleWithStatus.id.toString()}
              id={articleWithStatus.id}
              article={articleWithStatus.article}
              articleWithStatus={articleWithStatus}
              onEdit={onEdit}
              onRead={onRead}
              showAuthor={showAuthor}
              isOwner={isOwner}
              showApprovalStatus={showApprovalStatus}
              showReviewActions={showReviewActions}
            />
          );
        } else {
          const [id, article] = item as [bigint, Article];
          return (
            <ArticleCard
              key={id.toString()}
              id={id}
              article={article}
              onEdit={onEdit}
              onRead={onRead}
              showAuthor={showAuthor}
              isOwner={isOwner}
              showApprovalStatus={showApprovalStatus}
              showReviewActions={showReviewActions}
            />
          );
        }
      })}
    </div>
  );
}
