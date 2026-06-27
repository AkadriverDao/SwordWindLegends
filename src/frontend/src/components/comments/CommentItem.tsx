import {
  ChevronDownIcon,
  ChevronRightIcon,
  ReplyIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  type CommentWithReplies,
  useDeleteComment,
} from "../../hooks/useQueries";
import ReplyForm from "./ReplyForm";

interface CommentItemProps {
  comment: CommentWithReplies;
  articleId: string;
  level?: number;
  isAuthenticated: boolean;
}

export default function CommentItem({
  comment,
  articleId,
  level = 0,
  isAuthenticated,
}: CommentItemProps) {
  const { identity } = useInternetIdentity();
  const deleteComment = useDeleteComment();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const maxLevel = 3;
  const canReply = isAuthenticated && level < maxLevel;
  const canDelete =
    isAuthenticated &&
    identity &&
    comment.author.toString() === identity.getPrincipal().toString();

  const formatCommentDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  const handleDeleteClick = () => {
    setDeleteError(null);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteError(null);
      console.log("开始删除评论，ID:", comment.commentId.toString());
      console.log("文章ID:", articleId);
      await deleteComment.mutateAsync(comment.commentId);
      setShowDeleteConfirm(false);
      console.log("评论删除成功");
    } catch (error) {
      console.error("删除评论时出错:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("not yet implemented")) {
        setDeleteError("评论删除功能正在开发中，请稍后再试");
      } else if (errorMessage.includes("Unauthorized")) {
        setDeleteError("权限不足：只能删除自己的评论");
      } else if (errorMessage.includes("not found")) {
        setDeleteError("评论不存在或已被删除");
      } else {
        setDeleteError("删除失败，请重试");
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const indentationClass = level > 0 ? `ml-${Math.min(level * 4, 12)}` : "";
  const borderLeftClass =
    level > 0 ? "border-l-2 border-theme-primary/30 pl-4" : "";
  const displayName = comment.authorName || "匿名用户";

  return (
    <div className={`${indentationClass} ${borderLeftClass}`}>
      <div className="bg-dark-surface rounded-2xl border-2 border-gray-500 p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shrink-0">
            <UserIcon size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-dark-text global-font text-sm">
                  {displayName}
                </span>
                <span className="text-dark-text-secondary text-xs global-font">
                  {formatCommentDate(comment.createdAt)}
                </span>
                {comment.isReply && comment.repliedToUsername && (
                  <span className="text-theme-primary text-xs font-medium global-font bg-theme-primary/20 px-2 py-0.5 rounded-full">
                    回复@{comment.repliedToUsername}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {canReply && (
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-theme-primary hover:text-theme-primary/80 transition-colors duration-300 flex items-center space-x-1 text-xs font-medium global-font"
                  >
                    <ReplyIcon size={12} />
                    <span>回复</span>
                  </button>
                )}

                {canDelete && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    disabled={deleteComment.isPending}
                    className="text-dark-error hover:text-dark-error/80 transition-colors duration-300 flex items-center space-x-1 text-xs font-medium global-font disabled:opacity-50"
                  >
                    <TrashIcon size={12} />
                    <span>删除</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-dark-text leading-relaxed global-font text-sm">
              {comment.isReply && comment.repliedToUsername ? (
                <div>
                  <span className="text-theme-primary font-medium">
                    回复@{comment.repliedToUsername}:
                  </span>
                  <span className="ml-1">{comment.content}</span>
                </div>
              ) : (
                <p>{comment.content}</p>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && isAuthenticated && (
          <ReplyForm
            articleId={articleId}
            parentComment={comment}
            onCancel={() => setShowReplyForm(false)}
            onSuccess={handleReplySuccess}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-dark-error w-full max-w-md">
            <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-error/20 to-dark-warning/20 rounded-t-3xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-dark-error to-dark-warning rounded-full flex items-center justify-center shadow-lg">
                  <TrashIcon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text">
                    ⚠️ 确认删除评论
                  </h3>
                  <p className="text-dark-text-secondary font-medium">
                    此操作无法撤销
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-dark-text font-medium global-font">
                您确定要删除这条评论吗？
              </p>
              <div className="bg-dark-surface rounded-xl p-3 border-2 border-gray-500">
                <p className="text-dark-text-secondary text-sm global-font">
                  "{comment.content.slice(0, 100)}
                  {comment.content.length > 100 ? "..." : ""}"
                </p>
              </div>

              {/* Error Message */}
              {deleteError && (
                <div className="bg-dark-error/20 border-2 border-dark-error rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-dark-error text-lg">⚠️</span>
                    <p className="text-dark-error font-medium text-sm global-font">
                      {deleteError}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  disabled={deleteComment.isPending}
                  className="flex-1 px-4 py-2 border-2 border-gray-500 text-dark-text rounded-xl hover:bg-dark-hover transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 global-font"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleteComment.isPending}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-dark-error to-dark-warning hover:from-dark-error/80 hover:to-dark-warning/80 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 global-font"
                >
                  {deleteComment.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>删除中...</span>
                    </>
                  ) : (
                    <>
                      <TrashIcon size={16} />
                      <span>确认删除</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center space-x-2 text-theme-primary hover:text-theme-primary/80 transition-colors duration-300 mb-3 text-sm font-medium global-font"
          >
            {showReplies ? (
              <ChevronDownIcon size={16} />
            ) : (
              <ChevronRightIcon size={16} />
            )}
            <span>
              {showReplies
                ? "收起回复"
                : `查看 ${comment.replies.length} 条回复`}
            </span>
          </button>

          {showReplies && (
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.commentId.toString()}
                  comment={reply}
                  articleId={articleId}
                  level={level + 1}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
