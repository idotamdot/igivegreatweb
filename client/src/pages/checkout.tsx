import { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import AnimatedText from "@/components/animated-text";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, serviceId, serviceName }: { amount: number, serviceId: string, serviceName: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return to the services page after successful payment
        return_url: `${window.location.origin}/services?success=true`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // This point will only be reached if there's an immediate error
      // Normally, the user will be redirected to the return_url
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
      navigate("/services?success=true");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md border p-4">
        <PaymentElement />
      </div>
      
      <div className="mt-4">
        <Button 
          disabled={!stripe || isProcessing} 
          className="w-full" 
          type="submit"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              processing
            </>
          ) : (
            `pay $${(amount / 100).toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();
  
  // Parse URL parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const serviceId = params.get('service');
  const amount = params.get('amount') ? parseInt(params.get('amount')!) : 0;
  const serviceName = params.get('name') || '';
  
  useEffect(() => {
    // Validate parameters
    if (!serviceId || !amount || !serviceName) {
      toast({
        title: "Missing Information",
        description: "Service information is missing. Please select a service first.",
        variant: "destructive",
      });
      navigate("/services");
      return;
    }
    
    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { 
      amount, 
      serviceId,
      serviceName: decodeURIComponent(serviceName)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create payment intent");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Payment Setup Failed",
          description: error.message || "Could not set up payment. Please try again later.",
          variant: "destructive",
        });
        navigate("/services");
      });
  }, [serviceId, amount, serviceName, toast, navigate]);

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>
            <AnimatedText 
              text="checkout" 
              className="text-2xl font-bold"
              animationStyle="fade"
            />
          </CardTitle>
          <CardDescription>Complete your purchase for {decodeURIComponent(serviceName)}</CardDescription>
        </CardHeader>
        <CardContent>
          {!clientSecret ? (
            <div className="flex justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                amount={amount} 
                serviceId={serviceId!} 
                serviceName={decodeURIComponent(serviceName)}
              />
            </Elements>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/services")}>back to services</Button>
        </CardFooter>
      </Card>
    </div>
  );
}