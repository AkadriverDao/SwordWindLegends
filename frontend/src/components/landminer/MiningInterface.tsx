import React, { useState } from 'react';
import { PickaxeIcon, CoinsIcon, SkullIcon, AlertTriangleIcon, ClockIcon, LockIcon, SparklesIcon } from 'lucide-react';

interface Land {
  id: bigint;
  x: number;
  y: number;
  owner: string | null;
  occupiedAt: bigint | null;
}

interface MiningInterfaceProps {
  selectedLand: Land | null;
  onOccupyAndMine: (landId: bigint) => Promise<void>;
  onReviveCharacter: () => Promise<void>;
  currentUser?: string;
  isLoading: boolean;
  isMining: boolean;
  miningCountdown?: number | null;
  isCharacterAlive?: boolean;
}

export default function MiningInterface({ 
  selectedLand, 
  onOccupyAndMine,
  onReviveCharacter,
  currentUser, 
  isLoading,
  isMining,
  miningCountdown,
  isCharacterAlive = true
}: MiningInterfaceProps) {
  const [isOccupying, setIsOccupying] = useState(false);
  const [isReviving, setIsReviving] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const handleOccupyAndMine = async () => {
    if (!selectedLand || isOccupying || isMining || !isCharacterAlive) return;
    
    console.log('MiningInterface: 开始占领并挖矿', selectedLand.id.toString());
    setIsOccupying(true);
    setOperationError(null);
    
    try {
      await onOccupyAndMine(selectedLand.id);
      console.log('MiningInterface: 占领成功，挖矿已开始');
    } catch (error) {
      console.error('MiningInterface: 占领失败:', error);
      setOperationError(error instanceof Error ? error.message : '占领失败，请重试');
    } finally {
      setIsOccupying(false);
    }
  };

  const handleReviveCharacter = async () => {
    if (isCharacterAlive || isReviving) return;
    
    console.log('MiningInterface: 开始复活角色');
    setIsReviving(true);
    setOperationError(null);
    
    try {
      await onReviveCharacter();
      console.log('MiningInterface: 角色复活成功');
    } catch (error) {
      console.error('MiningInterface: 复活失败:', error);
      setOperationError(error instanceof Error ? error.message : '复活失败，请重试');
    } finally {
      setIsReviving(false);
    }
  };

  if (!selectedLand) {
    return (
      <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-400 text-2xl">🗺️</span>
        </div>
        <p className="text-dark-text font-bold global-font mb-2">选择一块土地</p>
        <p className="text-dark-text-secondary text-sm global-font">
          {!isCharacterAlive ? '角色死亡，请先复活后再选择土地' :
           isMining ? '挖矿期间无法选择其他土地' : 
           '点击地图上的土地查看详情和进行操作'}
        </p>
      </div>
    );
  }

  const isOwned = selectedLand.owner === currentUser;
  const isAvailable = !selectedLand.owner;
  const isOccupied = selectedLand.owner && selectedLand.owner !== currentUser;

  return (
    <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
      {/* Land Information */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🏞️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark-text global-font">
              土地 #{selectedLand.id.toString()}
            </h3>
            <p className="text-dark-text-secondary text-sm global-font">
              坐标: ({selectedLand.x}, {selectedLand.y})
            </p>
          </div>
        </div>

        {/* Land Status */}
        <div className={`p-4 rounded-xl border-2 ${
          isAvailable ? 'bg-green-500/20 border-green-500' :
          isOwned ? 'bg-blue-500/20 border-blue-500' :
          'bg-red-500/20 border-red-500'
        }`}>
          <div className="flex items-center space-x-2">
            {isAvailable && <span className="text-green-500 text-lg">🌱</span>}
            {isOwned && <span className="text-blue-500 text-lg">⛏️</span>}
            {isOccupied && <span className="text-red-500 text-lg">🏠</span>}
            <div>
              <p className={`font-bold global-font ${
                isAvailable ? 'text-green-500' :
                isOwned ? 'text-blue-500' :
                'text-red-500'
              }`}>
                {isAvailable ? '🌟 可占领土地' : isOwned ? '🏠 您的土地' : '🔒 已被占领'}
              </p>
              <p className="text-dark-text-secondary text-sm global-font">
                {isAvailable ? (!isCharacterAlive ? '角色死亡，无法占领' : '点击下方按钮占领并开始挖矿') :
                 isOwned ? '您拥有的土地' :
                 `被 ${selectedLand.owner} 占领`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Character Death Warning */}
      {!isCharacterAlive && (
        <div className="mb-6 bg-red-500/20 border-2 border-red-500 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <span className="text-red-500 text-2xl animate-pulse">💀</span>
            <div className="flex-1">
              <p className="text-red-500 font-bold global-font">角色已死亡</p>
              <p className="text-dark-text-secondary text-sm global-font">
                必须先复活角色才能进行挖矿操作
              </p>
            </div>
            <button
              onClick={handleReviveCharacter}
              disabled={isReviving}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center space-x-2 global-font text-sm touch-target"
            >
              {isReviving ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  <span>复活中...</span>
                </>
              ) : (
                <>
                  <SparklesIcon size={14} />
                  <span>复活</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mining Status Display */}
      {isMining && miningCountdown !== null && miningCountdown !== undefined && (
        <div className="mb-6 bg-amber-500/20 border-2 border-amber-500 rounded-xl p-4 animate-pulse">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
              <PickaxeIcon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-amber-500 font-bold global-font">⛏️ 挖矿进行中</p>
              <div className="flex items-center space-x-2">
                <ClockIcon size={14} className="text-amber-500" />
                <span className="text-amber-500 text-sm font-bold elegant-numbers">
                  {miningCountdown} 秒后完成
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((10 - miningCountdown) / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {operationError && (
        <div className="mb-6 bg-red-500/20 border-2 border-red-500 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangleIcon size={16} className="text-red-500" />
            <p className="text-red-500 font-bold text-sm global-font">
              {operationError}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        {isAvailable && (
          <button
            onClick={handleOccupyAndMine}
            disabled={isOccupying || isLoading || isMining || !isCharacterAlive}
            className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 global-font touch-target ${
              !isCharacterAlive 
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
            }`}
            type="button"
            title={!isCharacterAlive ? '角色死亡，无法挖矿' : '占领土地并开始挖矿'}
          >
            {isOccupying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>占领中...</span>
              </>
            ) : isMining ? (
              <>
                <LockIcon size={20} />
                <span>挖矿中，请等待</span>
              </>
            ) : !isCharacterAlive ? (
              <>
                <span className="text-lg">💀</span>
                <span>角色死亡，无法挖矿</span>
              </>
            ) : (
              <>
                <span className="text-lg">🏠</span>
                <PickaxeIcon size={20} />
                <span>占领并挖矿</span>
              </>
            )}
          </button>
        )}

        {/* Information for owned lands */}
        {isOwned && (
          <div className="bg-blue-500/20 border-2 border-blue-500 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-blue-500 text-2xl">🏠</span>
              <div>
                <p className="text-blue-500 font-bold global-font">您已拥有此土地</p>
                <p className="text-dark-text-secondary text-sm global-font">
                  {!isCharacterAlive ? '角色死亡，请先复活后再进行挖矿' :
                   isMining ? '正在其他土地挖矿，请等待完成' : 
                   '占领新土地可以立即开始挖矿'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Information for occupied lands */}
        {isOccupied && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-red-500 text-2xl">🔒</span>
              <div>
                <p className="text-red-500 font-bold global-font">土地已被占领</p>
                <p className="text-dark-text-secondary text-sm global-font">
                  此土地被其他用户占领，请选择其他可用土地
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Rules */}
      <div className="mt-6 bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-4 border-2 border-gray-500">
        <div className="flex items-start space-x-3">
          <span className="text-2xl shrink-0">📋</span>
          <div>
            <p className="text-dark-text font-bold global-font text-sm mb-2">游戏规则</p>
            <ul className="text-dark-text-secondary text-xs global-font space-y-1">
              <li>• 点击占领土地后立即开始10秒挖矿倒计时</li>
              <li>• 挖矿期间无法操作其他土地，确保专注挖矿</li>
              <li>• 倒计时结束后自动显示挖矿结果</li>
              <li>• 挖矿有三种结果：获得金币、空挖、遇到黑暗物质</li>
              <li>• 遇到黑暗物质会导致角色死亡，必须复活才能继续</li>
              <li>• 复活会重置所有游戏进度和金币</li>
              <li>• 所有游戏数据存储在区块链上</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
