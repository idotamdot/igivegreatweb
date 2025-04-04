import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlowButton } from "@/components/ui/glow-button";
import { Menu } from "lucide-react";

interface SiteHeaderProps {
  onMenuClick: () => void;
  onConnectClick: () => void;
}

export default function SiteHeader({ onMenuClick, onConnectClick }: SiteHeaderProps) {
  const [, navigate] = useLocation();

  return (
    <header className="fixed w-full p-4 flex justify-between items-center z-50">
      {/* Menu Button */}
      <button 
        onClick={onMenuClick}
        className="flex flex-col justify-center items-center space-y-1.5 w-8 h-8 z-50"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* Theme Controls */}
      <div className="absolute left-1/2 -translate-x-1/2 top-16">
        <ThemeToggle />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        <GlowButton size="sm" onClick={onConnectClick} className="hidden sm:inline-flex">
          let's connect
        </GlowButton>
        <GlowButton size="sm" onClick={() => navigate("/services")}>
          our services
        </GlowButton>
        <GlowButton size="sm" onClick={() => navigate("/client")} className="hidden sm:inline-flex">
          client login
        </GlowButton>
        {/* Temporarily navigate directly to admin page instead of auth page */}
        <GlowButton size="sm" onClick={() => navigate("/admin")} className="hidden md:inline-flex">
          staff login
        </GlowButton>
      </div>
    </header>
  );
}
