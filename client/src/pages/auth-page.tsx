import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Redirect } from "wouter";
import { Eye, EyeOff } from "lucide-react";

type LoginData = Pick<InsertUser, "username" | "password">;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(insertUserSchema.pick({ username: true, password: true })),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: InsertUser) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Forms */}
        <div className="flex flex-col space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              Aeke-Kingdom
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Admin Portal Access</p>
          </div>

          <div className="flex rounded-lg p-1 bg-gray-200 dark:bg-gray-700">
            <Button
              type="button"
              variant={isLogin ? "default" : "ghost"}
              className={`flex-1 ${isLogin 
                ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg" 
                : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "default" : "ghost"}
              className={`flex-1 ${!isLogin 
                ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg" 
                : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </Button>
          </div>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-transparent bg-gradient-to-r p-[2px] from-pink-500/20 to-blue-500/20 rounded-xl shadow-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              {isLogin ? (
                // Login Form
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
                              {...field}
                              className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...field}
                                className="focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              ) : (
                // Register Form
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Choose a username"
                              {...field}
                              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                {...field}
                                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </Card>
        </div>

        {/* Right Side - Hero Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
            <div className="relative bg-gradient-to-r from-pink-500 to-blue-500 p-1 rounded-full inline-block">
              <div className="bg-white dark:bg-gray-800 rounded-full p-8">
                <div className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  AK
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to the Kingdom
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Your comprehensive admin panel for managing movies, TV series, and anime content with style and efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-pink-200 dark:border-pink-800">
              <div className="text-2xl mb-2">🎬</div>
              <div className="font-semibold text-pink-600 dark:text-pink-400">Movies</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Manage your movie library</div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-blue-200 dark:border-blue-800">
              <div className="text-2xl mb-2">📺</div>
              <div className="font-semibold text-blue-600 dark:text-blue-400">TV Series</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Organize episodes & seasons</div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-pink-200 dark:border-pink-800">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold text-pink-600 dark:text-pink-400">Anime</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Multiple quality options</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
