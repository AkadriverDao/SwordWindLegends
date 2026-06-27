import React from 'react';
import { ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';

interface ReviewToggleProps {
  submittedForReview: boolean;
  onToggle: () => void;
}

export default function ReviewToggle({ submittedForReview, onToggle }: ReviewToggleProps) {
  return (
    <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-dark-text mb-2 flex items-center">
            🔍 提交审核
          </h3>
          <p className="text-dark-text-secondary font-medium">
            {submittedForReview 
              ? '✅ 将提交给管理员审核，通过后在主页显示' 
              : '📝 保存为私人文章，仅您和选择的分类区可看。'
            }
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
            submittedForReview
              ? 'bg-gradient-to-r from-dark-success to-dark-primary text-white'
              : 'bg-dark-surface border-2 border-gray-500 text-dark-text hover:bg-dark-hover'
          }`}
        >
          {submittedForReview ? (
            <>
              <ToggleRightIcon size={20} />
              <span>提交审核</span>
            </>
          ) : (
            <>
              <ToggleLeftIcon size={20} />
              <span>私人</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

