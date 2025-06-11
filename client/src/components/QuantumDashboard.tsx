import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Zap, 
  Shield, 
  Database, 
  Network,
  Cpu,
  HardDrive,
  Wifi,
  Settings,
  Terminal,
  Eye,
  Lock,
  Globe
} from 'lucide-react';

interface SystemMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface NetworkNode {
  id: string;
  name: string;
  type: 'user' | 'business' | 'admin' | 'ai';
  status: 'online' | 'idle' | 'offline';
  connections: number;
  data_flow: number;
}

export default function QuantumDashboard() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [quantumState, setQuantumState] = useState(0);
  const [dataStreams, setDataStreams] = useState<number[]>([]);

  useEffect(() => {
    // Initialize system metrics
    setMetrics([
      { id: 'neural', label: 'NEURAL_EFFICIENCY', value: 94, unit: '%', status: 'optimal', trend: 'up' },
      { id: 'quantum', label: 'QUANTUM_COHERENCE', value: 87, unit: '%', status: 'optimal', trend: 'stable' },
      { id: 'ethics', label: 'ETHICS_COMPLIANCE', value: 99, unit: '%', status: 'optimal', trend: 'up' },
      { id: 'security', label: 'SECURITY_MATRIX', value: 100, unit: '%', status: 'optimal', trend: 'stable' },
      { id: 'bandwidth', label: 'DATA_BANDWIDTH', value: 76, unit: 'GB/s', status: 'optimal', trend: 'up' },
      { id: 'uptime', label: 'SYSTEM_UPTIME', value: 99.9, unit: '%', status: 'optimal', trend: 'stable' }
    ]);

    // Initialize network nodes
    setNetworkNodes([
      { id: 'admin1', name: 'ADMIN_NEXUS', type: 'admin', status: 'online', connections: 15, data_flow: 2.4 },
      { id: 'ai1', name: 'NEURAL_AI', type: 'ai', status: 'online', connections: 8, data_flow: 5.7 },
      { id: 'biz1', name: 'BIZ_ENTITY_01', type: 'business', status: 'online', connections: 3, data_flow: 1.2 },
      { id: 'user1', name: 'USER_NODE_47', type: 'user', status: 'idle', connections: 1, data_flow: 0.3 }
    ]);

    // Animate quantum state and data streams
    const interval = setInterval(() => {
      setQuantumState(prev => (prev + 1) % 360);
      setDataStreams(prev => {
        const newStreams = [...prev];
        if (newStreams.length > 20) newStreams.shift();
        newStreams.push(Math.random() * 100);
        return newStreams;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-cyber-green';
      case 'warning': return 'text-neon-pink';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-neon-pink';
      case 'ai': return 'bg-cyber-green';
      case 'business': return 'bg-neon-blue';
      case 'user': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* System Header */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Brain className="w-8 h-8 text-cyber-green neon-glow" />
            <div>
              <h1 className="text-2xl font-bold text-hologram terminal-text">QUANTUM_ADMIN_NEXUS</h1>
              <p className="text-cyber-green terminal-text">&gt;&gt; Neural network administration interface</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyber-green text-black neon-glow">SYSTEM_ONLINE</Badge>
            <Badge className="bg-neon-pink text-white">QUANTUM_STATE: {quantumState}°</Badge>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id} className="card-cyber">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm terminal-text text-cyber-green flex items-center justify-between">
                {metric.label}
                <div className={`w-2 h-2 rounded-full ${
                  metric.status === 'optimal' ? 'bg-cyber-green' : 
                  metric.status === 'warning' ? 'bg-neon-pink' : 'bg-red-500'
                } neon-glow`}></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </span>
                  <span className="text-sm text-gray-400 terminal-text">{metric.unit}</span>
                </div>
                <Progress 
                  value={metric.value} 
                  className="h-2"
                />
                <div className="flex items-center gap-2 text-xs">
                  <Activity className="w-3 h-3" />
                  <span className="terminal-text text-cyber-green">
                    TREND: {metric.trend.toUpperCase()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Network Nodes */}
        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="text-neon-pink terminal-text flex items-center gap-2">
              <Network className="w-5 h-5" />
              ACTIVE_NETWORK_NODES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {networkNodes.map((node) => (
                <div key={node.id} className="cyber-glass p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getNodeTypeColor(node.type)} neon-glow`}></div>
                      <div>
                        <div className="terminal-text text-sm font-medium text-cyber-green">
                          {node.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {node.connections} connections • {node.data_flow} GB/s
                        </div>
                      </div>
                    </div>
                    <Badge className={`text-xs ${
                      node.status === 'online' ? 'bg-cyber-green text-black' :
                      node.status === 'idle' ? 'bg-neon-blue text-white' : 'bg-gray-500'
                    }`}>
                      {node.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Stream Visualization */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
              <Activity className="w-5 h-5" />
              REAL_TIME_DATA_STREAMS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 relative overflow-hidden bg-gray-900/50 rounded-lg">
              <svg className="w-full h-full">
                {dataStreams.map((value, index) => (
                  <rect
                    key={index}
                    x={index * 4}
                    y={32 - (value * 0.32)}
                    width="3"
                    height={value * 0.32}
                    fill="url(#dataGradient)"
                    className="opacity-80"
                  />
                ))}
                <defs>
                  <linearGradient id="dataGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00ff41" />
                    <stop offset="100%" stopColor="#ff006e" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="mt-3 text-xs terminal-text text-cyber-green">
              &gt;&gt; QUANTUM_DATA_PROCESSING: ACTIVE
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="text-hologram terminal-text flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            QUANTUM_OPERATIONS_PANEL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="cyber-glass neon-border h-12 flex-col gap-1">
              <Database className="w-4 h-4" />
              <span className="text-xs">DB_SYNC</span>
            </Button>
            <Button className="cyber-glass neon-border h-12 flex-col gap-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs">SECURITY</span>
            </Button>
            <Button className="cyber-glass neon-border h-12 flex-col gap-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs">BOOST</span>
            </Button>
            <Button className="cyber-glass neon-border h-12 flex-col gap-1">
              <Settings className="w-4 h-4" />
              <span className="text-xs">CONFIG</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}