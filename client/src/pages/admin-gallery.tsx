import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Artwork, PrintSize } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Image as ImageIcon, 
  Edit, 
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Upload,
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminGallery() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: artworks, isLoading, error } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks"],
  });

  const { data: printSizes } = useQuery<PrintSize[]>({
    queryKey: ["/api/print-sizes"],
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      await apiRequest("PATCH", `/api/artworks/${id}`, { featured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artworks"] });
      toast({
        title: "Featured status updated",
        description: "The artwork featured status has been changed.",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: number; visible: boolean }) => {
      await apiRequest("PATCH", `/api/artworks/${id}`, { visible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artworks"] });
      toast({
        title: "Visibility updated",
        description: "The artwork visibility has been changed.",
      });
    },
  });

  const categories = Array.from(new Set(artworks?.map(a => a.category) || []));
  
  const filteredArtworks = artworks?.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.artistName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || artwork.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "artist":
        return a.artistName.localeCompare(b.artistName);
      default:
        return 0;
    }
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
        <h2 className="text-lg font-semibold mb-2">Error loading gallery</h2>
        <p className="text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  const featuredCount = artworks?.filter(a => a.featured).length || 0;
  const visibleCount = artworks?.filter(a => a.visible).length || 0;
  const totalRevenue = artworks?.reduce((sum, artwork) => {
    return sum + (artwork.originalAvailable ? parseFloat(artwork.originalPrice.toString()) : 0);
  }, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-winter accent-winter">Gallery Management</h1>
          <p className="text-muted-foreground">Manage artwork collection and prints</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Art
          </Button>
          <Button className="bg-winter-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Add Artwork
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-spring">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-spring">Total Artworks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artworks?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="card-summer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-summer">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCount}</div>
          </CardContent>
        </Card>
        
        <Card className="card-winter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-winter">Visible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visibleCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-summer-gradient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
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
              <Input
                placeholder="Search by title or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="artist">Artist A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No artworks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all" ? "Try adjusting your filters" : "Upload your first artwork to get started"}
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Artwork
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredArtworks.map((artwork, index) => {
            const seasonClass = index % 3 === 0 ? 'card-spring' : index % 3 === 1 ? 'card-summer' : 'card-winter';
            const textClass = index % 3 === 0 ? 'text-spring' : index % 3 === 1 ? 'text-summer' : 'text-winter';
            
            return (
              <Card key={artwork.id} className={seasonClass}>
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className={`text-lg ${textClass}`}>
                        {artwork.title}
                      </CardTitle>
                      <CardDescription>by {artwork.artistName}</CardDescription>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline">{artwork.category}</Badge>
                        {artwork.featured && (
                          <Badge className="bg-yellow-500">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {artwork.visible ? (
                          <Badge className="bg-green-500">
                            <Eye className="w-3 h-3 mr-1" />
                            Visible
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p>{artwork.dimensions}</p>
                    <p>{artwork.medium}</p>
                    {artwork.originalAvailable && (
                      <p className="font-medium text-foreground">
                        Original: ${parseFloat(artwork.originalPrice.toString()).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFeaturedMutation.mutate({ 
                        id: artwork.id, 
                        featured: !artwork.featured 
                      })}
                    >
                      {artwork.featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibilityMutation.mutate({ 
                        id: artwork.id, 
                        visible: !artwork.visible 
                      })}
                    >
                      {artwork.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}