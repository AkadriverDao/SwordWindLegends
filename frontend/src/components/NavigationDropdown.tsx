import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDownIcon, UserIcon, TrophyIcon, PaletteIcon, SettingsIcon, LogOutIcon, GamepadIcon } from 'lucide-react';
import { useGetMiningLoggingEnabled } from '../hooks/useQueries';
import type { UserProfile } from '../backend';

interface NavigationDropdownProps {
  userProfile: UserProfile;
  isSuperUser: boolean;
  onNavigateToProfile: () => void;
  onNavigateToLeaderboard: () => void;
  onNavigateToCustomization: () => void;
  onNavigateToManagement: () => void;
  onNavigateToGameMod: () => void;
}

export default function NavigationDropdown({
  userProfile,
  isSuperUser,
  onNavigateToProfile,
  onNavigateToLeaderboard,
  onNavigateToCustomization,
  onNavigateToManagement,
  onNavigateToGameMod,
}: NavigationDropdownProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: loggingEnabled } = useGetMiningLoggingEnabled();
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Enhanced click outside detection using click event instead of mousedown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Check if click is outside both trigger and dropdown
      const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      
      if (isOpen && isOutsideTrigger && isOutsideDropdown && !isClosing) {
        if (loggingEnabled) {
          console.log('NavigationDropdown: 检测到外部点击，准备关闭下拉菜单');
        }
        
        // Add a small delay to ensure any pending click events are processed
        setIsClosing(true);
        setTimeout(() => {
          if (loggingEnabled) {
            console.log('NavigationDropdown: 延迟关闭下拉菜单');
          }
          setIsOpen(false);
          setIsClosing(false);
        }, 50); // 50ms delay to allow click events to process
      }
    }

    if (isOpen) {
      // Use click event instead of mousedown for better timing
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  }, [isOpen, isClosing, loggingEnabled]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    if (loggingEnabled) {
      console.log('NavigationDropdown: 开始登出操作');
    }
    
    if (isNavigating || isClosing) {
      if (loggingEnabled) {
        console.log('NavigationDropdown: 正在导航或关闭中，忽略登出操作');
      }
      return;
    }
    
    setIsNavigating(true);
    setIsClosing(true);
    if (loggingEnabled) {
      console.log('NavigationDropdown: 设置登出状态为进行中');
    }
    
    // Close menu immediately for better UX
    setIsOpen(false);
    if (loggingEnabled) {
      console.log('NavigationDropdown: 立即关闭下拉菜单');
    }
    
    try {
      if (loggingEnabled) {
        console.log('NavigationDropdown: 执行登出操作');
      }
      await clear();
      queryClient.clear();
      if (loggingEnabled) {
        console.log('NavigationDropdown: 登出操作完成');
      }
    } catch (error) {
      console.error('NavigationDropdown: 登出错误:', error);
    } finally {
      // Reset navigation state after logout completes
      setTimeout(() => {
        setIsNavigating(false);
        setIsClosing(false);
        if (loggingEnabled) {
          console.log('NavigationDropdown: 重置登出状态');
        }
      }, 100);
    }
  }, [clear, queryClient, isNavigating, isClosing, loggingEnabled]);

  // Optimized menu item click handler with improved timing
  const handleMenuItemClick = useCallback((navigationAction: () => void, actionName: string) => {
    return (e: React.MouseEvent) => {
      if (loggingEnabled) {
        console.log('菜单项被点击，事件已触发');
        console.log(`NavigationDropdown: ${actionName} 菜单项点击事件开始处理`);
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      if (loggingEnabled) {
        console.log(`NavigationDropdown: 点击了 ${actionName} 菜单项，准备调用导航函数`);
        console.log(`NavigationDropdown: 事件传播已停止，防止冒泡`);
      }
      
      // Prevent multiple rapid clicks during navigation
      if (isNavigating || isClosing) {
        if (loggingEnabled) {
          console.log('NavigationDropdown: 正在导航或关闭中，忽略重复点击');
        }
        return;
      }
      
      setIsNavigating(true);
      setIsClosing(true);
      if (loggingEnabled) {
        console.log(`NavigationDropdown: 设置导航状态为进行中`);
      }
      
      // Close menu immediately for better UX
      setIsOpen(false);
      if (loggingEnabled) {
        console.log(`NavigationDropdown: 立即关闭下拉菜单`);
      }
      
      // Use a longer delay to ensure proper event processing
      setTimeout(() => {
        try {
          if (loggingEnabled) {
            console.log(`NavigationDropdown: 执行 ${actionName} 导航函数`);
            console.log(`NavigationDropdown: 调用导航回调函数 - ${actionName}`);
          }
          navigationAction();
          if (loggingEnabled) {
            console.log(`NavigationDropdown: ${actionName} 导航函数执行完成`);
            console.log(`NavigationDropdown: 导航成功完成 - ${actionName}`);
          }
        } catch (error) {
          console.error(`NavigationDropdown: ${actionName} 导航错误:`, error);
          console.error(`NavigationDropdown: 导航失败 - ${actionName}:`, error);
        } finally {
          // Reset navigation state after navigation completes
          setTimeout(() => {
            setIsNavigating(false);
            setIsClosing(false);
            if (loggingEnabled) {
              console.log(`NavigationDropdown: 重置导航状态 - ${actionName}`);
            }
          }, 100);
        }
      }, 10); // Small delay to ensure click event is fully processed
    };
  }, [isNavigating, isClosing, loggingEnabled]);

  // Toggle dropdown with proper state management
  const handleToggleDropdown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isNavigating || isClosing) {
      if (loggingEnabled) {
        console.log('NavigationDropdown: 正在导航或关闭中，忽略下拉菜单切换');
      }
      return;
    }
    
    if (loggingEnabled) {
      console.log('NavigationDropdown: 切换下拉菜单状态');
      console.log(`NavigationDropdown: 当前菜单状态: ${isOpen ? '打开' : '关闭'}`);
    }
    setIsOpen(prev => {
      const newState = !prev;
      if (loggingEnabled) {
        console.log(`NavigationDropdown: 菜单状态切换为: ${newState ? '打开' : '关闭'}`);
      }
      return newState;
    });
  }, [isNavigating, isClosing, isOpen, loggingEnabled]);

  // Calculate dropdown position to ensure it's always visible - enhanced for mobile
  const getDropdownStyle = () => {
    if (!triggerRef.current) return {};
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = 400; // Approximate height of dropdown
    const dropdownWidth = window.innerWidth <= 640 ? Math.min(280, viewportWidth - 32) : 256; // Mobile responsive width
    
    let style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 999999, // Extremely high z-index to ensure it's always on top
      pointerEvents: 'auto', // Explicitly enable pointer events
    };
    
    if (loggingEnabled) {
      console.log('NavigationDropdown: 计算下拉菜单位置');
      console.log(`NavigationDropdown: 触发器位置 - left: ${triggerRect.left}, top: ${triggerRect.top}, right: ${triggerRect.right}, bottom: ${triggerRect.bottom}`);
      console.log(`NavigationDropdown: 视口尺寸 - width: ${viewportWidth}, height: ${viewportHeight}`);
    }
    
    // Mobile-specific positioning
    if (viewportWidth <= 640) {
      // On mobile, position dropdown at bottom of screen for better accessibility
      style.bottom = '1rem';
      style.left = '1rem';
      style.right = '1rem';
      style.width = 'auto';
      if (loggingEnabled) {
        console.log('NavigationDropdown: 移动端定位 - 底部全宽');
      }
    } else {
      // Desktop positioning
      // Horizontal positioning - adjust for mobile
      if (triggerRect.right + dropdownWidth > viewportWidth) {
        // Position to the left of trigger if it would overflow right
        style.right = `${viewportWidth - triggerRect.right}px`;
        if (loggingEnabled) {
          console.log(`NavigationDropdown: 水平定位 - 右对齐，right: ${style.right}`);
        }
      } else {
        // Default position to the right of trigger
        style.left = `${triggerRect.left}px`;
        if (loggingEnabled) {
          console.log(`NavigationDropdown: 水平定位 - 左对齐，left: ${style.left}`);
        }
      }
      
      // Vertical positioning - adjust for mobile
      if (triggerRect.bottom + dropdownHeight > viewportHeight) {
        // Position above trigger if it would overflow bottom
        style.bottom = `${viewportHeight - triggerRect.top}px`;
        if (loggingEnabled) {
          console.log(`NavigationDropdown: 垂直定位 - 上方，bottom: ${style.bottom}`);
        }
      } else {
        // Default position below trigger
        style.top = `${triggerRect.bottom + 8}px`;
        if (loggingEnabled) {
          console.log(`NavigationDropdown: 垂直定位 - 下方，top: ${style.top}`);
        }
      }
    }
    
    if (loggingEnabled) {
      console.log('NavigationDropdown: 最终样式:', style);
    }
    return style;
  };

  const dropdownContent = isOpen ? (
    <>
      {/* Backdrop to catch clicks - enhanced for mobile */}
      <div 
        className={`fixed inset-0 ${window.innerWidth <= 640 ? 'bg-black/50' : 'bg-transparent'}`}
        style={{ 
          zIndex: 999998,
          pointerEvents: 'auto'
        }}
        // Remove onClick handler from backdrop to prevent conflicts
      />
      
      {/* Dropdown Content - enhanced for mobile */}
      <div 
        ref={dropdownRef}
        className={`${window.innerWidth <= 640 ? 'mobile-dropdown' : 'w-56 sm:w-64'} bg-dark-card backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-gray-500 overflow-hidden`}
        style={{
          ...getDropdownStyle(),
          pointerEvents: 'auto', // Explicitly enable pointer events for dropdown content
        }}
        onClick={(e) => {
          // Prevent clicks inside dropdown from propagating
          e.stopPropagation();
          if (loggingEnabled) {
            console.log('NavigationDropdown: 点击下拉菜单内容，阻止事件冒泡');
          }
        }}
      >
        {/* User Greeting Header - mobile optimized */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-dark-surface to-dark-muted border-b-2 border-gray-500">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg">
              <UserIcon size={16} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-dark-text font-bold text-sm sm:text-lg truncate mobile-text-base">{userProfile.name}</p>
            </div>
          </div>
        </div>

        {/* Menu Items - mobile optimized */}
        <div className="py-2" style={{ pointerEvents: 'auto' }}>
          <button
            onClick={handleMenuItemClick(onNavigateToCustomization, '自定义')}
            disabled={isNavigating || isClosing}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-hover transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            style={{ 
              pointerEvents: 'auto',
              cursor: (isNavigating || isClosing) ? 'not-allowed' : 'pointer'
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-theme-secondary to-theme-accent rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <PaletteIcon size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">🎨 自定义</p>
              <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">个性化博客外观</p>
            </div>
          </button>

          {/* Game Mod Module - Navigates to route */}
          <button
            onClick={handleMenuItemClick(onNavigateToGameMod, '游戏Mod模块')}
            disabled={isNavigating || isClosing}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-hover transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            style={{ 
              pointerEvents: 'auto',
              cursor: (isNavigating || isClosing) ? 'not-allowed' : 'pointer'
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <GamepadIcon size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">🎮 游戏Mod模块</p>
              <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">游戏相关功能</p>
            </div>
          </button>

          {/* Mining Leaderboard Button - Hidden as per user request */}
          {/* The button code is kept but not rendered to maintain code integrity */}
          {false && (
            <button
              onClick={handleMenuItemClick(onNavigateToLeaderboard, '挖矿排行榜')}
              disabled={isNavigating || isClosing}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-hover transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              style={{ 
                pointerEvents: 'auto',
                cursor: (isNavigating || isClosing) ? 'not-allowed' : 'pointer'
              }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrophyIcon size={12} className="text-white sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">🏆 挖矿排行榜</p>
                <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">查看矿工金币排名</p>
              </div>
            </button>
          )}

          <button
            onClick={handleMenuItemClick(onNavigateToProfile, '个人页面')}
            disabled={isNavigating || isClosing}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-hover transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            style={{ 
              pointerEvents: 'auto',
              cursor: (isNavigating || isClosing) ? 'not-allowed' : 'pointer'
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-dark-success to-dark-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <UserIcon size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">👤 个人页面</p>
              <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">管理个人信息</p>
            </div>
          </button>

          {/* Management System - Only visible to super user */}
          {isSuperUser && (
            <button
              onClick={handleMenuItemClick(onNavigateToManagement, '管理系统')}
              disabled={isNavigating || isClosing}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-error/20 transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              style={{ 
                pointerEvents: 'auto',
                cursor: (isNavigating || isClosing) ? 'not-allowed' : 'pointer'
              }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-dark-error to-dark-warning rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <SettingsIcon size={12} className="text-white sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">⚙️ 管理系统</p>
                <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">文章审核和管理</p>
              </div>
            </button>
          )}

          {/* Logout Option */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLogout();
            }}
            disabled={isNavigating || isClosing}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-error/20 transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-gray-500 mt-2 touch-target"
            style={{ 
              pointerEvents: 'auto',
              cursor: (isNavigating || isClosing) ? 'not-allowed' : 'pointer'
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-dark-error to-dark-warning rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <LogOutIcon size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">🚪 登出</p>
              <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">退出当前账户</p>
            </div>
          </button>
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="relative" style={{ pointerEvents: 'auto' }}>
      {/* Dropdown Trigger - mobile optimized */}
      <button
        ref={triggerRef}
        onClick={handleToggleDropdown}
        disabled={isNavigating || isClosing}
        className="flex items-center space-x-2 sm:space-x-3 bg-dark-surface hover:bg-dark-hover px-3 sm:px-4 py-2 sm:py-3 rounded-2xl border-3 border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 touch-target"
        style={{ 
          pointerEvents: 'auto',
          cursor: (isNavigating || isClosing) ? 'not-allowed' : 'pointer'
        }}
      >
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg">
            <UserIcon size={12} className="text-white sm:w-4 sm:h-4" />
          </div>
          <span className="text-dark-text font-bold text-sm sm:text-base mobile-text-sm truncate max-w-16 sm:max-w-none">
            {(isNavigating || isClosing) ? '处理中...' : userProfile.name}
          </span>
        </div>
        <ChevronDownIcon 
          size={12} 
          className={`text-dark-text-secondary transition-transform duration-300 sm:w-4 sm:h-4 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Portal the dropdown to document.body to ensure it's always on top */}
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
}
