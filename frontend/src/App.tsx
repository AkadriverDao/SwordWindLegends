import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { CustomizationProvider } from './components/CustomizationProvider';
import { ThemeProvider } from './components/ThemeProvider';
import { useCustomizationContext } from './components/CustomizationProvider';
import UserProfileSetup from './components/UserProfileSetup';
import BlogDashboard from './components/BlogDashboard';
import ProfilePage from './components/ProfilePage';
import ArticleReader from './components/ArticleReader';
import LeaderboardPage from './components/LeaderboardPage';
import BlogCustomizationPage from './components/BlogCustomizationPage';
import ManagementSystemPage from './components/ManagementSystemPage';
import CategoryPage from './components/CategoryPage';
import LandMinerGamePage from './components/LandMinerGamePage';
import GoldExchangePage from './components/GoldExchangePage';
import GameModPage from './components/GameModPage';
import GameModDetailPage from './components/GameModDetailPage';
import CartoonAnimation from './components/CartoonAnimation';
import Header from './components/Header';

// Custom routing types and state management
type Route = '/' | '/profile' | '/leaderboard' | '/customize' | '/article' | '/management' | '/category' | '/landminer' | '/goldexchange' | '/game-mod' | '/game-mod-detail';

interface RouterState {
  currentRoute: Route;
  articleId?: string;
  categoryName?: string;
  gameModId?: string;
}

// Enhanced route parsing function to handle all URL patterns including game-mod detail
function parseRouteFromPath(path: string): RouterState {
  // Remove trailing slash and normalize path
  const normalizedPath = path.replace(/\/$/, '') || '/';
  
  console.log('App: 解析路由路径', normalizedPath);
  
  // Handle root path
  if (normalizedPath === '/') {
    return { currentRoute: '/' };
  }
  
  // Handle simple routes
  if (normalizedPath === '/profile') {
    return { currentRoute: '/profile' };
  }
  
  if (normalizedPath === '/leaderboard') {
    return { currentRoute: '/leaderboard' };
  }
  
  if (normalizedPath === '/customize') {
    return { currentRoute: '/customize' };
  }
  
  if (normalizedPath === '/management') {
    return { currentRoute: '/management' };
  }
  
  if (normalizedPath === '/landminer') {
    console.log('App: 识别到土地矿工路由');
    return { currentRoute: '/landminer' };
  }
  
  if (normalizedPath === '/goldexchange') {
    console.log('App: 识别到金币兑换路由');
    return { currentRoute: '/goldexchange' };
  }
  
  if (normalizedPath === '/game-mod') {
    console.log('App: 识别到游戏Mod模块路由');
    return { currentRoute: '/game-mod' };
  }
  
  // Handle parameterized routes
  const gameModDetailMatch = normalizedPath.match(/^\/game-mod\/(.+)$/);
  if (gameModDetailMatch) {
    console.log('App: 识别到游戏Mod详情路由');
    return { 
      currentRoute: '/game-mod-detail', 
      gameModId: gameModDetailMatch[1] 
    };
  }
  
  const articleMatch = normalizedPath.match(/^\/article\/(.+)$/);
  if (articleMatch) {
    return { 
      currentRoute: '/article', 
      articleId: articleMatch[1] 
    };
  }
  
  const categoryMatch = normalizedPath.match(/^\/category\/(.+)$/);
  if (categoryMatch) {
    return { 
      currentRoute: '/category', 
      categoryName: decodeURIComponent(categoryMatch[1]) 
    };
  }
  
  // Default fallback to home for unknown routes
  console.warn(`App: 未知路由: ${normalizedPath}, 重定向到首页`);
  return { currentRoute: '/' };
}

