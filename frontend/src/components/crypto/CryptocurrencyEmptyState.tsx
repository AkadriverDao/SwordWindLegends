import React from 'react';
import { AlertCircleIcon } from 'lucide-react';

interface CryptocurrencyEmptyStateProps {
  message: string;
}

export default function CryptocurrencyEmptyState({ message }: CryptocurrencyEmptyStateProps) {
  const getDescription = () => {
    if (message.includes('暂无交易对配置')) {
      return '超级管理员尚未配置任何交易对。请联系管理员在管理系统中添加交易对配置。';
    } else if (message.includes('暂无启用的交易对')) {
      return '所有交易对都已被禁用。请联系管理员在管理系统中启用交易对。';
    }
    return '请联系管理员配置交易对。';
  };

  return (
    <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-4 sm:p-6 text-center">
      <AlertCircleIcon size={32} className="text-dark-warning mx-auto mb-4" />
      <p className="text-dark-text font-bold mb-2 global-font mobile-text-base">{message}</p>
      <p className="text-dark-text-secondary text-sm global-font mobile-text-sm">
        {getDescription()}
      </p>
    </div>
  );
}

