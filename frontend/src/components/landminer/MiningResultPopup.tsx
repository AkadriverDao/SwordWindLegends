import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XIcon, CoinsIcon, AlertTriangleIcon } from 'lucide-react';

interface MiningResult {
  outcome: 'gold' | 'empty' | 'dark_matter';
  goldCoins: number;
  message: string;
  landId: number;
}

interface MiningResultPopupProps {
  result: MiningResult;
  currentGoldBalance: number;
  onClose: () => void;
}

export default function MiningResultPopup({ result, currentGoldBalance, onClose }: MiningResultPopupProps) {
  // Auto-trigger gold celebration effects for gold results
  useEffect(() => {
    if (result.outcome === 'gold') {
      console.log('显示金币获得结果弹窗，金币数量:', result.goldCoins, '当前余额:', currentGoldBalance);
      
      // Add celebration class to body for global effects
      document.body.classList.add('gold-celebration-active');
      
      // Remove after animation
      const timer = setTimeout(() => {
        document.body.classList.remove('gold-celebration-active');
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        document.body.classList.remove('gold-celebration-active');
      };
    }
  }, [result.outcome, result.goldCoins, currentGoldBalance]);

  const getResultIcon = () => {
    switch (result.outcome) {
      case 'gold':
        return <span className="text-6xl animate-bounce gold-sparkle">💰</span>;
      case 'empty':
        return <span className="text-6xl animate-pulse">🕳️</span>;
      case 'dark_matter':
        return <span className="text-6xl animate-bounce dark-matter-warning">💀</span>;
    }
  };

  const getResultColor = () => {
    switch (result.outcome) {
      case 'gold':
        return 'from-yellow-500 to-orange-500';
      case 'empty':
        return 'from-gray-500 to-gray-600';
      case 'dark_matter':
        return 'from-red-500 to-red-600';
    }
  };

  const getResultTitle = () => {
    switch (result.outcome) {
      case 'gold':
        return `🎉 恭喜！获得 ${result.goldCoins} 枚金币！`;
      case 'empty':
        return '😔 什么都没挖到';
      case 'dark_matter':
        return '💀 危险！挖到黑暗物质！';
    }
  };

  const getResultDescription = () => {
    switch (result.outcome) {
      case 'gold':
        return `您在土地 #${result.landId} 成功挖到了 ${result.goldCoins} 枚珍贵的金币！这块土地还可以继续挖矿获得更多财富。您的金币余额已实时更新至 ${currentGoldBalance} 枚，请查看游戏控制台中的最新余额显示。`;
      case 'empty':
        return `土地 #${result.landId} 这次没有收获，不要灰心，可以再次挖矿试试运气！`;
      case 'dark_matter':
        return `土地 #${result.landId} 潜藏着危险的黑暗物质，您的角色已死亡，金币已清零。需要复活后重新开始游戏。`;
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-modal">
      <div className={`bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500 w-full max-w-md animate-bounce-fun ${
        result.outcome === 'gold' ? 'ring-4 ring-yellow-300 shadow-yellow-500/50' : ''
      }`}>
        {/* Header */}
        <div className={`p-6 border-b-4 border-gray-500 bg-gradient-to-r ${getResultColor()} rounded-t-3xl ${
          result.outcome === 'gold' ? 'animate-pulse' : ''
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-lg ${
                result.outcome === 'gold' ? 'animate-bounce' : ''
              }`}>
                {result.outcome === 'gold' && <CoinsIcon size={24} className="text-white" />}
                {result.outcome === 'empty' && <span className="text-white text-xl">🕳️</span>}
                {result.outcome === 'dark_matter' && <AlertTriangleIcon size={24} className="text-white" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white global-font">⛏️ 挖矿结果</h3>
                <p className="text-white/90 font-medium global-font">土地 #{result.landId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 border-2 border-white/30 bg-white/10 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <XIcon size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          {/* Result Icon */}
          <div className="flex justify-center">
            {getResultIcon()}
          </div>

          {/* Result Title */}
          <div>
            <h4 className="text-2xl font-bold text-dark-text mb-3 global-font">
              {getResultTitle()}
            </h4>
            <p className="text-dark-text-secondary text-lg leading-relaxed global-font">
              {getResultDescription()}
            </p>
          </div>

          {/* Enhanced Gold Coins Display */}
          {result.outcome === 'gold' && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 border-4 border-yellow-500 rounded-2xl p-6 shadow-2xl animate-pulse">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CoinsIcon size={32} className="text-white animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-4xl global-font elegant-numbers mb-2 animate-bounce">
                    +{result.goldCoins} 金币
                  </p>
                  <p className="text-white/90 text-xl font-bold global-font mb-1 animate-pulse">
                    🎉 挖矿成功！
                  </p>
                  <p className="text-white/80 text-sm global-font">
                    系统随机生成，已添加到您的账户
                  </p>
                  <p className="text-white/90 text-lg global-font font-bold mt-3 bg-white/20 rounded-lg p-3">
                    💰 当前金币余额: {currentGoldBalance} 枚
                  </p>
                  <p className="text-white/90 text-sm global-font font-bold mt-2 bg-white/20 rounded-lg p-2">
                    ✨ 余额已实时更新！请查看游戏控制台
                  </p>
                </div>
              </div>
              
              {/* Enhanced gold coin celebration animation */}
              <div className="mt-4 flex justify-center space-x-2">
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0s' }}>💰</span>
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>💰</span>
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>🎉</span>
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0.8s' }}>💰</span>
              </div>
            </div>
          )}

          {/* Empty Mining Encouragement */}
          {result.outcome === 'empty' && (
            <div className="bg-blue-500/20 border-2 border-blue-500 rounded-2xl p-4">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-blue-500 text-2xl">🔄</span>
                <div>
                  <p className="text-blue-500 font-bold text-lg global-font">
                    可以再次挖矿
                  </p>
                  <p className="text-dark-text-secondary text-sm global-font">
                    每次挖矿都是新的随机机会！
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dark Matter Warning */}
          {result.outcome === 'dark_matter' && (
            <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-4">
              <div className="flex items-center justify-center space-x-3">
                <AlertTriangleIcon size={24} className="text-red-500" />
                <div>
                  <p className="text-red-500 font-bold text-lg global-font">
                    角色死亡，金币清零
                  </p>
                  <p className="text-dark-text-secondary text-sm global-font">
                    系统随机事件，您需要复活角色才能继续游戏
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Button */}
          <button
            onClick={onClose}
            className={`w-full bg-gradient-to-r ${getResultColor()} hover:opacity-90 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 global-font text-lg ${
              result.outcome === 'gold' ? 'animate-pulse' : ''
            }`}
          >
            {result.outcome === 'dark_matter' ? '💀 确认死亡状态' : 
             result.outcome === 'gold' ? `✅ 确认收获 ${result.goldCoins} 金币` : 
             '✅ 确认'}
          </button>
        </div>

        {/* Footer */}
        <div className={`p-4 bg-gradient-to-r ${getResultColor()}/20 border-t-4 border-gray-500 rounded-b-3xl`}>
          <div className="text-center">
            <p className="text-dark-text-secondary text-sm font-medium global-font">
              {result.outcome === 'gold' && `🎉 继续挖矿获得更多金币！每块土地都可以多次挖矿！您的金币余额已实时更新至 ${currentGoldBalance} 枚，请查看游戏控制台！`}
              {result.outcome === 'empty' && '💪 不要放弃，再次挖矿一定会有奖励！'}
              {result.outcome === 'dark_matter' && '⚠️ 挖矿有风险，探索需谨慎！复活后可以重新开始！'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
