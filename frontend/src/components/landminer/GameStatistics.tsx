import React from 'react';
import { BarChart3Icon, UsersIcon, TrendingUpIcon, CoinsIcon } from 'lucide-react';

interface GameStatistics {
  totalLands: number;
  totalMiners: number;
  totalMiningOperations: number;
  totalGoldMined: number;
}

interface GameStatisticsProps {
  statistics: GameStatistics | null;
  isLoading: boolean;
}

export default function GameStatistics({ statistics, isLoading }: GameStatisticsProps) {
  if (isLoading) {
    return (
      <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-theme-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-dark-text-secondary global-font">加载游戏统计中...</p>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6 text-center">
        <BarChart3Icon size={32} className="text-gray-500 mx-auto mb-4" />
        <p className="text-dark-text-secondary global-font">暂无统计数据</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <BarChart3Icon size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-dark-text global-font">📊 游戏统计</h3>
          <p className="text-dark-text-secondary text-sm global-font">全服务器游戏数据</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-500 text-lg">🗺️</span>
            <span className="text-dark-text font-bold text-sm global-font">总土地</span>
          </div>
          <div className="text-2xl font-bold text-green-500 elegant-numbers">
            {statistics.totalLands}
          </div>
        </div>

        <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
          <div className="flex items-center space-x-2 mb-2">
            <UsersIcon size={16} className="text-purple-500" />
            <span className="text-dark-text font-bold text-sm global-font">矿工数</span>
          </div>
          <div className="text-2xl font-bold text-purple-500 elegant-numbers">
            {statistics.totalMiners}
          </div>
        </div>

        <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUpIcon size={16} className="text-orange-500" />
            <span className="text-dark-text font-bold text-sm global-font">挖矿次数</span>
          </div>
          <div className="text-2xl font-bold text-orange-500 elegant-numbers">
            {statistics.totalMiningOperations}
          </div>
        </div>

        <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
          <div className="flex items-center space-x-2 mb-2">
            <CoinsIcon size={16} className="text-yellow-500" />
            <span className="text-dark-text font-bold text-sm global-font">总金币</span>
          </div>
          <div className="text-2xl font-bold text-yellow-500 elegant-numbers">
            {statistics.totalGoldMined}
          </div>
        </div>
      </div>

      {/* Total Gold Mined */}
      <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border-2 border-yellow-500">
        <div className="flex items-center space-x-3">
          <CoinsIcon size={20} className="text-yellow-500" />
          <div>
            <p className="text-yellow-500 font-bold global-font">
              全服总金币: {statistics.totalGoldMined}
            </p>
            <p className="text-dark-text-secondary text-xs global-font">
              所有矿工累计挖掘的金币数量
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
