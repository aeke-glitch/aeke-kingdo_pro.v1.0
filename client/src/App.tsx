import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { Sidebar } from "@/components/sidebar";
import { TimeDisplay } from "@/components/time-display";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Movies from "@/pages/movies";
import Series from "@/pages/series";
import Anime from "@/pages/anime";
import Genres from "@/pages/genres";
import Suggestions from "@/pages/suggestions";
import Settings from "@/pages/settings";
import { useAuth } from "@/hooks/use-auth";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();

  if (!user) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {/* Dynamic title will be set by individual pages */}
            </h1>

            <div className="flex items-center space-x-4">
              <TimeDisplay />

              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/movies" component={Movies} />
      <ProtectedRoute path="/series" component={Series} />
      <ProtectedRoute path="/anime" component={Anime} />
      <ProtectedRoute path="/genres" component={Genres} />
      <ProtectedRoute path="/suggestions" component={Suggestions} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppLayout>
              <Router />
            </AppLayout>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;