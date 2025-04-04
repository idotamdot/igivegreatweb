import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { GlowButton } from "@/components/ui/glow-button";
import AnimatedText from "@/components/animated-text";
import { useLocation } from "wouter";

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export default function ServicesPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const { 
    data: services, 
    isLoading, 
    error 
  } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading services",
        description: "Could not load available services. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const handleSelectService = (service: Service) => {
    navigate(`/checkout?service=${service.id}&amount=${service.price}&name=${encodeURIComponent(service.name)}`);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 min-h-screen">
      <div className="mb-6 pt-10">
        <GlowButton 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 hover:bg-black/10 dark:hover:bg-white/10" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" /> back to home
        </GlowButton>
      </div>
      <div className="text-center mb-8 md:mb-12">
        <AnimatedText 
          text="our services" 
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          animationStyle="fade"
        />
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          we offer a range of web design and development services to help your business succeed online.
          select a service below to get started on your next project.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services?.map((service) => (
          <Card key={service.id} className="flex flex-col h-full card-glow">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg sm:text-xl">{service.name}</CardTitle>
              <CardDescription className="text-sm">{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 price-glow">${(service.price / 100).toFixed(2)}</p>
              <ul className="space-y-2 text-sm sm:text-base">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-4 md:p-6">
              <GlowButton 
                className="w-full" 
                onClick={() => handleSelectService(service)}
              >
                select this service
              </GlowButton>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}