import React from 'react';
import { TrendingUpIcon, BookOpenIcon, UsersIcon, HeartIcon, ZapIcon, CoinsIcon, PickaxeIcon, ArrowRightLeftIcon } from 'lucide-react';
import { useGetMiningLoggingEnabled } from '../hooks/useQueries';

interface CommunityCategoriesProps {
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article' | '/management' | '/category' | '/landminer' | '/goldexchange', params?: any) => void;
}

const nftGameCategories = [
  {
    name: 'NFT市场',
    icon: CoinsIcon,
    description: '探索NFT交易和收藏品市场',
    color: 'from-purple-500 to-pink-500',
    emoji: '🎨',
    route: '/category' as const
  },
  {
    name: '土地矿工',
    icon: PickaxeIcon,
    description: '虚拟土地和挖矿游戏体验',
    color: 'from-amber-500 to-orange-500',
    emoji: '⛏️',
    route: '/landminer' as const
  },
  {
    name: '金币兑换',
    icon: ArrowRightLeftIcon,
    description: '将挖矿金币兑换成ICP代币',
    color: 'from-green-500 to-blue-500',
    emoji: '💱',
    route: '/goldexchange' as const
  }
];

const categories = [
  {
    name: '加密趋势',
    icon: TrendingUpIcon,
    description: '探索最新的加密货币和区块链趋势',
    color: 'from-dark-warning to-dark-accent',
    emoji: '📈',
    hidden: true // Hidden per user request
  },
  {
    name: '技术分享',
    icon: ZapIcon,
    description: '分享编程技术和开发经验',
    color: 'from-dark-primary to-dark-secondary',
    emoji: '💻'
  },
  {
    name: '人生经历',
    icon: HeartIcon,
    description: '记录生活中的点点滴滴',
    color: 'from-dark-error to-dark-warning',
    emoji: '💭'
  },
  {
    name: '学习笔记',
    icon: BookOpenIcon,
    description: '整理学习过程中的知识要点',
    color: 'from-dark-success to-dark-primary',
    emoji: '📚'
  },
  {
    name: '社区讨论',
    icon: UsersIcon,
    description: '参与社区热门话题讨论',
    color: 'from-dark-secondary to-dark-accent',
    emoji: '💬',
    hidden: true // Hidden per user request
  }
];

export default function CommunityCategories({ navigate }: CommunityCategoriesProps) {
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();

  const handleCategoryClick = (categoryName: string, route?: '/category' | '/landminer' | '/goldexchange') => {
    // Conditional logging based on backend log switch
    if (loggingEnabled) {
      console.log('CommunityCategories: 点击分类按钮', categoryName, 'route:', route);
    }
    
    // Prevent event bubbling and ensure proper navigation
    try {
      if (route === '/landminer') {
        if (loggingEnabled) {
          console.log('CommunityCategories: 导航到土地矿工游戏页面');
        }
        navigate('/landminer');
      } else if (route === '/goldexchange') {
        if (loggingEnabled) {
          console.log('CommunityCategories: 导航到金币兑换页面');
        }
        navigate('/goldexchange');
      } else {
        if (loggingEnabled) {
          console.log('CommunityCategories: 导航到分类页面', categoryName);
        }
        navigate('/category', { categoryName });
      }
    } catch (error) {
      console.error('CommunityCategories: 导航失败', error);
    }
  };

  // Filter out hidden categories
  const visibleCategories = categories.filter(category => !category.hidden);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h3 className="text-xl sm:text-2xl font-bold text-dark-text flex items-center mobile-text-lg">
          🏷️ 社区分类
        </h3>
        <div className="text-dark-text-secondary text-sm mobile-text-sm">
          探索不同主题的精彩内容
        </div>
      </div>

      {/* NFT&Game Section - Hidden per user request */}
      <div className="bg-dark-card backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-3 sm:border-4 border-gray-500 shadow-2xl" style={{ display: 'none' }}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">🎮</span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold text-dark-text global-font mobile-text-base">
            🎮 NFT&Game
          </h4>
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {nftGameCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (loggingEnabled) {
                    console.log('NFT&Game 按钮点击:', category.name, category.route);
                  }
                  handleCategoryClick(category.name, category.route);
                }}
                className={`bg-gradient-to-r ${category.color} hover:opacity-90 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center group border-2 border-gray-500 min-h-[70px] sm:min-h-[80px] flex flex-col items-center justify-center touch-target cursor-pointer`}
                type="button"
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-base sm:text-lg">{category.emoji}</span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-white global-font leading-tight mobile-text-xs">
                    {category.name}
                  </h5>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regular Categories Section - Equal width flexbox layout */}
      <div className="bg-dark-card backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-3 sm:border-4 border-gray-500 shadow-2xl">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {visibleCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (loggingEnabled) {
                    console.log('常规分类按钮点击:', category.name);
                  }
                  handleCategoryClick(category.name);
                }}
                className={`flex-1 min-w-[calc(50%-0.25rem)] sm:min-w-[calc(33.333%-0.5rem)] bg-gradient-to-r ${category.color} hover:opacity-90 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center group border-2 border-gray-500 min-h-[70px] sm:min-h-[80px] flex flex-col items-center justify-center touch-target cursor-pointer`}
                type="button"
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-base sm:text-lg">{category.emoji}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white global-font leading-tight mobile-text-xs">
                    {category.name}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
