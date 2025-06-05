import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertGenreSchema, type InsertGenre } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2 } from "lucide-react";

export function GenreForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movieGenres } = useQuery({
    queryKey: ["/api/genres/movies"],
  });

  const { data: seriesGenres } = useQuery({
    queryKey: ["/api/genres/series"],
  });

  const { data: animeGenres } = useQuery({
    queryKey: ["/api/genres/anime"],
  });

  const form = useForm<InsertGenre>({
    resolver: zodResolver(insertGenreSchema),
    defaultValues: {
      name: "",
      category: "movies",
    },
  });

  const createGenreMutation = useMutation({
    mutationFn: async (data: InsertGenre) => {
      const res = await apiRequest("POST", "/api/genres", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Genre added successfully!",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/genres"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteGenreMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/genres/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Genre deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/genres"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertGenre) => {
    createGenreMutation.mutate(data);
  };

  const handleDeleteGenre = (id: number) => {
    if (confirm("Are you sure you want to delete this genre?")) {
      deleteGenreMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Genre Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Movie Genres */}
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-pink-500 dark:text-pink-400">
              Movie Genres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {movieGenres?.map((genre: any) => (
                <div key={genre.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span>{genre.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteGenre(genre.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Series Genres */}
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-blue-500/10 to-pink-500/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
              TV Series Genres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {seriesGenres?.map((genre: any) => (
                <div key={genre.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span>{genre.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteGenre(genre.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anime Genres */}
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-pink-500 dark:text-pink-400">
              Anime Genres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {animeGenres?.map((genre: any) => (
                <div key={genre.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span>{genre.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteGenre(genre.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Genre Form */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-blue-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
            Add New Genre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter genre name" 
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="movies">Movies</SelectItem>
                        <SelectItem value="series">TV Series</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-end">
                <Button 
                  type="submit" 
                  disabled={createGenreMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {createGenreMutation.isPending ? "Adding..." : "Add Genre"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
