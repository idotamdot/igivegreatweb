import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, Shield, Globe, Brain } from "lucide-react";
import CryptoPayment from "@/components/CryptoPayment";
import { motion } from "framer-motion";

interface ServiceDetails {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  techSpecs: string[];
}

const serviceDetails: Record<string, ServiceDetails> = {
  'quantum-neural-networks': {
    id: 'quantum-neural-networks',
    name: 'Quantum Neural Networks',
    price: 2999,
    description: 'Advanced quantum-enhanced neural network architectures for next-generation AI applications',
    features: [
      'Quantum entanglement-based learning',
      'Superposition state processing',
      'Quantum error correction',
      'Exponential speedup algorithms',
      'Quantum-classical hybrid models'
    ],
    techSpecs: [
      'Qiskit & Cirq integration',
      'IBM Quantum & Google Quantum AI',
      'Quantum volume optimization',
      'NISQ device compatibility',
      'Real-time quantum monitoring'
    ]
  },
  'autonomous-ai': {
    id: 'autonomous-ai',
    name: 'Autonomous AI Development',
    price: 15000,
    description: 'Complete AI system development with neural network architecture',
    features: [
      'Custom neural network design',
      'Autonomous learning algorithms',
      'Real-time decision making',
      'Self-optimizing performance',
      'Advanced pattern recognition'
    ],
    techSpecs: [
      'TensorFlow/PyTorch implementation',
      'Distributed computing architecture',
      'API integration capabilities',
      '24/7 monitoring dashboard',
      'Scalable cloud deployment'
    ]
  },
  'neural-cybersecurity': {
    id: 'neural-cybersecurity',
    name: 'Neural Cybersecurity Suite',
    price: 8500,
    description: 'Advanced AI-powered security system with threat prediction',
    features: [
      'Predictive threat analysis',
      'Real-time intrusion detection',
      'Automated response protocols',
      'Behavioral anomaly detection',
      'Quantum encryption ready'
    ],
    techSpecs: [
      'Machine learning threat models',
      'Zero-trust architecture',
      'SIEM integration',
      'Compliance automation',
      'Incident response workflows'
    ]
  },
  'quantum-hosting': {
    id: 'quantum-hosting',
    name: 'Quantum Cloud Hosting',
    price: 2500,
    description: 'Next-generation cloud infrastructure with quantum computing',
    features: [
      'Quantum-enhanced processing',
      'Ultra-low latency networks',
      'Auto-scaling resources',
      'Global edge deployment',
      '99.99% uptime guarantee'
    ],
    techSpecs: [
      'Quantum computing nodes',
      'Edge computing distribution',
      'Container orchestration',
      'Load balancing algorithms',
      'Real-time monitoring'
    ]
  },
  'ai-intelligence': {
    id: 'ai-intelligence',
    name: 'AI Business Intelligence',
    price: 12000,
    description: 'Comprehensive AI analytics and business intelligence platform',
    features: [
      'Predictive analytics dashboard',
      'Real-time data processing',
      'Custom KPI tracking',
      'Automated reporting',
      'Market trend analysis'
    ],
    techSpecs: [
      'Big data processing pipeline',
      'Machine learning models',
      'Interactive visualization',
      'API data connectors',
      'Custom dashboard builder'
    ]
  }
};

export default function CryptoCheckout() {
  const [location] = useLocation();
  const [serviceId, setServiceId] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const service = params.get('service');
    const email = params.get('email');
    const amount = params.get('amount');
    const name = params.get('name');
    
    if (service) {
      // If service exists in our details, use it
      if (serviceDetails[service]) {
        setServiceId(service);
      } else {
        // Create dynamic service from URL params
        const dynamicService: ServiceDetails = {
          id: service,
          name: name || 'Custom Neural Service',
          price: amount ? parseInt(amount) : 999,
          description: 'Advanced neural network service deployment',
          features: [
            'Quantum-enhanced processing',
            'Real-time neural optimization',
            'Autonomous system management',
            'Advanced AI integration',
            'Secure deployment protocol'
          ],
          techSpecs: [
            'Neural network architecture',
            'Quantum processing integration',
            'Distributed computing',
            'Real-time monitoring',
            'Scalable infrastructure'
          ]
        };
        serviceDetails[service] = dynamicService;
        setServiceId(service);
      }
    }
    
    if (email) {
      setClientEmail(email);
    } else {
      setClientEmail('neural.client@quantumlabs.ai');
    }
  }, [location]);

  const service = serviceDetails[serviceId];

  const handlePaymentComplete = (paymentId: string) => {
    setPaymentComplete(true);
    console.log('Payment completed:', paymentId);
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Card className="bg-gray-800 border-red-500/20">
          <CardContent className="p-6">
            <p className="text-red-400">Service not found. Please select a valid service.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Neural Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="text-cyan-400 hover:text-cyan-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />
        </div>

        {paymentComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-green-900/20 via-gray-800 to-gray-900 border-green-500/30">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-500/20 rounded-full">
                    <Shield className="w-12 h-12 text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-green-400">Payment Successful!</CardTitle>
                <CardDescription className="text-gray-300">
                  Your Neural Web Labs service has been activated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-green-500/20">
                  <h3 className="font-semibold text-white mb-2">Service Activated:</h3>
                  <p className="text-green-400 text-lg">{service.name}</p>
                  <p className="text-gray-300 text-sm mt-1">${service.price.toLocaleString()} paid via cryptocurrency</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">What happens next:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-cyan-400" />
                      Our AI operators will begin project setup within 24 hours
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      You'll receive access credentials via email
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      Real-time progress tracking available in client dashboard
                    </li>
                  </ul>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  onClick={() => window.location.href = '/client'}
                >
                  Access Client Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Service Details */}
            <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-cyan-500/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-cyan-400">{service.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      Neural Web Labs Premium Service
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">${service.price.toLocaleString()}</span>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      One-time payment
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Technical Specifications:</h4>
                  <ul className="space-y-2">
                    {service.techSpecs.map((spec, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <Shield className="w-4 h-4 text-green-400 shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Crypto Payment */}
            <CryptoPayment
              amount={service.price}
              serviceType={service.name}
              clientEmail={clientEmail}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}