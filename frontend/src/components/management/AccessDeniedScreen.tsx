import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';

interface AccessDeniedScreenProps {
  onBack: () => void;
}

export default function AccessDeniedScreen({ onBack }: AccessDeniedScreenProps) {
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
          onClick={onBack}
          className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          返回首页
        </button>
      </div>
    </div>
  );
}

