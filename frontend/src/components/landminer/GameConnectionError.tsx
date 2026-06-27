import React from 'react';
import { ArrowLeftIcon, PickaxeIcon, AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';

interface GameConnectionErrorProps {
  onBack: () => void;
  onRetry: () => void;
  error: string | null;
}

export default function GameConnectionError({ onBack, onRetry, error }: GameConnectionErrorProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
        <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110"
            >
              <ArrowLeftIcon size={20} className="text-dark-text" />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <PickaxeIcon size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-dark-text global-font">
                  ⛏️ 土地矿工
                </h2>
              </div>
              <p className="text-dark-text-secondary font-medium global-font">虚拟土地挖矿游戏</p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertTriangleIcon size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-dark-text mb-4 global-font">
            🚫 游戏服务器连接失败
          </h3>
          <p className="text-dark-text-secondary text-lg mb-6 global-font">
            {error || '无法连接到游戏服务器，游戏模块可能尚未部署或接口不匹配'}
          </p>
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangleIcon size={20} className="text-red-500" />
              <div className="text-left">
                <p className="text-red-500 font-bold text-sm global-font mb-2">
                  可能的问题：
                </p>
                <ul className="text-red-500 text-sm global-font space-y-1">
                  <li>• 游戏服务器尚未部署</li>
                  <li>• 游戏接口未正确配置</li>
                  <li>• 网络连接问题</li>
                  <li>• 游戏系统未正确初始化</li>
                  <li>• 服务器配置错误</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font"
            >
              返回首页
            </button>
            <button 
              onClick={onRetry}
              className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font flex items-center space-x-2"
            >
              <RefreshCwIcon size={16} />
              <span>重试连接</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
