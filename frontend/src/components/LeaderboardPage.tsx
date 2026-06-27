import React from 'react';
import { useGetMiningLeaderboard, useGetUserProfile } from '../hooks/useUserQueries';
import { ArrowLeftIcon, TrophyIcon, CoinsIcon, CrownIcon, MedalIcon, AwardIcon, PickaxeIcon } from 'lucide-react';
import type { MiningLeaderboardEntry } from '../backend';

interface LeaderboardPageProps {
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article', params?: any) => void;
}

export default function LeaderboardPage({ navigate }: LeaderboardPageProps) {
  const { data: miningLeaderboard, isLoading: leaderboardLoading } = useGetMiningLeaderboard();

  const handleBack = () => {
    navigate('/');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <CrownIcon size={24} className="text-yellow-500" />;
      case 2:
        return <MedalIcon size={24} className="text-gray-400" />;
      case 3:
        return <AwardIcon size={24} className="text-amber-600" />;
      default:
        return <span className="text-gray-500 font-bold text-lg elegant-numbers">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-orange-500 border-yellow-500';
      case 2:
        return 'from-gray-400 to-gray-500 border-gray-400';
      case 3:
        return 'from-amber-500 to-orange-500 border-amber-500';
      default:
        return 'from-gray-500 to-gray-600 border-gray-500';
    }
  };

  const formatGoldAmount = (gold: bigint) => {
    return gold.toString();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
        {/* Header */}
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
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <TrophyIcon size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-dark-text global-font">
                  🏆 挖矿排行榜
                </h2>
              </div>
              <p className="text-dark-text-secondary font-medium global-font">查看矿工按挖矿金币数量排名</p>
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="p-8">
          {leaderboardLoading ? (
            <div className="text-center py-16">
              <div className="animate-bounce rounded-full h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mb-6 flex items-center justify-center">
                <PickaxeIcon size={24} className="text-white" />
              </div>
              <p className="text-dark-text text-xl font-bold global-font">加载挖矿排行榜中...</p>
            </div>
          ) : !miningLeaderboard || miningLeaderboard.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <PickaxeIcon size={32} className="text-gray-400" />
              </div>
              <p className="text-dark-text text-xl font-bold mb-2 global-font">暂无挖矿排行数据</p>
              <p className="text-dark-text-secondary text-lg global-font">等待矿工开始挖矿后显示排名</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border-3 border-gray-500 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <CoinsIcon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-dark-text mb-1 global-font">
                        ⛏️ 按挖矿金币排名
                      </h3>
                      <p className="text-dark-text-secondary font-medium global-font">
                        根据矿工挖矿获得的金币总数进行排名
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-500 elegant-numbers global-font">
                      {miningLeaderboard.length}
                    </div>
                    <div className="text-sm text-dark-text-secondary font-medium global-font">
                      位矿工
                    </div>
                  </div>
                </div>
              </div>

              {miningLeaderboard.map((entry, index) => {
                const rank = index + 1;
                const isTopThree = rank <= 3;
                
                return (
                  <MiningLeaderboardItem
                    key={entry.principal.toString()}
                    entry={entry}
                    rank={rank}
                    isTopThree={isTopThree}
                    getRankIcon={getRankIcon}
                    getRankBadgeColor={getRankBadgeColor}
                    formatGoldAmount={formatGoldAmount}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MiningLeaderboardItemProps {
  entry: MiningLeaderboardEntry;
  rank: number;
  isTopThree: boolean;
  getRankIcon: (rank: number) => React.ReactNode;
  getRankBadgeColor: (rank: number) => string;
  formatGoldAmount: (gold: bigint) => string;
}

function MiningLeaderboardItem({ 
  entry, 
  rank, 
  isTopThree, 
  getRankIcon, 
  getRankBadgeColor, 
  formatGoldAmount 
}: MiningLeaderboardItemProps) {
  const { data: userProfile } = useGetUserProfile(entry.principal);

  return (
    <div
      className={`bg-dark-surface backdrop-blur-sm rounded-2xl shadow-lg border-3 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-gray-500`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Rank Badge */}
          <div className={`w-16 h-16 bg-gradient-to-r ${getRankBadgeColor(rank)} rounded-full flex items-center justify-center shadow-lg border-3`}>
            {getRankIcon(rank)}
          </div>
          
          {/* User Info */}
          <div>
            <h3 className="text-xl font-bold text-dark-text mb-1 global-font">
              {userProfile?.name || '神秘矿工'}
            </h3>
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="flex items-center space-x-1">
                <CoinsIcon size={16} />
                <span className="font-medium global-font elegant-numbers">{formatGoldAmount(entry.gold)} 枚金币</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Metric */}
        <div className="text-right">
          <div className="bg-yellow-500/20 border-yellow-500 px-4 py-2 rounded-xl border-2">
            <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center space-x-2 elegant-numbers">
              <CoinsIcon size={20} />
              <span className="global-font">
                {formatGoldAmount(entry.gold)}
              </span>
            </div>
            <div className="text-sm text-yellow-600 font-medium global-font">
              挖矿金币
            </div>
          </div>
        </div>
      </div>

      {/* Special Effects for Top 3 */}
      {isTopThree && (
        <div className="mt-4 pt-4 border-t-2 border-gray-500">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border-2 border-yellow-500">
              <span className="text-yellow-500 font-bold text-sm global-font">
                {rank === 1 && '🎉 挖矿冠军！'}
                {rank === 2 && '🥈 挖矿亚军！'}
                {rank === 3 && '🥉 挖矿季军！'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
