import React, { useRef, useEffect } from 'react';
import { type CoinGeckoPrice } from '../../services/coingecko';

interface HoveredPoint {
  x: number;
  y: number;
  price: number;
  time: string;
}

interface ChartRendererProps {
  priceData: CoinGeckoPrice[];
  selectedTradingPair: string;
  priceChange: number | null;
  isLoading: boolean;
  error: string | null;
  hoveredPoint: HoveredPoint | null;
  viewOffset: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export default function ChartRenderer({
  priceData,
  selectedTradingPair,
  priceChange,
  isLoading,
  error,
  hoveredPoint,
  viewOffset,
  containerRef,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onMouseLeave
}: ChartRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Enhanced canvas drawing logic with symbol-specific data validation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
      // Set canvas size with high DPI support
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = 450 * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = '450px';
      ctx.scale(dpr, dpr);
      
      const width = rect.width;
      const height = 450;
      const padding = { top: 30, right: 100, bottom: 60, left: 80 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;
      
      // Clear canvas with professional background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, width, height);
      
      // If no data, show empty chart
      if (priceData.length === 0) {
        ctx.fillStyle = '#374151';
        ctx.font = '16px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          isLoading ? `正在加载 ${selectedTradingPair} 数据...` : `暂无 ${selectedTradingPair} 数据`,
          width / 2,
          height / 2
        );
        return;
      }
      
      // Apply pan transformations
      ctx.save();
      ctx.translate(padding.left + viewOffset.x, padding.top + viewOffset.y);
      
      // Calculate price range with padding
      const prices = priceData.map(d => d.price).filter(p => p > 0 && isFinite(p));
      
      if (prices.length === 0) {
        throw new Error(`没有有效的 ${selectedTradingPair} 价格数据用于绘制图表`);
      }
      
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = maxPrice - minPrice;
      const pricePadding = priceRange * 0.1;
      const adjustedMin = minPrice - pricePadding;
      const adjustedMax = maxPrice + pricePadding;
      const adjustedRange = adjustedMax - adjustedMin;
      
      if (adjustedRange <= 0) {
        throw new Error(`${selectedTradingPair} 价格数据范围无效`);
      }
      
      // Helper functions for coordinate transformation
      const getX = (index: number) => (index / (priceData.length - 1)) * chartWidth;
      const getY = (price: number) => ((adjustedMax - price) / adjustedRange) * chartHeight;
      
      // Draw professional grid lines
      drawGridLines(ctx, chartWidth, chartHeight);
      
      // Create enhanced gradient for area fill
      const areaGradient = createAreaGradient(ctx, chartHeight, priceChange);
      
      // Draw area under the curve
      drawAreaUnderCurve(ctx, priceData, getX, getY, chartWidth, chartHeight, areaGradient);
      
      // Draw enhanced price line
      drawPriceLine(ctx, priceData, getX, getY, chartWidth, priceChange);
      
      ctx.restore();
      
      // Draw axes and labels
      drawAxesAndLabels(ctx, width, height, padding, chartWidth, chartHeight, adjustedMax, adjustedRange, priceData, selectedTradingPair);
      
      // Draw hover point
      if (hoveredPoint) {
        drawHoverPoint(ctx, hoveredPoint, padding, viewOffset);
      }
    } catch (canvasError) {
      console.error(`${selectedTradingPair} 图表绘制错误:`, canvasError);
      handleCanvasError(ctx, canvas, selectedTradingPair);
    }
    
  }, [priceData, hoveredPoint, viewOffset, priceChange, selectedTradingPair, isLoading, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      className="w-full cursor-move rounded-xl"
      style={{ height: '450px' }}
    />
  );
}

// Helper functions for chart drawing
function drawGridLines(ctx: CanvasRenderingContext2D, chartWidth: number, chartHeight: number) {
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.globalAlpha = 0.6;
  
  const gridLines = 8;
  const timeGridLines = 6;
  
  // Horizontal grid lines
  for (let i = 0; i <= gridLines; i++) {
    const y = (i / gridLines) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(chartWidth, y);
    ctx.stroke();
  }
  
  // Vertical grid lines
  for (let i = 0; i <= timeGridLines; i++) {
    const x = (i / timeGridLines) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, chartHeight);
    ctx.stroke();
  }
  
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function createAreaGradient(ctx: CanvasRenderingContext2D, chartHeight: number, priceChange: number | null): CanvasGradient {
  const areaGradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
  const isPositive = priceChange && priceChange >= 0;
  
  if (isPositive) {
    areaGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    areaGradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
    areaGradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
  } else {
    areaGradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
    areaGradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.2)');
    areaGradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
  }
  
  return areaGradient;
}

