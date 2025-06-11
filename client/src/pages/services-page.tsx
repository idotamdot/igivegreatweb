import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2, ArrowLeft, Brain, Network, Shield, Zap, Database, Eye, Terminal, Cpu } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CyberMatrix from "@/components/CyberMatrix";
import NeuralNavigation from "@/components/NeuralNavigation";
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
      <div className="min-h-screen bg-cyber-gradient cyber-grid flex items-center justify-center">
        <CyberMatrix />
        <div className="cyber-glass p-8 rounded-3xl neon-border">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-green mx-auto mb-4" />
          <div className="terminal-text text-cyber-green">
            &gt;&gt; NEURAL_SERVICES_LOADING...
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-cyber-gradient cyber-grid">
      <CyberMatrix />
      <NeuralNavigation />
      <div className="container mx-auto py-10 px-4 sm:px-6 min-h-screen">
        <div className="mb-6 pt-10">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 cyber-glass border-cyber-green text-cyber-green hover:bg-cyber-green/20 terminal-text neon-glow" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" /> &lt;&lt; NEURAL_CORE
          </Button>
        </div>
        
        <div className="text-center mb-8 md:mb-12">
          <div className="cyber-glass p-8 rounded-3xl neon-border">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-hologram glitch-effect terminal-text">
              NEURAL_SERVICE_MESH
            </h1>
            <div className="text-cyber-green mb-6 terminal-text space-y-2">
              <div>&gt;&gt; QUANTUM_ENHANCED_SOLUTIONS</div>
              <div>&gt;&gt; ETHICAL_AI_INTEGRATION</div>
              <div>&gt;&gt; ZERO_TRUST_ARCHITECTURE</div>
            </div>
            <Badge className="bg-cyber-green text-black neon-glow">
              NEURAL_NETWORK_ACTIVE
            </Badge>
          </div>
        </div>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services?.map((service) => (
            <Card key={service.id} className="flex flex-col h-full card-cyber hover-lift">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg sm:text-xl text-cyber-green terminal-text">{service.name}</CardTitle>
                <CardDescription className="text-sm text-gray-300 terminal-text">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-4 md:p-6 pt-0 md:pt-0">
                <p className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-neon-pink terminal-text">${(service.price / 100).toFixed(2)}</p>
                <ul className="space-y-2 text-sm sm:text-base">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green mr-2 flex-shrink-0 neon-glow" />
                      <span className="text-gray-300 terminal-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-4 md:p-6 pt-0">
                <Button 
                  className="w-full bg-neon-gradient neon-glow terminal-text" 
                  onClick={() => handleSelectService(service)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  INITIATE_SERVICE
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}