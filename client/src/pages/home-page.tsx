import { useState } from "react";
import SiteHeader from "@/components/site-header";
import MobileNav from "@/components/mobile-nav";
import ConnectDialog from "@/components/connect-dialog";

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col">
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
      
      <main className="flex-1 flex justify-center items-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-center px-4 text-white animate-pulse-slow site-title-glow">
          igivegreatweb.com
        </h1>
      </main>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <ConnectDialog open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}
