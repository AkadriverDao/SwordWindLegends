import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  LogOutIcon,
  PaletteIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { UserProfile } from "../types/backend";

interface NavigationDropdownProps {
  userProfile: UserProfile;
  isSuperUser: boolean;
  onNavigateToProfile: () => void;
  onNavigateToCustomization: () => void;
  onNavigateToManagement: () => void;
}

export default function NavigationDropdown({
  userProfile,
  isSuperUser,
  onNavigateToProfile,
  onNavigateToCustomization,
  onNavigateToManagement,
}: NavigationDropdownProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
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
      const isOutsideTrigger =
        triggerRef.current && !triggerRef.current.contains(target);
      const isOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(target);

      if (isOpen && isOutsideTrigger && isOutsideDropdown && !isClosing) {
        // Add a small delay to ensure any pending click events are processed
        setIsClosing(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
        }, 50); // 50ms delay to allow click events to process
      }
    }

    if (isOpen) {
      // Use click event instead of mousedown for better timing
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
  }, [isOpen, isClosing]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    if (isNavigating || isClosing) {
      return;
    }

    setIsNavigating(true);
    setIsClosing(true);

    // Close menu immediately for better UX
    setIsOpen(false);

    try {
      await clear();
      queryClient.clear();
    } catch (error) {
      console.error("NavigationDropdown: 登出错误:", error);
    } finally {
      // Reset navigation state after logout completes
      setTimeout(() => {
        setIsNavigating(false);
        setIsClosing(false);
      }, 100);
    }
  }, [clear, queryClient, isNavigating, isClosing]);

  // Optimized menu item click handler with improved timing
  const handleMenuItemClick = useCallback(
    (navigationAction: () => void, actionName: string) => {
      return (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Prevent multiple rapid clicks during navigation
        if (isNavigating || isClosing) {
          return;
        }

        setIsNavigating(true);
        setIsClosing(true);

        // Close menu immediately for better UX
        setIsOpen(false);

        // Use a longer delay to ensure proper event processing
        setTimeout(() => {
          try {
            navigationAction();
          } catch (error) {
            console.error(`NavigationDropdown: ${actionName} 导航错误:`, error);
          } finally {
            // Reset navigation state after navigation completes
            setTimeout(() => {
              setIsNavigating(false);
              setIsClosing(false);
            }, 100);
          }
        }, 10); // Small delay to ensure click event is fully processed
      };
    },
    [isNavigating, isClosing],
  );

  // Toggle dropdown with proper state management
  const handleToggleDropdown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isNavigating || isClosing) {
        return;
      }

      setIsOpen((prev) => !prev);
    },
    [isNavigating, isClosing],
  );

  // Calculate dropdown position to ensure it's always visible - enhanced for mobile
  const getDropdownStyle = () => {
    if (!triggerRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = 400; // Approximate height of dropdown
    const dropdownWidth =
      window.innerWidth <= 640 ? Math.min(280, viewportWidth - 32) : 256; // Mobile responsive width

    const style: React.CSSProperties = {
      position: "fixed",
      zIndex: 999999, // Extremely high z-index to ensure it's always on top
      pointerEvents: "auto", // Explicitly enable pointer events
    };

    // Mobile-specific positioning
    if (viewportWidth <= 640) {
      // On mobile, position dropdown at bottom of screen for better accessibility
      style.bottom = "1rem";
      style.left = "1rem";
      style.right = "1rem";
      style.width = "auto";
    } else {
      // Desktop positioning
      // Horizontal positioning - adjust for mobile
      if (triggerRect.right + dropdownWidth > viewportWidth) {
        // Position to the left of trigger if it would overflow right
        style.right = `${viewportWidth - triggerRect.right}px`;
      } else {
        // Default position to the right of trigger
        style.left = `${triggerRect.left}px`;
      }

      // Vertical positioning - adjust for mobile
      if (triggerRect.bottom + dropdownHeight > viewportHeight) {
        // Position above trigger if it would overflow bottom
        style.bottom = `${viewportHeight - triggerRect.top}px`;
      } else {
        // Default position below trigger
        style.top = `${triggerRect.bottom + 8}px`;
      }
    }

    return style;
  };

  const dropdownContent = isOpen ? (
    <>
      {/* Backdrop to catch clicks - enhanced for mobile */}
      <div
        className={`fixed inset-0 ${window.innerWidth <= 640 ? "bg-black/50" : "bg-transparent"}`}
        style={{
          zIndex: 999998,
          pointerEvents: "auto",
        }}
        // Remove onClick handler from backdrop to prevent conflicts
      />

      {/* Dropdown Content - enhanced for mobile */}
      <div
        ref={dropdownRef}
        role="menu"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggleDropdown(e as unknown as React.MouseEvent);
          }
        }}
        className={`${window.innerWidth <= 640 ? "mobile-dropdown" : "w-56 sm:w-64"} bg-dark-card backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-gray-500 overflow-hidden`}
        style={{
          ...getDropdownStyle(),
          pointerEvents: "auto", // Explicitly enable pointer events for dropdown content
        }}
        onClick={(e) => {
          // Prevent clicks inside dropdown from propagating
          e.stopPropagation();
        }}
      >
        {/* User Greeting Header - mobile optimized */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-dark-surface to-dark-muted border-b-2 border-gray-500">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg">
              <UserIcon size={16} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-dark-text font-bold text-sm sm:text-lg truncate mobile-text-base">
                {userProfile.name}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items - mobile optimized */}
        <div className="py-2" style={{ pointerEvents: "auto" }}>
          <button
            type="button"
            onClick={handleMenuItemClick(onNavigateToCustomization, "自定义")}
            disabled={isNavigating || isClosing}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-hover transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            style={{
              pointerEvents: "auto",
              cursor: isNavigating || isClosing ? "not-allowed" : "pointer",
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-theme-secondary to-theme-accent rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <PaletteIcon size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">
                🎨 自定义
              </p>
              <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">
                个性化博客外观
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleMenuItemClick(onNavigateToProfile, "个人页面")}
            disabled={isNavigating || isClosing}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-hover transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            style={{
              pointerEvents: "auto",
              cursor: isNavigating || isClosing ? "not-allowed" : "pointer",
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-dark-success to-dark-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <UserIcon size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">
                👤 个人页面
              </p>
              <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">
                管理个人信息
              </p>
            </div>
          </button>

          {/* Management System - Only visible to super user */}
          {isSuperUser && (
            <button
              type="button"
              onClick={handleMenuItemClick(onNavigateToManagement, "管理系统")}
              disabled={isNavigating || isClosing}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-error/20 transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              style={{
                pointerEvents: "auto",
                cursor: isNavigating || isClosing ? "not-allowed" : "pointer",
              }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-dark-error to-dark-warning rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <SettingsIcon size={12} className="text-white sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">
                  ⚙️ 管理系统
                </p>
                <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">
                  文章审核和管理
                </p>
              </div>
            </button>
          )}

          {/* Logout Option */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLogout();
            }}
            disabled={isNavigating || isClosing}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 mobile-nav-item text-left hover:bg-dark-error/20 transition-all duration-300 flex items-center space-x-2 sm:space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-gray-500 mt-2 touch-target"
            style={{
              pointerEvents: "auto",
              cursor: isNavigating || isClosing ? "not-allowed" : "pointer",
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 mobile-nav-icon bg-gradient-to-r from-dark-error to-dark-warning rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <LogOutIcon size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-dark-text font-bold text-sm sm:text-base mobile-text-base">
                🚪 登出
              </p>
              <p className="text-dark-text-secondary text-xs sm:text-sm mobile-text-sm">
                退出当前账户
              </p>
            </div>
          </button>
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="relative" style={{ pointerEvents: "auto" }}>
      {/* Dropdown Trigger - mobile optimized */}
      <button
        type="button"
        ref={triggerRef}
        onClick={handleToggleDropdown}
        disabled={isNavigating || isClosing}
        className="flex items-center space-x-2 sm:space-x-3 bg-dark-surface hover:bg-dark-hover px-3 sm:px-4 py-2 sm:py-3 rounded-2xl border-3 border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 touch-target"
        style={{
          pointerEvents: "auto",
          cursor: isNavigating || isClosing ? "not-allowed" : "pointer",
        }}
      >
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg">
            <UserIcon size={12} className="text-white sm:w-4 sm:h-4" />
          </div>
          <span className="text-dark-text font-bold text-sm sm:text-base mobile-text-sm truncate max-w-16 sm:max-w-none">
            {isNavigating || isClosing ? "处理中..." : userProfile.name}
          </span>
        </div>
        <ChevronDownIcon
          size={12}
          className={`text-dark-text-secondary transition-transform duration-300 sm:w-4 sm:h-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Portal the dropdown to document.body to ensure it's always on top */}
      {typeof document !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
