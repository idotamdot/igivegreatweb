import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Artwork } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  Loader2, 
  PencilIcon, 
  EyeIcon, 
  EyeOffIcon,
  ChevronLeft,
  ImageIcon,
  Plus,
  Star,
  StarOff
} from "lucide-react";
import { GlowButton } from "@/components/ui/glow-button";
import { Switch } from "@/components/ui/switch";

export default function AdminGalleryManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // Check authorization
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "owner") {
      setLocation("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin area",
        variant: "destructive",
      });
    }
  }, [user, setLocation, toast]);
  
  // Get all artworks including hidden ones
  const { 
    data: artworks, 
    isLoading 
  } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks/all"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/artworks?includeHidden=true");
      return res.json();
    },
    enabled: !!(user && (user.role === "admin" || user.role === "owner")),
  });
  
  // Toggle artwork visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async (artworkId: number) => {
      const res = await apiRequest("PATCH", `/api/artworks/${artworkId}/toggle-visibility`);
      return res.json();
    },
    onSuccess: () => {
      // Invalidate both regular and admin artwork queries
      queryClient.invalidateQueries({ queryKey: ["/api/artworks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/artworks/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/artworks/featured"] });
      
      toast({
        title: "Success",
        description: "Artwork visibility updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update artwork visibility: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number, featured: boolean }) => {
      const res = await apiRequest("PATCH", `/api/artworks/${id}`, { featured });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate both regular and admin artwork queries
      queryClient.invalidateQueries({ queryKey: ["/api/artworks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/artworks/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/artworks/featured"] });
      
      toast({
        title: "Success",
        description: "Featured status updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update featured status: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle toggling artwork visibility
  const handleToggleVisibility = (artworkId: number) => {
    toggleVisibilityMutation.mutate(artworkId);
  };
  
  // Handle toggling featured status
  const handleToggleFeatured = (artwork: Artwork) => {
    toggleFeaturedMutation.mutate({ 
      id: artwork.id, 
      featured: !artwork.featured 
    });
  };
  
  if (!user || (user.role !== "admin" && user.role !== "owner")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You don't have permission to access this area.</p>
          <GlowButton onClick={() => setLocation("/")}>
            Return to Home
          </GlowButton>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setLocation("/admin")}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors mr-4"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Back to Admin</span>
            </button>
            <h1 className="text-3xl font-bold">Artwork Management</h1>
          </div>
          <GlowButton 
            onClick={() => setLocation("/admin/artwork/new")}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Artwork
          </GlowButton>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : !artworks || artworks.length === 0 ? (
          <div className="text-center py-20 border border-border rounded-lg">
            <ImageIcon className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-medium mb-2">No Artworks Found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't added any artworks to your gallery yet.
            </p>
            <GlowButton 
              onClick={() => setLocation("/admin/artwork/new")}
              className="flex items-center mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Artwork
            </GlowButton>
          </div>
        ) : (
          <div className="bg-card border border-accent/20 rounded-lg p-6">
            <div className="mb-4 text-sm text-muted-foreground">
              Use the toggles below to control which artworks are shown in the gallery. 
              Artworks that are hidden will not appear to visitors.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Artwork</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-center py-3 px-4">Featured</th>
                    <th className="text-center py-3 px-4">Visible</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.map((artwork) => (
                    <tr key={artwork.id} className="border-b border-border/30 hover:bg-accent/5">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div 
                            className="w-12 h-12 rounded overflow-hidden mr-3 border border-border"
                            style={{
                              opacity: artwork.visible === false ? 0.5 : 1
                            }}
                          >
                            <img 
                              src={artwork.imageUrl} 
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{artwork.title}</div>
                            <div className="text-sm text-muted-foreground">{artwork.artistName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{artwork.category}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div>
                            {artwork.originalAvailable && (
                              <span>Original: ${Number(artwork.originalPrice).toLocaleString()}</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Prints from ${(Number(artwork.originalPrice) * 0.1).toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          className="inline-flex items-center justify-center"
                          onClick={() => handleToggleFeatured(artwork)}
                          disabled={toggleFeaturedMutation.isPending}
                        >
                          {artwork.featured ? (
                            <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                          ) : (
                            <StarOff className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Switch
                          checked={artwork.visible !== false}
                          onCheckedChange={() => handleToggleVisibility(artwork.id)}
                          disabled={toggleVisibilityMutation.isPending}
                        />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                            onClick={() => setLocation(`/admin/artwork/edit/${artwork.id}`)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-primary hover:text-primary/80 transition-colors"
                            onClick={() => setLocation(`/artwork/${artwork.id}`)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}