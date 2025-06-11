import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Shield } from "lucide-react";

interface SiteHeaderProps {
  onMenuClick?: () => void;
  onConnectClick?: () => void;
}

export default function SiteHeader({ onMenuClick, onConnectClick }: SiteHeaderProps) {
  const [systemTime, setSystemTime] = useState('');
  const [networkStatus, setNetworkStatus] = useState(98.7);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Simulate network fluctuation
    const networkInterval = setInterval(() => {
      setNetworkStatus(prev => Math.max(95, Math.min(100, prev + Math.random() * 2 - 1)));
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(networkInterval);
    };
  }, []);

  return (
    <header className="fixed w-full top-0 z-40 cyber-glass border-b border-cyber-green/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Neural System Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyber-green neon-glow" />
              <span className="terminal-text text-cyber-green text-sm">NEURAL_OS</span>
            </div>
            <Badge className="bg-cyber-green text-black text-xs neon-glow">
              ONLINE
            </Badge>
          </div>

          {/* System Metrics */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-neon-pink" />
              <span className="terminal-text text-neon-pink text-xs">
                NET: {networkStatus.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-blue" />
              <span className="terminal-text text-neon-blue text-xs">
                SEC: MAXIMUM
              </span>
            </div>
            <div className="terminal-text text-cyber-green text-xs">
              {systemTime}
            </div>
          </div>

          {/* Quantum Signature */}
          <div className="terminal-text text-purple-400 text-xs">
            QNT-SIG: VERIFIED
          </div>
        </div>
      </div>
    </header>
  );
}
