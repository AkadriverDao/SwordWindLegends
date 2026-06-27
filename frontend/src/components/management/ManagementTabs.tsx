import React from 'react';
import { FilterIcon, ClockIcon, CheckCircleIcon, XCircleIcon, TrendingUpIcon, SettingsIcon } from 'lucide-react';

interface ManagementTabsProps {
  selectedTab: 'pending' | 'approved' | 'rejected' | 'all' | 'trading' | 'landminer';
  onTabChange: (tab: 'pending' | 'approved' | 'rejected' | 'all' | 'trading' | 'landminer') => void;
}

export default function ManagementTabs({ selectedTab, onTabChange }: ManagementTabsProps) {
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

  const tabs = [
    { key: 'pending', label: '未审核' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已拒绝' },
    { key: 'all', label: '全部' },
    { key: 'trading', label: '交易对管理' },
    { key: 'landminer', label: '土地矿工配置' },
  ];

  return (
    <div className="p-6 border-b-2 border-gray-500">
      <div className="flex justify-center">
        <div className="bg-dark-surface rounded-2xl p-2 border-3 border-gray-500 shadow-inner">
          <div className="flex space-x-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key as any)}
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
  );
}

