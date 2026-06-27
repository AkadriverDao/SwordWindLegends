import React from 'react';

export interface PriceFormatOptions {
  symbol: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export class DataProcessor {
  static formatPrice(price: number | null, symbol: string): string | null {
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
  }

  static formatPriceChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  static validatePriceData(data: any[]): boolean {
    return data.every(point => 
      point && 
      typeof point.price === 'number' && 
      typeof point.timestamp === 'number' &&
      point.price > 0 && 
      isFinite(point.price) &&
      point.timestamp > 0
    );
  }

  static calculatePriceChange(priceData: any[]): number | null {
    if (priceData.length < 2) return null;
    
    const latest = priceData[priceData.length - 1];
    const earliest = priceData[0];
    
    if (latest && earliest && latest.price > 0 && earliest.price > 0) {
      return ((latest.price - earliest.price) / earliest.price) * 100;
    }
    
    return null;
  }

  static formatDateTime(timestamp: number): string {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static getSymbolSpecificConfig(symbol: string): {
    decimalPlaces: number;
    displayFormat: 'compact' | 'full';
    priceThreshold: number;
  } {
    if (symbol.includes('BTC')) {
      return { decimalPlaces: 0, displayFormat: 'compact', priceThreshold: 1000 };
    } else if (symbol.includes('ETH') || symbol.includes('SOL')) {
      return { decimalPlaces: 2, displayFormat: 'compact', priceThreshold: 100 };
    } else if (symbol.includes('ADA')) {
      return { decimalPlaces: 4, displayFormat: 'full', priceThreshold: 1 };
    } else {
      return { decimalPlaces: 4, displayFormat: 'full', priceThreshold: 1 };
    }
  }
}

// React component wrapper for data processing utilities
export default function DataProcessorProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
