import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  Zap, 
  Tags, 
  Settings,
  Lightbulb // Add Lightbulb icon
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "TV Series", href: "/series", icon: Tv },
  { name: "Anime", href: "/anime", icon: Zap },
  { name: "Genres", href: "/genres", icon: Tags },
  { name: "Suggestions", href: "/suggestions", icon: Lightbulb },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 z-40">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Aeke-Kingdom
        </h2>
      </div>

      <nav className="mt-6">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 hover:text-white transition-all duration-200 group ${
                isActive 
                  ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg" 
                  : ""
              }`}
            >
              <item.icon className="mr-3 h-5 w-5 group-hover:animate-pulse" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}