import React, { useState, useEffect, Suspense, lazy } from "react";
import ArticleReader from "./components/ArticleReader";
import BlogDashboard from "./components/BlogDashboard";
import CartoonAnimation from "./components/CartoonAnimation";
import CategoryPage from "./components/CategoryPage";
import { CustomizationProvider } from "./components/CustomizationProvider";
import { useCustomizationContext } from "./components/CustomizationProvider";
import Header from "./components/Header";
import LeaderboardPage from "./components/LeaderboardPage";
import { ThemeProvider } from "./components/ThemeProvider";
import UserProfileSetup from "./components/UserProfileSetup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";

// Lazy load heavy pages for code splitting
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const BlogCustomizationPage = lazy(
  () => import("./components/BlogCustomizationPage"),
);
const ManagementSystemPage = lazy(
  () => import("./components/ManagementSystemPage"),
);
const LandMinerGamePage = lazy(() => import("./components/LandMinerGamePage"));
const GoldExchangePage = lazy(() => import("./components/GoldExchangePage"));

// Custom routing types and state management
type Route =
  | "/"
  | "/profile"
  | "/leaderboard"
  | "/customize"
  | "/article"
  | "/management"
  | "/category"
  | "/landminer"
  | "/goldexchange";

interface RouterState {
  currentRoute: Route;
  articleId?: string;
  categoryName?: string;
}

// Enhanced route parsing function to handle all URL patterns
function parseRouteFromPath(path: string): RouterState {
  // Remove trailing slash and normalize path
  const normalizedPath = path.replace(/\/$/, "") || "/";

  // Handle root path
  if (normalizedPath === "/") {
    return { currentRoute: "/" };
  }

  // Handle simple routes
  if (normalizedPath === "/profile") {
    return { currentRoute: "/profile" };
  }

  if (normalizedPath === "/leaderboard") {
    return { currentRoute: "/leaderboard" };
  }

  if (normalizedPath === "/customize") {
    return { currentRoute: "/customize" };
  }

  if (normalizedPath === "/management") {
    return { currentRoute: "/management" };
  }

  if (normalizedPath === "/landminer") {
    return { currentRoute: "/landminer" };
  }

  if (normalizedPath === "/goldexchange") {
    return { currentRoute: "/goldexchange" };
  }

  // Handle parameterized routes
  const articleMatch = normalizedPath.match(/^\/article\/(.+)$/);
  if (articleMatch) {
    return {
      currentRoute: "/article",
      articleId: articleMatch[1],
    };
  }

  const categoryMatch = normalizedPath.match(/^\/category\/(.+)$/);
  if (categoryMatch) {
    return {
      currentRoute: "/category",
      categoryName: decodeURIComponent(categoryMatch[1]),
    };
  }

  // Default fallback to home for unknown routes
  return { currentRoute: "/" };
}

