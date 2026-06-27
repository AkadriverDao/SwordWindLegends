import React, { useState } from 'react';
import { useGetComments } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { MessageCircleIcon, UserIcon } from 'lucide-react';
import CommentItem from './comments/CommentItem';
import CommentForm from './comments/CommentForm';

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { data: comments, isLoading: commentsLoading } = useGetComments(articleId);
  const { identity } = useInternetIdentity();
  const [showCommentForm, setShowCommentForm] = useState(false);

  const isAuthenticated = !!identity;
  const isCryptoTrendsPage = articleId === '999999';

  // Calculate total comment count including replies
  const getTotalCommentCount = (comments: any[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + getTotalCommentCount(comment.replies || []);
    }, 0);
  };

  const totalComments = comments ? getTotalCommentCount(comments) : 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center">
            <MessageCircleIcon size={16} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-dark-text global-font">
            {isCryptoTrendsPage ? '💬 加密趋势社区讨论' : '💬 评论区'}
          </h3>
          <span className="text-dark-text-secondary text-sm global-font elegant-numbers">
            ({totalComments} 条评论和回复)
          </span>
        </div>

        {isAuthenticated && !showCommentForm && (
          <button
            onClick={() => setShowCommentForm(true)}
            className="bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2 global-font"
          >
            <MessageCircleIcon size={16} />
            <span>发表评论</span>
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && isAuthenticated && (
        <CommentForm
          articleId={articleId}
          isCryptoTrendsPage={isCryptoTrendsPage}
          onCancel={() => setShowCommentForm(false)}
        />
      )}

      {/* Login Prompt for Unauthenticated Users */}
      {!isAuthenticated && (
        <div className="mb-8 bg-dark-warning/20 rounded-2xl border-3 border-gray-500 p-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <UserIcon size={24} className="text-dark-warning" />
            <p className="text-dark-text font-bold text-lg global-font">
              登录后参与讨论
            </p>
          </div>
          <p className="text-dark-text-secondary global-font">
            {isCryptoTrendsPage 
              ? '请先登录您的账户，然后就可以发表评论与其他用户交流加密趋势话题了'
              : '请先登录您的账户，然后就可以发表评论和回复与作者和其他读者互动了'
            }
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {commentsLoading ? (
          <div className="text-center py-8">
            <div className="animate-bounce rounded-full h-8 w-8 bg-gradient-to-r from-theme-primary to-theme-secondary mx-auto mb-4 flex items-center justify-center">
              <MessageCircleIcon size={16} className="text-white" />
            </div>
            <p className="text-dark-text-secondary global-font">加载评论中...</p>
          </div>
        ) : comments && comments.length > 0 ? (
          <>
            <div className="bg-gradient-to-r from-theme-primary/10 to-theme-secondary/10 rounded-xl p-4 border-2 border-gray-500">
              <div className="flex items-center space-x-3">
                <MessageCircleIcon size={20} className="text-theme-primary" />
                <div>
                  <p className="text-dark-text font-bold global-font">
                    {isCryptoTrendsPage ? '💬 加密趋势讨论区' : '💬 互动讨论区'}
                  </p>
                  <p className="text-dark-text-secondary text-sm global-font">
                    {isCryptoTrendsPage 
                      ? '与社区成员分享您对加密货币、区块链技术和市场趋势的见解。您可以删除自己发表的评论和回复。'
                      : '支持多层回复，点击"回复"按钮参与对话，回复格式为"回复@用户名"。您可以删除自己发表的评论和回复。'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {comments.map((comment) => (
              <CommentItem
                key={comment.commentId.toString()}
                comment={comment}
                articleId={articleId}
                level={0}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircleIcon size={32} className="text-gray-400" />
            </div>
            <p className="text-dark-text text-lg font-bold mb-2 global-font">
              暂无评论
            </p>
            <p className="text-dark-text-secondary global-font">
              {isCryptoTrendsPage 
                ? '成为第一个分享加密趋势见解的人吧！'
                : '成为第一个发表评论的人吧！'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

