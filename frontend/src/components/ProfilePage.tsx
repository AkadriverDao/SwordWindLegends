import React, { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useGetMyArticles } from '../hooks/useArticleQueries';
import { useGetMiningLoggingEnabled } from '../hooks/useMiningConfigQueries';
import { ArrowLeftIcon, UserIcon, EditIcon, PenToolIcon, BookOpenIcon } from 'lucide-react';
import UserInfoEditModal from './UserInfoEditModal';
import ArticleList from './ArticleList';
import ArticleEditor from './ArticleEditor';

interface ProfilePageProps {
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article', params?: any) => void;
}

export default function ProfilePage({ navigate }: ProfilePageProps) {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { data: myArticles } = useGetMyArticles();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<{
    id: bigint;
    title: string;
    content: string;
    coverImage?: string;
    submittedForReview?: boolean;
    categories?: string[];
  } | undefined>(undefined);

  const handleBack = () => {
    navigate('/');
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleCreateArticle = () => {
    setEditingArticle(undefined);
    setShowArticleEditor(true);
  };

  const handleEditArticle = (id: bigint, title: string, content: string, coverImage?: string, submittedForReview?: boolean, categories?: string[]) => {
    setEditingArticle({ id, title, content, coverImage, submittedForReview, categories });
    setShowArticleEditor(true);
  };

  const handleReadArticle = (article: { id: bigint; title: string; content: string; author: any; createdAt: bigint; updatedAt: bigint; coverImage?: string }) => {
    if (loggingEnabled) {
      console.log('ProfilePage: 准备导航到文章阅读页面', { 
        articleId: article.id.toString(), 
        title: article.title 
      });
    }
    
    navigate('/article', { articleId: article.id.toString() });
  };

  const handleCloseEditor = () => {
    setShowArticleEditor(false);
    setEditingArticle(undefined);
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="bg-dark-card backdrop-blur-sm rounded-3xl p-12 border-4 border-gray-500 shadow-2xl inline-block">
          <div className="animate-bounce rounded-full h-12 w-12 bg-gradient-to-r from-dark-primary to-dark-secondary mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-xl">👤</span>
          </div>
          <p className="text-dark-text text-xl font-bold">加载个人页面中...</p>
        </div>
      </div>
    );
  }

  if (showArticleEditor) {
    return (
      <ArticleEditor 
        editingArticle={editingArticle}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
        <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110"
            >
              <ArrowLeftIcon size={20} className="text-dark-text" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-dark-text flex items-center">
                👤 个人页面
              </h2>
              <p className="text-dark-text-secondary font-medium">管理您的个人信息和经历内容</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-dark-text flex items-center">
              ✨ 用户信息
            </h3>
            <button
              onClick={handleEditProfile}
              className="w-full bg-gradient-to-r from-dark-surface to-dark-muted rounded-2xl border-3 border-gray-500 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dark-primary to-dark-secondary flex items-center justify-center shadow-lg">
                    <UserIcon size={32} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-dark-text mb-1">
                      {userProfile?.name || '未设置'}
                    </p>
                    <p className="text-dark-text-secondary font-medium">
                      点击编辑用户信息
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-dark-primary to-dark-secondary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <EditIcon size={20} className="text-white" />
                </div>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-dark-text flex items-center">
                📝 我的经历
              </h3>
              <button
                onClick={handleCreateArticle}
                className="bg-gradient-to-r from-dark-success to-dark-primary hover:from-dark-success/80 hover:to-dark-primary/80 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
              >
                <PenToolIcon size={16} />
                <span>✨ 创作新经历</span>
              </button>
            </div>

            {myArticles && myArticles.length > 0 ? (
              <ArticleList
                articles={myArticles}
                showAuthor={false}
                onEdit={handleEditArticle}
                onRead={handleReadArticle}
                isOwner={true}
                showApprovalStatus={true}
              />
            ) : (
              <div className="text-center py-12">
                <div className="bg-dark-surface backdrop-blur-sm rounded-3xl p-8 border-3 border-gray-500 shadow-lg inline-block">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-primary to-dark-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <BookOpenIcon size={32} className="text-white" />
                  </div>
                  <p className="text-dark-text text-lg font-bold mb-2">
                    🎨 您还没有发布任何经历
                  </p>
                  <p className="text-dark-text-secondary">点击上方按钮开始创作吧！</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && userProfile && (
        <UserInfoEditModal
          userProfile={userProfile}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}
