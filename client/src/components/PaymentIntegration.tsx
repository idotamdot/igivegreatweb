import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Wallet,
  Building2,
  Smartphone,
  Bitcoin,
  Settings,
  TrendingUp,
  Users
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  fees: string;
  processingTime: string;
  pros: string[];
  cons: string[];
  icon: any;
  status: 'active' | 'recommended' | 'alternative';
  globalReach: number;
}

interface PaymentMetrics {
  monthlyVolume: number;
  averageTransaction: number;
  conversionRate: number;
  chargebackRate: number;
}

export default function PaymentIntegration() {
  const [stripeConnected, setStripeConnected] = useState(true);
  const [metrics, setMetrics] = useState<PaymentMetrics>({
    monthlyVolume: 125000,
    averageTransaction: 2500,
    conversionRate: 94.7,
    chargebackRate: 0.1
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Current payment processor - industry standard for SaaS',
      fees: '2.9% + 30¢',
      processingTime: 'Instant',
      pros: [
        'Excellent developer experience',
        'Global coverage (40+ countries)',
        'Advanced fraud protection',
        'Subscription billing built-in',
        'Strong API documentation'
      ],
      cons: [
        'Higher fees than some alternatives',
        'Account holds for new businesses',
        'Limited crypto support'
      ],
      icon: CreditCard,
      status: 'active',
      globalReach: 95
    },
    {
      id: 'paddle',
      name: 'Paddle',
      description: 'Merchant of record - handles all tax compliance',
      fees: '5% + 50¢',
      processingTime: 'Instant',
      pros: [
        'Handles all global tax compliance',
        'No need for tax registration',
        'Built-in subscription management',
        'Excellent for B2B SaaS',
        'Reduces administrative burden'
      ],
      cons: [
        'Higher fees than direct processors',
        'Less customization control',
        'Paddle owns customer relationship'
      ],
      icon: Shield,
      status: 'recommended',
      globalReach: 90
    },
    {
      id: 'crypto',
      name: 'Crypto Payments',
      description: 'Bitcoin, Ethereum, stablecoins for tech-forward clients',
      fees: '1-2%',
      processingTime: '10-60 minutes',
      pros: [
        'Very low fees',
        'No chargebacks',
        'Global reach',
        'Appeals to crypto natives',
        'Instant settlement to wallet'
      ],
      cons: [
        'Volatility risk',
        'Limited mainstream adoption',
        'Regulatory uncertainty',
        'Technical complexity'
      ],
      icon: Bitcoin,
      status: 'alternative',
      globalReach: 85
    },
    {
      id: 'paypal',
      name: 'PayPal Business',
      description: 'Familiar option for smaller clients',
      fees: '2.9% + 30¢',
      processingTime: 'Instant',
      pros: [
        'High consumer trust',
        'Easy setup',
        'Buyer protection',
        'Global brand recognition'
      ],
      cons: [
        'Account freezing issues',
        'Poor customer service',
        'Limited B2B features',
        'Higher dispute rates'
      ],
      icon: Wallet,
      status: 'alternative',
      globalReach: 75
    },
    {
      id: 'wise',
      name: 'Wise Business',
      description: 'Multi-currency accounts with low FX fees',
      fees: '0.4-2% FX',
      processingTime: '1-2 days',
      pros: [
        'Excellent FX rates',
        'Multi-currency accounts',
        'Low international fees',
        'Transparent pricing'
      ],
      cons: [
        'Not a payment processor',
        'Requires separate gateway',
        'Limited payment methods',
        'Mainly for currency conversion'
      ],
      icon: Globe,
      status: 'alternative',
      globalReach: 80
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-cyber-green text-black';
      case 'recommended': return 'bg-neon-pink text-white';
      case 'alternative': return 'bg-neon-blue text-white';
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
      {/* Payment Status Header */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <CreditCard className="w-8 h-8 text-cyber-green neon-glow" />
            <div>
              <h1 className="text-2xl font-bold text-hologram terminal-text">PAYMENT_INTEGRATION_STATUS</h1>
              <p className="text-cyber-green terminal-text">&gt;&gt; Neural Web Labs payment processing analysis</p>
            </div>
          </div>
          <Badge className={`text-lg px-4 py-2 neon-glow ${stripeConnected ? 'bg-cyber-green text-black' : 'bg-red-500 text-white'}`}>
            {stripeConnected ? 'STRIPE_CONNECTED' : 'SETUP_REQUIRED'}
          </Badge>
        </div>

        {/* Current Status Alert */}
        <Alert className="mb-6 border-cyber-green/20 bg-cyber-green/10">
          <CheckCircle className="h-4 w-4 text-cyber-green" />
          <AlertDescription className="text-cyber-green terminal-text">
            Stripe is connected and processing payments. Your Neural Web Labs business is ready to accept payments for all AI services.
          </AlertDescription>
        </Alert>

        {/* Payment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center cyber-glass p-4 rounded-lg">
            <div className="text-2xl font-bold text-cyber-green">{formatCurrency(metrics.monthlyVolume)}</div>
            <div className="text-xs terminal-text text-gray-400">MONTHLY_VOLUME</div>
          </div>
          
          <div className="text-center cyber-glass p-4 rounded-lg">
            <div className="text-2xl font-bold text-neon-pink">{formatCurrency(metrics.averageTransaction)}</div>
            <div className="text-xs terminal-text text-gray-400">AVG_TRANSACTION</div>
          </div>
          
          <div className="text-center cyber-glass p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{metrics.conversionRate}%</div>
            <div className="text-xs terminal-text text-gray-400">CONVERSION_RATE</div>
          </div>
          
          <div className="text-center cyber-glass p-4 rounded-lg">
            <div className="text-2xl font-bold text-neon-blue">{metrics.chargebackRate}%</div>
            <div className="text-xs terminal-text text-gray-400">CHARGEBACK_RATE</div>
          </div>
        </div>
      </div>

      {/* Payment Methods Comparison */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <h2 className="text-xl font-bold text-cyber-green terminal-text mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          PAYMENT_METHOD_ANALYSIS
        </h2>
        
        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Card key={method.id} className="card-cyber hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-cyber-green neon-glow" />
                      <div>
                        <CardTitle className="text-cyber-green terminal-text text-lg">
                          {method.name}
                        </CardTitle>
                        <Badge className={`text-xs mt-1 ${getStatusColor(method.status)}`}>
                          {method.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyber-green">
                        {method.fees}
                      </div>
                      <div className="text-xs text-gray-400">{method.processingTime}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-300 terminal-text text-sm">
                    {method.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-cyber-green terminal-text text-sm font-bold mb-2">ADVANTAGES:</h4>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {method.pros.map((pro, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-cyber-green" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-neon-pink terminal-text text-sm font-bold mb-2">CONSIDERATIONS:</h4>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {method.cons.map((con, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-neon-pink" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-xs text-gray-400 terminal-text">GLOBAL_REACH:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyber-green neon-glow"
                          style={{ width: `${method.globalReach}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-cyber-green font-bold">
                        {method.globalReach}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <h2 className="text-xl font-bold text-cyber-green terminal-text mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          OPTIMIZATION_RECOMMENDATIONS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="cyber-glass p-4 rounded-lg border border-neon-pink/20">
              <h3 className="text-neon-pink terminal-text font-bold mb-2">CURRENT_SETUP_OPTIMAL</h3>
              <p className="text-gray-300 text-sm terminal-text">
                Stripe is excellent for Neural Web Labs' B2B SaaS model. Strong API, subscription billing, and developer tools align perfectly with your autonomous AI services.
              </p>
            </div>
            
            <div className="cyber-glass p-4 rounded-lg border border-cyber-green/20">
              <h3 className="text-cyber-green terminal-text font-bold mb-2">CONSIDER_ADDING</h3>
              <p className="text-gray-300 text-sm terminal-text">
                Crypto payments for tech-forward clients who value decentralization. Bitcoin/ETH could differentiate Neural Web Labs in the AI space.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="cyber-glass p-4 rounded-lg border border-purple-400/20">
              <h3 className="text-purple-400 terminal-text font-bold mb-2">ENTERPRISE_SCALING</h3>
              <p className="text-gray-300 text-sm terminal-text">
                For larger enterprise clients, consider Paddle as merchant of record to handle complex global tax compliance automatically.
              </p>
            </div>
            
            <div className="cyber-glass p-4 rounded-lg border border-neon-blue/20">
              <h3 className="text-neon-blue terminal-text font-bold mb-2">INTERNATIONAL_EXPANSION</h3>
              <p className="text-gray-300 text-sm terminal-text">
                Wise Business accounts for multi-currency operations when expanding Neural Web Labs globally with local pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}