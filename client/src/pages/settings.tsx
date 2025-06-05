import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/theme-provider";
import { Info } from "lucide-react";
import { useEffect } from "react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  // Update page title
  useEffect(() => {
    const header = document.querySelector("main h1");
    if (header) {
      header.textContent = "Settings";
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Settings
        </h1>
      </div>

      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toggle between light and dark themes
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Light</span>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-blue-500"
              />
              <span className="text-sm text-gray-500">Dark</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Info className="mr-2 h-4 w-4 text-blue-500" />
              <span>Theme changes will be applied immediately and saved to your preferences.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings Sections */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-blue-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pink-500 dark:text-pink-400">
            About Aeke-Kingdom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Admin Panel</span>
              <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Aeke-Kingdom
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <span className="text-sm font-medium">Neon Fusion</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A comprehensive admin panel for managing movies, TV series, and anime content with modern design and powerful features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
