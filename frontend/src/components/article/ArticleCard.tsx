import React from 'react';
import { useDeleteArticle, useGetUserProfile, useApproveArticle, useRejectArticle, getArticleApprovalStatus, type ArticleWithStatus } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { Article } from '../../backend';
import { EditIcon, TrashIcon, BookOpenIcon, ClockIcon, CheckCircleIcon, XCircleIcon, LockIcon } from 'lucide-react';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import { stripMarkdown } from '../../utils/markdown';

interface ArticleCardProps {
  id: bigint;
  article?: Article;
  articleWithStatus?: ArticleWithStatus;
  onEdit?: (id: bigint, title: string, content: string, coverImage?: string, submittedForReview?: boolean, categories?: string[]) => void;
  onRead?: (article: { id: bigint; title: string; content: string; author: any; createdAt: bigint; updatedAt: bigint; coverImage?: string }) => void;
  showAuthor?: boolean;
  isOwner?: boolean;
  showApprovalStatus?: boolean;
  showReviewActions?: boolean;
}

const getStatusIcon = (status: 'private' | 'pending' | 'approved' | 'rejected') => {
  switch (status) {
    case 'private':
      return <LockIcon size={16} className="text-dark-primary" />;
    case 'pending':
      return <ClockIcon size={16} className="text-dark-warning" />;
    case 'approved':
      return <CheckCircleIcon size={16} className="text-dark-success" />;
    case 'rejected':
      return <XCircleIcon size={16} className="text-dark-error" />;
  }
};

const getStatusText = (status: 'private' | 'pending' | 'approved' | 'rejected') => {
  switch (status) {
    case 'private':
      return '私人';
    case 'pending':
      return '未审核';
    case 'approved':
      return '已审核通过';
    case 'rejected':
      return '已审核不通过';
  }
};

const getStatusColor = (status: 'private' | 'pending' | 'approved' | 'rejected') => {
  switch (status) {
    case 'private':
      return 'bg-dark-primary/20 border-gray-500 text-dark-primary';
    case 'pending':
      return 'bg-dark-warning/20 border-gray-500 text-dark-warning';
    case 'approved':
      return 'bg-dark-success/20 border-gray-500 text-dark-success';
    case 'rejected':
      return 'bg-dark-error/20 border-gray-500 text-dark-error';
  }
};

