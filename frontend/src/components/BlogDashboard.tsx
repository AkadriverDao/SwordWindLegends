import React, { useMemo } from 'react';
import { useGetAllArticles } from '../hooks/useArticleQueries';
import { useGetMiningLoggingEnabled } from '../hooks/useMiningConfigQueries';
import ArticleList from './ArticleList';
import CommunityCategories from './CommunityCategories';

interface BlogDashboardProps {
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article' | '/management' | '/category' | '/landminer' | '/goldexchange', params?: any) => void;
}

export default function BlogDashboard({ navigate }: BlogDashboardProps) {
  const { data: allArticles, isLoading } = useGetAllArticles();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  const approvedArticles = useMemo(() => {
    if (!allArticles) return [];
    
    const approved = allArticles.filter(([id, article]) => {
      return Number(article.approvalStatus) === 1 && article.submittedForReview === true;
    });
    
    return approved.sort((a, b) => {
      return Number(b[1].createdAt - a[1].createdAt);
    });
  }, [allArticles]);

  const handleReadArticle = (article: { id: bigint; title: string; content: string; author: any; createdAt: bigint; updatedAt: bigint; coverImage?: string }) => {
    if (loggingEnabled) {
      console.log('BlogDashboard: 准备导航到文章阅读页面', { 
        articleId: article.id.toString(), 
        title: article.title 
      });
    }
    
    navigate('/article', { articleId: article.id.toString() });
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
            仅显示已审核通过的社区文章
          </div>
        </div>

        {approvedArticles && approvedArticles.length > 0 ? (
          <ArticleList
            articles={approvedArticles}
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
                🎨 暂无已审核的社区文章
              </p>
              <p className="text-dark-text-secondary text-lg">社区文章正在审核中，请稍后查看</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
