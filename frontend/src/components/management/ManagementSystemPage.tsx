import React, { useState } from 'react';
import { useIsSuperUser } from '../../hooks/useUserQueries';
import { ArrowLeftIcon, ShieldIcon, AlertTriangleIcon, FilterIcon, ClockIcon, CheckCircleIcon, XCircleIcon, TrendingUpIcon, SettingsIcon } from 'lucide-react';
import TradingPairManager from './TradingPairManager';
import ArticleManager from './ArticleManager';
import LandMinerConfigManager from './LandMinerConfigManager';
import ManagementHeader from './ManagementHeader';
import ManagementTabs from './ManagementTabs';
import AccessDeniedScreen from './AccessDeniedScreen';

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
    return <AccessDeniedScreen onBack={handleBack} />;
  }

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
        <ManagementHeader onBack={handleBack} />
        <ManagementTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

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

