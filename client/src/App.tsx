/**
 * App.tsx
 * ルーティングとグローバルレイアウト
 * 
 * Design Philosophy: Emotion Palette - Warm Minimalism
 * - 感情を色彩で表現（ゴールド、スレートブルー、コーラルピンク、ディープオレンジ）
 * - 温かみのあるクリーム色背景
 * - ミニマルなデザインで投稿内容に焦点
 * - スムーズなアニメーション
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";

// Route-based code splitting: each page is loaded only when needed
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal loading fallback — keeps layout stable during chunk load
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  const { user } = useApp();

  // Show onboarding if no user
  if (!user) {
    return (
      <main>
        <Suspense fallback={<PageLoader />}>
          <OnboardingPage />
        </Suspense>
      </main>
    );
  }

  return (
    <main>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path={"/"} component={HomePage} />
          <Route path={"/post"} component={PostPage} />
          <Route path={"/search"} component={SearchPage} />
          <Route path={"/profile"} component={ProfilePage} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </main>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
