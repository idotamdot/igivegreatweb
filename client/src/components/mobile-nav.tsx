import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { MenuLink } from "@shared/schema";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  // Fetch menu links
  const { data: menuLinks, isLoading, error } = useQuery<MenuLink[]>({
    queryKey: ["/api/menu-links"],
    // Only fetch when the menu is open to improve performance
    enabled: open,
  });

  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const renderMenuLinks = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      );
    }
    
    if (error) {
      return <div className="py-2 text-red-400">Failed to load menu</div>;
    }
    
    if (!menuLinks || menuLinks.length === 0) {
      return <div className="py-2 text-gray-500">No links available</div>;
    }

    return (
      <>
        {menuLinks
          .filter(link => link.active)
          .sort((a, b) => a.order - b.order)
          .map(link => (
            <a 
              key={link.id} 
              href={link.url} 
              className="block py-2 text-white hover:text-gray-300"
              onClick={link.url === "#" ? (e) => e.preventDefault() : undefined}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        <span className="block py-2 text-gray-500">more coming soon!</span>
      </>
    );
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Menu */}
      <div 
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 transform transition-transform duration-300 ease-in-out z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-4">
          {renderMenuLinks()}
        </div>
      </div>
    </>
  );
}
