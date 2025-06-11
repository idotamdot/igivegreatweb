import { useState } from "react";
import { Link } from "wouter";
import SiteHeader from "@/components/site-header";
import MobileNav from "@/components/mobile-nav";
import ConnectDialog from "@/components/connect-dialog";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Heart } from "lucide-react";

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col">
      <ParticleBackground />
      <SiteHeader 
        onMenuClick={() => setMobileNavOpen(true)} 
        onConnectClick={() => setConnectOpen(true)}
      />
      
      {/* Menu Arrow Indicator */}
      <div className="fixed top-20 left-5 flex items-center z-40 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-6 h-10 mb-2 transform rotate-[225deg]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white menu-indicator-arrow animate-glow"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          <div className="text-white text-lg md:text-xl menu-indicator-text animate-glow">
            see our work here
          </div>
        </div>
      </div>
      
      {/* Cyberpunk Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center space-y-12 bg-cyber-gradient cyber-grid relative">
        {/* Data Stream Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-cyber-green opacity-30 data-stream" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-neon-pink opacity-20 data-stream" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-neon-blue opacity-25 data-stream" style={{animationDelay: '2s'}}></div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-center px-4 text-hologram font-mono neon-glow glitch-effect terminal-text">
          igivegreatweb.com
        </h1>
        
        {/* Cyberpunk Interface */}
        <div className="flex flex-col items-center space-y-6 z-10">
          <Link to="/index">
            <Button 
              size="lg" 
              className="bg-neon-gradient hover:bg-hologram-gradient text-white text-xl px-16 py-8 rounded-3xl shadow-2xl btn-magnetic neon-glow cyber-glass border-2 border-neon-pink hover:border-neon-blue animate-float hologram-effect"
            >
              <Search className="w-6 h-6 mr-3 text-cyber-green" />
              <span className="text-hologram font-bold">NEURAL INDEX</span>
              <Sparkles className="w-6 h-6 ml-3 text-neon-blue" />
            </Button>
          </Link>
          
          <div className="cyber-glass p-6 rounded-2xl neon-border max-w-lg text-center">
            <div className="text-cyber-green text-sm terminal-text leading-relaxed space-y-1">
              <div>&gt;&gt; ETHICAL PROTOCOL ENGAGED</div>
              <div>&gt;&gt; INDEX_MODE: SEEKING NOT EXPLOITING</div>
              <div>&gt;&gt; BEHAVIORAL_ADS: DISABLED</div>
              <div>&gt;&gt; MANIPULATION_SHIELD: ACTIVE</div>
            </div>
          </div>
          
          {/* Neural Business Portal */}
          <Link to="/apply">
            <Button 
              variant="outline" 
              size="lg"
              className="cyber-glass hover:bg-neon-pink/20 text-neon-pink border-2 border-neon-pink hover:border-cyber-green px-8 py-4 rounded-2xl hover-lift neon-glow animate-scale-in hologram-effect"
              style={{animationDelay: '0.4s'}}
            >
              <Heart className="w-5 h-5 mr-3 text-neon-pink" />
              <span className="terminal-text">NEURAL_BUSINESS_UPLOAD</span>
            </Button>
          </Link>
        </div>

        {/* Holographic Status Display */}
        <div className="absolute bottom-8 left-8 cyber-glass p-4 rounded-xl neon-border animate-fade-in-up">
          <div className="terminal-text text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyber-green rounded-full neon-glow"></div>
              <span>NEURAL_NETWORK: ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full neon-glow"></div>
              <span>ETHICS_ENGINE: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-pink rounded-full neon-glow"></div>
              <span>QUANTUM_INDEX: READY</span>
            </div>
          </div>
        </div>
      </main>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <ConnectDialog open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}
