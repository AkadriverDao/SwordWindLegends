import { BookOpenIcon, ShieldIcon } from "lucide-react";
import { useGetAllArticles } from "../../hooks/useArticleQueries";
import ArticleList from "../ArticleList";

interface ArticleManagerProps {
  onReadArticle: (article: {
    id: bigint;
    title: string;
    content: string;
    author: any;
    createdAt: bigint;
    updatedAt: bigint;
    coverImage?: string;
  }) => void;
}

export default function ArticleManager({ onReadArticle }: ArticleManagerProps) {
  const { data: allArticles, isLoading } = useGetAllArticles();

  const articles = allArticles ?? [];

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-bounce rounded-full h-12 w-12 bg-gradient-to-r from-dark-warning to-dark-accent mx-auto mb-6 flex items-center justify-center">
          <ShieldIcon size={24} className="text-white" />
        </div>
        <p className="text-dark-text text-xl font-bold">加载文章列表中...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <BookOpenIcon size={32} className="text-gray-400" />
        </div>
        <p className="text-dark-text text-xl font-bold mb-2">暂无社区文章</p>
        <p className="text-dark-text-secondary text-lg">
          社区中暂无任何文章，等待用户开始创作
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-dark-text flex items-center">
          📋 文章管理
          <span className="ml-3 text-sm font-normal text-dark-text-secondary">
            (全部)
          </span>
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-dark-text-secondary text-sm">
            共 {articles.length} 篇文章
          </div>
        </div>
      </div>

      <ArticleList
        articles={articles}
        showAuthor={true}
        onRead={onReadArticle}
        isOwner={false}
      />
    </div>
  );
}
