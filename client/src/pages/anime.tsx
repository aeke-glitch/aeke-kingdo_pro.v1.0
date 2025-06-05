import { AnimeForm } from "@/components/anime-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash2, Eye, Video } from "lucide-react";
import { useEffect } from "react";

export default function Anime() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: anime, isLoading } = useQuery({
    queryKey: ["/api/anime"],
  });

  const deleteAnimeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/anime/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Anime deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/anime"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteAnime = (id: number) => {
    if (confirm("Are you sure you want to delete this anime? This will also delete all episodes.")) {
      deleteAnimeMutation.mutate(id);
    }
  };

  // Update page title
  useEffect(() => {
    const header = document.querySelector("main h1");
    if (header) {
      header.textContent = "Anime Management";
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Anime Management
        </h1>
      </div>

      <AnimeForm />

      {/* Anime List */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
            Anime Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading anime...</p>
            </div>
          ) : anime?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No anime found. Add your first anime above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Studio</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anime?.map((animeItem: any) => (
                    <TableRow key={animeItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <TableCell className="font-medium">{animeItem.title}</TableCell>
                      <TableCell>{animeItem.year}</TableCell>
                      <TableCell>
                        <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                          {animeItem.genre}
                        </Badge>
                      </TableCell>
                      <TableCell>{animeItem.studio}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-purple-500 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            title="View Episodes"
                          >
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="Manage Episodes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteAnime(animeItem.id)}
                            disabled={deleteAnimeMutation.isPending}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
