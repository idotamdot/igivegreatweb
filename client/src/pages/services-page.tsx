import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="container mx-auto py-10 min-h-screen">
      <div className="text-center mb-12">
        <AnimatedText 
          text="our services" 
          className="text-4xl md:text-5xl font-bold mb-4"
          animationStyle="fade"
        />
        <p className="text-muted-foreground max-w-2xl mx-auto">
          we offer a range of web design and development services to help your business succeed online.
          select a service below to get started on your next project.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <Card key={service.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold mb-6">${(service.price / 100).toFixed(2)}</p>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSelectService(service)}
              >
                select this service
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}