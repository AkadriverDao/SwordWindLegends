import React from 'react';
import { RefreshCwIcon } from 'lucide-react';

interface CryptocurrencyHeaderProps {
  lastUpdated: Date | null;
  configurationLoaded: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function CryptocurrencyHeader({ 
  lastUpdated, 
  configurationLoaded, 
  isRefreshing, 
  onRefresh 
}: CryptocurrencyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
        <h4 className="text-lg font-bold text-dark-text global-font mobile-text-base">
          实时价格
        </h4>
        {lastUpdated && (
          <span className="text-dark-text-secondary text-sm global-font mobile-text-xs">
            更新于 {lastUpdated.toLocaleTimeString('zh-CN')}
          </span>
        )}
        {!configurationLoaded && (
          <span className="text-dark-warning text-sm global-font mobile-text-xs">
            配置加载中...
          </span>
        )}
      </div>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="p-2 bg-dark-surface hover:bg-dark-hover rounded-xl border-2 border-gray-500 transition-all duration-300 disabled:opacity-50 touch-target"
        title="刷新价格和配置"
      >
        <RefreshCwIcon size={16} className={`text-dark-text ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}

