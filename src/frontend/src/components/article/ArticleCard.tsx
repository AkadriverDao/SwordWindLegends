import {
  BookOpenIcon,
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  PinIcon,
  PinOffIcon,
  TrashIcon,
} from "lucide-react";
import React from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useDeleteArticle,
  useGetUserProfile,
  useSetArticlePinned,
  useSetArticleVisible,
} from "../../hooks/useQueries";
import { useIsSuperUser } from "../../hooks/useUserQueries";
import type { Article } from "../../types/backend";
import { stripMarkdown } from "../../utils/markdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

interface ArticleCardProps {
  id: bigint;
  article?: Article;
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

export default function ArticleCard({
  id,
  article,
  onEdit,
  onRead,
  showAuthor = false,
  isOwner = false,
}: ArticleCardProps) {
  const deleteArticle = useDeleteArticle();
  const setArticlePinned = useSetArticlePinned();
  const setArticleVisible = useSetArticleVisible();
  const { identity } = useInternetIdentity();
  const { isSuperUser } = useIsSuperUser();

  const { data: authorProfile } = useGetUserProfile(
    article?.author || (null as any),
  );

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState<
    string | null
  >(null);
  const [hideReasonVisible, setHideReasonVisible] = React.useState(false);

  if (!article) {
    return null;
  }

  const displayTitle = article.title;
  const displayContent = article.content;
  const displayCreatedAt = article.createdAt;
  const displayUpdatedAt = article.updatedAt;
  const displayAuthor = article.author;
  const displayCategories = article.categories || [];
  const isHidden = article.visible === false;
  const isPinned = article.pinned === true;
  const hideReason = article.hideReason || "";

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
      console.error("删除文章时出错:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleRead = () => {
    if (onRead) {
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

  const handleTogglePin = async () => {
    try {
      await setArticlePinned.mutateAsync({ articleId: id, pinned: !isPinned });
      setShowSuccessMessage(
        isPinned ? `已取消置顶"${displayTitle}"` : `已置顶"${displayTitle}"`,
      );
      setTimeout(() => setShowSuccessMessage(null), 3000);
    } catch (error) {
      console.error("置顶操作失败:", error);
      setShowSuccessMessage("置顶操作失败，请重试");
      setTimeout(() => setShowSuccessMessage(null), 3000);
    }
  };

  const handleToggleVisible = async () => {
    // 隐藏时必须填写隐藏原因
    if (article.visible) {
      const reason = window.prompt("请填写隐藏该文章的原因（必填）：", "");
      if (!reason || reason.trim() === "") {
        setShowSuccessMessage("隐藏文章需要填写原因，操作已取消");
        setTimeout(() => setShowSuccessMessage(null), 3000);
        return;
      }
      try {
        await setArticleVisible.mutateAsync({
          articleId: id,
          visible: false,
          hideReason: reason.trim(),
        });
        setShowSuccessMessage(`已隐藏"${displayTitle}"`);
        setTimeout(() => setShowSuccessMessage(null), 3000);
      } catch (error) {
        console.error("隐藏文章失败:", error);
        setShowSuccessMessage("隐藏操作失败，请重试");
        setTimeout(() => setShowSuccessMessage(null), 3000);
      }
      return;
    }

    // 显示文章：清除隐藏原因
    try {
      await setArticleVisible.mutateAsync({
        articleId: id,
        visible: true,
        hideReason: "",
      });
      setShowSuccessMessage(`已显示"${displayTitle}"`);
      setTimeout(() => setShowSuccessMessage(null), 3000);
    } catch (error) {
      console.error("显示文章失败:", error);
      setShowSuccessMessage("显示操作失败，请重试");
      setTimeout(() => setShowSuccessMessage(null), 3000);
    }
  };

  const canEdit =
    isOwner &&
    identity &&
    displayAuthor &&
    displayAuthor.toString() === identity.getPrincipal().toString();
  const canRead = true;

  // Get first line preview content for ALL article list views
  const getFirstLinePreview = () => {
    if (!displayContent) return null;

    const cleanContent = stripMarkdown(displayContent);
    const lines = cleanContent.split("\n");
    let firstLine = "";

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        firstLine = trimmedLine;
        break;
      }
    }

    if (!firstLine) return null;

    const truncatedLine =
      firstLine.length > 80 ? `${firstLine.substring(0, 80)}...` : firstLine;

    return truncatedLine;
  };

  const firstLinePreview = getFirstLinePreview();

  return (
    <>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-dark-success to-dark-primary text-white p-4 rounded-2xl shadow-2xl border-3 border-gray-500 z-50 animate-bounce-fun max-w-md">
          <div className="flex items-center space-x-3">
            <span className="text-white shrink-0">✅</span>
            <p className="font-bold elegant-numbers text-sm">
              {showSuccessMessage}
            </p>
          </div>
        </div>
      )}

      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-xl border-4 border-gray-500 transition-all duration-300 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {isPinned && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-bold bg-dark-primary/20 text-dark-primary rounded border border-dark-primary/40">
                    <PinIcon size={12} />
                    <span>置顶</span>
                  </span>
                )}
                {isHidden && (
                  <button
                    type="button"
                    className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-bold bg-dark-error/20 text-dark-error rounded border border-dark-error/40 cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-primary"
                    onMouseEnter={() => setHideReasonVisible(true)}
                    onMouseLeave={() => setHideReasonVisible(false)}
                    onClick={() => setHideReasonVisible((v) => !v)}
                  >
                    <EyeOffIcon size={12} />
                    <span>已隐藏</span>
                  </button>
                )}
              </div>

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

              {/* Hide reason tooltip / inline note */}
              {isHidden && hideReasonVisible && hideReason && (
                <div className="mb-3 px-3 py-2 bg-dark-error/10 border border-dark-error/30 rounded-lg text-dark-text-secondary text-xs global-font">
                  <span className="font-bold text-dark-error">隐藏原因：</span>
                  {hideReason}
                </div>
              )}
            </div>

            <div className="flex space-x-1 sm:space-x-2 ml-2 sm:ml-4 shrink-0">
              {onRead && canRead && (
                <button
                  type="button"
                  onClick={handleRead}
                  className="p-2 sm:p-3 text-dark-primary hover:bg-dark-primary/20 rounded-full transition-all duration-300 border-2 border-gray-500 shadow-lg hover:shadow-xl hover:scale-110"
                  title="阅读文章"
                  data-ocid="article.read_button"
                >
                  <BookOpenIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              )}

              {/* Super-user management actions */}
              {isSuperUser && (
                <>
                  <button
                    type="button"
                    onClick={handleTogglePin}
                    disabled={setArticlePinned.isPending}
                    className="p-2 sm:p-3 text-dark-primary hover:bg-dark-primary/20 rounded-full transition-all duration-300 border-2 border-gray-500 shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                    title={isPinned ? "取消置顶" : "置顶"}
                    data-ocid="article.toggle_pin_button"
                  >
                    {setArticlePinned.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-dark-primary border-t-transparent" />
                    ) : isPinned ? (
                      <PinOffIcon
                        size={16}
                        className="sm:w-[18px] sm:h-[18px]"
                      />
                    ) : (
                      <PinIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleVisible}
                    disabled={setArticleVisible.isPending}
                    className={`p-2 sm:p-3 rounded-full transition-all duration-300 border-2 border-gray-500 shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 ${
                      isHidden
                        ? "text-dark-success hover:bg-dark-success/20"
                        : "text-dark-error hover:bg-dark-error/20"
                    }`}
                    title={isHidden ? "显示" : "隐藏"}
                    data-ocid="article.toggle_visible_button"
                  >
                    {setArticleVisible.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    ) : isHidden ? (
                      <EyeIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    ) : (
                      <EyeOffIcon
                        size={16}
                        className="sm:w-[18px] sm:h-[18px]"
                      />
                    )}
                  </button>
                </>
              )}

              {canEdit && onEdit && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(
                        id,
                        displayTitle,
                        displayContent,
                        undefined,
                        displayCategories,
                      )
                    }
                    className="p-2 sm:p-3 text-dark-success hover:bg-dark-success/20 rounded-full transition-all duration-300 border-2 border-gray-500 shadow-lg hover:shadow-xl hover:scale-110"
                    title="编辑文章"
                    data-ocid="article.edit_button"
                  >
                    <EditIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    disabled={deleteArticle.isPending}
                    className="p-2 sm:p-3 text-dark-error hover:bg-dark-error/20 rounded-full transition-all duration-300 border-2 border-gray-500 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-110 disabled:hover:scale-100"
                    title="删除文章"
                    data-ocid="article.delete_button"
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
                  👤 作者：{authorProfile?.name || "神秘作者"}
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