function drawAreaUnderCurve(
  ctx: CanvasRenderingContext2D,
  priceData: CoinGeckoPrice[],
  getX: (index: number) => number,
  getY: (price: number) => number,
  chartWidth: number,
  chartHeight: number,
  areaGradient: CanvasGradient
) {
  ctx.fillStyle = areaGradient;
  ctx.beginPath();
  
  priceData.forEach((point, index) => {
    if (point && point.price > 0 && isFinite(point.price)) {
      const x = getX(index);
      const y = getY(point.price);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  });
  
  ctx.lineTo(getX(priceData.length - 1), chartHeight);
  ctx.lineTo(getX(0), chartHeight);
  ctx.closePath();
  ctx.fill();
}

function drawPriceLine(
  ctx: CanvasRenderingContext2D,
  priceData: CoinGeckoPrice[],
  getX: (index: number) => number,
  getY: (price: number) => number,
  chartWidth: number,
  priceChange: number | null
) {
  const lineGradient = ctx.createLinearGradient(0, 0, chartWidth, 0);
  const isPositive = priceChange && priceChange >= 0;
  
  if (isPositive) {
    lineGradient.addColorStop(0, '#10b981');
    lineGradient.addColorStop(0.5, '#059669');
    lineGradient.addColorStop(1, '#047857');
  } else {
    lineGradient.addColorStop(0, '#ef4444');
    lineGradient.addColorStop(0.5, '#dc2626');
    lineGradient.addColorStop(1, '#b91c1c');
  }
  
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = isPositive ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  
  priceData.forEach((point, index) => {
    if (point && point.price > 0 && isFinite(point.price)) {
      const x = getX(index);
      const y = getY(point.price);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  });
  
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawAxesAndLabels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
  chartWidth: number,
  chartHeight: number,
  adjustedMax: number,
  adjustedRange: number,
  priceData: CoinGeckoPrice[],
  selectedTradingPair: string
) {
  const gridLines = 8;
  const timeGridLines = 6;
  
  // Y-axis price labels
  ctx.fillStyle = '#9ca3af';
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i <= gridLines; i++) {
    const price = adjustedMax - (i / gridLines) * adjustedRange;
    const y = padding.top + (i / gridLines) * chartHeight;
    const formattedPrice = formatPriceForChart(price, selectedTradingPair);
    ctx.fillText(formattedPrice, padding.left - 10, y);
  }
  
  // X-axis time labels
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 0; i <= timeGridLines; i++) {
    const dataIndex = Math.floor((i / timeGridLines) * (priceData.length - 1));
    const point = priceData[dataIndex];
    if (point && point.timestamp) {
      const x = padding.left + (i / timeGridLines) * chartWidth;
      const date = new Date(point.timestamp);
      const label = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      ctx.fillText(label, x, height - 40);
    }
  }
  
  // Draw axis lines
  ctx.strokeStyle = '#4b5563';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.moveTo(padding.left, padding.top + chartHeight);
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  ctx.stroke();
}

function drawHoverPoint(
  ctx: CanvasRenderingContext2D,
  hoveredPoint: HoveredPoint,
  padding: { top: number; right: number; bottom: number; left: number },
  viewOffset: { x: number; y: number }
) {
  const adjustedX = padding.left + viewOffset.x + (hoveredPoint.x - padding.left);
  const adjustedY = hoveredPoint.y;
  
  // Outer glow
  ctx.shadowColor = '#6366f1';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.arc(adjustedX, adjustedY, 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Inner highlight
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(adjustedX, adjustedY, 4, 0, 2 * Math.PI);
  ctx.fill();
  
  // Crosshair lines
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  ctx.beginPath();
  ctx.moveTo(adjustedX, padding.top);
  ctx.lineTo(adjustedX, padding.top + 450 - padding.top - padding.bottom);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(padding.left, adjustedY);
  ctx.lineTo(padding.left + 450 - padding.left - padding.right, adjustedY);
  ctx.stroke();
  
  ctx.setLineDash([]);
}

function formatPriceForChart(price: number, symbol: string): string {
  if (symbol.includes('BTC')) {
    return `$${price.toFixed(0)}`;
  } else if (symbol.includes('ETH') || symbol.includes('SOL')) {
    return `$${price.toFixed(2)}`;
  } else if (symbol.includes('ADA')) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toFixed(2)}`;
  }
}

function handleCanvasError(ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement, selectedTradingPair: string) {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ef4444';
    ctx.font = '16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `${selectedTradingPair} 图表数据暂时获取不到`, 
      canvas.width / (2 * (window.devicePixelRatio || 1)), 
      canvas.height / (2 * (window.devicePixelRatio || 1))
    );
  }
}

export { ChartRenderer };
