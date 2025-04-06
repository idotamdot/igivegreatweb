import { useQuery, useMutation } from "@tanstack/react-query";
import { Artwork, PrintSize, ArtworkPrintSize } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams, useRoute, Link } from "wouter";
import { 
  ChevronLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  AlertCircle, 
  Palette,
  Maximize2
} from "lucide-react";
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ArtworkDetail() {
  const { id } = useParams();
  const artworkId = id ? parseInt(id) : 0;
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // State variables
  const [selectedPrintSizeId, setSelectedPrintSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isOriginal, setIsOriginal] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  
  // Get the artwork details
  const { 
    data: artwork, 
    isLoading: artworkLoading, 
    error: artworkError 
  } = useQuery<Artwork>({
    queryKey: [`/api/artworks/${artworkId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/artworks/${artworkId}`);
      return res.json();
    },
    enabled: !isNaN(artworkId),
  });

  // Get available print sizes for this artwork
  const { 
    data: printSizes, 
    isLoading: sizesLoading 
  } = useQuery<(ArtworkPrintSize & PrintSize)[]>({
    queryKey: [`/api/artworks/${artworkId}/print-sizes`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/artworks/${artworkId}/print-sizes`);
      return res.json();
    },
    enabled: !isNaN(artworkId),
  });

  // Reset selected print size when switching between original and print
  useEffect(() => {
    if (isOriginal) {
      setSelectedPrintSizeId(null);
    } else if (printSizes && printSizes.length > 0 && !selectedPrintSizeId) {
      setSelectedPrintSizeId(printSizes[0].printSizeId);
    }
  }, [isOriginal, printSizes, selectedPrintSizeId]);

  // Create an order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: {
      artworkId: number;
      printSizeId?: number;
      quantity: number;
      isOriginal: boolean;
      shippingAddress: string;
    }) => {
      const res = await apiRequest("POST", "/api/print-orders", orderData);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order Created",
        description: "Your order has been created successfully",
        variant: "default",
      });
      setCartOpen(false);
      
      // Navigate to payment page
      setLocation(`/checkout/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });

  // Handle adding to cart
  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase artwork",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    if (!artwork) return;
    
    if (!isOriginal && !selectedPrintSizeId) {
      toast({
        title: "Selection Required",
        description: "Please select a print size",
        variant: "destructive",
      });
      return;
    }
    
    setCartOpen(true);
  };

  // Handle placing the order
  const handlePlaceOrder = () => {
    if (!artwork) return;
    
    if (!shippingAddress.trim()) {
      toast({
        title: "Shipping Address Required",
        description: "Please enter your shipping address",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      artworkId: artwork.id,
      printSizeId: isOriginal ? undefined : selectedPrintSizeId!,
      quantity,
      isOriginal,
      shippingAddress,
    };

    createOrderMutation.mutate(orderData);
  };

  // Find the selected print size details
  const selectedPrintSize = printSizes?.find(size => size.printSizeId === selectedPrintSizeId);
  
  // Calculate the price
  const price = isOriginal 
    ? (artwork?.originalPrice ? parseFloat(artwork.originalPrice) : 0) 
    : (selectedPrintSize ? parseFloat(selectedPrintSize.price.toString()) : 0);
  
  // Calculate total price
  const totalPrice = price * quantity;

  if (artworkLoading || sizesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (artworkError || !artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Artwork Not Found</h1>
          <p className="text-muted-foreground mb-4">We couldn't find the artwork you're looking for.</p>
          <Link href="/gallery">
            <a className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Back to Gallery
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/gallery")}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back to Gallery</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Artwork Image */}
          <div className="relative group">
            <div className="overflow-hidden rounded-lg border border-border shadow-lg">
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title} 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background">
                <Maximize2 className="h-5 w-5" />
              </button>
              <button className="bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background">
                <Heart className="h-5 w-5" />
              </button>
              <button className="bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Artwork Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {artwork.artistName}</p>
            
            <div className="flex items-center mb-6">
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                {artwork.category}
              </span>
              {artwork.featured && (
                <span className="ml-2 text-sm bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full flex items-center">
                  <Check className="h-3 w-3 mr-1" /> Featured
                </span>
              )}
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {artwork.description}
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {artwork.medium && (
                  <div>
                    <span className="text-muted-foreground">Medium:</span>
                    <span className="ml-2">{artwork.medium}</span>
                  </div>
                )}
                {artwork.dimensions && (
                  <div>
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span className="ml-2">{artwork.dimensions}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Print Type Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Choose Type</h3>
              <RadioGroup 
                className="flex space-x-4"
                defaultValue={artwork.originalAvailable ? "print" : "print"}
                onValueChange={(value) => setIsOriginal(value === "original")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="print" id="print-option" />
                  <Label htmlFor="print-option">Print</Label>
                </div>
                {artwork.originalAvailable && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="original" id="original-option" />
                    <Label htmlFor="original-option">Original Artwork</Label>
                  </div>
                )}
              </RadioGroup>
            </div>
            
            {/* Print Size Selection (only if print is selected) */}
            {!isOriginal && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Select Print Size</h3>
                {printSizes && printSizes.length > 0 ? (
                  <RadioGroup 
                    defaultValue={printSizes[0].printSizeId.toString()}
                    onValueChange={(value) => setSelectedPrintSizeId(parseInt(value))}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {printSizes.map((size) => (
                      <div
                        key={size.printSizeId}
                        className={`border rounded-md p-3 transition-all ${
                          selectedPrintSizeId === size.printSizeId
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem 
                          value={size.printSizeId.toString()} 
                          id={`size-${size.printSizeId}`}
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`size-${size.printSizeId}`}
                          className="flex items-center justify-between cursor-pointer w-full"
                        >
                          <div>
                            <span className="font-medium">{size.name}</span>
                            <div className="text-sm text-muted-foreground">
                              {size.width}" × {size.height}"
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${parseFloat(size.price.toString()).toFixed(2)}</div>
                            {!size.inStock && (
                              <span className="text-red-500 text-xs">Out of stock</span>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-muted-foreground italic">
                    No print sizes available
                  </div>
                )}
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center max-w-[150px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border border-border rounded-l-md px-3 py-2 hover:bg-muted"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="border-y border-border px-3 py-2 w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="border border-border rounded-r-md px-3 py-2 hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Pricing and Add to Cart */}
            <div className="border-t border-border pt-6 mb-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Total Price</h3>
                  <p className="text-sm text-muted-foreground">
                    {isOriginal 
                      ? "Original Artwork" 
                      : selectedPrintSize ? `${selectedPrintSize.name} Print` : "Print"
                    }
                    {quantity > 1 && ` × ${quantity}`}
                  </p>
                </div>
                <div className="text-3xl font-bold">${totalPrice.toFixed(2)}</div>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!isOriginal && !selectedPrintSizeId}
                className="w-full bg-primary text-primary-foreground rounded-md py-3 font-semibold hover:bg-primary/90 transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isOriginal ? "Purchase Original" : "Add Print to Cart"}
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="text-sm text-muted-foreground">
              <div className="flex items-start mb-2">
                <Palette className="h-4 w-4 mr-2 mt-0.5" />
                <span>All prints are made with archival-quality inks on premium fine art paper</span>
              </div>
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                <span>Please allow 7-10 business days for printing and shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Checkout Dialog */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>
              Please provide your shipping information to continue with checkout.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground">by {artwork.artistName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${totalPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  {isOriginal ? "Original" : selectedPrintSize?.name} × {quantity}
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="shipping-address">Shipping Address</Label>
              <Textarea
                id="shipping-address"
                placeholder="Enter your full shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="px-4 py-2 text-muted-foreground border border-border rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Continue to Payment"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}