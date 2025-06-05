
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertMovieSuggestionSchema, type InsertMovieSuggestion } from "@shared/schema";
import { Send, Lightbulb } from "lucide-react";

export function MovieSuggestionForm() {
  const { toast } = useToast();

  const { data: movieGenres } = useQuery({
    queryKey: ["/api/genres/movies"],
  });

  const form = useForm<InsertMovieSuggestion>({
    resolver: zodResolver(insertMovieSuggestionSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      genre: "",
      description: "",
      suggestedBy: "",
      status: "pending",
    },
  });

  const createSuggestionMutation = useMutation({
    mutationFn: async (data: InsertMovieSuggestion) => {
      const res = await fetch("/api/movie-suggestions/internal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to submit suggestion");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Movie suggestion submitted successfully!",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMovieSuggestion) => {
    createSuggestionMutation.mutate(data);
  };

  const clearForm = () => {
    form.reset();
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-pink-500 dark:text-pink-400 flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" />
          Suggest a Movie
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie Title *</FormLabel>
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
                    <FormLabel>Year</FormLabel>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="suggestedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us why you'd like to see this movie added..."
                      {...field}
                      className="focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-4">
              <Button 
                type="submit" 
                disabled={createSuggestionMutation.isPending}
                className="bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Send className="mr-2 h-4 w-4" />
                {createSuggestionMutation.isPending ? "Submitting..." : "Submit Suggestion"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={clearForm}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
