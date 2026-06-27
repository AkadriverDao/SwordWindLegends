import React from 'react';
import { useGetSingleArticle, useGetUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ArrowLeftIcon, HeartIcon, MessageCircleIcon } from 'lucide-react';
import CommentSection from './CommentSection';
import LikeButton from './LikeButton';
import { parseMarkdown } from '../utils/markdown';

interface ArticleReaderProps {
  articleId?: string;
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article', params?: any) => void;
}

export default function ArticleReader({ articleId, navigate }: ArticleReaderProps) {
  const { data: article, isLoading: articleLoading, error } = useGetSingleArticle(articleId);
  const { data: authorProfile } = useGetUserProfile(article?.author || null as any);
  const { identity } = useInternetIdentity();

  console.log('ArticleReader: 渲染组件', { 
    articleId, 
    hasArticle: !!article, 
    articleTitle: article?.title,
    isLoading: articleLoading,
    error
  });

  const handleBack = () => {
    navigate('/profile');
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if article is approved and visible
  const isArticleVisible = article && (
    article.approvalStatus === BigInt(1) || 
    (identity && article.author.toString() === identity.getPrincipal().toString())
  );

  if (articleLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-theme-primary mx-auto mb-4"></div>
          <p className="text-dark-text-secondary text-lg">加载文章中...</p>
        </div>
      </div>
    );
  }

  if (error || !article || !isArticleVisible) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-dark-text mb-2">文章未找到</h2>
          <p className="text-dark-text-secondary mb-6">
            {error ? '加载文章时出错' : '该文章不存在或您没有权限查看'}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-theme-primary hover:bg-theme-secondary text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-card border-b-4 border-gray-500 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-dark-text hover:text-theme-primary transition-colors duration-300 group"
            >
              <ArrowLeftIcon size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">返回</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <LikeButton articleId={articleId || '0'} />
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <article className="bg-dark-card rounded-3xl shadow-2xl border-4 border-gray-500 overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b-4 border-gray-500 bg-gradient-to-br from-dark-surface to-dark-card">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-dark-text-secondary">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-theme-primary to-theme-secondary flex items-center justify-center text-white font-bold shadow-lg">
                  {authorProfile?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="font-medium text-dark-text">
                  {authorProfile?.name || '匿名作者'}
                </span>
              </div>
              
              <span className="text-gray-400">•</span>
              
              <time className="text-sm">
                {formatDate(article.createdAt)}
              </time>
              
              {article.categories && article.categories.length > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <div className="flex flex-wrap gap-2">
                    {article.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-theme-primary/20 text-theme-primary rounded-full text-sm font-medium border border-theme-primary/30"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Article Body */}
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {parseMarkdown(article.content)}
            </div>
          </div>

          {/* Article Footer */}
          <div className="p-8 border-t-4 border-gray-500 bg-dark-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-dark-text-secondary">
                  <HeartIcon size={20} />
                  <span>{Number(article.likeCount)} 点赞</span>
                </div>
                <div className="flex items-center space-x-2 text-dark-text-secondary">
                  <MessageCircleIcon size={20} />
                  <span>评论</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection articleId={articleId || '0'} />
        </div>
      </main>
    </div>
  );
}
