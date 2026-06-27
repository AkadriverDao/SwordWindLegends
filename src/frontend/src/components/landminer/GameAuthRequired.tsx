import { AlertTriangleIcon, ArrowLeftIcon, PickaxeIcon } from "lucide-react";
import React from "react";

interface GameAuthRequiredProps {
  onBack: () => void;
}

export default function GameAuthRequired({ onBack }: GameAuthRequiredProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
        <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <button
              type="button"
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
              <p className="text-dark-text-secondary font-medium global-font">
                虚拟土地挖矿游戏
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertTriangleIcon size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-dark-text mb-4 global-font">
            🔐 需要登录
          </h3>
          <p className="text-dark-text-secondary text-lg mb-6 global-font">
            请先登录您的账户才能参与土地矿工游戏
          </p>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font"
          >
            返回首页登录
          </button>
        </div>
      </div>
    </div>
  );
}
