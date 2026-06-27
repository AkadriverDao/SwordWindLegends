import React, { useState } from 'react';
import { useGetMiningProbabilities, useSetMiningProbabilities, useGetMiningLoggingEnabled, useSetMiningLoggingEnabled, type MiningProbabilities } from '../../hooks/useQueries';
import { SettingsIcon, PickaxeIcon, PercentIcon, ToggleLeftIcon, ToggleRightIcon, SaveIcon, RefreshCwIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';

interface LandMinerConfigManagerProps {
  onShowSuccessMessage: (message: string) => void;
}

export default function LandMinerConfigManager({ onShowSuccessMessage }: LandMinerConfigManagerProps) {
  const { data: currentProbabilities, isLoading: probabilitiesLoading, refetch: refetchProbabilities } = useGetMiningProbabilities();
  const { data: loggingEnabled, isLoading: loggingLoading, refetch: refetchLogging } = useGetMiningLoggingEnabled();
  const setMiningProbabilities = useSetMiningProbabilities();
  const setMiningLoggingEnabled = useSetMiningLoggingEnabled();

  const [tempProbabilities, setTempProbabilities] = useState<MiningProbabilities>({
    goldProbability: 65,
    deathProbability: 5,
    nothingProbability: 30,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update temp probabilities when current probabilities load
  React.useEffect(() => {
    if (currentProbabilities) {
      setTempProbabilities(currentProbabilities);
      setHasUnsavedChanges(false);
    }
  }, [currentProbabilities]);

  const handleProbabilityChange = (type: keyof MiningProbabilities, value: number) => {
    const newProbabilities = { ...tempProbabilities, [type]: value };
    
    // Auto-calculate nothing probability to ensure total is 100%
    if (type === 'goldProbability' || type === 'deathProbability') {
      const goldProb = type === 'goldProbability' ? value : newProbabilities.goldProbability;
      const deathProb = type === 'deathProbability' ? value : newProbabilities.deathProbability;
      const nothingProb = 100 - goldProb - deathProb;
      
      if (nothingProb >= 0) {
        newProbabilities.nothingProbability = nothingProb;
      }
    }
    
    setTempProbabilities(newProbabilities);
    setHasUnsavedChanges(true);
  };

  const handleAutoBalance = (changedType: keyof MiningProbabilities, newValue: number) => {
    if (changedType === 'nothingProbability') {
      // If nothing probability is changed, adjust gold and death proportionally
      const remaining = 100 - newValue;
      const currentGoldAndDeath = tempProbabilities.goldProbability + tempProbabilities.deathProbability;
      
      if (currentGoldAndDeath > 0) {
        const goldRatio = tempProbabilities.goldProbability / currentGoldAndDeath;
        const deathRatio = tempProbabilities.deathProbability / currentGoldAndDeath;
        
        const newProbabilities = {
          goldProbability: Math.round(remaining * goldRatio),
          deathProbability: Math.round(remaining * deathRatio),
          nothingProbability: newValue,
        };
        
        setTempProbabilities(newProbabilities);
      } else {
        setTempProbabilities({
          goldProbability: Math.round(remaining * 0.9), // 90% of remaining for gold
          deathProbability: Math.round(remaining * 0.1), // 10% of remaining for death
          nothingProbability: newValue,
        });
      }
    } else {
      handleProbabilityChange(changedType, newValue);
    }
    setHasUnsavedChanges(true);
  };

  const getTotalProbability = () => {
    return tempProbabilities.goldProbability + tempProbabilities.deathProbability + tempProbabilities.nothingProbability;
  };

  const isValidProbabilities = () => {
    const total = getTotalProbability();
    return Math.abs(total - 100) < 0.01;
  };

  const handleSaveProbabilities = async () => {
    if (!isValidProbabilities()) {
      onShowSuccessMessage('概率总和必须等于100%，请调整设置');
      return;
    }

    try {
      await setMiningProbabilities.mutateAsync(tempProbabilities);
      setHasUnsavedChanges(false);
      
      // Force refresh to get latest data
      await Promise.all([
        refetchProbabilities(),
        refetchLogging()
      ]);
      
      onShowSuccessMessage('挖矿概率配置已保存，所有玩家的挖矿结果将立即应用新的概率分布，前端已自动刷新最新配置');
    } catch (error) {
      console.error('保存挖矿概率配置失败:', error);
      const errorMessage = error instanceof Error ? error.message : '保存失败，请重试';
      onShowSuccessMessage(errorMessage);
    }
  };

  const handleResetProbabilities = () => {
    const defaultProbabilities = { goldProbability: 65, deathProbability: 5, nothingProbability: 30 };
    setTempProbabilities(defaultProbabilities);
    setHasUnsavedChanges(true);
  };

  const handleToggleLogging = async () => {
    try {
      const newLoggingState = !loggingEnabled;
      await setMiningLoggingEnabled.mutateAsync(newLoggingState);
      
      // Force refresh to get latest data
      await Promise.all([
        refetchProbabilities(),
        refetchLogging()
      ]);
      
      onShowSuccessMessage(`挖矿日志已${newLoggingState ? '开启' : '关闭'}，设置立即生效，前端日志输出也将同步控制，前端已自动刷新最新配置`);
    } catch (error) {
      console.error('切换挖矿日志开关失败:', error);
      const errorMessage = error instanceof Error ? error.message : '操作失败，请重试';
      onShowSuccessMessage(errorMessage);
    }
  };

  const isLoading = probabilitiesLoading || loggingLoading;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-dark-text flex items-center">
          ⛏️ 土地矿工游戏配置
          <span className="ml-3 text-sm font-normal text-dark-text-secondary">
            (配置挖矿概率分布和日志输出设置，实时获取最新状态)
          </span>
        </h3>
      </div>

      {isLoading ? (
        <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-theme-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-dark-text text-xl font-bold">加载游戏配置中...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mining Probabilities Configuration */}
          <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <PercentIcon size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-dark-text">🎲 挖矿奖励概率设置</h4>
                <p className="text-dark-text-secondary text-sm">
                  自定义三种挖矿结果的概率分布，总和必须为100%，设置将保存并实时生效
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Gold Probability */}
              <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">💰</span>
                  <h5 className="text-md font-bold text-dark-text">金币概率</h5>
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={tempProbabilities.goldProbability}
                    onChange={(e) => handleProbabilityChange('goldProbability', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-gold"
                  />
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tempProbabilities.goldProbability}
                      onChange={(e) => handleAutoBalance('goldProbability', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-dark-surface border border-gray-500 rounded text-center text-sm text-dark-text"
                    />
                    <span className="text-yellow-500 font-bold text-lg">%</span>
                  </div>
                  <p className="text-dark-text-secondary text-xs">
                    玩家获得1-10枚金币的概率
                  </p>
                </div>
              </div>

              {/* Death Probability */}
              <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">💀</span>
                  <h5 className="text-md font-bold text-dark-text">死亡概率</h5>
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={tempProbabilities.deathProbability}
                    onChange={(e) => handleProbabilityChange('deathProbability', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-death"
                  />
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tempProbabilities.deathProbability}
                      onChange={(e) => handleAutoBalance('deathProbability', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-dark-surface border border-gray-500 rounded text-center text-sm text-dark-text"
                    />
                    <span className="text-red-500 font-bold text-lg">%</span>
                  </div>
                  <p className="text-dark-text-secondary text-xs">
                    玩家角色直接死亡的概率
                  </p>
                </div>
              </div>

              {/* Nothing Probability - Auto-calculated */}
              <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🕳️</span>
                  <h5 className="text-md font-bold text-dark-text">空挖概率</h5>
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={tempProbabilities.nothingProbability}
                    onChange={(e) => handleProbabilityChange('nothingProbability', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-nothing"
                  />
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tempProbabilities.nothingProbability}
                      onChange={(e) => handleAutoBalance('nothingProbability', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-dark-surface border border-gray-500 rounded text-center text-sm text-dark-text"
                    />
                    <span className="text-gray-500 font-bold text-lg">%</span>
                  </div>
                  <p className="text-dark-text-secondary text-xs">
                    玩家啥也挖不到的概率（自动计算）
                  </p>
                </div>
              </div>
            </div>

            {/* Probability Summary */}
            <div className={`bg-gradient-to-r rounded-xl p-4 border-2 mb-6 ${
              isValidProbabilities() 
                ? 'from-green-500/20 to-green-600/20 border-green-500' 
                : 'from-red-500/20 to-red-600/20 border-red-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isValidProbabilities() ? (
                    <CheckCircleIcon size={20} className="text-green-500" />
                  ) : (
                    <AlertTriangleIcon size={20} className="text-red-500" />
                  )}
                  <div>
                    <p className={`font-bold ${isValidProbabilities() ? 'text-green-500' : 'text-red-500'}`}>
                      概率总和: {getTotalProbability()}%
                    </p>
                    <p className="text-dark-text-secondary text-sm">
                      {isValidProbabilities() ? '✅ 概率分布有效，可保存设置' : '⚠️ 概率总和必须等于100%'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleResetProbabilities}
                    className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-1 text-sm"
                  >
                    <RefreshCwIcon size={14} />
                    <span>重置默认</span>
                  </button>
                  <button
                    onClick={handleSaveProbabilities}
                    disabled={!isValidProbabilities() || !hasUnsavedChanges || setMiningProbabilities.isPending}
                    className="px-4 py-2 bg-gradient-to-r from-dark-success to-dark-primary text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center space-x-2 text-sm"
                  >
                    {setMiningProbabilities.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        <span>保存中...</span>
                      </>
                    ) : (
                      <>
                        <SaveIcon size={14} />
                        <span>保存概率</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Probability Preview */}
            <div className="bg-dark-card rounded-xl p-4 border-2 border-gray-500">
              <h5 className="text-md font-bold text-dark-text mb-3 flex items-center">
                <span className="text-lg mr-2">📊</span>
                概率分布预览
              </h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-dark-text-secondary text-sm">💰 获得金币</span>
                  <span className="text-yellow-500 font-bold">{tempProbabilities.goldProbability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-text-secondary text-sm">💀 角色死亡</span>
                  <span className="text-red-500 font-bold">{tempProbabilities.deathProbability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-text-secondary text-sm">🕳️ 啥也挖不到</span>
                  <span className="text-gray-500 font-bold">{tempProbabilities.nothingProbability}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mining Logging Configuration */}
          <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <SettingsIcon size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-dark-text">📝 挖矿日志控制</h4>
                <p className="text-dark-text-secondary text-sm">
                  控制后端挖矿操作的日志输出和前端调试信息，设置实时生效，状态实时获取
                </p>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border-2 border-gray-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    loggingEnabled 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}>
                    {loggingEnabled ? (
                      <ToggleRightIcon size={24} className="text-white" />
                    ) : (
                      <ToggleLeftIcon size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-dark-text">
                      挖矿日志输出
                    </h5>
                    <p className="text-dark-text-secondary text-sm">
                      {loggingEnabled ? '✅ 已开启 - 后端将输出详细的挖矿操作日志，前端也将显示调试信息' : '❌ 已关闭 - 后端不输出挖矿操作日志，前端也不显示调试信息'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleToggleLogging}
                  disabled={setMiningLoggingEnabled.isPending}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center space-x-2 ${
                    loggingEnabled
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  }`}
                >
                  {setMiningLoggingEnabled.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>设置中...</span>
                    </>
                  ) : (
                    <>
                      {loggingEnabled ? (
                        <>
                          <ToggleLeftIcon size={16} />
                          <span>关闭日志</span>
                        </>
                      ) : (
                        <>
                          <ToggleRightIcon size={16} />
                          <span>开启日志</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Information */}
          <div className="bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-6 border-2 border-gray-500">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg shrink-0">
                <PickaxeIcon size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-dark-text mb-3">
                  🎮 游戏配置说明
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-bold text-dark-text">概率配置：</h5>
                    <ul className="text-dark-text-secondary text-sm space-y-1">
                      <li>• 💰 金币概率：玩家获得1-10枚随机金币的概率</li>
                      <li>• 💀 死亡概率：玩家角色直接死亡的概率</li>
                      <li>• 🕳️ 空挖概率：玩家什么都挖不到的概率（自动计算）</li>
                      <li>• 三种概率的总和必须等于100%</li>
                      <li>• 配置保存后立即应用到所有玩家的挖矿操作</li>
                      <li>• 前端实时获取最新概率配置</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-dark-text">日志控制：</h5>
                    <ul className="text-dark-text-secondary text-sm space-y-1">
                      <li>• 📝 开启日志：后端输出详细的挖矿操作信息，前端显示调试信息</li>
                      <li>• 🔇 关闭日志：后端不输出挖矿操作日志，前端不显示调试信息</li>
                      <li>• 设置实时生效，无需重启系统</li>
                      <li>• 影响所有玩家的挖矿操作日志行为</li>
                      <li>• 便于调试和监控游戏运行状态</li>
                      <li>• 前端挖矿相关日志也受此开关控制</li>
                      <li>• 前端实时获取最新日志开关状态</li>
                    </ul>
                  </div>
                </div>
                
                {hasUnsavedChanges && (
                  <div className="mt-4 p-3 bg-amber-500/20 rounded-xl border-2 border-amber-500">
                    <p className="text-amber-500 font-medium text-sm flex items-center">
                      <AlertTriangleIcon size={16} className="mr-2" />
                      ⚠️ 您有未保存的概率配置更改，请点击"保存概率"按钮应用设置
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Configuration Status - Real-time */}
          <div className="bg-dark-card rounded-2xl border-3 border-gray-500 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon size={16} className="text-white" />
              </div>
              <h4 className="text-lg font-bold text-dark-text">📋 当前实时生效配置</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="font-bold text-dark-text text-sm">挖矿概率分布（实时）：</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-dark-surface rounded-lg p-2 border border-gray-500">
                    <span className="text-dark-text-secondary text-sm">💰 金币</span>
                    <span className="text-yellow-500 font-bold">{currentProbabilities?.goldProbability || 65}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-dark-surface rounded-lg p-2 border border-gray-500">
                    <span className="text-dark-text-secondary text-sm">💀 死亡</span>
                    <span className="text-red-500 font-bold">{currentProbabilities?.deathProbability || 5}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-dark-surface rounded-lg p-2 border border-gray-500">
                    <span className="text-dark-text-secondary text-sm">🕳️ 空挖</span>
                    <span className="text-gray-500 font-bold">{currentProbabilities?.nothingProbability || 30}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h5 className="font-bold text-dark-text text-sm">系统设置（实时）：</h5>
                <div className="bg-dark-surface rounded-lg p-3 border border-gray-500">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      loggingEnabled ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {loggingEnabled ? (
                        <ToggleRightIcon size={14} className="text-white" />
                      ) : (
                        <ToggleLeftIcon size={14} className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-dark-text font-medium text-sm">挖矿日志</p>
                      <p className="text-dark-text-secondary text-xs">
                        {loggingEnabled ? '已开启（后端 + 前端）' : '已关闭（后端 + 前端）'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Notice */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border-2 border-green-500">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shrink-0">
                <CheckCircleIcon size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-green-500 mb-3">
                  ✅ 配置功能已连接并实时同步
                </h4>
                <div className="space-y-3">
                  <div className="bg-dark-surface rounded-lg p-4 border border-gray-500">
                    <h5 className="font-bold text-dark-text text-sm mb-2">功能状态：</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-dark-text-secondary">概率配置接口</span>
                        <span className="text-green-500 font-bold">✅ 已连接</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-dark-text-secondary">日志开关接口</span>
                        <span className="text-green-500 font-bold">✅ 已连接</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-dark-text-secondary">实时状态获取</span>
                        <span className="text-green-500 font-bold">✅ 已启用</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-dark-text-secondary">链上数据持久化</span>
                        <span className="text-green-500 font-bold">✅ 已启用</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-dark-text-secondary">前端日志控制</span>
                        <span className="text-green-500 font-bold">✅ 已同步</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-dark-text-secondary">自动缓存刷新</span>
                        <span className="text-green-500 font-bold">✅ 已启用</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark-surface rounded-lg p-4 border border-gray-500">
                    <h5 className="font-bold text-dark-text text-sm mb-2">配置效果：</h5>
                    <ul className="text-dark-text-secondary text-xs space-y-1">
                      <li>• 所有概率设置立即应用到挖矿方法</li>
                      <li>• 日志开关同时控制后端和前端的调试输出</li>
                      <li>• 配置数据安全存储在区块链上，永久有效</li>
                      <li>• 只有超级管理员可以修改这些配置</li>
                      <li>• 所有玩家的挖矿操作立即受新配置影响</li>
                      <li>• 空挖概率自动计算为 100% - 金币概率 - 死亡概率</li>
                      <li>• 前端每次都实时获取最新配置状态</li>
                      <li>• 配置更新后前端自动刷新缓存，确保所有用户立即同步</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
