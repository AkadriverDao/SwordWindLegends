import { AlertTriangleIcon, ArrowLeftIcon, ShieldIcon } from "lucide-react";
import { useIsSuperUser } from "../hooks/useQueries";
import ArticleManager from "./management/ArticleManager";

interface ManagementSystemPageProps {
  navigate: (
    route:
      | "/"
      | "/profile"
      | "/leaderboard"
      | "/customize"
      | "/article"
      | "/management",
    params?: any,
  ) => void;
}

export default function ManagementSystemPage({
  navigate,
}: ManagementSystemPageProps) {
  const { isSuperUser } = useIsSuperUser();

  const handleBack = () => {
    navigate("/");
  };

  const handleReadArticle = (article: {
    id: bigint;
    title: string;
    content: string;
    author: any;
    createdAt: bigint;
    updatedAt: bigint;
    coverImage?: string;
  }) => {
    navigate("/article", { articleId: article.id.toString() });
  };

  if (!isSuperUser) {
    return (
      <div className="text-center py-16">
        <div className="bg-dark-card backdrop-blur-sm rounded-3xl p-12 border-4 border-gray-500 shadow-2xl inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-dark-error to-dark-warning rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertTriangleIcon size={40} className="text-white" />
          </div>
          <p className="text-dark-text text-xl font-bold mb-4">访问被拒绝</p>
          <p className="text-dark-text-secondary text-lg mb-6">
            您没有权限访问管理系统
          </p>
          <button
            type="button"
            onClick={handleBack}
            data-ocid="management.back_button"
            className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
        <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleBack}
              data-ocid="management.back_button"
              className="p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110"
            >
              <ArrowLeftIcon size={20} className="text-dark-text" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-dark-error to-dark-warning rounded-full flex items-center justify-center shadow-lg">
                  <ShieldIcon size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-dark-text">
                  ⚙️ 超级管理员控制台
                </h2>
              </div>
              <p className="text-dark-text-secondary font-medium">文章管理</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b-2 border-gray-500">
          <div className="bg-gradient-to-r from-dark-success/20 to-dark-primary/20 rounded-2xl p-4 border-3 border-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-dark-success to-dark-primary rounded-full flex items-center justify-center shadow-lg">
                  <ShieldIcon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark-text mb-1">
                    🛡️ 超级管理员身份已确认
                  </h3>
                  <p className="text-dark-text-secondary font-medium">
                    您拥有完整的文章管理权限
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-dark-primary/20 px-4 py-2 rounded-xl border-2 border-gray-500">
                <ShieldIcon size={16} className="text-dark-primary" />
                <span className="text-dark-primary font-bold">超级管理员</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <ArticleManager onReadArticle={handleReadArticle} />
        </div>
      </div>
    </div>
  );
}
