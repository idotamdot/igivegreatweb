import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ContentBlock } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Globe,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminContent() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [placementFilter, setPlacementFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: contentBlocks, isLoading, error } = useQuery<ContentBlock[]>({
    queryKey: ["/api/content-blocks"],
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      await apiRequest("PATCH", `/api/content-blocks/${id}`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-blocks"] });
      toast({
        title: "Content status updated",
        description: "The content block status has been changed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating content",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const placements = Array.from(new Set(contentBlocks?.map(cb => cb.placement) || []));
  
  const filteredContent = contentBlocks?.filter(block => {
    const matchesSearch = block.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlacement = placementFilter === "all" || block.placement === placementFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && block.active) ||
                         (statusFilter === "inactive" && !block.active);
    return matchesSearch && matchesPlacement && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold mb-2">Error loading content</h2>
        <p className="text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  const activeBlocks = contentBlocks?.filter(block => block.active).length || 0;
  const totalBlocks = contentBlocks?.length || 0;
  const uniquePlacements = placements.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-spring accent-spring">Content Management</h1>
          <p className="text-muted-foreground">Manage website content blocks and pages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Layout className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button className="bg-spring-gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-spring">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-spring">Total Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlocks}</div>
          </CardContent>
        </Card>
        
        <Card className="card-summer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-summer">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBlocks}</div>
          </CardContent>
        </Card>
        
        <Card className="card-winter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-winter">Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniquePlacements}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-winter-gradient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlocks - activeBlocks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content blocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={placementFilter} onValueChange={setPlacementFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Placement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Placements</SelectItem>
                {placements.map(placement => (
                  <SelectItem key={placement} value={placement}>
                    {placement.charAt(0).toUpperCase() + placement.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Blocks List */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No content blocks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || placementFilter !== "all" || statusFilter !== "all" ? 
                  "Try adjusting your filters" : 
                  "Create your first content block to get started"
                }
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Content Block
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredContent.map((block, index) => {
            const seasonClass = index % 3 === 0 ? 'card-spring' : index % 3 === 1 ? 'card-summer' : 'card-winter';
            const textClass = index % 3 === 0 ? 'text-spring' : index % 3 === 1 ? 'text-summer' : 'text-winter';
            
            return (
              <Card key={block.id} className={seasonClass}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className={`text-lg ${textClass}`}>
                          {block.title}
                        </CardTitle>
                        <div className="flex gap-1">
                          {block.active ? (
                            <Badge className="bg-green-500">
                              <Eye className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                          <Badge variant="outline">
                            <Globe className="w-3 h-3 mr-1" />
                            {block.placement}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        Key: {block.key}
                      </CardDescription>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {block.content}
                        </p>
                      </div>
                      {block.metaData && (
                        <div className="text-xs text-muted-foreground">
                          Last updated: {new Date(block.updatedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActiveMutation.mutate({ 
                          id: block.id, 
                          active: !block.active 
                        })}
                      >
                        {block.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}