import React from 'react';
import { useGetAllArticles, useGetPendingArticles } from '../../hooks/useArticleQueries';
import { BookOpenIcon, ShieldIcon } from 'lucide-react';
import ArticleList from '../ArticleList';

interface ArticleManagerProps {
  selectedTab: 'pending' | 'approved' | 'rejected' | 'all';
  onReadArticle: (article: { id: bigint; title: string; content: string; author: any; createdAt: bigint; updatedAt: bigint; coverImage?: string }) => void;
}

export default function ArticleManager({ selectedTab, onReadArticle }: ArticleManagerProps) {
  const { data: allArticles, isLoading: allArticlesLoading } = useGetAllArticles();
  const { data: pendingArticles, isLoading: pendingLoading } = useGetPendingArticles();

  const isLoading = allArticlesLoading || pendingLoading;

  const getFilteredArticles = () => {
    if (!allArticles) return [];
    
    return allArticles.filter(([id, article]) => {
      if (selectedTab === 'all') return article.submittedForReview;
      if (selectedTab === 'pending') return article.submittedForReview && Number(article.approvalStatus) === 0;
      if (selectedTab === 'approved') return article.submittedForReview && Number(article.approvalStatus) === 1;
      if (selectedTab === 'rejected') return article.submittedForReview && Number(article.approvalStatus) === 2;
      return false;
    });
  };

  const filteredArticles = getFilteredArticles();

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

  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <BookOpenIcon size={32} className="text-gray-400" />
        </div>
        <p className="text-dark-text text-xl font-bold mb-2">
          暂无{selectedTab === 'all' ? '' : selectedTab === 'pending' ? '未审核' : selectedTab === 'approved' ? '已通过' : '已拒绝'}文章
        </p>
        <p className="text-dark-text-secondary text-lg">
          {selectedTab === 'pending' && '当前没有需要审核的文章，所有提交的文章都已处理完成'}
          {selectedTab === 'approved' && '暂无已通过审核的文章，等待用户提交更多内容'}
          {selectedTab === 'rejected' && '暂无已拒绝的文章，所有审核都已通过'}
          {selectedTab === 'all' && '系统中暂无任何提交审核的文章，等待用户开始创作'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-dark-text flex items-center">
          📋 文章审核列表
          <span className="ml-3 text-sm font-normal text-dark-text-secondary">
            ({selectedTab === 'pending' ? '未审核' : selectedTab === 'approved' ? '已通过' : selectedTab === 'rejected' ? '已拒绝' : '全部'})
          </span>
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-dark-text-secondary text-sm">
            共 {filteredArticles.length} 篇文章
          </div>
          {selectedTab === 'pending' && filteredArticles.length > 0 && (
            <div className="bg-dark-warning/20 px-3 py-1 rounded-xl border-2 border-gray-500">
              <span className="text-dark-warning font-bold text-sm">需要审核</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-dark-primary/20 to-dark-secondary/20 rounded-2xl p-6 border-3 border-gray-500">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-dark-primary to-dark-secondary rounded-full flex items-center justify-center shadow-lg shrink-0 mt-1">
            <ShieldIcon size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-dark-text mb-3">
              📋 审核操作指南
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-bold text-dark-text">基本操作：</h5>
                <ul className="text-dark-text-secondary font-medium space-y-1">
                  <li className="flex items-center space-x-2">
                    <span className="text-lg">✅</span>
                    <span>点击 ✅ 按钮通过文章审核</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-lg">❌</span>
                    <span>点击 ❌ 按钮拒绝文章审核</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BookOpenIcon size={16} className="text-dark-primary" />
                    <span>点击 📖 按钮阅读完整文章内容</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold text-dark-text">审核规则：</h5>
                <ul className="text-dark-text-secondary font-medium space-y-1">
                  <li>• 只有未审核状态的文章可以进行审核操作</li>
                  <li>• 通过审核的文章将立即在主页显示给所有用户</li>
                  <li>• 拒绝的文章将标记为"已审核不通过"，不在主页显示</li>
                  <li>• 被拒绝的文章仍保留在用户的个人页面中</li>
                  <li>• 用户可以编辑被拒绝的文章并重新提交审核</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-dark-warning/20 rounded-xl border-2 border-gray-500">
              <p className="text-dark-warning font-medium text-sm">
                ⚠️ 注意：拒绝审核不会删除文章，文章将标记为"已审核不通过"状态
              </p>
            </div>
          </div>
        </div>
      </div>

      <ArticleList
        articles={filteredArticles}
        showAuthor={true}
        onRead={onReadArticle}
        isOwner={false}
        showApprovalStatus={true}
        showReviewActions={selectedTab === 'pending'}
      />
    </div>
  );
}
