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
    <div className="fixed top-4 left-4 z-50">
      <div className="cyber-glass p-4 rounded-2xl neon-border">
        {/* Network Status Header */}
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-5 h-5 text-cyber-green neon-glow" />
          <div className="terminal-text text-cyber-green text-sm">
            NEURAL_NETWORK
          </div>
          <Badge className="bg-cyber-green text-black text-xs neon-glow">
            ONLINE
          </Badge>
        </div>

        {/* Navigation Nodes */}
        <div className="space-y-2">
          {navNodes.map((node) => {
            const Icon = node.icon;
            const isActive = activeNode === node.id;
            const isCurrentPath = location === node.path;
            
            return (
              <Link key={node.id} to={node.path}>
                <Button
                  variant={isCurrentPath ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start gap-3 text-xs h-10 transition-all duration-300 ${
                    isCurrentPath 
                      ? 'bg-neon-gradient text-white neon-glow' 
                      : 'text-cyber-green hover:bg-cyber-green/10 hover:text-neon-pink'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)} neon-glow`}></div>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="terminal-text font-medium">{node.label}</div>
                    <div className="text-xs opacity-70">{node.description}</div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Network Pulse Indicator */}
        <div className="mt-4 pt-3 border-t border-cyber-green/20">
          <div className="flex items-center gap-2 text-xs">
            <Globe className="w-3 h-3 text-neon-blue" />
            <div className="terminal-text text-cyber-green">
              NETWORK_PULSE: {networkPulse}%
            </div>
            <div 
              className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden"
            >
              <div 
                className="h-full bg-cyber-green neon-glow transition-all duration-100"
                style={{ width: `${networkPulse}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 pt-3 border-t border-cyber-green/20">
          <div className="text-xs terminal-text text-cyber-green mb-2">QUICK_ACCESS:</div>
          <div className="grid grid-cols-2 gap-1">
            <Button variant="ghost" size="sm" className="text-xs h-6 cyber-glass">
              <Terminal className="w-3 h-3 mr-1" />
              CLI
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-6 cyber-glass">
              <Zap className="w-3 h-3 mr-1" />
              BOOST
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}