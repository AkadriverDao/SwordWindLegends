import {
  ArrowLeftIcon,
  EyeOffIcon,
  HeartIcon,
  LinkIcon,
  MessageCircleIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetSingleArticle, useGetUserProfile } from "../hooks/useQueries";
import CommentSection from "./CommentSection";
import LikeButton from "./LikeButton";
import MarkdownRenderer from "./MarkdownRenderer";

interface ArticleReaderProps {
  articleId?: string;
  navigate: (
    route: "/" | "/profile" | "/leaderboard" | "/customize" | "/article",
    params?: any,
  ) => void;
}

type CopyState = "idle" | "copied" | "failed";

export default function ArticleReader({
  articleId,
  navigate,
}: ArticleReaderProps) {
  const {
    data: article,
    isLoading: articleLoading,
    error,
  } = useGetSingleArticle(articleId);
  const { data: authorProfile } = useGetUserProfile(
    article?.author || (null as any),
  );
  const { identity } = useInternetIdentity();

  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [hideReasonVisible, setHideReasonVisible] = useState(false);
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending copy-state reset timer on unmount
  useEffect(() => {
    return () => {
      if (copyResetTimer.current) {
        clearTimeout(copyResetTimer.current);
      }
    };
  }, []);

  const handleBack = () => {
    // Return to the originating page (home or category) instead of forcing /profile.
    // If there is no history entry to go back to, fall back to the home route.
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if article is visible. Authors can always view their own articles,
  // including ones they have hidden (visible === false).
  const isArticleVisible =
    article &&
    (article.visible !== false ||
      (identity &&
        article.author.toString() === identity.getPrincipal().toString()));

  // Build the public shareable URL for this article.
  // The app uses path-based routing (window.location.pathname), so the
  // canonical public link is <origin>/article/<articleId>.
  const buildShareUrl = (): string => {
    const origin = window.location.origin;
    const id = articleId || "0";
    return `${origin}/article/${id}`;
  };

  const handleCopyLink = async () => {
    const url = buildShareUrl();

    // Reset any pending recovery timer before starting a new copy attempt
    if (copyResetTimer.current) {
      clearTimeout(copyResetTimer.current);
      copyResetTimer.current = null;
    }

    const succeed = () => {
      setCopyState("copied");
      copyResetTimer.current = setTimeout(() => {
        setCopyState("idle");
        copyResetTimer.current = null;
      }, 2000);
    };

    const fail = () => {
      setCopyState("failed");
      // Failure state persists until the user re-clicks or dismisses, so they
      // can manually select and copy the displayed link text.
    };

    // Preferred path: async Clipboard API
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(url);
        succeed();
        return;
      } catch {
        // Fall through to legacy fallback below
      }
    }

    // Legacy fallback: hidden textarea + execCommand('copy')
    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (ok) {
        succeed();
      } else {
        fail();
      }
    } catch {
      fail();
    }
  };

  if (articleLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-theme-primary mx-auto mb-4" />
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
            {error ? "加载文章时出错" : "该文章不存在或您没有权限查看"}
          </p>
          <button
            type="button"
            onClick={handleBack}
            data-ocid="article.back_button"
            className="px-6 py-3 bg-theme-primary hover:bg-theme-secondary text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const buttonLabel =
    copyState === "copied"
      ? "已复制"
      : copyState === "failed"
        ? "复制失败，请手动复制"
        : "复制链接";

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-card border-b-4 border-gray-500 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              data-ocid="article.back_button"
              className="flex items-center space-x-2 text-dark-text hover:text-theme-primary transition-colors duration-300 group"
            >
              <ArrowLeftIcon
                size={24}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="font-medium">返回</span>
            </button>

            <div className="flex items-center space-x-4">
              <LikeButton articleId={articleId || "0"} />
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <article className="bg-dark-card rounded-3xl shadow-2xl border-4 border-gray-500 overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b-4 border-gray-500 bg-gradient-to-br from-dark-surface to-dark-card">
            {/* Hidden badge — only authors/super-users reach this page for
                hidden articles, so the marker is safe to always render here
                when article.visible === false. */}
            {article.visible === false && (
              <div className="mb-4">
                <button
                  type="button"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-bold bg-dark-error/20 text-dark-error rounded-lg border border-dark-error/40 cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-primary"
                  onMouseEnter={() => setHideReasonVisible(true)}
                  onMouseLeave={() => setHideReasonVisible(false)}
                  onClick={() => setHideReasonVisible((v) => !v)}
                  data-ocid="article.hidden_badge"
                  aria-expanded={hideReasonVisible}
                >
                  <EyeOffIcon size={14} />
                  <span>已隐藏</span>
                </button>
                {hideReasonVisible && article.hideReason && (
                  <div className="mt-2 px-4 py-3 bg-dark-error/10 border border-dark-error/30 rounded-lg text-dark-text-secondary text-sm global-font">
                    <span className="font-bold text-dark-error">
                      隐藏原因：
                    </span>
                    {article.hideReason}
                  </div>
                )}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-dark-text-secondary">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-theme-primary to-theme-secondary flex items-center justify-center text-white font-bold shadow-lg">
                  {authorProfile?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <span className="font-medium text-dark-text">
                  {authorProfile?.name || "匿名作者"}
                </span>
              </div>

              <span className="text-gray-400">•</span>

              <time className="text-sm">{formatDate(article.createdAt)}</time>

              {article.categories && article.categories.length > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <div className="flex flex-wrap gap-2">
                    {article.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-theme-primary/20 text-theme-primary rounded-full text-sm font-medium border border-theme-primary/30"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Copy-link control — placed at the end of the meta row so it
                  sits beside the author/date/category info without breaking
                  the reading flow. Visually coordinated with LikeButton. */}
              <div className="flex flex-col items-start gap-1 ml-auto">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  data-ocid="article.copy_link_button"
                  aria-label="复制文章链接"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                    copyState === "copied"
                      ? "bg-gradient-to-r from-dark-success to-theme-primary text-white"
                      : copyState === "failed"
                        ? "bg-gradient-to-r from-dark-error to-dark-warning text-white"
                        : "bg-dark-surface border-2 border-gray-500 text-dark-text hover:bg-dark-hover"
                  }`}
                >
                  <LinkIcon size={18} />
                  <span>{buttonLabel}</span>
                </button>

                {/* Failure fallback: expose the link text so the user can
                    manually select and copy it. */}
                {copyState === "failed" && (
                  <label
                    className="w-full max-w-xs"
                    data-ocid="article.copy_link_fallback"
                  >
                    <span className="sr-only">可手动选中的文章链接</span>
                    <input
                      type="text"
                      readOnly
                      value={buildShareUrl()}
                      onFocus={(e) => e.currentTarget.select()}
                      data-ocid="article.copy_link_input"
                      className="w-full px-3 py-1.5 text-sm bg-dark-bg border-2 border-dark-border rounded-lg text-dark-text font-mono focus:outline-none focus:border-theme-primary"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <MarkdownRenderer content={article.content} />
            </div>
          </div>

          {/* Article Footer */}
          <div className="p-8 border-t-4 border-gray-500 bg-dark-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-dark-text-secondary">
                  <HeartIcon size={20} />
                  <span>{Number(article.likes)} 点赞</span>
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
          <CommentSection articleId={articleId || "0"} />
        </div>
      </main>
    </div>
  );
}
