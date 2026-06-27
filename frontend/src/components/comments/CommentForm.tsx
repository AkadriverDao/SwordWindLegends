import React, { useState } from 'react';
import { useCreateComment } from '../../hooks/useQueries';
import { MessageCircleIcon, SendIcon } from 'lucide-react';

interface CommentFormProps {
  articleId: string;
  isCryptoTrendsPage?: boolean;
  onCancel: () => void;
}

export default function CommentForm({ articleId, isCryptoTrendsPage = false, onCancel }: CommentFormProps) {
  const [commentText, setCommentText] = useState('');
  const createComment = useCreateComment();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      console.log('提交评论到文章ID:', articleId);
      console.log('评论内容:', commentText.trim());
      
      await createComment.mutateAsync({
        articleId,
        content: commentText.trim(),
      });
      
      setCommentText('');
      onCancel();
      console.log('评论提交成功');
    } catch (error) {
      console.error('提交评论时出错:', error);
    }
  };

  return (
    <div className="mb-8 bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-dark-text mb-2 global-font">
            {isCryptoTrendsPage ? '💭 分享您对加密趋势的看法' : '💭 写下您的想法'}
          </label>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-theme-primary/30 focus:border-theme-primary bg-dark-card text-dark-text resize-vertical global-font"
            rows={4}
            placeholder={isCryptoTrendsPage ? "分享您对加密货币和区块链趋势的见解..." : "分享您对这篇文章的看法..."}
            required
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              onCancel();
              setCommentText('');
            }}
            className="px-4 py-2 border-2 border-gray-500 text-dark-text rounded-xl hover:bg-dark-hover transition-all duration-300 font-medium global-font"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={createComment.isPending || !commentText.trim()}
            className="px-4 py-2 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center space-x-2 global-font"
          >
            {createComment.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>发布中...</span>
              </>
            ) : (
              <>
                <SendIcon size={16} />
                <span>发布评论</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

