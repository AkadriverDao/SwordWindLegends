import React from 'react';
import { useGetArticleLikes, useLikeArticle, useUnlikeArticle } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { HeartIcon } from 'lucide-react';

interface LikeButtonProps {
  articleId: string;
}

export default function LikeButton({ articleId }: LikeButtonProps) {
  const { data: likeData } = useGetArticleLikes(articleId);
  const likeArticle = useLikeArticle();
  const unlikeArticle = useUnlikeArticle();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const likeCount = likeData?.count || 0;
  const userHasLiked = likeData?.userHasLiked || false;
  const isLoading = likeArticle.isPending || unlikeArticle.isPending;

  const handleLikeToggle = async () => {
    if (!isAuthenticated || isLoading) return;

    try {
      if (userHasLiked) {
        await unlikeArticle.mutateAsync(articleId);
      } else {
        await likeArticle.mutateAsync(articleId);
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2 text-dark-text-secondary">
        <HeartIcon size={20} className="text-gray-500" />
        <span className="font-medium elegant-numbers global-font">{likeCount}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 global-font ${
        userHasLiked
          ? 'bg-gradient-to-r from-dark-error to-dark-warning text-white'
          : 'bg-dark-surface border-2 border-gray-500 text-dark-text hover:bg-dark-hover'
      }`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
      ) : (
        <HeartIcon 
          size={20} 
          className={userHasLiked ? 'text-white fill-current' : 'text-dark-error'} 
        />
      )}
      <span className="elegant-numbers">
        {likeCount}
      </span>
      <span className="hidden sm:inline">
        {userHasLiked ? '已赞' : '点赞'}
      </span>
    </button>
  );
}
