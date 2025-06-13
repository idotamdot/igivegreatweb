import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Brain, 
  Network, 
  Shield, 
  Zap, 
  Database, 
  Cpu,
  Globe,
  Lock,
  Eye,
  Terminal,
  Code,
  Server,
  CloudLightning,
  Bitcoin,
  Coins
} from 'lucide-react';
import { useLocation } from 'wouter';

interface QuantumService {
  id: string;
  name: string;
  description: string;
  category: 'ai-dev' | 'quantum-hosting' | 'cybersecurity' | 'neural-ops';
  features: string[];
  pricing: {
    starter: number;
    pro: number;
    enterprise: string;
  };
  icon: any;
  quantum_enhanced: boolean;
  ai_powered: boolean;
}

export default function QuantumServices() {
  const [services, setServices] = useState<QuantumService[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [networkActivity, setNetworkActivity] = useState(95);
  const [previewService, setPreviewService] = useState<QuantumService | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Initialize revolutionary quantum services
    const quantumServices: QuantumService[] = [
      {
        id: 'ai-web-dev',
        name: 'AI Autonomous Web Development',
        description: 'Neural networks design, code, and deploy your websites completely autonomously using advanced AI agents.',
        category: 'ai-dev',
        features: [
          'Autonomous AI coding agents',
          'Real-time neural optimization',
          'Quantum-enhanced performance',
          'Self-healing code architecture',
          'AI-powered UX/UI generation',
          'Neural testing & debugging'
        ],
        pricing: { starter: 2999, pro: 7999, enterprise: 'Custom' },
        icon: Brain,
        quantum_enhanced: true,
        ai_powered: true
      },
      {
        id: 'quantum-hosting',
        name: 'Quantum Cloud Infrastructure',
        description: 'Quantum-encrypted hosting with neural load balancing and predictive scaling for ultimate performance.',
        category: 'quantum-hosting',
        features: [
          'Quantum encryption protocols',
          'Neural load balancing',
          'Predictive auto-scaling',
          '99.999% uptime guarantee',
          'Global edge deployment',
          'Real-time threat mitigation'
        ],
        pricing: { starter: 199, pro: 799, enterprise: 'Custom' },
        icon: CloudLightning,
        quantum_enhanced: true,
        ai_powered: true
      },
      {
        id: 'cybersecurity-mesh',
        name: 'Neural Cybersecurity Mesh',
        description: 'AI-powered threat detection with quantum-level security protocols and real-time neural response systems.',
        category: 'cybersecurity',
        features: [
          'AI threat prediction engine',
          'Quantum-level encryption',
          'Neural intrusion detection',
          'Real-time response protocols',
          'Zero-day vulnerability protection',
          'Behavioral analysis algorithms'
        ],
        pricing: { starter: 599, pro: 1999, enterprise: 'Custom' },
        icon: Shield,
        quantum_enhanced: true,
        ai_powered: true
      },
      {
        id: 'neural-optimization',
        name: 'Neural Performance Optimization',
        description: 'AI continuously optimizes your web applications for maximum performance using quantum computing algorithms.',
        category: 'neural-ops',
        features: [
          'Continuous AI optimization',
          'Quantum algorithm enhancement',
          'Neural caching systems',
          'Predictive resource allocation',
          'Real-time performance tuning',
          'Autonomous code refactoring'
        ],
        pricing: { starter: 399, pro: 1299, enterprise: 'Custom' },
        icon: Zap,
        quantum_enhanced: true,
        ai_powered: true
      },
      {
        id: 'ai-ecommerce',
        name: 'AI-Powered E-Commerce Engine',
        description: 'Neural networks create personalized shopping experiences with quantum-enhanced recommendation systems.',
        category: 'ai-dev',
        features: [
          'AI customer behavior analysis',
          'Quantum recommendation engine',
          'Neural inventory management',
          'Autonomous pricing optimization',
          'AI-powered fraud detection',
          'Predictive analytics dashboard'
        ],
        pricing: { starter: 1599, pro: 4999, enterprise: 'Custom' },
        icon: Database,
        quantum_enhanced: true,
        ai_powered: true
      },
      {
        id: 'quantum-api',
        name: 'Quantum API Management',
        description: 'AI-managed APIs with quantum encryption and neural rate limiting for ultimate scalability and security.',
        category: 'neural-ops',
        features: [
          'AI API orchestration',
          'Quantum-encrypted endpoints',
          'Neural rate limiting',
          'Autonomous scaling protocols',
          'Real-time analytics engine',
          'Predictive load management'
        ],
        pricing: { starter: 299, pro: 999, enterprise: 'Custom' },
        icon: Network,
        quantum_enhanced: true,
        ai_powered: true
      }
    ];

    setServices(quantumServices);

    // Animate network activity
    const interval = setInterval(() => {
      setNetworkActivity(prev => Math.max(90, Math.min(100, prev + Math.random() * 4 - 2)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', name: 'ALL_SERVICES', icon: Globe },
    { id: 'ai-dev', name: 'AI_DEVELOPMENT', icon: Brain },
    { id: 'quantum-hosting', name: 'QUANTUM_HOSTING', icon: Server },
    { id: 'cybersecurity', name: 'CYBERSECURITY', icon: Shield },
    { id: 'neural-ops', name: 'NEURAL_OPS', icon: Cpu }
  ];

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai-dev': return 'text-cyber-green';
      case 'quantum-hosting': return 'text-neon-pink';
      case 'cybersecurity': return 'text-neon-blue';
      case 'neural-ops': return 'text-purple-400';
      default: return 'text-cyber-green';
    }
  };

  return (
    <div className="space-y-8">
      {/* Quantum Service Categories */}
      <Card className="card-cyber">
        <CardHeader>
          <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            QUANTUM_SERVICE_CATEGORIES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className={`cyber-glass border-cyber-green/30 hover:bg-cyber-green/20 ${
                    activeCategory === category.id 
                      ? 'bg-cyber-green text-black neon-glow' 
                      : 'text-cyber-green'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="terminal-text text-xs">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Neural Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map(service => {
          const Icon = service.icon;
          return (
            <Card key={service.id} className="card-cyber hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-8 h-8 ${getCategoryColor(service.category)} neon-glow`} />
                    <div>
                      <CardTitle className="text-cyber-green terminal-text text-lg">
                        {service.name}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        {service.quantum_enhanced && (
                          <Badge className="bg-purple-400 text-white text-xs neon-glow">
                            QUANTUM
                          </Badge>
                        )}
                        {service.ai_powered && (
                          <Badge className="bg-cyber-green text-black text-xs neon-glow">
                            AI_POWERED
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 terminal-text text-sm">
                  {service.description}
                </p>

                {/* Neural Features */}
                <div className="space-y-2">
                  <div className="terminal-text text-neon-pink text-sm font-medium">
                    NEURAL_FEATURES:
                  </div>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-400 terminal-text flex items-center gap-2">
                        <div className="w-1 h-1 bg-cyber-green rounded-full neon-glow"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quantum Pricing */}
                <div className="cyber-glass p-4 rounded-lg">
                  <div className="terminal-text text-neon-blue text-sm font-medium mb-3">
                    QUANTUM_PRICING_MATRIX:
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xs terminal-text text-gray-400">STARTER</div>
                      <div className="text-lg font-bold text-cyber-green terminal-text">
                        ${service.pricing.starter}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs terminal-text text-gray-400">PRO</div>
                      <div className="text-lg font-bold text-neon-pink terminal-text">
                        ${service.pricing.pro}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs terminal-text text-gray-400">ENTERPRISE</div>
                      <div className="text-lg font-bold text-purple-400 terminal-text">
                        {service.pricing.enterprise}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Neural Action Buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-neon-gradient neon-glow terminal-text"
                      onClick={() => navigate(`/crypto-checkout?service=${service.id}&amount=${service.pricing.pro}&name=${encodeURIComponent(service.name)}`)}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      DEPLOY_SERVICE
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-cyber-green text-cyber-green hover:bg-cyber-green/20"
                      onClick={() => setPreviewService(service)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Crypto Payment Option for Tech Clients */}
                  <Button 
                    variant="outline" 
                    className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10 terminal-text text-xs"
                    onClick={() => navigate(`/crypto-checkout?service=${service.id}&email=tech-client@example.com`)}
                  >
                    <Bitcoin className="w-3 h-3 mr-2" />
                    PAY_WITH_CRYPTO
                    <Badge className="ml-2 bg-orange-500/20 text-orange-400 text-xs">
                      BTC/ETH/USDC
                    </Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Neural Network Status */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="text-hologram terminal-text flex items-center gap-2">
            <Network className="w-5 h-5" />
            NEURAL_NETWORK_STATUS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyber-green">{services.length}</div>
              <div className="text-xs terminal-text text-gray-400">QUANTUM_SERVICES</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-pink">{networkActivity.toFixed(1)}%</div>
              <div className="text-xs terminal-text text-gray-400">NETWORK_EFFICIENCY</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-blue">24/7</div>
              <div className="text-xs terminal-text text-gray-400">AI_MONITORING</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">∞</div>
              <div className="text-xs terminal-text text-gray-400">SCALABILITY</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Preview Dialog */}
      <Dialog open={!!previewService} onOpenChange={(open) => !open && setPreviewService(null)}>
        <DialogContent className="max-w-2xl bg-black/95 border-cyber-green/30">
          <DialogHeader>
            <DialogTitle className="text-cyber-green terminal-text flex items-center gap-2">
              {previewService?.icon && <previewService.icon className="w-6 h-6" />}
              {previewService?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {previewService?.description}
            </DialogDescription>
          </DialogHeader>
          
          {previewService && (
            <div className="space-y-6">
              {/* Service Badges */}
              <div className="flex gap-2">
                {previewService.quantum_enhanced && (
                  <Badge className="bg-purple-400 text-white neon-glow">
                    QUANTUM_ENHANCED
                  </Badge>
                )}
                {previewService.ai_powered && (
                  <Badge className="bg-cyber-green text-black neon-glow">
                    AI_POWERED
                  </Badge>
                )}
              </div>

              {/* Features List */}
              <div>
                <h3 className="text-cyber-green terminal-text mb-3">NEURAL_FEATURES:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {previewService.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-cyber-green rounded-full neon-glow"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Tiers */}
              <div>
                <h3 className="text-cyber-green terminal-text mb-3">PRICING_MATRIX:</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="cyber-glass p-4 border-cyber-green/30">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 terminal-text">STARTER</div>
                      <div className="text-xl font-bold text-cyber-green">${previewService.pricing.starter.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="cyber-glass p-4 border-cyber-green/50 bg-cyber-green/10">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 terminal-text">PRO</div>
                      <div className="text-xl font-bold text-cyber-green">${previewService.pricing.pro.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="cyber-glass p-4 border-cyber-green/30">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 terminal-text">ENTERPRISE</div>
                      <div className="text-xl font-bold text-cyber-green">{previewService.pricing.enterprise}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1 bg-neon-gradient neon-glow terminal-text"
                  onClick={() => {
                    navigate(`/crypto-checkout?service=${previewService.id}&amount=${previewService.pricing.pro}&name=${encodeURIComponent(previewService.name)}`);
                    setPreviewService(null);
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  DEPLOY_SERVICE
                </Button>
                <Button 
                  variant="outline" 
                  className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                  onClick={() => {
                    navigate(`/crypto-checkout?service=${previewService.id}&email=tech-client@example.com`);
                    setPreviewService(null);
                  }}
                >
                  <Bitcoin className="w-4 h-4 mr-2" />
                  PAY_CRYPTO
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}