// Custom routing hook for managing navigation state
function useCustomRouter() {
  const [router, setRouter] = useState<RouterState>({ currentRoute: "/" });

  // Initialize route from URL on mount with enhanced parsing
  useEffect(() => {
    const initializeRoute = () => {
      const path = window.location.pathname;
      const parsedRoute = parseRouteFromPath(path);
      setRouter(parsedRoute);

      // Update URL if it was normalized or redirected
      const expectedUrl = getUrlFromRoute(parsedRoute);
      if (path !== expectedUrl) {
        window.history.replaceState({}, "", expectedUrl);
      }
    };

    initializeRoute();
  }, []);

  // Handle browser back/forward buttons with enhanced parsing
  useEffect(() => {
    const handlePopState = (_event: PopStateEvent) => {
      const path = window.location.pathname;
      const parsedRoute = parseRouteFromPath(path);
      setRouter(parsedRoute);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Helper function to generate URL from route state
  const getUrlFromRoute = (routeState: RouterState): string => {
    switch (routeState.currentRoute) {
      case "/":
        return "/";
      case "/profile":
        return "/profile";
      case "/leaderboard":
        return "/leaderboard";
      case "/customize":
        return "/customize";
      case "/management":
        return "/management";
      case "/landminer":
        return "/landminer";
      case "/goldexchange":
        return "/goldexchange";
      case "/article":
        return routeState.articleId ? `/article/${routeState.articleId}` : "/";
      case "/category":
        return routeState.categoryName
          ? `/category/${encodeURIComponent(routeState.categoryName)}`
          : "/";
      default:
        return "/";
    }
  };

  // Navigation function with URL synchronization and enhanced route handling
  const navigate = (
    route: Route,
    params?: { articleId?: string; categoryName?: string },
  ) => {
    const newRouter: RouterState = {
      currentRoute: route,
      articleId: params?.articleId,
      categoryName: params?.categoryName,
    };

    setRouter(newRouter);

    // Generate the correct URL
    const url = getUrlFromRoute(newRouter);

    // Only update URL if it's different from current
    if (window.location.pathname !== url) {
      window.history.pushState({}, "", url);
    }
  };

  return { router, navigate };
}

function PageLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-theme-primary border-t-transparent mx-auto mb-4" />
        <p className="text-dark-text-secondary text-base font-medium">
          页面加载中...
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const { customization } = useCustomizationContext();
  const { router, navigate } = useCustomRouter();

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Use customized blog title
  const blogTitle = customization.blogTitle || "Sword Wind Legends";

  // Update document title based on current route and user customization
  useEffect(() => {
    const getPageTitle = () => {
      switch (router.currentRoute) {
        case "/profile":
          return `个人页面 - ${blogTitle}`;
        case "/leaderboard":
          return `排行榜 - ${blogTitle}`;
        case "/customize":
          return `自定义 - ${blogTitle}`;
        case "/article":
          return `阅读 - ${blogTitle}`;
        case "/management":
          return `管理系统 - ${blogTitle}`;
        case "/landminer":
          return `土地矿工 - ${blogTitle}`;
        case "/goldexchange":
          return `金币兑换 - ${blogTitle}`;
        case "/category":
          return `${router.categoryName || "分类"} - ${blogTitle}`;
        default:
          return blogTitle;
      }
    };

    document.title = getPageTitle();
  }, [router.currentRoute, router.categoryName, blogTitle]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface flex items-center justify-center relative overflow-hidden">
        <CartoonAnimation />
        <div className="text-center bg-dark-card backdrop-blur-sm rounded-3xl p-6 sm:p-12 shadow-2xl border-4 border-dark-accent max-w-xs sm:max-w-md mx-4">
          <div className="animate-bounce rounded-full h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-theme-primary to-theme-secondary mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <div className="sword-logo text-white text-lg sm:text-2xl">⚔️</div>
          </div>
          <p className="text-dark-text text-lg sm:text-xl font-bold">
            正在初始化...
          </p>
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
    // Check if route requires authentication
    const protectedRoutes = [
      "/profile",
      "/customize",
      "/management",
      "/landminer",
      "/goldexchange",
    ];
    const requiresAuth = protectedRoutes.includes(router.currentRoute);

    if (requiresAuth && !isAuthenticated) {
      // Redirect to home for protected routes when not authenticated
      navigate("/");
      return null;
    }

    // Check if user profile is required for authenticated routes
    if (requiresAuth && isAuthenticated && !userProfile && !profileLoading) {
      return (
        <div className="space-y-8">
          <div className="text-center bg-dark-card backdrop-blur-sm rounded-3xl p-6 sm:p-12 border-4 border-theme-accent shadow-2xl mx-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <div className="sword-logo text-white text-2xl sm:text-3xl">
                ⚔️
              </div>
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
      case "/":
        return <BlogDashboard navigate={navigate} />;
      case "/profile":
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <ProfilePage navigate={navigate} />
          </Suspense>
        );
      case "/leaderboard":
        return <LeaderboardPage navigate={navigate} />;
      case "/customize":
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <BlogCustomizationPage navigate={navigate} />
          </Suspense>
        );
      case "/management":
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <ManagementSystemPage navigate={navigate} />
          </Suspense>
        );
      case "/landminer":
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <LandMinerGamePage navigate={navigate} />
          </Suspense>
        );
      case "/goldexchange":
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <GoldExchangePage navigate={navigate} />
          </Suspense>
        );
      case "/article":
        return (
          <ArticleReader articleId={router.articleId} navigate={navigate} />
        );
      case "/category":
        return (
          <CategoryPage
            categoryName={router.categoryName}
            navigate={navigate}
          />
        );
      default:
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
