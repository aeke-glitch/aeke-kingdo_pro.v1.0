import { MovieForm } from "@/components/movie-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash2, ExternalLink } from "lucide-react";

export default function Movies() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movies, isLoading } = useQuery({
    queryKey: ["/api/movies"],
  });

  const deleteMovieMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/movies/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Movie deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
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

  const handleDeleteMovie = (id: number) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      deleteMovieMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Movie Management
        </h1>
      </div>

      <MovieForm />

      {/* Movies List */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
            Movies Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading movies...</p>
            </div>
          ) : movies?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No movies found. Add your first movie above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Links</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies?.map((movie: any) => (
                    <TableRow key={movie.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <TableCell className="font-medium">{movie.title}</TableCell>
                      <TableCell>{movie.year}</TableCell>
                      <TableCell>
                        <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                          {movie.genre}
                        </Badge>
                      </TableCell>
                      <TableCell>{movie.rating}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {movie.torrentLink && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(movie.torrentLink, '_blank')}
                              className="text-xs"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Torrent
                            </Button>
                          )}
                          {movie.magnetLink && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(movie.magnetLink)}
                              className="text-xs"
                            >
                              Magnet
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
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
                            onClick={() => handleDeleteMovie(movie.id)}
                            disabled={deleteMovieMutation.isPending}
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
