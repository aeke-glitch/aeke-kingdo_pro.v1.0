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
import { insertAnimeSchema, insertAnimeEpisodeSchema, type InsertAnime, type InsertAnimeEpisode } from "@shared/schema";
import { Save, X, Plus, Video } from "lucide-react";

export function AnimeForm() {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: animeGenres } = useQuery({
    queryKey: ["/api/genres/anime"],
  });

  const { data: allAnime } = useQuery({
    queryKey: ["/api/anime"],
  });

  const animeForm = useForm<InsertAnime>({
    resolver: zodResolver(insertAnimeSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      genre: "",
      studio: "",
      synopsis: "",
    },
  });

  const episodeForm = useForm<InsertAnimeEpisode>({
    resolver: zodResolver(insertAnimeEpisodeSchema),
    defaultValues: {
      animeId: 0,
      episodeNumber: 1,
      title: "",
      link720p: "",
      link1080p: "",
      link4k: "",
      size720p: "",
      size1080p: "",
      size4k: "",
    },
  });

  const createAnimeMutation = useMutation({
    mutationFn: async (data: InsertAnime & { thumbnail?: File }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "thumbnail" && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
      
      const res = await fetch("/api/anime", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to create anime");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Anime created successfully!",
      });
      animeForm.reset();
      setThumbnailFile(null);
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

  const createEpisodeMutation = useMutation({
    mutationFn: async (data: InsertAnimeEpisode) => {
      const res = await fetch("/api/anime-episodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to create anime episode");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Episode added successfully!",
      });
      episodeForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onAnimeSubmit = (data: InsertAnime) => {
    createAnimeMutation.mutate({
      ...data,
      thumbnail: thumbnailFile || undefined,
    });
  };

  const onEpisodeSubmit = (data: InsertAnimeEpisode) => {
    createEpisodeMutation.mutate(data);
  };

  const clearAnimeForm = () => {
    animeForm.reset();
    setThumbnailFile(null);
  };

  const clearEpisodeForm = () => {
    episodeForm.reset();
  };

  return (
    <div className="space-y-6">
      {/* Anime Form */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
            Add/Edit Anime
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...animeForm}>
            <form onSubmit={animeForm.handleSubmit(onAnimeSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={animeForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anime Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter anime title" 
                        {...field}
                        className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={animeForm.control}
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
                control={animeForm.control}
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
                        {animeGenres?.map((genre: any) => (
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
                control={animeForm.control}
                name="studio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Studio</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Studio name" 
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
                  control={animeForm.control}
                  name="synopsis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Synopsis</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Anime synopsis..." 
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Thumbnail</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2 flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={createAnimeMutation.isPending}
                  className="bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createAnimeMutation.isPending ? "Saving..." : "Save Anime"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={clearAnimeForm}
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

      {/* Episode Management with Quality Options */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pink-500 dark:text-pink-400">
            Episode Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...episodeForm}>
            <form onSubmit={episodeForm.handleSubmit(onEpisodeSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={episodeForm.control}
                  name="animeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Anime</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            <SelectValue placeholder="Select an anime" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allAnime?.map((anime: any) => (
                            <SelectItem key={anime.id} value={anime.id.toString()}>
                              {anime.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={episodeForm.control}
                  name="seasonNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Season Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
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
                  control={episodeForm.control}
                  name="episodeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Episode Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
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
                  control={episodeForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Episode Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Episode title" 
                          {...field}
                          className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Quality Options */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-blue-500 dark:text-blue-400">Video Quality Options</h4>
                
                {/* 720p Quality */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-3">
                    <Video className="text-pink-500 mr-2 h-5 w-5" />
                    <span className="font-medium">720p HD</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={episodeForm.control}
                      name="link720p"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="720p video link" 
                              {...field}
                              className="text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={episodeForm.control}
                      name="size720p"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="File size (MB)" 
                              {...field}
                              className="text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* 1080p Quality */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-3">
                    <Video className="text-blue-500 mr-2 h-5 w-5" />
                    <span className="font-medium">1080p Full HD</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={episodeForm.control}
                      name="link1080p"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="1080p video link" 
                              {...field}
                              className="text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={episodeForm.control}
                      name="size1080p"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="File size (MB)" 
                              {...field}
                              className="text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* 360p Quality */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-3">
                    <Video className="text-gray-500 mr-2 h-5 w-5" />
                    <span className="font-medium">360p</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={episodeForm.control}
                      name="link360p"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="360p video link" 
                              {...field}
                              className="text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={episodeForm.control}
                      name="size360p"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="File size (e.g. 150MB)" 
                              {...field}
                              className="text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* 480p Quality */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-3">
                    <Video className="text-orange-500 mr-2 h-5 w-5" />
                    <span className="font-medium">480p</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={episodeForm.control}
                      name="link480p"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="480p video link" 
                              {...field}
                              className="text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={episodeForm.control}
                      name="size480p"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="File size (e.g. 250MB)" 
                              {...field}
                              className="text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={createEpisodeMutation.isPending}
                className="bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" />
                {createEpisodeMutation.isPending ? "Adding..." : "Add Episode"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
