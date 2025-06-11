import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Network, 
  Shield, 
  Zap, 
  Server, 
  Bot,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Globe,
  Database,
  Cpu,
  Eye,
  Target,
  Gauge,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface QuantumMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  category: 'performance' | 'security' | 'ai' | 'infrastructure';
}

interface NeuralActivity {
  timestamp: string;
  type: 'ai_deployment' | 'security_scan' | 'optimization' | 'quantum_processing';
  description: string;
  status: 'success' | 'warning' | 'error';
  value?: number;
}

export default function QuantumAnalytics() {
  const [metrics, setMetrics] = useState<QuantumMetric[]>([]);
  const [realtimeData, setRealtimeData] = useState({
    aiEfficiency: 94,
    quantumProcessing: 87,
    securityStatus: 99,
    networkThroughput: 156,
    activeProjects: 7,
    onlineAgents: 23
  });
  const [activities, setActivities] = useState<NeuralActivity[]>([]);

  useEffect(() => {
    // Initialize quantum metrics
    const quantumMetrics: QuantumMetric[] = [
      {
        id: 'ai-efficiency',
        name: 'Neural AI Efficiency',
        value: 94.7,
        unit: '%',
        trend: 'up',
        change: 2.3,
        category: 'ai'
      },
      {
        id: 'quantum-processing',
        name: 'Quantum Processing Power',
        value: 87.2,
        unit: 'QFLOPS',
        trend: 'up',
        change: 5.1,
        category: 'performance'
      },
      {
        id: 'security-strength',
        name: 'Cybersecurity Mesh Integrity',
        value: 99.1,
        unit: '%',
        trend: 'stable',
        change: 0.1,
        category: 'security'
      },
      {
        id: 'neural-uptime',
        name: 'Neural Network Uptime',
        value: 99.97,
        unit: '%',
        trend: 'up',
        change: 0.02,
        category: 'infrastructure'
      },
      {
        id: 'threat-blocked',
        name: 'Threats Neutralized',
        value: 1247,
        unit: 'today',
        trend: 'up',
        change: 18.7,
        category: 'security'
      },
      {
        id: 'ai-predictions',
        name: 'AI Prediction Accuracy',
        value: 96.8,
        unit: '%',
        trend: 'up',
        change: 1.2,
        category: 'ai'
      },
      {
        id: 'quantum-encryption',
        name: 'Quantum Encryption Strength',
        value: 2048,
        unit: 'qubits',
        trend: 'stable',
        change: 0,
        category: 'security'
      },
      {
        id: 'neural-learning',
        name: 'Neural Learning Rate',
        value: 89.4,
        unit: '%',
        trend: 'up',
        change: 3.6,
        category: 'ai'
      }
    ];

    const neuralActivities: NeuralActivity[] = [
      {
        timestamp: '2 minutes ago',
        type: 'ai_deployment',
        description: 'Frontend Neural AI deployed to QuantumCommerce project',
        status: 'success',
        value: 94
      },
      {
        timestamp: '5 minutes ago',
        type: 'security_scan',
        description: 'Quantum security scan completed - 247 threats neutralized',
        status: 'success',
        value: 247
      },
      {
        timestamp: '8 minutes ago',
        type: 'optimization',
        description: 'Neural performance optimization increased efficiency by 12%',
        status: 'success',
        value: 12
      },
      {
        timestamp: '12 minutes ago',
        type: 'quantum_processing',
        description: 'Quantum algorithm processing completed for MedTech project',
        status: 'success'
      },
      {
        timestamp: '15 minutes ago',
        type: 'ai_deployment',
        description: 'Security Guardian AI activated enhanced monitoring',
        status: 'warning'
      },
      {
        timestamp: '18 minutes ago',
        type: 'optimization',
        description: 'Neural load balancer optimized server distribution',
        status: 'success',
        value: 23
      }
    ];

    setMetrics(quantumMetrics);
    setActivities(neuralActivities);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        aiEfficiency: Math.max(90, Math.min(100, prev.aiEfficiency + (Math.random() - 0.5) * 2)),
        quantumProcessing: Math.max(80, Math.min(95, prev.quantumProcessing + (Math.random() - 0.5) * 3)),
        securityStatus: Math.max(95, Math.min(100, prev.securityStatus + (Math.random() - 0.5) * 1)),
        networkThroughput: Math.max(100, Math.min(200, prev.networkThroughput + (Math.random() - 0.5) * 10)),
        activeProjects: prev.activeProjects,
        onlineAgents: Math.max(20, Math.min(30, prev.onlineAgents + Math.floor((Math.random() - 0.5) * 2)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'text-cyber-green';
      case 'security': return 'text-neon-pink';
      case 'ai': return 'text-neon-blue';
      case 'infrastructure': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-cyber-green" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ai_deployment': return Bot;
      case 'security_scan': return Shield;
      case 'optimization': return Zap;
      case 'quantum_processing': return Cpu;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'ai_deployment': return 'text-neon-blue';
      case 'security_scan': return 'text-neon-pink';
      case 'optimization': return 'text-cyber-green';
      case 'quantum_processing': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-cyber-green';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Neural Status */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="text-hologram terminal-text flex items-center gap-2">
            <Activity className="w-6 h-6" />
            QUANTUM_ANALYTICS_DASHBOARD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <Brain className="w-8 h-8 text-neon-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-blue terminal-text">
                {realtimeData.aiEfficiency.toFixed(1)}%
              </div>
              <div className="text-xs terminal-text text-gray-400">AI_EFFICIENCY</div>
            </div>
            <div className="text-center">
              <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400 terminal-text">
                {realtimeData.quantumProcessing.toFixed(1)}%
              </div>
              <div className="text-xs terminal-text text-gray-400">QUANTUM_POWER</div>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-neon-pink mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-pink terminal-text">
                {realtimeData.securityStatus.toFixed(1)}%
              </div>
              <div className="text-xs terminal-text text-gray-400">SECURITY_MESH</div>
            </div>
            <div className="text-center">
              <Network className="w-8 h-8 text-cyber-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyber-green terminal-text">
                {realtimeData.networkThroughput.toFixed(0)}
              </div>
              <div className="text-xs terminal-text text-gray-400">MBPS_NEURAL</div>
            </div>
            <div className="text-center">
              <Database className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-400 terminal-text">
                {realtimeData.activeProjects}
              </div>
              <div className="text-xs terminal-text text-gray-400">ACTIVE_PROJECTS</div>
            </div>
            <div className="text-center">
              <Bot className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyan-400 terminal-text">
                {realtimeData.onlineAgents}
              </div>
              <div className="text-xs terminal-text text-gray-400">ONLINE_AGENTS</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quantum Metrics Grid */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              NEURAL_NETWORK_METRICS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metrics.map(metric => (
                <Card key={metric.id} className="cyber-glass p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className={`terminal-text text-sm font-medium ${getCategoryColor(metric.category)}`}>
                        {metric.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-white terminal-text">
                          {metric.value}
                        </span>
                        <span className="text-xs text-gray-400 terminal-text">
                          {metric.unit}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-xs terminal-text ${
                        metric.trend === 'up' ? 'text-cyber-green' : 
                        metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <Badge className={`${getCategoryColor(metric.category)} bg-opacity-20 text-xs`}>
                    {metric.category.toUpperCase()}
                  </Badge>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Neural Activity Feed */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
              <Eye className="w-5 h-5" />
              REAL_TIME_NEURAL_ACTIVITY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={index} className="cyber-glass p-3 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ActivityIcon className={`w-5 h-5 mt-0.5 ${getActivityColor(activity.type)}`} />
                      <div className="flex-1">
                        <p className="terminal-text text-sm text-gray-300">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="terminal-text text-xs text-gray-500">
                            {activity.timestamp}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'success' ? 'bg-cyber-green' :
                            activity.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                          } neon-glow`}></div>
                          {activity.value && (
                            <Badge className="bg-gray-700 text-gray-300 text-xs">
                              +{activity.value}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-neon-blue terminal-text flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              NEURAL_PERFORMANCE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="terminal-text text-gray-400">AI Processing Speed</span>
                <span className="terminal-text text-neon-blue">94.7%</span>
              </div>
              <Progress value={94.7} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="terminal-text text-gray-400">Quantum Efficiency</span>
                <span className="terminal-text text-purple-400">87.2%</span>
              </div>
              <Progress value={87.2} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="terminal-text text-gray-400">Neural Learning Rate</span>
                <span className="terminal-text text-cyber-green">89.4%</span>
              </div>
              <Progress value={89.4} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-neon-pink terminal-text flex items-center gap-2">
              <Shield className="w-5 h-5" />
              SECURITY_STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-pink terminal-text mb-2">
                1,247
              </div>
              <div className="text-sm terminal-text text-gray-400">
                THREATS_NEUTRALIZED_TODAY
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-cyber-green terminal-text">99.1%</div>
                <div className="text-xs terminal-text text-gray-400">MESH_INTEGRITY</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400 terminal-text">2048</div>
                <div className="text-xs terminal-text text-gray-400">QUANTUM_BITS</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              GROWTH_METRICS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyber-green terminal-text mb-2">
                +23%
              </div>
              <div className="text-sm terminal-text text-gray-400">
                PERFORMANCE_INCREASE
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-neon-blue terminal-text">+18.7%</div>
                <div className="text-xs terminal-text text-gray-400">THREAT_DETECTION</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-400 terminal-text">+5.1%</div>
                <div className="text-xs terminal-text text-gray-400">QUANTUM_POWER</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}