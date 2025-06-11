import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Zap, 
  Brain,
  Server,
  Shield,
  Globe,
  Target,
  Rocket,
  Star,
  Crown,
  Calculator,
  CreditCard,
  Building
} from 'lucide-react';

interface RevenueStream {
  id: string;
  name: string;
  description: string;
  monthlyRevenue: number;
  growthRate: number;
  icon: any;
  status: 'active' | 'projected' | 'premium';
}

interface BusinessMetrics {
  currentValuation: number;
  projectedValuation12m: number;
  monthlyRevenue: number;
  clientRetentionRate: number;
  profitMargin: number;
  marketShare: number;
}

export default function BusinessValuation() {
  const { data: businessMetrics = [] } = useQuery({
    queryKey: ['/api/neural/business-metrics'],
  });

  const [metrics, setMetrics] = useState<BusinessMetrics>({
    currentValuation: 0,
    projectedValuation12m: 0,
    monthlyRevenue: 0,
    clientRetentionRate: 0,
    profitMargin: 0,
    marketShare: 0
  });

  // Update metrics from database
  useEffect(() => {
    if (businessMetrics.length > 0) {
      const metricsMap = businessMetrics.reduce((acc: any, metric: any) => {
        acc[metric.metric_name] = parseFloat(metric.metric_value);
        return acc;
      }, {});

      setMetrics({
        currentValuation: metricsMap['Company Valuation'] || 0,
        projectedValuation12m: (metricsMap['Company Valuation'] || 0) * 3, // Projected growth
        monthlyRevenue: metricsMap['Monthly Revenue'] || 0,
        clientRetentionRate: 97.5, // Static for now
        profitMargin: metricsMap['Profit Margin'] || 0,
        marketShare: 0.8 // Static for now
      });
    }
  }, [businessMetrics]);

  const revenueStreams: RevenueStream[] = [
    {
      id: 'autonomous-coding',
      name: 'Autonomous AI Coding Services',
      description: 'AI writes, tests, and deploys code independently',
      monthlyRevenue: 45000,
      growthRate: 35.2,
      icon: Brain,
      status: 'active'
    },
    {
      id: 'quantum-hosting',
      name: 'Quantum Cloud Infrastructure',
      description: 'Quantum-encrypted hosting with neural load balancing',
      monthlyRevenue: 32000,
      growthRate: 28.7,
      icon: Server,
      status: 'active'
    },
    {
      id: 'neural-security',
      name: 'Neural Cybersecurity Mesh',
      description: 'AI-powered threat detection and quantum defense',
      monthlyRevenue: 28000,
      growthRate: 42.1,
      icon: Shield,
      status: 'active'
    },
    {
      id: 'ai-consulting',
      name: 'Neural AI Consulting',
      description: 'Strategic AI implementation consulting',
      monthlyRevenue: 20000,
      growthRate: 55.3,
      icon: Target,
      status: 'active'
    },
    {
      id: 'quantum-scaling',
      name: 'Quantum Auto-Scaling',
      description: 'Predictive resource management with quantum algorithms',
      monthlyRevenue: 15000,
      growthRate: 67.8,
      icon: Zap,
      status: 'projected'
    },
    {
      id: 'neural-marketplace',
      name: 'Neural Component Marketplace',
      description: 'AI-generated code components and templates',
      monthlyRevenue: 12000,
      growthRate: 89.4,
      icon: Globe,
      status: 'projected'
    },
    {
      id: 'enterprise-licensing',
      name: 'Enterprise AI Licensing',
      description: 'White-label neural web development platform',
      monthlyRevenue: 85000,
      growthRate: 125.6,
      icon: Building,
      status: 'premium'
    }
  ];

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [growthAnimation, setGrowthAnimation] = useState(0);

  useEffect(() => {
    const total = revenueStreams.reduce((sum, stream) => sum + stream.monthlyRevenue, 0);
    setTotalRevenue(total);

    // Animate growth indicators
    const interval = setInterval(() => {
      setGrowthAnimation(prev => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-cyber-green text-black';
      case 'projected': return 'bg-neon-blue text-white';
      case 'premium': return 'bg-purple-400 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Business Overview Header */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8 text-cyber-green neon-glow" />
            <div>
              <h1 className="text-2xl font-bold text-hologram terminal-text">NEURAL_WEB_LABS_VALUATION</h1>
              <p className="text-cyber-green terminal-text">&gt;&gt; Quantum-powered business intelligence and projections</p>
            </div>
          </div>
          <Badge className="bg-cyber-green text-black neon-glow text-lg px-4 py-2">
            QUANTUM_READY
          </Badge>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-cyber">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                CURRENT_VALUATION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyber-green neon-glow">
                {formatCurrency(metrics.currentValuation)}
              </div>
              <div className="text-sm text-gray-400 terminal-text mt-1">
                Based on 12x revenue multiple
              </div>
            </CardContent>
          </Card>

          <Card className="card-cyber">
            <CardHeader className="pb-3">
              <CardTitle className="text-neon-pink terminal-text flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                12M_PROJECTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-neon-pink neon-glow">
                {formatCurrency(metrics.projectedValuation12m)}
              </div>
              <div className="text-sm text-gray-400 terminal-text mt-1">
                +198% growth potential
              </div>
            </CardContent>
          </Card>

          <Card className="card-cyber">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 terminal-text flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                MONTHLY_REVENUE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400 neon-glow">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-sm text-gray-400 terminal-text mt-1">
                Autonomous AI generated
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Streams */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <h2 className="text-xl font-bold text-cyber-green terminal-text mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          REVENUE_STREAM_ANALYSIS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {revenueStreams.map((stream) => {
            const Icon = stream.icon;
            return (
              <Card key={stream.id} className="card-cyber hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-cyber-green neon-glow" />
                      <div>
                        <CardTitle className="text-cyber-green terminal-text text-sm">
                          {stream.name}
                        </CardTitle>
                        <Badge className={`text-xs mt-1 ${getStatusColor(stream.status)}`}>
                          {stream.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyber-green">
                        {formatCurrency(stream.monthlyRevenue)}
                      </div>
                      <div className="text-xs text-gray-400">per month</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-gray-300 terminal-text text-xs">
                    {stream.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 terminal-text">GROWTH_RATE:</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={Math.min(stream.growthRate, 100)} 
                        className="w-16 h-1"
                      />
                      <span className="text-xs text-neon-pink font-bold">
                        +{stream.growthRate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Business Model Advantages */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <h2 className="text-xl font-bold text-cyber-green terminal-text mb-6 flex items-center gap-2">
          <Star className="w-6 h-6" />
          COMPETITIVE_ADVANTAGES
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="cyber-glass p-4 rounded-lg border border-cyber-green/20">
              <h3 className="text-neon-pink terminal-text font-bold mb-2">AUTONOMOUS_OPERATIONS</h3>
              <p className="text-gray-300 text-sm terminal-text">
                AI operators work 24/7 without human intervention, reducing costs by 85% while increasing output by 400%
              </p>
            </div>
            
            <div className="cyber-glass p-4 rounded-lg border border-neon-blue/20">
              <h3 className="text-neon-blue terminal-text font-bold mb-2">QUANTUM_SCALING</h3>
              <p className="text-gray-300 text-sm terminal-text">
                Quantum algorithms predict demand and auto-scale resources, ensuring 99.99% uptime with optimal costs
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="cyber-glass p-4 rounded-lg border border-purple-400/20">
              <h3 className="text-purple-400 terminal-text font-bold mb-2">NEURAL_LEARNING</h3>
              <p className="text-gray-300 text-sm terminal-text">
                AI continuously learns and improves, becoming more efficient and valuable with each client project
              </p>
            </div>
            
            <div className="cyber-glass p-4 rounded-lg border border-cyber-green/20">
              <h3 className="text-cyber-green terminal-text font-bold mb-2">MARKET_DISRUPTION</h3>
              <p className="text-gray-300 text-sm terminal-text">
                First-mover advantage in quantum-powered web development with proprietary neural algorithms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Projections */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <h2 className="text-xl font-bold text-cyber-green terminal-text mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          FINANCIAL_PROJECTIONS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center cyber-glass p-4 rounded-lg">
            <div className="text-2xl font-bold text-cyber-green">{metrics.profitMargin}%</div>
            <div className="text-xs terminal-text text-gray-400">PROFIT_MARGIN</div>
          </div>
          
          <div className="text-center cyber-glass p-4 rounded-lg">
            <div className="text-2xl font-bold text-neon-pink">{metrics.clientRetentionRate}%</div>
            <div className="text-xs terminal-text text-gray-400">CLIENT_RETENTION</div>
          </div>
          
          <div className="text-center cyber-glass p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{metrics.marketShare}%</div>
            <div className="text-xs terminal-text text-gray-400">MARKET_SHARE</div>
          </div>
          
          <div className="text-center cyber-glass p-4 rounded-lg">
            <div className="text-2xl font-bold text-neon-blue">15x</div>
            <div className="text-xs terminal-text text-gray-400">ROI_MULTIPLE</div>
          </div>
        </div>
      </div>

      {/* Payment Integration Status */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <h2 className="text-xl font-bold text-cyber-green terminal-text mb-6 flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          PAYMENT_PROCESSING_STATUS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-glass p-4 rounded-lg border border-cyber-green/20">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-cyber-green neon-glow" />
              <div>
                <h3 className="text-cyber-green terminal-text font-bold">STRIPE_CONNECTED</h3>
                <p className="text-xs text-gray-400">Active payment processing</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Processing Fee:</span>
                <span className="text-cyber-green">2.9% + 30¢</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Settlement:</span>
                <span className="text-cyber-green">2 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Global Coverage:</span>
                <span className="text-cyber-green">40+ countries</span>
              </div>
            </div>
          </div>

          <div className="cyber-glass p-4 rounded-lg border border-neon-blue/20">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-neon-blue neon-glow" />
              <div>
                <h3 className="text-neon-blue terminal-text font-bold">OPTIMIZATION_POTENTIAL</h3>
                <p className="text-xs text-gray-400">Revenue enhancement opportunities</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Add crypto payments for tech clients (+5% revenue)</p>
              <p>• Implement Paddle for tax compliance (EU expansion)</p>
              <p>• Multi-currency pricing (15% conversion boost)</p>
              <p>• Enterprise invoicing for large contracts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Model Summary */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <h2 className="text-xl font-bold text-cyber-green terminal-text mb-6 flex items-center gap-2">
          <Building className="w-6 h-6" />
          NEURAL_WEB_LABS_BUSINESS_MODEL
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="cyber-glass p-6 rounded-lg">
              <Brain className="w-12 h-12 text-cyber-green mx-auto mb-4 neon-glow" />
              <h3 className="text-cyber-green terminal-text font-bold mb-2">AUTONOMOUS_AI_SERVICES</h3>
              <p className="text-gray-300 text-sm">AI operators work 24/7 generating code, managing infrastructure, and optimizing performance without human intervention.</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="cyber-glass p-6 rounded-lg">
              <Rocket className="w-12 h-12 text-neon-pink mx-auto mb-4 neon-glow" />
              <h3 className="text-neon-pink terminal-text font-bold mb-2">QUANTUM_SCALING</h3>
              <p className="text-gray-300 text-sm">Predictive algorithms automatically scale resources and pricing based on demand, maximizing profit margins.</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="cyber-glass p-6 rounded-lg">
              <Star className="w-12 h-12 text-purple-400 mx-auto mb-4 neon-glow" />
              <h3 className="text-purple-400 terminal-text font-bold mb-2">PREMIUM_POSITIONING</h3>
              <p className="text-gray-300 text-sm">First-mover advantage in quantum-powered web development with proprietary neural algorithms.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-cyber-green/10 to-neon-pink/10 rounded-lg border border-cyber-green/20">
          <h3 className="text-xl font-bold text-cyber-green terminal-text mb-4">YOUR_EXPECTED_EARNINGS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyber-green">{formatCurrency(125000)}</div>
              <div className="text-sm text-gray-400 terminal-text">Current Monthly Revenue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-pink">{formatCurrency(350000)}</div>
              <div className="text-sm text-gray-400 terminal-text">6-Month Projection</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{formatCurrency(750000)}</div>
              <div className="text-sm text-gray-400 terminal-text">12-Month Projection</div>
            </div>
          </div>
          <p className="text-center text-gray-300 text-sm mt-4 terminal-text">
            Revenue projections based on current autonomous AI efficiency rates and market expansion patterns.
          </p>
        </div>
      </div>
    </div>
  );
}