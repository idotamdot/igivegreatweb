import { useQuery, useMutation } from "@tanstack/react-query";
import { PrintOrder, Artwork } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams, Link } from "wouter";
import { ChevronLeft, CreditCard, Check, AlertCircle } from "lucide-react";
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from "react";

// Make sure to call `loadStripe` outside of a component's render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Inner component that handles the payment form
function CheckoutForm({ order, artwork }: { order: PrintOrder; artwork: Artwork | null }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/orders',
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred');
      setPaymentStatus('error');
      toast({
        title: "Payment Failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } else {
      setPaymentStatus('success');
      toast({
        title: "Payment Successful",
        description: "Your order has been processed successfully!",
        variant: "default",
      });
      
      // Redirect to orders page after a brief delay
      setTimeout(() => {
        setLocation('/orders');
      }, 2000);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        
        <div className="flex items-start space-x-4 mb-4">
          {artwork && (
            <div className="w-20 h-20 overflow-hidden rounded-md border border-border flex-shrink-0">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-grow">
            <h4 className="font-medium">{artwork?.title || "Artwork"}</h4>
            <p className="text-sm text-muted-foreground">
              {order.isOriginal 
                ? 'Original Artwork'
                : 'Print'
              }
              {order.quantity > 1 && ` × ${order.quantity}`}
            </p>
            <p className="text-sm text-muted-foreground">
              by {artwork?.artistName || "Artist"}
            </p>
          </div>
          
          <div className="text-right">
            <p className="font-bold">${order.price ? parseFloat(order.price.toString()).toFixed(2) : '0.00'}</p>
          </div>
        </div>
        
        <div className="border-t border-border pt-4 flex justify-between">
          <p className="font-semibold">Total</p>
          <p className="font-bold">${order.price ? parseFloat(order.price.toString()).toFixed(2) : '0.00'}</p>
        </div>
      </div>
      
      {/* Payment Element */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Details
        </h3>
        
        <div className="mb-6">
          <PaymentElement />
        </div>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
        
        {paymentStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md flex items-center">
            <Check className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">Payment successful! You'll be redirected shortly.</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={!stripe || isProcessing || paymentStatus === 'success'}
          className="w-full bg-primary text-primary-foreground rounded-md py-3 font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </span>
          ) : (
            <span>Pay ${order.price ? parseFloat(order.price.toString()).toFixed(2) : '0.00'}</span>
          )}
        </button>
      </div>
    </form>
  );
}

// Main checkout page component
export default function CheckoutOrder() {
  const { id } = useParams();
  const orderId = id ? parseInt(id) : 0;
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the checkout page",
        variant: "destructive",
      });
      setLocation("/auth");
    }
  }, [user, toast, setLocation]);

  // Get order details
  const { 
    data: order, 
    isLoading: orderLoading, 
    error: orderError 
  } = useQuery<PrintOrder>({
    queryKey: [`/api/print-orders/${orderId}`],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", `/api/print-orders/${orderId}`);
        return res.json();
      } catch (err) {
        console.error("Error fetching order:", err);
        throw err;
      }
    },
    enabled: !isNaN(orderId) && !!user,
  });

  // Get artwork details for the order
  const { 
    data: artwork, 
    isLoading: artworkLoading 
  } = useQuery<Artwork>({
    queryKey: ["/api/artworks", order?.artworkId],
    queryFn: async () => {
      if (!order) throw new Error("No order available");
      const res = await apiRequest("GET", `/api/artworks/${order.artworkId}`);
      return res.json();
    },
    enabled: !!order?.artworkId,
  });

  // Create payment intent
  useEffect(() => {
    if (order && !clientSecret) {
      const createPaymentIntent = async () => {
        try {
          const res = await apiRequest(
            "POST", 
            `/api/print-orders/${order.id}/payment`
          );
          const data = await res.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error("Error creating payment intent:", error);
          toast({
            title: "Payment Setup Failed",
            description: "There was an error setting up the payment. Please try again.",
            variant: "destructive",
          });
        }
      };

      createPaymentIntent();
    }
  }, [order, clientSecret, toast]);

  if (orderLoading || artworkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-4">We couldn't find the order you're looking for.</p>
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => setLocation(`/artwork/${order.artworkId}`)}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back to Artwork</span>
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Complete Your Purchase</h1>
        
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm order={order} artwork={artwork || null} />
          </Elements>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-muted-foreground">Loading payment form...</p>
          </div>
        )}
      </div>
    </div>
  );
}