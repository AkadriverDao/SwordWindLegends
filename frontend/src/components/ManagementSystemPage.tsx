import React, { useState } from 'react';
import { useIsSuperUser } from '../hooks/useQueries';
import { ArrowLeftIcon, ShieldIcon, AlertTriangleIcon, FilterIcon, ClockIcon, CheckCircleIcon, XCircleIcon, TrendingUpIcon, SettingsIcon } from 'lucide-react';
import TradingPairManager from './management/TradingPairManager';
import ArticleManager from './management/ArticleManager';
import LandMinerConfigManager from './management/LandMinerConfigManager';

interface ManagementSystemPageProps {
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article' | '/management', params?: any) => void;
}

export default function ManagementSystemPage({ navigate }: ManagementSystemPageProps) {
  const { isSuperUser } = useIsSuperUser();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected' | 'all' | 'trading' | 'landminer'>('pending');
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);

  const handleBack = () => {
    navigate('/');
  };

  const handleReadArticle = (article: { id: bigint; title: string; content: string; author: any; createdAt: bigint; updatedAt: bigint; coverImage?: string }) => {
    console.log('ManagementSystemPage: 准备导航到文章阅读页面', { 
      articleId: article.id.toString(), 
      title: article.title 
    });
    
    navigate('/article', { articleId: article.id.toString() });
  };

  const handleShowSuccessMessage = (message: string) => {
    setShowSuccessMessage(message);
    setTimeout(() => setShowSuccessMessage(null), 4000);
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
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'pending':
        return <ClockIcon size={16} />;
      case 'approved':
        return <CheckCircleIcon size={16} />;
      case 'rejected':
        return <XCircleIcon size={16} />;
      case 'trading':
        return <TrendingUpIcon size={16} />;
      case 'landminer':
        return <SettingsIcon size={16} />;
      default:
        return <FilterIcon size={16} />;
    }
  };

  const getTabColor = (tab: string) => {
    switch (tab) {
      case 'pending':
        return 'from-dark-warning to-dark-accent';
      case 'approved':
        return 'from-dark-success to-dark-primary';
      case 'rejected':
        return 'from-dark-error to-dark-warning';
      case 'trading':
        return 'from-dark-primary to-dark-secondary';
      case 'landminer':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-dark-primary to-dark-secondary';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-dark-success to-dark-primary text-white p-6 rounded-2xl shadow-2xl border-3 border-gray-500 z-50 animate-bounce-fun max-w-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircleIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">✅ 操作成功</p>
              <p className="font-medium">{showSuccessMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
        <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
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
              <p className="text-dark-text-secondary font-medium">文章审核管理、交易对配置和土地矿工游戏设置</p>
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
                    您拥有完整的文章审核权限、交易对配置权限和土地矿工游戏配置权限
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-dark-primary/20 px-4 py-2 rounded-xl border-2 border-gray-500">
                <TrendingUpIcon size={16} className="text-dark-primary" />
                <span className="text-dark-primary font-bold">超级管理员</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b-2 border-gray-500">
          <div className="flex justify-center">
            <div className="bg-dark-surface rounded-2xl p-2 border-3 border-gray-500 shadow-inner">
              <div className="flex space-x-2 flex-wrap">
                {[
                  { key: 'pending', label: '未审核' },
                  { key: 'approved', label: '已通过' },
                  { key: 'rejected', label: '已拒绝' },
                  { key: 'all', label: '全部' },
                  { key: 'trading', label: '交易对管理' },
                  { key: 'landminer', label: '土地矿工配置' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base ${
                      selectedTab === tab.key
                        ? `bg-gradient-to-r ${getTabColor(tab.key)} text-white shadow-lg`
                        : 'text-dark-text-secondary hover:bg-dark-hover'
                    }`}
                  >
                    {getTabIcon(tab.key)}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {selectedTab === 'trading' ? (
            <TradingPairManager onShowSuccessMessage={handleShowSuccessMessage} />
          ) : selectedTab === 'landminer' ? (
            <LandMinerConfigManager onShowSuccessMessage={handleShowSuccessMessage} />
          ) : (
            <ArticleManager selectedTab={selectedTab} onReadArticle={handleReadArticle} />
          )}
        </div>
      </div>
    </div>
  );
}
