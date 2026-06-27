import React, { useState, useCallback } from 'react';
import { type CoinGeckoPrice } from '../../services/coingecko';

interface HoveredPoint {
  x: number;
  y: number;
  price: number;
  time: string;
}

interface ChartInteractionsProps {
  priceData: CoinGeckoPrice[];
  selectedTradingPair: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onHoveredPointChange: (point: HoveredPoint | null) => void;
  onViewOffsetChange: (offset: { x: number; y: number }) => void;
  viewOffset: { x: number; y: number };
  children: (handlers: {
    onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
  }) => React.ReactNode;
}

export default function ChartInteractions({
  priceData,
  selectedTradingPair,
  containerRef,
  onHoveredPointChange,
  onViewOffsetChange,
  viewOffset,
  children
}: ChartInteractionsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Enhanced mouse move handler with improved stability
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    if (!canvas || priceData.length === 0 || !containerRef.current) return;
    
    try {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      if (isDragging) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;
        onViewOffsetChange({
          x: Math.max(-200, Math.min(200, viewOffset.x + deltaX)),
          y: Math.max(-100, Math.min(100, viewOffset.y + deltaY))
        });
        setDragStart({ x, y });
        return;
      }
      
      // Find closest data point for hover effect
      const padding = { top: 30, right: 100, bottom: 60, left: 80 };
      const chartWidth = rect.width - padding.left - padding.right;
      const chartHeight = 450 - padding.top - padding.bottom;
      
      if (x >= padding.left && x <= padding.left + chartWidth && y >= padding.top && y <= padding.top + chartHeight) {
        const adjustedX = (x - padding.left - viewOffset.x);
        const dataIndex = Math.round((adjustedX / chartWidth) * (priceData.length - 1));
        
        if (dataIndex >= 0 && dataIndex < priceData.length) {
          const point = priceData[dataIndex];
          
          if (point && point.price > 0 && isFinite(point.price)) {
            const prices = priceData.map(d => d.price).filter(p => p > 0 && isFinite(p));
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const priceRange = maxPrice - minPrice;
            const pricePadding = priceRange * 0.1;
            const adjustedMin = minPrice - pricePadding;
            const adjustedMax = maxPrice + pricePadding;
            const adjustedRange = adjustedMax - adjustedMin;
            
            const pointX = padding.left + (dataIndex / (priceData.length - 1)) * chartWidth;
            const pointY = padding.top + ((adjustedMax - point.price) / adjustedRange) * chartHeight;
            
            onHoveredPointChange({
              x: pointX,
              y: pointY,
              price: point.price,
              time: new Date(point.timestamp).toLocaleString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            });
          }
        }
      } else {
        onHoveredPointChange(null);
      }
    } catch (error) {
      console.error(`${selectedTradingPair} 鼠标移动处理错误:`, error);
      onHoveredPointChange(null);
    }
  }, [priceData, isDragging, dragStart, viewOffset, selectedTradingPair, onHoveredPointChange, onViewOffsetChange, containerRef]);

  // Mouse down handler for panning
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x, y });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    onHoveredPointChange(null);
    setIsDragging(false);
  }, [onHoveredPointChange]);

  return (
    <>
      {children({
        onMouseMove: handleMouseMove,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseLeave
      })}
    </>
  );
}

export type { HoveredPoint };
