import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3, 
  Activity,
  ArrowUpRight,
  Coins,
  CreditCard,
  Banknote
} from "lucide-react";

interface RevenueStream {
  id: string;
  name: string;
  currentRevenue: number;
  projectedRevenue: number;
  growthRate: number;
  optimization: number;
  quantumEnhanced: boolean;
}

interface QuantumMetric {
  name: string;
  value: number;
  target: number;
  improvement: number;
  status: 'optimal' | 'improving' | 'needs-attention';
}

export function QuantumRevenueEngine() {
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [quantumMetrics, setQuantumMetrics] = useState<QuantumMetric[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [quantumBoost, setQuantumBoost] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Initialize revenue streams
    const streams: RevenueStream[] = [
      {
        id: 'autonomous-dev',
        name: 'Autonomous Development Services',
        currentRevenue: 47500,
        projectedRevenue: 68750,
        growthRate: 44.7,
        optimization: 97.3,
        quantumEnhanced: true
      },
      {
        id: 'quantum-hosting',
        name: 'Quantum Cloud Hosting',
        currentRevenue: 32000,
        projectedRevenue: 51200,
        growthRate: 60.0,
        optimization: 94.8,
        quantumEnhanced: true
      },
      {
        id: 'neural-security',
        name: 'Neural Cybersecurity Suite',
        currentRevenue: 28750,
        projectedRevenue: 41625,
        growthRate: 44.8,
        optimization: 92.1,
        quantumEnhanced: true
      },
      {
        id: 'ai-consulting',
        name: 'AI Strategy Consulting',
        currentRevenue: 16750,
        projectedRevenue: 26800,
        growthRate: 60.0,
        optimization: 89.6,
        quantumEnhanced: false
      }
    ];

    const metrics: QuantumMetric[] = [
      { name: 'Revenue Optimization', value: 94.2, target: 96.0, improvement: 12.4, status: 'improving' },
      { name: 'Profit Margin Enhancement', value: 78.3, target: 82.0, improvement: 15.7, status: 'improving' },
      { name: 'Client Value Maximization', value: 91.7, target: 94.0, improvement: 8.9, status: 'optimal' },
      { name: 'Market Penetration', value: 23.4, target: 35.0, improvement: 67.3, status: 'improving' },
      { name: 'Revenue Predictability', value: 87.9, target: 90.0, improvement: 5.2, status: 'needs-attention' },
      { name: 'Quantum Acceleration Factor', value: 127.4, target: 150.0, improvement: 23.8, status: 'improving' }
    ];

    setRevenueStreams(streams);
    setQuantumMetrics(metrics);
    setTotalRevenue(streams.reduce((sum, stream) => sum + stream.currentRevenue, 0));
    setQuantumBoost(34.7);
  }, []);

  const initiateQuantumOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate quantum optimization process
    setTimeout(() => {
      setRevenueStreams(prev => prev.map(stream => ({
        ...stream,
        currentRevenue: Math.round(stream.currentRevenue * 1.15),
        optimization: Math.min(100, stream.optimization + 2.3),
        growthRate: stream.growthRate + 5.7
      })));
      
      setQuantumBoost(prev => prev + 8.2);
      setTotalRevenue(prev => Math.round(prev * 1.15));
      setIsOptimizing(false);
    }, 4000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-cyber-green';
      case 'improving': return 'text-neon-blue';
      case 'needs-attention': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-cyber-green';
      case 'improving': return 'bg-neon-blue';
      case 'needs-attention': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantum Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">TOTAL_REVENUE</p>
                <p className="terminal-text text-2xl font-bold text-cyber-green">
                  ${(totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-cyber-green neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">QUANTUM_BOOST</p>
                <p className="terminal-text text-2xl font-bold text-neon-blue">
                  +{quantumBoost.toFixed(1)}%
                </p>
              </div>
              <Zap className="w-8 h-8 text-neon-blue neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">GROWTH_RATE</p>
                <p className="terminal-text text-2xl font-bold text-hologram">
                  +52.4%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-hologram neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <Button 
              onClick={initiateQuantumOptimization}
              disabled={isOptimizing}
              className="w-full bg-gradient-to-r from-cyber-green to-neon-blue hover:from-neon-blue hover:to-cyber-green terminal-text"
            >
              {isOptimizing ? 'OPTIMIZING...' : 'QUANTUM_BOOST'}
              <Target className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="streams" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-neon-blue/30">
          <TabsTrigger value="streams" className="terminal-text">Revenue Streams</TabsTrigger>
          <TabsTrigger value="metrics" className="terminal-text">Quantum Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="streams" className="space-y-4">
          <div className="grid gap-4">
            {revenueStreams.map((stream) => (
              <Card key={stream.id} className="card-hologram">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="terminal-text text-white text-lg">
                      {stream.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {stream.quantumEnhanced && (
                        <Badge className="bg-neon-blue terminal-text">
                          QUANTUM_ENHANCED
                        </Badge>
                      )}
                      <Badge className="bg-cyber-green terminal-text">
                        ACTIVE
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">CURRENT</p>
                      <p className="terminal-text text-xl font-bold text-cyber-green">
                        ${(stream.currentRevenue / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">PROJECTED</p>
                      <p className="terminal-text text-xl font-bold text-neon-blue">
                        ${(stream.projectedRevenue / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">GROWTH</p>
                      <div className="flex items-center space-x-1">
                        <p className="terminal-text text-xl font-bold text-hologram">
                          +{stream.growthRate.toFixed(1)}%
                        </p>
                        <ArrowUpRight className="w-4 h-4 text-hologram" />
                      </div>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">OPTIMIZATION</p>
                      <p className="terminal-text text-xl font-bold text-purple-400">
                        {stream.optimization.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Revenue Growth</span>
                        <span>{stream.growthRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(100, stream.growthRate)} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Optimization Level</span>
                        <span>{stream.optimization.toFixed(1)}%</span>
                      </div>
                      <Progress value={stream.optimization} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quantumMetrics.map((metric, index) => (
              <Card key={index} className="card-hologram">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="terminal-text text-gray-400 text-sm">
                        {metric.name.toUpperCase()}
                      </p>
                      <Badge className={`${getStatusBadgeColor(metric.status)} terminal-text`}>
                        {metric.status.toUpperCase().replace('-', '_')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="terminal-text text-2xl font-bold text-cyber-green">
                        {metric.name.includes('Factor') ? metric.value.toFixed(1) : `${metric.value.toFixed(1)}%`}
                      </p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-cyber-green" />
                        <span className="terminal-text text-cyber-green text-sm">
                          +{metric.improvement.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Target</span>
                        <span>
                          {metric.name.includes('Factor') ? metric.target.toFixed(1) : `${metric.target.toFixed(1)}%`}
                        </span>
                      </div>
                      <Progress 
                        value={metric.name.includes('Factor') ? 
                          (metric.value / metric.target) * 100 : 
                          metric.value
                        } 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}