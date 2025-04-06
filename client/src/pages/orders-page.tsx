import { useQuery } from "@tanstack/react-query";
import { PrintOrder, Artwork } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import {
  Package,
  Check,
  Truck,
  Clock,
  ShoppingCart,
  RefreshCw,
  Home,
  AlertCircle,
  Eye
} from "lucide-react";
import { useEffect } from "react";

// Status badge component
function StatusBadge({ status }: { status: string }) {
  let color = "";
  let icon = null;
  
  switch (status.toLowerCase()) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800 border-yellow-200";
      icon = <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />;
      break;
    case "processing":
      color = "bg-blue-100 text-blue-800 border-blue-200";
      icon = <RefreshCw className="h-3.5 w-3.5 mr-1 flex-shrink-0" />;
      break;
    case "shipped":
      color = "bg-purple-100 text-purple-800 border-purple-200";
      icon = <Truck className="h-3.5 w-3.5 mr-1 flex-shrink-0" />;
      break;
    case "delivered":
      color = "bg-green-100 text-green-800 border-green-200";
      icon = <Check className="h-3.5 w-3.5 mr-1 flex-shrink-0" />;
      break;
    case "cancelled":
      color = "bg-red-100 text-red-800 border-red-200";
      icon = <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />;
      break;
    default:
      color = "bg-gray-100 text-gray-800 border-gray-200";
      icon = <Package className="h-3.5 w-3.5 mr-1 flex-shrink-0" />;
  }
  
  return (
    <span className={`px-2.5 py-1 text-xs rounded-full border flex items-center ${color}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function OrdersPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your orders",
        variant: "destructive",
      });
      setLocation("/auth");
    }
  }, [user, toast, setLocation]);
  
  // Get user's orders
  const { 
    data: orders, 
    isLoading: ordersLoading, 
    error: ordersError 
  } = useQuery<PrintOrder[]>({
    queryKey: ["/api/print-orders"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/print-orders");
      return res.json();
    },
    enabled: !!user,
  });
  
  // Get artworks for the orders
  const { 
    data: artworks, 
    isLoading: artworksLoading 
  } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/artworks");
      return res.json();
    },
    enabled: !!orders && orders.length > 0,
  });
  
  // Helper function to find artwork by id
  const getArtwork = (artworkId: number) => {
    return artworks?.find(artwork => artwork.id === artworkId);
  };
  
  // Format date helper
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  if (ordersLoading || artworksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-4">We couldn't load your orders. Please try again later.</p>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">View and track your print and artwork orders</p>
        
        {(!orders || orders.length === 0) ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="bg-muted inline-block p-4 rounded-full mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't placed any orders yet. Browse our gallery to find beautiful artwork prints.
            </p>
            <Link href="/gallery">
              <a className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Browse Gallery
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const artwork = getArtwork(order.artworkId);
              return (
                <div key={order.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                    {/* Order details */}
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        {/* Artwork thumbnail */}
                        {artwork && (
                          <div className="w-24 h-24 overflow-hidden rounded-md border border-border flex-shrink-0">
                            <img
                              src={artwork.imageUrl}
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Order info */}
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              {artwork ? artwork.title : `Order #${order.id}`}
                            </h3>
                            <StatusBadge status={order.status} />
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-1">
                            Order #: {order.id} • Placed on {formatDate(order.orderDate)}
                          </p>
                          
                          <p className="text-sm mb-2">
                            {order.isOriginal ? 'Original Artwork' : 'Print'} 
                            {!order.isOriginal && order.printSizeId ? ` (Size ID: ${order.printSizeId})` : ''}
                            {order.quantity > 1 && ` × ${order.quantity}`}
                          </p>
                          
                          <p className="font-medium">
                            ${parseFloat(order.price.toString()).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Order meta */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-border pt-4">
                        <div>
                          <h4 className="font-medium flex items-center mb-1">
                            <Home className="h-4 w-4 mr-1" />
                            Shipping Address
                          </h4>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {order.shippingAddress || "Not provided"}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium flex items-center mb-1">
                            <Truck className="h-4 w-4 mr-1" />
                            Shipping Details
                          </h4>
                          {order.trackingNumber ? (
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Tracking #: {order.trackingNumber}
                              </p>
                              <a
                                href="#"
                                className="text-primary hover:underline text-sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  toast({
                                    title: "Feature Coming Soon",
                                    description: "Tracking functionality will be available soon",
                                  });
                                }}
                              >
                                Track Package
                              </a>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              {order.status === "pending" ? "Not yet shipped" : "No tracking information"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions sidebar */}
                    <div className="bg-muted/50 p-6 flex flex-col justify-center space-y-3 border-t md:border-t-0 md:border-l border-border">
                      <Link href={`/artwork/${order.artworkId}`}>
                        <a className="inline-flex items-center text-sm text-foreground hover:text-primary">
                          <Eye className="h-4 w-4 mr-1.5" />
                          View Artwork
                        </a>
                      </Link>
                      
                      {order.status === "pending" && !order.stripePaymentId && (
                        <Link href={`/checkout/${order.id}`}>
                          <a className="inline-flex items-center text-sm text-foreground hover:text-primary">
                            <ShoppingCart className="h-4 w-4 mr-1.5" />
                            Complete Payment
                          </a>
                        </Link>
                      )}
                      
                      <button 
                        className="inline-flex items-center text-sm text-foreground hover:text-primary"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Order details and history will be available soon",
                          });
                        }}
                      >
                        <Package className="h-4 w-4 mr-1.5" />
                        Order Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}