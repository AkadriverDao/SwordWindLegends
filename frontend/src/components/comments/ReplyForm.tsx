import React, { useState } from 'react';
import { useCreateReply, type CommentWithReplies } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { ReplyIcon, SendIcon } from 'lucide-react';

interface ReplyFormProps {
  articleId: string;
  parentComment: CommentWithReplies;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ReplyForm({ articleId, parentComment, onCancel, onSuccess }: ReplyFormProps) {
  const [replyText, setReplyText] = useState('');
  const createReply = useCreateReply();
  const { identity } = useInternetIdentity();

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !identity) return;

    try {
      await createReply.mutateAsync({
        articleId,
        parentComment,
        content: replyText.trim(),
      });
      setReplyText('');
      onSuccess();
    } catch (error) {
      console.error('提交回复时出错:', error);
    }
  };

  const repliedToUsername = parentComment.authorName || '匿名用户';

  return (
    <div className="mt-4 bg-dark-surface/50 rounded-xl border-2 border-gray-500 p-4">
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-r from-theme-secondary to-theme-accent rounded-full flex items-center justify-center shrink-0">
          <ReplyIcon size={14} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-dark-text font-medium text-sm global-font">
            回复 <span className="text-theme-primary font-bold">@{repliedToUsername}</span>
          </p>
          <p className="text-dark-text-secondary text-xs global-font mt-1">
            "{parentComment.content.slice(0, 50)}{parentComment.content.length > 50 ? '...' : ''}"
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmitReply} className="space-y-3">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-theme-primary/30 focus:border-theme-primary bg-dark-card text-dark-text resize-vertical global-font text-sm"
          rows={3}
          placeholder="写下您的回复..."
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 border-2 border-gray-500 text-dark-text rounded-lg hover:bg-dark-hover transition-all duration-300 font-medium global-font text-sm"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={createReply.isPending || !replyText.trim()}
            className="px-3 py-1.5 bg-gradient-to-r from-theme-secondary to-theme-accent text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center space-x-1 global-font text-sm"
          >
            {createReply.isPending ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                <span>发布中...</span>
              </>
            ) : (
              <>
                <SendIcon size={12} />
                <span>发布回复</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

