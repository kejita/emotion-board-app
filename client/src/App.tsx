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
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

function Router() {
  const { user } = useApp();

  // Show onboarding if no user
  if (!user) {
    return (
      <main>
        <OnboardingPage />
      </main>
    );
  }

  return (
    <main>
      <Switch>
        <Route path={"/"} component={HomePage} />
        <Route path={"/post"} component={PostPage} />
        <Route path={"/search"} component={SearchPage} />
        <Route path={"/profile"} component={ProfilePage} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
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
