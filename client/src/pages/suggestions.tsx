
import { MovieSuggestionForm } from "@/components/movie-suggestion-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Trash2, Clock } from "lucide-react";

export default function Suggestions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["/api/movie-suggestions"],
  });

  const updateSuggestionMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes?: string }) => {
      const res = await fetch(`/api/movie-suggestions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, adminNotes }),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to update suggestion");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Suggestion updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/movie-suggestions"] });
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

  const deleteSuggestionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/movie-suggestions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete suggestion");
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Suggestion deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/movie-suggestions"] });
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

  const handleApprove = (id: number) => {
    updateSuggestionMutation.mutate({ id, status: "approved" });
  };

  const handleReject = (id: number) => {
    updateSuggestionMutation.mutate({ id, status: "rejected" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this suggestion?")) {
      deleteSuggestionMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3 mr-1" />;
      case "approved":
        return <Check className="h-3 w-3 mr-1" />;
      case "rejected":
        return <X className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Movie Suggestions
        </h1>
      </div>

      <MovieSuggestionForm />

      {/* Suggestions List */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-pink-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-500 dark:text-blue-400">
            All Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading suggestions...</p>
            </div>
          ) : suggestions?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No suggestions yet. Submit your first suggestion above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Suggested By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions?.map((suggestion: any) => (
                    <TableRow key={suggestion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <TableCell className="font-medium">
                        <div>
                          <div>{suggestion.title}</div>
                          {suggestion.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {suggestion.description.substring(0, 100)}
                              {suggestion.description.length > 100 ? "..." : ""}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{suggestion.year || "N/A"}</TableCell>
                      <TableCell>
                        {suggestion.genre ? (
                          <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                            {suggestion.genre}
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{suggestion.suggestedBy || "Anonymous"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(suggestion.status)}>
                          {getStatusIcon(suggestion.status)}
                          {suggestion.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(suggestion.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {suggestion.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleApprove(suggestion.id)}
                                disabled={updateSuggestionMutation.isPending}
                                className="text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReject(suggestion.id)}
                                disabled={updateSuggestionMutation.isPending}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(suggestion.id)}
                            disabled={deleteSuggestionMutation.isPending}
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
