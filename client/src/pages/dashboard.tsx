import { DashboardStats } from "@/components/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Film, Tv, Zap } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6">
      <DashboardStats />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-pink-500 dark:text-pink-400">
              Quick Add Movie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/movies">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105">
                <Plus className="mr-2 h-4 w-4" />
                Add New Movie
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-blue-500/10 to-pink-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
              Quick Add Series
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/series">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                <Plus className="mr-2 h-4 w-4" />
                Add New Series
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-pink-500 dark:text-pink-400">
              Quick Add Anime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/anime">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105">
                <Plus className="mr-2 h-4 w-4" />
                Add New Anime
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-blue-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Film className="text-pink-500 mr-3 h-5 w-5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome to Aeke-Kingdom Admin Panel
                </span>
              </div>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Tv className="text-blue-500 mr-3 h-5 w-5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Admin panel initialized successfully
                </span>
              </div>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <Zap className="text-pink-500 mr-3 h-5 w-5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Ready to manage your content library
                </span>
              </div>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
