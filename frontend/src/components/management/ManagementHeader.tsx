import React from 'react';
import { ArrowLeftIcon, ShieldIcon, TrendingUpIcon } from 'lucide-react';

interface ManagementHeaderProps {
  onBack: () => void;
}

export default function ManagementHeader({ onBack }: ManagementHeaderProps) {
  return (
    <>
      <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110"
          >
            <ArrowLeftIcon size={20} className="text-dark-text" />
          </button>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-dark-error to-dark-warning rounded-full flex items-center justify-center shadow-lg">
                <ShieldIcon size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-dark-text">
                ⚙️ 超级管理员控制台
              </h2>
            </div>
            <p className="text-dark-text-secondary font-medium">文章审核管理、交易对配置和土地矿工游戏设置</p>
          </div>
        </div>
      </div>

      <div className="p-6 border-b-2 border-gray-500">
        <div className="bg-gradient-to-r from-dark-success/20 to-dark-primary/20 rounded-2xl p-4 border-3 border-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-dark-success to-dark-primary rounded-full flex items-center justify-center shadow-lg">
                <ShieldIcon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark-text mb-1">
                  🛡️ 超级管理员身份已确认
                </h3>
                <p className="text-dark-text-secondary font-medium">
                  您拥有完整的文章审核权限、交易对配置权限和土地矿工游戏配置权限
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-dark-primary/20 px-4 py-2 rounded-xl border-2 border-gray-500">
              <TrendingUpIcon size={16} className="text-dark-primary" />
              <span className="text-dark-primary font-bold">超级管理员</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

