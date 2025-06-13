import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Database, 
  Network, 
  Zap, 
  Shield, 
  Eye, 
  Terminal,
  Activity,
  Cpu,
  Globe
} from 'lucide-react';

interface NavNode {
  id: string;
  label: string;
  path: string;
  icon: any;
  status: 'online' | 'processing' | 'standby';
  connections: string[];
  description: string;
}

export default function NeuralNavigation() {
  const [location] = useLocation();
  const [activeNode, setActiveNode] = useState<string>('');
  const [networkPulse, setNetworkPulse] = useState(0);

  const navNodes: NavNode[] = [
    {
      id: 'core',
      label: 'NEURAL_WEB_LABS',
      path: '/',
      icon: Brain,
      status: 'online',
      connections: ['admin', 'auth'],
      description: 'Neural Web Labs homepage'
    },
    {
      id: 'admin',
      label: 'AI_OPERATIONS',
      path: '/admin',
      icon: Shield,
      status: 'online',
      connections: ['core'],
      description: 'Quantum AI Operations Center'
    },
    {
      id: 'auth',
      label: 'AUTH_MATRIX',
      path: '/auth',
      icon: Eye,
      status: 'standby',
      connections: ['admin'],
      description: 'Authentication protocols'
    },
    {
      id: 'login',
      label: 'NEURAL_LOGIN',
      path: '/login',
      icon: Terminal,
      status: 'online',
      connections: ['core'],
      description: 'Neural matrix access portal'
    },
    {
      id: 'quantum-workspace',
      label: 'QUANTUM_WORKSPACE',
      path: '/quantum-workspace',
      icon: Cpu,
      status: 'processing',
      connections: ['core', 'admin'],
      description: 'Advanced quantum operations center'
    },
    {
      id: 'ai-generator',
      label: 'AI_PROJECT_GEN',
      path: '/ai-generator',
      icon: Activity,
      status: 'online',
      connections: ['quantum-workspace', 'admin'],
      description: 'Autonomous project generation system'
    },
    {
      id: 'neural-analytics',
      label: 'NEURAL_ANALYTICS',
      path: '/neural-analytics',
      icon: Globe,
      status: 'processing',
      connections: ['quantum-workspace', 'ai-generator'],
      description: 'Real-time performance analytics'
    }
  ];

  useEffect(() => {
    // Update active node based on current location
    const currentNode = navNodes.find(node => node.path === location);
    if (currentNode) {
      setActiveNode(currentNode.id);
    }

    // Animate network pulse
    const interval = setInterval(() => {
      setNetworkPulse(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, [location]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-cyber-green';
      case 'processing': return 'bg-neon-pink';
      case 'standby': return 'bg-neon-blue';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionOpacity = (nodeId: string, targetId: string) => {
    const node = navNodes.find(n => n.id === nodeId);
    if (!node) return 0;
    
    const isConnected = node.connections.includes(targetId);
    const isActive = activeNode === nodeId || activeNode === targetId;
    
    if (isConnected && isActive) return 0.8;
    if (isConnected) return 0.3;
    return 0.1;
  };

  return (
    <div className="w-full bg-gray-900/50 backdrop-blur-sm border-b border-cyber-green/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-cyber-green neon-glow" />
            <div className="terminal-text text-cyber-green font-bold">NEURAL_WEB_LABS</div>
            <Badge className="bg-cyber-green text-black text-xs neon-glow">
              QUANTUM_READY
            </Badge>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {navNodes.map((node) => {
              const Icon = node.icon;
              const isCurrentPath = location === node.path;
              
              return (
                <Link key={node.id} to={node.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 text-xs transition-all duration-300 ${
                      isCurrentPath 
                        ? 'bg-neon-gradient text-white neon-glow' 
                        : 'text-cyber-green hover:bg-cyber-green/10 hover:text-neon-pink'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)} neon-glow`}></div>
                    <Icon className="w-4 h-4" />
                    <span className="terminal-text font-medium">{node.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="text-xs terminal-text text-cyber-green">
              NETWORK: {networkPulse}%
            </div>
            <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyber-green neon-glow transition-all duration-100"
                style={{ width: `${networkPulse}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}