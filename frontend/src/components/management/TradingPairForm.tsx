import React, { useState, useEffect } from 'react';
import { useAddTradingPair, useUpdateTradingPair } from '../../hooks/useQueries';

interface TradingPairFormProps {
  editingPair: { symbol: string; coinId: string; enabled: boolean } | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function TradingPairForm({ editingPair, onClose, onSuccess }: TradingPairFormProps) {
  const [newPairSymbol, setNewPairSymbol] = useState('');
  const [newPairCoinId, setNewPairCoinId] = useState('');
  const addTradingPair = useAddTradingPair();
  const updateTradingPair = useUpdateTradingPair();

  useEffect(() => {
    if (editingPair) {
      setNewPairSymbol(editingPair.symbol);
      setNewPairCoinId(editingPair.coinId);
    } else {
      setNewPairSymbol('');
      setNewPairCoinId('');
    }
  }, [editingPair]);

  const handleSaveTradingPair = async () => {
    if (!newPairSymbol.trim() || !newPairCoinId.trim()) return;

    try {
      if (editingPair) {
        console.log('更新交易对:', newPairSymbol);
        await updateTradingPair.mutateAsync({
          symbol: newPairSymbol.trim(),
          enabled: editingPair.enabled,
        });
        onSuccess(`交易对 "${newPairSymbol}" 已更新，前端加密趋势模块将立即同步显示`);
      } else {
        console.log('添加新交易对:', newPairSymbol, newPairCoinId);
        await addTradingPair.mutateAsync({
          symbol: newPairSymbol.trim(),
          coinId: newPairCoinId.trim(),
        });
        onSuccess(`交易对 "${newPairSymbol}" (CoinGecko ID: ${newPairCoinId}) 已添加，前端加密趋势模块将立即同步显示`);
      }
    } catch (error) {
      console.error('保存交易对时出错:', error);
      const errorMessage = error instanceof Error ? error.message : '保存失败，请重试';
      onSuccess(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500 w-full max-w-md">
        <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
          <h3 className="text-xl font-bold text-dark-text">
            {editingPair ? '编辑交易对' : '添加新交易对'}
          </h3>
          <p className="text-dark-text-secondary text-sm mt-2">
            {editingPair ? '修改交易对配置' : '添加后将在加密趋势模块中显示（需启用状态）'}
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-dark-text mb-2">
              交易对符号 (如: BTC/USDT, ICP/USDT)
            </label>
            <input
              type="text"
              value={newPairSymbol}
              onChange={(e) => setNewPairSymbol(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-theme-primary/30 focus:border-theme-primary bg-dark-surface text-dark-text"
              placeholder="ICP/USDT"
              disabled={!!editingPair}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-text mb-2">
              CoinGecko ID (如: internet-computer, bitcoin)
            </label>
            <input
              type="text"
              value={newPairCoinId}
              onChange={(e) => setNewPairCoinId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-theme-primary/30 focus:border-theme-primary bg-dark-surface text-dark-text font-mono"
              placeholder="internet-computer"
              disabled={!!editingPair}
            />
            <p className="text-dark-text-secondary text-xs mt-1">
              请访问 CoinGecko 网站查找正确的币种 ID
            </p>
          </div>

          <div className="bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 rounded-xl p-4 border-2 border-gray-500">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-dark-text font-bold global-font text-sm">
                  {editingPair ? '编辑说明' : '添加说明'}
                </p>
                <p className="text-dark-text-secondary text-xs global-font">
                  {editingPair 
                    ? '编辑模式下只能修改启用/禁用状态，交易对符号和 CoinGecko ID 不可修改。'
                    : '添加后交易对将立即在后端同步，但只有启用状态的交易对才会在前端加密趋势模块中显示。您可以随时通过启用/禁用按钮控制显示。'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              disabled={addTradingPair.isPending || updateTradingPair.isPending}
              className="flex-1 px-4 py-2 border-2 border-gray-500 text-dark-text rounded-xl hover:bg-dark-hover transition-all duration-300 font-bold disabled:opacity-50"
            >
              取消
            </button>
            <button
              onClick={handleSaveTradingPair}
              disabled={
                (!newPairSymbol.trim() || (!editingPair && !newPairCoinId.trim())) || 
                addTradingPair.isPending || 
                updateTradingPair.isPending
              }
              className="flex-1 px-4 py-2 bg-gradient-to-r from-dark-success to-dark-primary text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {(addTradingPair.isPending || updateTradingPair.isPending) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>保存中...</span>
                </>
              ) : (
                <span>{editingPair ? '更新' : '添加'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
