import React from 'react';
import { TagIcon } from 'lucide-react';

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const AVAILABLE_CATEGORIES = [
  { value: '技术分享', label: '技术分享', emoji: '💻' },
  { value: '学习笔记', label: '学习笔记', emoji: '📚' },
  { value: '人生经历', label: '人生经历', emoji: '💭' },
  { value: 'NFT市场', label: 'NFT市场', emoji: '🎨' },
  { value: '土地矿工', label: '土地矿工', emoji: '⛏️' },
];

export default function CategorySelector({ selectedCategories, onCategoryToggle }: CategorySelectorProps) {
  return (
    <div>
      <label className="flex items-center text-lg font-bold text-dark-text mb-3">
        <TagIcon size={20} className="mr-2" />
        🏷️ 分类标签
      </label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_CATEGORIES.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onCategoryToggle(category.value)}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border-2 hover:scale-105 ${
              selectedCategories.includes(category.value)
                ? 'bg-green-500 text-white border-green-500 shadow-lg'
                : 'bg-dark-surface text-dark-text border-gray-500 hover:bg-dark-hover'
            }`}
          >
            <span className="mr-1">{category.emoji}</span>
            {category.label}
          </button>
        ))}
      </div>
      <p className="text-dark-text-secondary text-sm mt-2 font-medium">
        选择适合的分类标签，可以选择多个
      </p>
    </div>
  );
}

