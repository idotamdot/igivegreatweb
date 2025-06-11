import { Link } from "wouter";
import SiteHeader from "@/components/site-header";
import ParticleBackground from "@/components/ParticleBackground";
import CyberMatrix from "@/components/CyberMatrix";
import NeuralNavigation from "@/components/NeuralNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Brain, Network, Shield, Zap, Database, Eye, Terminal } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <CyberMatrix />
      <ParticleBackground />
      <NeuralNavigation />
      <SiteHeader />
      
      <main className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Neural Core Interface */}
          <div className="cyber-glass p-8 rounded-3xl neon-border hologram-effect">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Brain className="w-12 h-12 text-cyber-green neon-glow" />
              <div className="h-8 w-px bg-cyber-green neon-glow"></div>
              <Network className="w-12 h-12 text-neon-pink neon-glow" />
              <div className="h-8 w-px bg-neon-pink neon-glow"></div>
              <Shield className="w-12 h-12 text-neon-blue neon-glow" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-hologram glitch-effect terminal-text">
              NEURAL_WEB_LABS
            </h1>
            
            <div className="space-y-3 mb-8">
              <div className="terminal-text text-cyber-green text-lg">
                &gt;&gt; QUANTUM_WEB_ARCHITECTURE: ONLINE
              </div>
              <div className="terminal-text text-neon-pink text-lg">
                &gt;&gt; AI_ENHANCED_DEVELOPMENT: ACTIVE
              </div>
              <div className="terminal-text text-neon-blue text-lg">
                &gt;&gt; NEURAL_CODING_MATRIX: INITIALIZED
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <Badge className="bg-cyber-green text-black neon-glow">
                AI_POWERED_CODING
              </Badge>
              <Badge className="bg-neon-pink text-white neon-glow">
                QUANTUM_HOSTING
              </Badge>
              <Badge className="bg-neon-blue text-white neon-glow">
                NEURAL_OPTIMIZATION
              </Badge>
              <Badge className="bg-purple-400 text-white neon-glow">
                CYBERSECURITY_MESH
              </Badge>
            </div>
          </div>

          {/* Neural Business Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/services">
              <div className="card-cyber p-6 hover-lift cursor-pointer group">
                <Brain className="w-8 h-8 text-cyber-green mx-auto mb-4 neon-glow group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-cyber-green terminal-text mb-2">
                  AI_WEB_DEVELOPMENT
                </h3>
                <p className="text-gray-300 terminal-text text-sm">
                  Neural networks code your websites autonomously
                </p>
                <div className="mt-4 terminal-text text-xs text-neon-pink">
                  &gt;&gt; CUSTOM_AI_CODING_AGENTS
                </div>
              </div>
            </Link>

            <Link to="/services">
              <div className="card-neon p-6 hover-lift cursor-pointer group">
                <Network className="w-8 h-8 text-neon-pink mx-auto mb-4 neon-glow group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-neon-pink terminal-text mb-2">
                  QUANTUM_HOSTING
                </h3>
                <p className="text-gray-300 terminal-text text-sm">
                  Quantum-encrypted cloud infrastructure
                </p>
                <div className="mt-4 terminal-text text-xs text-cyber-green">
                  &gt;&gt; 99.999%_UPTIME_GUARANTEED
                </div>
              </div>
            </Link>

            <Link to="/services">
              <div className="card-hologram p-6 hover-lift cursor-pointer group">
                <Shield className="w-8 h-8 text-hologram mx-auto mb-4 neon-glow group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-hologram terminal-text mb-2">
                  CYBERSECURITY_MESH
                </h3>
                <p className="text-gray-300 terminal-text text-sm">
                  Neural threat detection and prevention
                </p>
                <div className="mt-4 terminal-text text-xs text-neon-blue">
                  &gt;&gt; ZERO_DAY_PROTECTION
                </div>
              </div>
            </Link>
          </div>

          {/* Neural Search Interface */}
          <div className="cyber-glass p-6 rounded-2xl neon-border">
            <div className="flex items-center gap-4 mb-4">
              <Search className="w-6 h-6 text-cyber-green neon-glow" />
              <span className="terminal-text text-cyber-green">NEURAL_SEARCH_PROTOCOL</span>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter quantum search parameters..."
                  className="w-full px-4 py-3 bg-gray-900/50 border border-cyber-green/30 rounded-lg text-cyber-green terminal-text placeholder-gray-500 focus:border-cyber-green focus:outline-none"
                />
              </div>
              <Button className="bg-neon-gradient neon-glow terminal-text">
                <Zap className="w-4 h-4 mr-2" />
                EXECUTE
              </Button>
            </div>
          </div>

          {/* Neural Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-glass p-4 rounded-lg text-center">
              <Eye className="w-6 h-6 text-cyber-green mx-auto mb-2 neon-glow" />
              <div className="text-lg font-bold text-cyber-green">24/7</div>
              <div className="text-xs terminal-text text-gray-400">MONITORING</div>
            </div>
            <div className="cyber-glass p-4 rounded-lg text-center">
              <Terminal className="w-6 h-6 text-neon-pink mx-auto mb-2 neon-glow" />
              <div className="text-lg font-bold text-neon-pink">99.9%</div>
              <div className="text-xs terminal-text text-gray-400">UPTIME</div>
            </div>
            <div className="cyber-glass p-4 rounded-lg text-center">
              <Shield className="w-6 h-6 text-neon-blue mx-auto mb-2 neon-glow" />
              <div className="text-lg font-bold text-neon-blue">256</div>
              <div className="text-xs terminal-text text-gray-400">BIT_ENCRYPTION</div>
            </div>
            <div className="cyber-glass p-4 rounded-lg text-center">
              <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2 neon-glow" />
              <div className="text-lg font-bold text-purple-400">AI</div>
              <div className="text-xs terminal-text text-gray-400">ENHANCED</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}