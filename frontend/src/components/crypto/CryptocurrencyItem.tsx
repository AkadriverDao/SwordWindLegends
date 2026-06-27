import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

interface CryptocurrencyPrice {
  symbol: string;
  currentPrice: number | null;
  priceChange24h?: number;
  isLoading: boolean;
  error?: string;
  hasData: boolean;
}

interface CryptocurrencyItemProps {
  crypto: CryptocurrencyPrice;
}

export default function CryptocurrencyItem({ crypto }: CryptocurrencyItemProps) {
  const formatPrice = (price: number | null, symbol: string) => {
    if (price === null) return null;
    
    if (symbol.includes('BTC')) {
      return `$${price.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    } else if (symbol.includes('ETH') || symbol.includes('SOL')) {
      return `$${price.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    } else if (symbol.includes('ADA')) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  const formatPriceChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getPriceDisplayText = (crypto: CryptocurrencyPrice) => {
    if (crypto.currentPrice !== null) {
      return formatPrice(crypto.currentPrice, crypto.symbol);
    } else if (crypto.isLoading) {
      return '加载中...';
    } else {
      return '数据暂时获取不到';
    }
  };

  return (
    <div className="w-full p-3 sm:p-4 text-left touch-target">
      {/* Mobile Layout - Stacked */}
      <div className="block sm:hidden space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-dark-warning to-dark-accent shrink-0">
              <span className="text-white font-bold text-xs">
                {crypto.symbol.split('/')[0].slice(0, 2)}
              </span>
            </div>
            <div className="text-dark-text font-bold global-font mobile-text-sm">
              {crypto.symbol}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pl-8">
          <div>
            <div className={`font-bold elegant-numbers global-font mobile-text-sm ${
              crypto.currentPrice !== null ? 'text-dark-text' : 'text-dark-text-secondary'
            }`}>
              {getPriceDisplayText(crypto)}
            </div>
          </div>
          
          <div>
            {crypto.currentPrice !== null && crypto.priceChange24h !== undefined && (
              <div className={`flex items-center space-x-1 ${
                crypto.priceChange24h >= 0 ? 'text-dark-success' : 'text-dark-error'
              }`}>
                {crypto.priceChange24h >= 0 ? (
                  <TrendingUpIcon size={12} />
                ) : (
                  <TrendingDownIcon size={12} />
                )}
                <span className="font-bold elegant-numbers global-font text-xs">
                  {formatPriceChange(crypto.priceChange24h)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Grid */}
      <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-dark-warning to-dark-accent">
              <span className="text-white font-bold text-xs">
                {crypto.symbol.split('/')[0].slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="text-dark-text font-bold global-font">
                {crypto.symbol}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-4">
          <div className={`font-bold elegant-numbers global-font ${
            crypto.currentPrice !== null ? 'text-dark-text' : 'text-dark-text-secondary'
          }`}>
            {getPriceDisplayText(crypto)}
          </div>
        </div>
        
        <div className="col-span-4">
          {crypto.currentPrice !== null && crypto.priceChange24h !== undefined && (
            <div className={`flex items-center space-x-2 ${
              crypto.priceChange24h >= 0 ? 'text-dark-success' : 'text-dark-error'
            }`}>
              {crypto.priceChange24h >= 0 ? (
                <TrendingUpIcon size={16} />
              ) : (
                <TrendingDownIcon size={16} />
              )}
              <span className="font-bold elegant-numbers global-font text-sm">
                {formatPriceChange(crypto.priceChange24h)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

