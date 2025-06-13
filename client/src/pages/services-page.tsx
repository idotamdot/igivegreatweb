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
import QuantumServices from "@/components/QuantumServices";
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

  const handleCryptoPayment = (service: Service) => {
    navigate(`/crypto-checkout?service=${service.id}&email=client@example.com`);
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

  if (error) {
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
          
          <div className="text-center">
            <div className="cyber-glass p-8 rounded-3xl neon-border border-red-500/50">
              <h1 className="text-3xl font-bold mb-4 text-red-400 terminal-text">
                NEURAL_SERVICES_ERROR
              </h1>
              <div className="text-cyber-green mb-6 terminal-text">
                &gt;&gt; SERVICE_DATABASE_CONNECTION: FAILED
              </div>
              <p className="text-gray-300 terminal-text mb-6">
                Neural service matrix temporarily offline. Using quantum backup systems...
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white terminal-text"
              >
                RECONNECT_NEURAL_MATRIX
              </Button>
            </div>
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
              NEURAL_WEB_LABS_SERVICES
            </h1>
            <div className="text-cyber-green mb-6 terminal-text space-y-2">
              <div>&gt;&gt; AI_POWERED_DEVELOPMENT: ONLINE</div>
              <div>&gt;&gt; QUANTUM_HOSTING_MATRIX: ACTIVE</div>
              <div>&gt;&gt; NEURAL_SECURITY_MESH: DEPLOYED</div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge className="bg-cyber-green text-black neon-glow">
                AUTONOMOUS_CODING
              </Badge>
              <Badge className="bg-neon-pink text-white neon-glow">
                QUANTUM_INFRASTRUCTURE
              </Badge>
              <Badge className="bg-neon-blue text-white neon-glow">
                AI_OPTIMIZATION
              </Badge>
            </div>
          </div>
        </div>
      
        <QuantumServices />
      </div>
    </div>
  );
}