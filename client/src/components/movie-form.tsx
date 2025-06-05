import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertMovieSchema, type InsertMovie } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Save, X } from "lucide-react";

export function MovieForm() {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movieGenres } = useQuery({
    queryKey: ["/api/genres/movies"],
  });

  const form = useForm<InsertMovie>({
    resolver: zodResolver(insertMovieSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      genre: "",
      rating: "",
      description: "",
      torrentLink: "",
      magnetLink: "",
    },
  });

  const createMovieMutation = useMutation({
    mutationFn: async (data: InsertMovie & { thumbnail?: File }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "thumbnail" && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
      
      const res = await fetch("/api/movies", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to create movie");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Movie created successfully!",
      });
      form.reset();
      setThumbnailFile(null);
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

  const onSubmit = (data: InsertMovie) => {
    createMovieMutation.mutate({
      ...data,
      thumbnail: thumbnailFile || undefined,
    });
  };

  const clearForm = () => {
    form.reset();
    setThumbnailFile(null);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
          Add/Edit Movie
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter movie title" 
                      {...field}
                      className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Year</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="2024" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {movieGenres?.map((genre: any) => (
                        <SelectItem key={genre.id} value={genre.name}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="PG-13" 
                      {...field}
                      className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Movie description..." 
                        rows={3}
                        {...field}
                        className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
            <FormField
              control={form.control}
              name="torrentLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Torrent Link</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://..." 
                      {...field}
                      className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="magnetLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Magnet Link</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="magnet:?xt=urn:btih:..." 
                        {...field}
                        className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-4">
              <Button 
                type="submit" 
                disabled={createMovieMutation.isPending}
                className="bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Save className="mr-2 h-4 w-4" />
                {createMovieMutation.isPending ? "Saving..." : "Save Movie"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={clearForm}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
