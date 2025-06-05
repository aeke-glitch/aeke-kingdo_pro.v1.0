import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Film, Tv, Zap, Tags, Lightbulb } from "lucide-react";

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Movies",
      value: stats?.movies || 0,
      icon: Film,
      color: "text-pink-500",
      bgColor: "text-blue-500",
    },
    {
      title: "TV Series",
      value: stats?.series || 0,
      icon: Tv,
      color: "text-blue-500",
      bgColor: "text-pink-500",
    },
    {
      title: "Anime Shows",
      value: stats?.anime || 0,
      icon: Zap,
      color: "text-pink-500",
      bgColor: "text-blue-500",
    },
    {
      title: "Total Genres",
      value: stats?.genres || 0,
      icon: Tags,
      color: "text-blue-500",
      bgColor: "text-pink-500",
    },
    {
      title: "Pending Suggestions",
      value: stats?.suggestions || 0,
      icon: Lightbulb,
      color: "text-pink-500",
      bgColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((card, index) => (
        <Card 
          key={card.title}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 border-2 border-transparent hover:border-gradient-to-r hover:from-pink-500 hover:to-blue-500"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <card.icon className={`text-3xl ${card.bgColor} opacity-50`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
