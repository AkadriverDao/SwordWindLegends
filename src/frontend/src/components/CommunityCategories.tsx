import { BookOpenIcon, HeartIcon, ZapIcon } from "lucide-react";

interface CommunityCategoriesProps {
  navigate: (
    route:
      | "/"
      | "/profile"
      | "/leaderboard"
      | "/customize"
      | "/article"
      | "/management"
      | "/category"
      | "/landminer"
      | "/goldexchange",
    params?: { categoryName?: string },
  ) => void;
}

const categories = [
  {
    name: "技术分享",
    icon: ZapIcon,
    description: "分享编程技术和开发经验",
    color: "from-dark-primary to-dark-secondary",
    emoji: "💻",
  },
  {
    name: "人生经历",
    icon: HeartIcon,
    description: "记录生活中的点点滴滴",
    color: "from-dark-error to-dark-warning",
    emoji: "💭",
  },
  {
    name: "学习笔记",
    icon: BookOpenIcon,
    description: "整理学习过程中的知识要点",
    color: "from-dark-success to-dark-primary",
    emoji: "📚",
  },
];

export default function CommunityCategories({
  navigate,
}: CommunityCategoriesProps) {
  const handleCategoryClick = (categoryName: string) => {
    try {
      navigate("/category", { categoryName });
    } catch (error) {
      console.error("CommunityCategories: 导航失败", error);
    }
  };

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

      {/* Regular Categories Section - Equal width flexbox layout */}
      <div className="bg-dark-card backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-3 sm:border-4 border-gray-500 shadow-2xl">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category) => {
            const _IconComponent = category.icon;
            return (
              <button
                key={category.name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCategoryClick(category.name);
                }}
                className={`flex-1 min-w-[calc(50%-0.25rem)] sm:min-w-[calc(33.333%-0.5rem)] bg-gradient-to-r ${category.color} hover:opacity-90 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-center group border-2 border-gray-500 min-h-[70px] sm:min-h-[80px] flex flex-col items-center justify-center touch-target cursor-pointer`}
                type="button"
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-base sm:text-lg">
                      {category.emoji}
                    </span>
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