// Custom routing hook for managing navigation state
function useCustomRouter() {
  const [router, setRouter] = useState<RouterState>({ currentRoute: '/' });

  // Initialize route from URL on mount with enhanced parsing
  useEffect(() => {
    const initializeRoute = () => {
      const path = window.location.pathname;
      console.log('App: 初始化路由，当前路径:', path);
      const parsedRoute = parseRouteFromPath(path);
      console.log('App: 解析后的路由:', parsedRoute);
      setRouter(parsedRoute);
      
      // Update URL if it was normalized or redirected
      const expectedUrl = getUrlFromRoute(parsedRoute);
      if (path !== expectedUrl) {
        console.log('App: 更新URL从', path, '到', expectedUrl);
        window.history.replaceState({}, '', expectedUrl);
      }
    };

    initializeRoute();
  }, []);

  // Handle browser back/forward buttons with enhanced parsing
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const path = window.location.pathname;
      console.log('App: 浏览器导航事件，路径:', path);
      const parsedRoute = parseRouteFromPath(path);
      console.log('App: 浏览器导航解析后的路由:', parsedRoute);
      setRouter(parsedRoute);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper function to generate URL from route state
  const getUrlFromRoute = (routeState: RouterState): string => {
    switch (routeState.currentRoute) {
      case '/':
        return '/';
      case '/profile':
        return '/profile';
      case '/leaderboard':
        return '/leaderboard';
      case '/customize':
        return '/customize';
      case '/management':
        return '/management';
      case '/landminer':
        return '/landminer';
      case '/goldexchange':
        return '/goldexchange';
      case '/game-mod':
        return '/game-mod';
      case '/game-mod-detail':
        return routeState.gameModId ? `/game-mod/${routeState.gameModId}` : '/game-mod';
      case '/article':
        return routeState.articleId ? `/article/${routeState.articleId}` : '/';
      case '/category':
        return routeState.categoryName ? `/category/${encodeURIComponent(routeState.categoryName)}` : '/';
      default:
        return '/';
    }
  };

  // Navigation function with URL synchronization and enhanced route handling
  const navigate = (route: Route, params?: { articleId?: string; categoryName?: string; gameModId?: string }) => {
    console.log('App: 导航请求', route, params);
    
    const newRouter: RouterState = {
      currentRoute: route,
      articleId: params?.articleId,
      categoryName: params?.categoryName,
      gameModId: params?.gameModId,
    };

    console.log('App: 新路由状态', newRouter);
    setRouter(newRouter);

    // Generate the correct URL
    const url = getUrlFromRoute(newRouter);
    console.log('App: 生成的URL', url);

    // Only update URL if it's different from current
    if (window.location.pathname !== url) {
      console.log('App: 更新浏览器URL到', url);
      window.history.pushState({}, '', url);
    }
  };

  return { router, navigate };
}

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { customization } = useCustomizationContext();
  const { router, navigate } = useCustomRouter();
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Use customized blog title
  const blogTitle = customization.blogTitle || "Sword Wind Legends";

  // Update document title based on current route and user customization
  useEffect(() => {
    const getPageTitle = () => {
      switch (router.currentRoute) {
        case '/profile':
          return `个人页面 - ${blogTitle}`;
        case '/leaderboard':
          return `排行榜 - ${blogTitle}`;
        case '/customize':
          return `自定义 - ${blogTitle}`;
        case '/article':
          return `阅读 - ${blogTitle}`;
        case '/management':
          return `管理系统 - ${blogTitle}`;
        case '/landminer':
          return `土地矿工 - ${blogTitle}`;
        case '/goldexchange':
          return `金币兑换 - ${blogTitle}`;
        case '/game-mod':
          return `游戏展示区 - ${blogTitle}`;
        case '/game-mod-detail':
          return `游戏详情 - ${blogTitle}`;
        case '/category':
          return `${router.categoryName || '分类'} - ${blogTitle}`;
        default:
          return blogTitle;
      }
    };

    document.title = getPageTitle();
  }, [router.currentRoute, router.categoryName, blogTitle]);

  // Debug current route
  useEffect(() => {
    console.log('App: 当前路由状态', router);
  }, [router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface flex items-center justify-center relative overflow-hidden">
        <CartoonAnimation />
        <div className="text-center bg-dark-card backdrop-blur-sm rounded-3xl p-6 sm:p-12 shadow-2xl border-4 border-dark-accent max-w-xs sm:max-w-md mx-4">
          <div className="animate-bounce rounded-full h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-theme-primary to-theme-secondary mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <div className="sword-logo text-white text-lg sm:text-2xl">⚔️</div>
          </div>
          <p className="text-dark-text text-lg sm:text-xl font-bold">正在初始化...</p>
        </div>
      </div>
    );
  }

  if (showProfileSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface relative overflow-hidden theme-applied">
        <CartoonAnimation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 relative z-10">
          <UserProfileSetup />
        </main>
      </div>
    );
  }

  const renderCurrentRoute = () => {
    console.log('App: 渲染当前路由', router.currentRoute);
    
    // Check if route requires authentication
    const protectedRoutes = ['/profile', '/customize', '/management', '/landminer', '/goldexchange', '/game-mod', '/game-mod-detail'];
    const requiresAuth = protectedRoutes.includes(router.currentRoute);

    if (requiresAuth && !isAuthenticated) {
      console.log('App: 受保护的路由需要认证，重定向到首页');
      // Redirect to home for protected routes when not authenticated
      navigate('/');
      return null;
    }

    // Check if user profile is required for authenticated routes
    if (requiresAuth && isAuthenticated && !userProfile && !profileLoading) {
      return (
        <div className="space-y-8">
          <div className="text-center bg-dark-card backdrop-blur-sm rounded-3xl p-6 sm:p-12 border-4 border-theme-accent shadow-2xl mx-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <div className="sword-logo text-white text-2xl sm:text-3xl">⚔️</div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-text mb-4">
              🌟 {blogTitle}
            </h2>
            <p className="text-dark-text-secondary text-base sm:text-lg font-medium">
              请先完成用户资料设置
            </p>
          </div>
        </div>
      );
    }

    switch (router.currentRoute) {
      case '/':
        console.log('App: 渲染首页');
        return <BlogDashboard navigate={navigate} />;
      case '/profile':
        console.log('App: 渲染个人页面');
        return <ProfilePage navigate={navigate} />;
      case '/leaderboard':
        console.log('App: 渲染排行榜页面');
        return <LeaderboardPage navigate={navigate} />;
      case '/customize':
        console.log('App: 渲染自定义页面');
        return <BlogCustomizationPage navigate={navigate} />;
      case '/management':
        console.log('App: 渲染管理系统页面');
        return <ManagementSystemPage navigate={navigate} />;
      case '/landminer':
        console.log('App: 渲染土地矿工游戏页面');
        return <LandMinerGamePage navigate={navigate} />;
      case '/goldexchange':
        console.log('App: 渲染金币兑换页面');
        return <GoldExchangePage navigate={navigate} />;
      case '/game-mod':
        console.log('App: 渲染游戏Mod模块页面');
        return <GameModPage navigate={navigate} />;
      case '/game-mod-detail':
        console.log('App: 渲染游戏Mod详情页面', router.gameModId);
        return <GameModDetailPage gameModId={router.gameModId} navigate={navigate} />;
      case '/article':
        console.log('App: 渲染文章阅读页面', router.articleId);
        return <ArticleReader articleId={router.articleId} navigate={navigate} />;
      case '/category':
        console.log('App: 渲染分类页面', router.categoryName);
        return <CategoryPage categoryName={router.categoryName} navigate={navigate} />;
      default:
        console.log('App: 默认渲染首页');
        return <BlogDashboard navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface relative overflow-hidden theme-applied">
      <CartoonAnimation />
      
      <Header 
        blogTitle={blogTitle} 
        userProfile={userProfile} 
        navigate={navigate} 
        isAuthenticated={isAuthenticated}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 relative z-10">
        {renderCurrentRoute()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CustomizationProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </CustomizationProvider>
  );
}
