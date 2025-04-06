import { useQuery } from "@tanstack/react-query";
import { Artwork } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Star, ShoppingCart, ArrowRight, Home, ArrowLeft } from "lucide-react";
import { GlowButton } from "@/components/ui/glow-button";

export default function GalleryPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Get all artworks
  const { data: artworks, isLoading, error } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/artworks");
      return res.json();
    },
  });

  // Get featured artworks for the hero section
  const { data: featuredArtworks } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks/featured"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/artworks/featured");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load artwork gallery",
      variant: "destructive",
    });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-4">We couldn't load the gallery. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Extract a featured artwork for the hero section
  const heroArtwork = featuredArtworks && featuredArtworks.length > 0 
    ? featuredArtworks[0] 
    : (artworks && artworks.length > 0 ? artworks[0] : null);

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      {heroArtwork && (
        <div className="relative h-[70vh] mb-16">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: `url(${heroArtwork.imageUrl})` }}
          ></div>
          <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="inline-block py-2 px-4 border-2 border-white/50 backdrop-blur-sm">
                art gallery
              </span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Discover and purchase stunning artwork prints from our collection of talented artists.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition-all transform hover:-translate-y-1 hover:shadow-glow-white flex items-center"
              >
                Browse Gallery <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              {heroArtwork.originalAvailable && (
                <button 
                  onClick={() => setLocation(`/artwork/${heroArtwork.id}`)}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-all transform hover:-translate-y-1"
                >
                  Featured Artwork
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Return to homepage button - positioned in the top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <GlowButton
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 hover:bg-black/10 dark:hover:bg-white/10" 
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4" /> back to home
        </GlowButton>
      </div>
        
      {/* Gallery Section */}
      <div id="gallery" className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">our collection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks && artworks.map((artwork) => (
            <div 
              key={artwork.id} 
              className="group bg-background border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {artwork.featured && (
                  <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
                    <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{artwork.title}</h3>
                <p className="text-muted-foreground mb-3">{artwork.artistName}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">{artwork.category}</span>
                    {artwork.originalAvailable && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Original Available
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setLocation(`/artwork/${artwork.id}`)}
                    className="inline-flex items-center text-primary hover:text-primary/80"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    <span>View Prints</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Admin Actions */}
      {user && (user.role === "owner" || user.role === "admin") && (
        <div className="container mx-auto px-4 py-8 mt-8">
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-semibold mb-4">Admin Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setLocation("/admin/artwork/new")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add New Artwork
              </button>
              <button 
                onClick={() => setLocation("/admin/print-sizes")}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
              >
                Manage Print Sizes
              </button>
              <button 
                onClick={() => setLocation("/admin/orders")}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90"
              >
                View Print Orders
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Information Section */}
      <div className="bg-muted py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">own a piece of art</h2>
            <p className="text-lg text-muted-foreground mb-8">
              All prints are created using archival-quality inks on premium papers, 
              ensuring your artwork maintains its beauty for generations. Each piece is 
              carefully packaged and shipped to ensure it arrives in perfect condition.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">Museum-grade materials and printing techniques</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Secure Shipping</h3>
                <p className="text-muted-foreground">Carefully packaged and tracked delivery</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Satisfaction Guaranteed</h3>
                <p className="text-muted-foreground">Love your art or we'll make it right</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}