import React from 'react';
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';

interface ErrorHandlerProps {
  error: string | null;
  isLoading: boolean;
  selectedTradingPair: string;
  onRetry: () => void;
  hasData: boolean;
}

export default function ErrorHandler({ 
  error, 
  isLoading, 
  selectedTradingPair, 
  onRetry, 
  hasData 
}: ErrorHandlerProps) {
  // Don't show error if we have data to display
  if (hasData && error) {
    return (
      <div className="absolute top-4 right-4 bg-dark-error/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-dark-error">
        <div className="flex items-center space-x-2">
          <AlertCircleIcon size={14} className="text-dark-error" />
          <span className="text-dark-error text-xs font-medium global-font">
            {error}
          </span>
        </div>
      </div>
    );
  }

  // Show full error screen only when no data is available
  if (error && !hasData && !isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-dark-surface rounded-xl border-2 border-gray-500">
        <div className="text-center">
          <AlertCircleIcon size={48} className="text-dark-warning mx-auto mb-4" />
          <p className="text-dark-text font-medium global-font">数据暂时获取不到</p>
          <p className="text-dark-text-secondary text-sm global-font mt-2">
            {selectedTradingPair} 的价格数据暂时无法获取，请稍后重试
          </p>
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export function LoadingState({ selectedTradingPair }: { selectedTradingPair: string }) {
  return (
    <div className="flex items-center justify-center h-96 bg-dark-surface rounded-xl border-2 border-gray-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-theme-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-dark-text font-medium global-font">加载中...</p>
        <p className="text-dark-text-secondary text-sm global-font mt-2">
          正在获取 {selectedTradingPair} 的30天数据
        </p>
      </div>
    </div>
  );
}

export function ErrorBoundary({ children, fallback }: { 
  children: React.ReactNode; 
  fallback: React.ReactNode;
}) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [children]);

  if (hasError) {
    return <>{fallback}</>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Chart error boundary caught:', error);
    setHasError(true);
    return <>{fallback}</>;
  }
}
