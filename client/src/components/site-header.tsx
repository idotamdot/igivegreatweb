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

      {/* Theme Toggle */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <ThemeToggle />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <GlowButton size="sm" onClick={onConnectClick}>
          let's connect
        </GlowButton>
        {/* Temporarily navigate directly to admin page instead of auth page */}
        <GlowButton size="sm" onClick={() => navigate("/admin")}>
          staff login
        </GlowButton>
      </div>
    </header>
  );
}
