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
import { insertSeriesSchema, insertEpisodeSchema, type InsertSeries, type InsertEpisode } from "@shared/schema";
import { Save, X, Plus } from "lucide-react";

export function SeriesForm() {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: seriesGenres } = useQuery({
    queryKey: ["/api/genres/series"],
  });

  const { data: allSeries } = useQuery({
    queryKey: ["/api/series"],
  });

  const seriesForm = useForm<InsertSeries>({
    resolver: zodResolver(insertSeriesSchema),
    defaultValues: {
      title: "",
      startYear: new Date().getFullYear(),
      genre: "",
      status: "ongoing",
      description: "",
    },
  });

  const episodeForm = useForm<InsertEpisode>({
    resolver: zodResolver(insertEpisodeSchema),
    defaultValues: {
      seriesId: 0,
      seasonNumber: 1,
      episodeNumber: 1,
      title: "",
      duration: 45,
      videoLink: "",
      subtitleLink: "",
    },
  });

  const createSeriesMutation = useMutation({
    mutationFn: async (data: InsertSeries & { thumbnail?: File }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "thumbnail" && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
      
      const res = await fetch("/api/series", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to create series");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Series created successfully!",
      });
      seriesForm.reset();
      setThumbnailFile(null);
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
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
    mutationFn: async (data: InsertEpisode & { subtitle?: File }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "subtitle" && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (data.subtitle) {
        formData.append("subtitle", data.subtitle);
      }
      
      const res = await fetch("/api/episodes", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to create episode");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Episode added successfully!",
      });
      episodeForm.reset();
      setSubtitleFile(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSeriesSubmit = (data: InsertSeries) => {
    createSeriesMutation.mutate({
      ...data,
      thumbnail: thumbnailFile || undefined,
    });
  };

  const onEpisodeSubmit = (data: InsertEpisode) => {
    createEpisodeMutation.mutate({
      ...data,
      subtitle: subtitleFile || undefined,
    });
  };

  const clearSeriesForm = () => {
    seriesForm.reset();
    setThumbnailFile(null);
  };

  const clearEpisodeForm = () => {
    episodeForm.reset();
    setSubtitleFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Series Form */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-blue-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pink-500 dark:text-pink-400">
            Add/Edit TV Series
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...seriesForm}>
            <form onSubmit={seriesForm.handleSubmit(onSeriesSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={seriesForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Series Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter series title" 
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={seriesForm.control}
                name="startYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2024" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={seriesForm.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {seriesGenres?.map((genre: any) => (
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
                control={seriesForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="hiatus">Hiatus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="md:col-span-2">
                <FormField
                  control={seriesForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Series description..." 
                          rows={3}
                          {...field}
                          className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2 flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={createSeriesMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createSeriesMutation.isPending ? "Saving..." : "Save Series"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={clearSeriesForm}
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

      {/* Episode Form */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-blue-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
            Season & Episode Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...episodeForm}>
            <form onSubmit={episodeForm.handleSubmit(onEpisodeSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={episodeForm.control}
                  name="seriesId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Series</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <SelectValue placeholder="Select a series" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allSeries?.map((series: any) => (
                            <SelectItem key={series.id} value={series.id.toString()}>
                              {series.title}
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
                          className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={episodeForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="45" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-4">
                <h4 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">Quality Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={episodeForm.control}
                    name="link360p"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>360p Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <FormLabel>360p Size</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 200MB"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={episodeForm.control}
                    name="link480p"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>480p Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <FormLabel>480p Size</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 350MB"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={episodeForm.control}
                    name="link720p"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>720p Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <FormLabel>720p Size</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 500MB"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={episodeForm.control}
                    name="link1080p"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>1080p Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <FormLabel>1080p Size</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 1GB"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle File/URL</label>
                  <Input
                    type="file"
                    accept=".srt,.vtt,.ass"
                    onChange={(e) => setSubtitleFile(e.target.files?.[0] || null)}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={createEpisodeMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
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
