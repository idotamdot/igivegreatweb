import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Brain, 
  Cpu, 
  Database, 
  Network, 
  Shield, 
  Zap,
  Eye,
  Lock,
  Globe,
  Terminal,
  Wifi
} from 'lucide-react';

interface HologramNode {
  id: string;
  x: number;
  y: number;
  size: number;
  type: 'neural' | 'data' | 'security' | 'quantum';
  connections: string[];
  activity: number;
}

interface DataStream {
  id: string;
  from: string;
  to: string;
  intensity: number;
  type: 'secure' | 'neural' | 'quantum';
}

export default function HolographicInterface() {
  const [nodes, setNodes] = useState<HologramNode[]>([]);
  const [dataStreams, setDataStreams] = useState<DataStream[]>([]);
  const [networkActivity, setNetworkActivity] = useState(0);
  const [quantumState, setQuantumState] = useState('STABLE');

  useEffect(() => {
    // Initialize holographic nodes
    const initialNodes: HologramNode[] = [
      { id: 'core', x: 50, y: 50, size: 20, type: 'neural', connections: ['sec1', 'data1', 'q1'], activity: 95 },
      { id: 'sec1', x: 20, y: 30, size: 15, type: 'security', connections: ['core', 'data1'], activity: 87 },
      { id: 'data1', x: 80, y: 30, size: 15, type: 'data', connections: ['core', 'q1'], activity: 92 },
      { id: 'q1', x: 35, y: 80, size: 18, type: 'quantum', connections: ['core', 'data1'], activity: 99 },
      { id: 'neural1', x: 70, y: 70, size: 12, type: 'neural', connections: ['q1', 'data1'], activity: 84 }
    ];

    setNodes(initialNodes);

    // Initialize data streams
    const initialStreams: DataStream[] = [
      { id: 'stream1', from: 'core', to: 'sec1', intensity: 0.8, type: 'secure' },
      { id: 'stream2', from: 'core', to: 'data1', intensity: 0.9, type: 'neural' },
      { id: 'stream3', from: 'q1', to: 'core', intensity: 1.0, type: 'quantum' }
    ];

    setDataStreams(initialStreams);

    // Animate the holographic interface
    const interval = setInterval(() => {
      setNetworkActivity(prev => {
        const newActivity = (prev + Math.random() * 10 - 5) % 100;
        return Math.max(0, Math.min(100, newActivity));
      });

      // Update node activities
      setNodes(prev => prev.map(node => ({
        ...node,
        activity: Math.max(70, Math.min(100, node.activity + Math.random() * 6 - 3))
      })));

      // Update quantum state
      const states = ['STABLE', 'ENTANGLED', 'SUPERPOSITION', 'COHERENT'];
      if (Math.random() < 0.1) {
        setQuantumState(states[Math.floor(Math.random() * states.length)]);
      }

      // Update data stream intensities
      setDataStreams(prev => prev.map(stream => ({
        ...stream,
        intensity: Math.max(0.3, Math.min(1.0, stream.intensity + Math.random() * 0.4 - 0.2))
      })));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'neural': return '#00ff41';
      case 'data': return '#ff006e';
      case 'security': return '#3a86ff';
      case 'quantum': return '#8b5cf6';
      default: return '#ffffff';
    }
  };

  const getStreamColor = (type: string) => {
    switch (type) {
      case 'secure': return '#3a86ff';
      case 'neural': return '#00ff41';
      case 'quantum': return '#8b5cf6';
      default: return '#ffffff';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'neural': return Brain;
      case 'data': return Database;
      case 'security': return Shield;
      case 'quantum': return Cpu;
      default: return Network;
    }
  };

  return (
    <div className="space-y-6">
      {/* Holographic Network Visualization */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="text-hologram terminal-text flex items-center gap-2">
            <Network className="w-5 h-5" />
            HOLOGRAPHIC_NETWORK_INTERFACE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 bg-gray-900/50 rounded-lg overflow-hidden">
            <svg className="w-full h-full">
              {/* Render data streams */}
              {dataStreams.map((stream) => {
                const fromNode = nodes.find(n => n.id === stream.from);
                const toNode = nodes.find(n => n.id === stream.to);
                if (!fromNode || !toNode) return null;

                return (
                  <line
                    key={stream.id}
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke={getStreamColor(stream.type)}
                    strokeWidth={stream.intensity * 3}
                    opacity={stream.intensity}
                    className="animate-pulse"
                  />
                );
              })}

              {/* Render network nodes */}
              {nodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                return (
                  <g key={node.id}>
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={node.size}
                      fill={getNodeColor(node.type)}
                      opacity="0.3"
                      className="animate-pulse"
                    />
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={node.size * 0.6}
                      fill={getNodeColor(node.type)}
                      opacity="0.8"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Node Labels */}
            {nodes.map((node) => {
              const Icon = getNodeIcon(node.type);
              return (
                <div
                  key={`label-${node.id}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${node.x}%`, 
                    top: `${node.y}%` 
                  }}
                >
                  <Icon 
                    className="w-4 h-4 text-white" 
                    style={{ color: getNodeColor(node.type) }}
                  />
                </div>
              );
            })}
          </div>

          {/* Network Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-cyber-green">{nodes.length}</div>
              <div className="text-xs terminal-text text-gray-400">ACTIVE_NODES</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-neon-pink">{dataStreams.length}</div>
              <div className="text-xs terminal-text text-gray-400">DATA_STREAMS</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-neon-blue">{networkActivity.toFixed(1)}%</div>
              <div className="text-xs terminal-text text-gray-400">NETWORK_LOAD</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{quantumState}</div>
              <div className="text-xs terminal-text text-gray-400">QUANTUM_STATE</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Control Panel */}
      <Card className="card-cyber">
        <CardHeader>
          <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            NEURAL_CONTROL_MATRIX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="cyber-glass neon-border h-16 flex-col gap-2">
              <Activity className="w-5 h-5 text-cyber-green" />
              <span className="text-xs terminal-text">SCAN_NETWORK</span>
            </Button>
            <Button className="cyber-glass neon-border h-16 flex-col gap-2">
              <Shield className="w-5 h-5 text-neon-blue" />
              <span className="text-xs terminal-text">BOOST_SECURITY</span>
            </Button>
            <Button className="cyber-glass neon-border h-16 flex-col gap-2">
              <Zap className="w-5 h-5 text-neon-pink" />
              <span className="text-xs terminal-text">QUANTUM_BOOST</span>
            </Button>
            <Button className="cyber-glass neon-border h-16 flex-col gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              <span className="text-xs terminal-text">DEEP_SCAN</span>
            </Button>
          </div>

          {/* System Status */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="terminal-text text-cyber-green text-sm">SYSTEM_INTEGRITY:</span>
              <Badge className="bg-cyber-green text-black neon-glow">OPTIMAL</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="terminal-text text-cyber-green text-sm">NEURAL_SYNC:</span>
              <Badge className="bg-neon-pink text-white">SYNCHRONIZED</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="terminal-text text-cyber-green text-sm">QUANTUM_ENCRYPTION:</span>
              <Badge className="bg-purple-400 text-white">ACTIVE</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Connections */}
      <Card className="card-neon">
        <CardHeader>
          <CardTitle className="text-neon-pink terminal-text flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            ACTIVE_NEURAL_CONNECTIONS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {nodes.map((node) => (
              <div key={node.id} className="cyber-glass p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full neon-glow"
                      style={{ backgroundColor: getNodeColor(node.type) }}
                    ></div>
                    <div>
                      <div className="terminal-text text-sm font-medium text-cyber-green">
                        NODE_{node.id.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">
                        Activity: {node.activity.toFixed(1)}% • Type: {node.type.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <Badge className="text-xs bg-gray-700 text-white">
                    {node.connections.length} LINKS
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}