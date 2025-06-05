import { SeriesForm } from "@/components/series-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash2, Eye } from "lucide-react";
import { useEffect } from "react";

export default function Series() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: series, isLoading } = useQuery({
    queryKey: ["/api/series"],
  });

  const deleteSeriesMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/series/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Series deleted successfully!",
      });
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

  const handleDeleteSeries = (id: number) => {
    if (confirm("Are you sure you want to delete this series? This will also delete all episodes.")) {
      deleteSeriesMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "hiatus":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Update page title
  useEffect(() => {
    const header = document.querySelector("main h1");
    if (header) {
      header.textContent = "TV Series Management";
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
          TV Series Management
        </h1>
      </div>

      <SeriesForm />

      {/* Series List */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-blue-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pink-500 dark:text-pink-400">
            Series Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading series...</p>
            </div>
          ) : series?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No series found. Add your first series above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Start Year</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {series?.map((seriesItem: any) => (
                    <TableRow key={seriesItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <TableCell className="font-medium">{seriesItem.title}</TableCell>
                      <TableCell>{seriesItem.startYear}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {seriesItem.genre}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(seriesItem.status)}>
                          {seriesItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="View Episodes"
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
                            onClick={() => handleDeleteSeries(seriesItem.id)}
                            disabled={deleteSeriesMutation.isPending}
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
