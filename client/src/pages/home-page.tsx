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
      
      <main className="flex-1 flex justify-center items-center">
        <h1 className="text-4xl md:text-6xl font-light text-center px-4">
          igivegreatweb.com
        </h1>
      </main>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <ConnectDialog open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}
