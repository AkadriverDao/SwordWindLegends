import React, { useState } from 'react';
import { useGetAllTradingPairs, useAddTradingPair, useUpdateTradingPair, useDeleteTradingPair } from '../../hooks/useQueries';
import { PlusIcon, EditIcon, ToggleLeftIcon, ToggleRightIcon, TrashIcon, TrendingUpIcon } from 'lucide-react';
import TradingPairForm from './TradingPairForm';

interface TradingPairManagerProps {
  onShowSuccessMessage: (message: string) => void;
}

export default function TradingPairManager({ onShowSuccessMessage }: TradingPairManagerProps) {
  const { data: backendTradingPairs, isLoading: tradingPairsLoading } = useGetAllTradingPairs();
  const updateTradingPair = useUpdateTradingPair();
  const deleteTradingPair = useDeleteTradingPair();
  const [showTradingPairForm, setShowTradingPairForm] = useState(false);
  const [editingPair, setEditingPair] = useState<{ symbol: string; coinId: string; enabled: boolean } | null>(null);

  const handleAddTradingPair = () => {
    setEditingPair(null);
    setShowTradingPairForm(true);
  };

  const handleEditTradingPair = (symbol: string, coinId: string, enabled: boolean) => {
    setEditingPair({ symbol, coinId, enabled });
    setShowTradingPairForm(true);
  };

  const handleToggleTradingPair = async (symbol: string, currentEnabled: boolean) => {
    try {
      console.log('切换交易对状态:', symbol, '当前状态:', currentEnabled);
      await updateTradingPair.mutateAsync({
        symbol,
        enabled: !currentEnabled,
      });
      onShowSuccessMessage(`交易对 "${symbol}" 已${!currentEnabled ? '启用' : '禁用'}，前端加密趋势模块将立即同步更新`);
    } catch (error) {
      console.error('切换交易对状态时出错:', error);
      const errorMessage = error instanceof Error ? error.message : '操作失败，请重试';
      onShowSuccessMessage(errorMessage);
    }
  };

  const handleDeleteTradingPair = async (symbol: string) => {
    if (window.confirm(`确定要删除交易对 "${symbol}" 吗？删除后该交易对将从加密趋势模块中移除，此操作无法撤销。`)) {
      try {
        console.log('删除交易对:', symbol);
        await deleteTradingPair.mutateAsync(symbol);
        onShowSuccessMessage(`交易对 "${symbol}" 已删除，前端加密趋势模块将立即同步更新`);
      } catch (error) {
        console.error('删除交易对时出错:', error);
        const errorMessage = error instanceof Error ? error.message : '删除失败，请重试';
        onShowSuccessMessage(errorMessage);
      }
    }
  };

  const handleFormSuccess = (message: string) => {
    setShowTradingPairForm(false);
    onShowSuccessMessage(message);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-dark-text flex items-center">
          ⛓️ 交易对管理
          <span className="ml-3 text-sm font-normal text-dark-text-secondary">
            (配置加密趋势页面显示的交易对，包括 CoinGecko ID 映射和启用/禁用状态)
          </span>
        </h3>
        <button
          onClick={handleAddTradingPair}
          className="bg-gradient-to-r from-dark-success to-dark-primary text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
        >
          <PlusIcon size={16} />
          <span>添加交易对</span>
        </button>
      </div>

      {tradingPairsLoading ? (
        <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-theme-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-dark-text-secondary global-font">加载交易对配置中...</p>
        </div>
      ) : (
        <div className="bg-dark-surface rounded-2xl border-3 border-gray-500 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-dark-surface to-dark-muted border-b-2 border-gray-500">
            <div className="grid grid-cols-12 gap-4 text-sm font-bold text-dark-text-secondary">
              <div className="col-span-3">交易对</div>
              <div className="col-span-3">CoinGecko ID</div>
              <div className="col-span-2">状态</div>
              <div className="col-span-2">启用/禁用</div>
              <div className="col-span-2">操作</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-500">
            {backendTradingPairs && backendTradingPairs.length > 0 ? (
              backendTradingPairs.map(([symbol, pair]) => (
                <div key={symbol} className="p-4 hover:bg-dark-hover/50 transition-colors duration-200">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-dark-warning to-dark-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {pair.symbol.split('/')[0].slice(0, 2)}
                          </span>
                        </div>
                        <span className="text-dark-text font-bold">{pair.symbol}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-3">
                      <span className="text-dark-text-secondary font-mono text-sm bg-dark-card px-2 py-1 rounded border border-gray-500">
                        {pair.coinId || '未设置'}
                      </span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-bold ${
                        pair.enabled 
                          ? 'bg-dark-success/20 text-dark-success border border-dark-success' 
                          : 'bg-dark-error/20 text-dark-error border border-dark-error'
                      }`}>
                        {pair.enabled ? <ToggleRightIcon size={14} /> : <ToggleLeftIcon size={14} />}
                        <span>{pair.enabled ? '已启用' : '已禁用'}</span>
                      </span>
                    </div>
                    
                    <div className="col-span-2">
                      <button
                        onClick={() => handleToggleTradingPair(pair.symbol, pair.enabled)}
                        disabled={updateTradingPair.isPending}
                        className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                          pair.enabled
                            ? 'bg-gradient-to-r from-dark-error to-dark-warning text-white'
                            : 'bg-gradient-to-r from-dark-success to-dark-primary text-white'
                        }`}
                      >
                        {pair.enabled ? '禁用' : '启用'}
                      </button>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditTradingPair(pair.symbol, pair.coinId, pair.enabled)}
                          disabled={updateTradingPair.isPending}
                          className="p-2 bg-dark-primary/20 text-dark-primary rounded-lg hover:bg-dark-primary/30 transition-all duration-300 disabled:opacity-50"
                          title="编辑"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTradingPair(pair.symbol)}
                          disabled={deleteTradingPair.isPending}
                          className="p-2 bg-dark-error/20 text-dark-error rounded-lg hover:bg-dark-error/30 transition-all duration-300 disabled:opacity-50"
                          title="删除"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <TrendingUpIcon size={32} className="text-dark-text-secondary mx-auto mb-4" />
                <p className="text-dark-text font-bold mb-2">暂无交易对配置</p>
                <p className="text-dark-text-secondary mb-4">点击上方按钮添加第一个交易对</p>
                <div className="bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-4 border-2 border-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="text-dark-text font-bold global-font text-sm">
                        完全由后端管理
                      </p>
                      <p className="text-dark-text-secondary text-xs global-font">
                        包括 ICP/USDT 在内的所有交易对都需要在此配置后才会在加密趋势模块中显示。每个交易对都需要配置对应的 CoinGecko ID 和启用/禁用状态。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showTradingPairForm && (
        <TradingPairForm
          editingPair={editingPair}
          onClose={() => setShowTradingPairForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