export default function ArticleCard({
  id,
  article,
  articleWithStatus,
  onEdit,
  onRead,
  showAuthor = false,
  isOwner = false,
  showApprovalStatus = false,
  showReviewActions = false
}: ArticleCardProps) {
  const deleteArticle = useDeleteArticle();
  const approveArticle = useApproveArticle();
  const rejectArticle = useRejectArticle();
  const { identity } = useInternetIdentity();
  
  const authorPrincipal = article?.author || articleWithStatus?.article?.author;
  const { data: authorProfile } = useGetUserProfile(authorPrincipal || null as any);
  
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState<string | null>(null);

  // Determine the approval status and article data
  let approvalStatus: 'private' | 'pending' | 'approved' | 'rejected';
  let displayTitle: string;
  let displayContent: string;
  let displayCreatedAt: bigint;
  let displayUpdatedAt: bigint;
  let displayAuthor: any;
  let displaySubmittedForReview: boolean = false;
  let displayCategories: string[] = [];

  if (articleWithStatus) {
    approvalStatus = getArticleApprovalStatus(articleWithStatus);
    displayTitle = articleWithStatus.title;
    displayContent = articleWithStatus.article?.content || '';
    displayCreatedAt = articleWithStatus.createdAt;
    displayUpdatedAt = articleWithStatus.article?.updatedAt || articleWithStatus.createdAt;
    displayAuthor = articleWithStatus.article?.author;
    displaySubmittedForReview = articleWithStatus.article?.submittedForReview || false;
    displayCategories = articleWithStatus.article?.categories || [];
  } else if (article) {
    if (!article.submittedForReview) {
      approvalStatus = 'private';
    } else {
      switch (Number(article.approvalStatus)) {
        case 0:
          approvalStatus = 'pending';
          break;
        case 1:
          approvalStatus = 'approved';
          break;
        case 2:
          approvalStatus = 'rejected';
          break;
        default:
          approvalStatus = 'pending';
      }
    }
    displayTitle = article.title;
    displayContent = article.content;
    displayCreatedAt = article.createdAt;
    displayUpdatedAt = article.updatedAt;
    displayAuthor = article.author;
    displaySubmittedForReview = article.submittedForReview;
    displayCategories = article.categories || [];
  } else {
    return null;
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteArticle.mutateAsync(id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('删除文章时出错:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleRead = () => {
    if (onRead && article) {
      console.log('ArticleCard: 点击阅读文章，文章ID:', id.toString());
      onRead({
        id,
        title: displayTitle,
        content: displayContent,
        author: displayAuthor,
        createdAt: displayCreatedAt,
        updatedAt: displayUpdatedAt,
      });
    }
  };

  const handleApprove = async () => {
    try {
      console.log('ArticleCard: 开始审核通过文章', id.toString());
      await approveArticle.mutateAsync(id);
      setShowSuccessMessage(`文章"${displayTitle}"已通过审核，现在将在主页显示给所有用户`);
      setTimeout(() => setShowSuccessMessage(null), 4000);
      console.log('ArticleCard: 文章审核通过成功');
    } catch (error) {
      console.error('审核通过文章时出错:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Unauthorized')) {
        setShowSuccessMessage('权限不足：只有超级管理员可以审核文章');
      } else {
        setShowSuccessMessage('审核操作失败，请重试');
      }
      setTimeout(() => setShowSuccessMessage(null), 4000);
    }
  };

  const handleReject = async () => {
    try {
      console.log('ArticleCard: 开始拒绝文章审核', id.toString());
      await rejectArticle.mutateAsync(id);
      setShowSuccessMessage(`文章"${displayTitle}"已拒绝审核，文章状态已更新为"已审核不通过"`);
      setTimeout(() => setShowSuccessMessage(null), 4000);
      console.log('ArticleCard: 文章审核拒绝成功');
    } catch (error) {
      console.error('拒绝审核文章时出错:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Unauthorized')) {
        setShowSuccessMessage('权限不足：只有超级管理员可以审核文章');
      } else {
        setShowSuccessMessage('审核操作失败，请重试');
      }
      setTimeout(() => setShowSuccessMessage(null), 4000);
    }
  };

  const canEdit = isOwner && identity && displayAuthor && displayAuthor.toString() === identity.getPrincipal().toString();
  const canRead = !!article;

  // Get first line preview content for ALL article list views
  const getFirstLinePreview = () => {
    if (!displayContent) return null;
    
    const cleanContent = stripMarkdown(displayContent);
    const lines = cleanContent.split('\n');
    let firstLine = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        firstLine = trimmedLine;
        break;
      }
    }
    
    if (!firstLine) return null;
    
    const truncatedLine = firstLine.length > 80 
      ? firstLine.substring(0, 80) + '...' 
      : firstLine;
    
    return truncatedLine;
  };

  const firstLinePreview = getFirstLinePreview();

  return (
    <>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-dark-success to-dark-primary text-white p-4 rounded-2xl shadow-2xl border-3 border-gray-500 z-50 animate-bounce-fun max-w-md">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon size={20} className="text-white shrink-0" />
            <p className="font-bold elegant-numbers text-sm">{showSuccessMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-xl border-4 border-gray-500 transition-all duration-300 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-dark-text leading-relaxed mb-2 global-font truncate">
                📝 {displayTitle}
              </h3>
              
              {/* Categories Display with Standard Styling */}
              {displayCategories.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                  {displayCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-2 py-1 text-dark-text-secondary text-xs font-medium bg-dark-surface/50 rounded border border-gray-500 cursor-pointer hover:bg-dark-hover transition-colors duration-200"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Approval Status Badge */}
              {showApprovalStatus && (
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-xl border-2 text-sm font-bold mb-3 global-font ${getStatusColor(approvalStatus)}`}>
                  {getStatusIcon(approvalStatus)}
                  <span>{getStatusText(approvalStatus)}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-1 sm:space-x-2 ml-2 sm:ml-4 shrink-0">
              {onRead && canRead && (
                <button
                  onClick={handleRead}
                  className="p-2 sm:p-3 text-dark-primary hover:bg-dark-primary/20 rounded-full transition-all duration-300 border-2 border-gray-500 shadow-lg hover:shadow-xl hover:scale-110"
                  title="阅读文章"
                >
                  <BookOpenIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              )}
              
              {/* Review Actions for Super User */}
              {showReviewActions && approvalStatus === 'pending' && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={approveArticle.isPending}
                    className="p-2 sm:p-3 text-dark-success hover:bg-dark-success/20 rounded-full transition-all duration-300 border-2 border-gray-500 shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                    title="通过审核"
                  >
                    {approveArticle.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-dark-success border-t-transparent"></div>
                    ) : (
                      <span className="text-base sm:text-lg">✅</span>
                    )}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={rejectArticle.isPending}
                    className="p-2 sm:p-3 text-dark-error hover:bg-dark-error/20 rounded-full transition-all duration-300 border-2 border-gray-500 shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                    title="拒绝审核"
                  >
                    {rejectArticle.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-dark-error border-t-transparent"></div>
                    ) : (
                      <span className="text-base sm:text-lg">❌</span>
                    )}
                  </button>
                </>
              )}
              
              {canEdit && onEdit && (
                <>
                  <button
                    onClick={() => onEdit(id, displayTitle, displayContent, undefined, displaySubmittedForReview, displayCategories)}
                    className="p-2 sm:p-3 text-dark-success hover:bg-dark-success/20 rounded-full transition-all duration-300 border-2 border-gray-500 shadow-lg hover:shadow-xl hover:scale-110"
                    title="编辑文章"
                  >
                    <EditIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    disabled={deleteArticle.isPending}
                    className="p-2 sm:p-3 text-dark-error hover:bg-dark-error/20 rounded-full transition-all duration-300 border-2 border-gray-500 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-110 disabled:hover:scale-100"
                    title="删除文章"
                  >
                    <TrashIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* First-line preview content */}
          {firstLinePreview && (
            <div className="text-dark-text-secondary mb-3 leading-relaxed text-sm global-font">
              <p className="line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {firstLinePreview}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-dark-text-secondary border-t-2 border-gray-500 pt-3 font-medium global-font space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
              {showAuthor && (
                <span className="flex items-center text-xs sm:text-sm">
                  👤 作者：{authorProfile?.name || '神秘作者'}
                </span>
              )}
              <span className="flex items-center text-xs sm:text-sm">
                📅 发布于：{formatDate(displayCreatedAt)}
              </span>
              {displayUpdatedAt !== displayCreatedAt && (
                <span className="flex items-center text-xs sm:text-sm">
                  🔄 更新于：{formatDate(displayUpdatedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          articleTitle={displayTitle}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={deleteArticle.isPending}
        />
      )}
    </>
  );
}
