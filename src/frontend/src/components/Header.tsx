import { useCallback } from "react";
import { useIsSuperUser } from "../hooks/useQueries";
import type { UserProfile } from "../types/backend";
import LoginButton from "./LoginButton";
import NavigationDropdown from "./NavigationDropdown";

interface HeaderProps {
  blogTitle: string;
  userProfile: UserProfile | null | undefined;
  navigate: (
    route:
      | "/"
      | "/profile"
      | "/leaderboard"
      | "/customize"
      | "/article"
      | "/management"
      | "/category"
      | "/landminer"
      | "/goldexchange",
    params?: { articleId?: string; categoryName?: string },
  ) => void;
  isAuthenticated: boolean;
}

export default function Header({
  blogTitle,
  userProfile,
  navigate,
  isAuthenticated,
}: HeaderProps) {
  const { isSuperUser } = useIsSuperUser();

  const handleNavigateToProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  const handleNavigateToCustomization = useCallback(() => {
    navigate("/customize");
  }, [navigate]);

  const handleNavigateToManagement = useCallback(() => {
    navigate("/management");
  }, [navigate]);

  const handleNavigateToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <header className="bg-dark-card backdrop-blur-sm border-b-4 border-dark-accent shadow-2xl sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Blog Title - Clickable to navigate home */}
        <button
          type="button"
          onClick={handleNavigateToHome}
          className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-300"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg">
            <div className="sword-logo text-white text-base sm:text-xl">⚔️</div>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-dark-text truncate max-w-32 sm:max-w-none">
            {blogTitle}
          </h1>
        </button>

        {/* User Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated && userProfile ? (
            <NavigationDropdown
              userProfile={userProfile}
              isSuperUser={isSuperUser}
              onNavigateToProfile={handleNavigateToProfile}
              onNavigateToCustomization={handleNavigateToCustomization}
              onNavigateToManagement={handleNavigateToManagement}
            />
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
