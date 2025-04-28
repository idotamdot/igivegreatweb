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
          .map(link => {
            return link.hasPage ? (
              <Link 
                key={link.id} 
                href={`/page/${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="block py-2 text-white hover:text-gray-300"
                onClick={() => onClose()}
              >
                {link.label}
              </Link>
            ) : (
              <a 
                key={link.id} 
                href={link.url} 
                className="block py-2 text-white hover:text-gray-300"
                onClick={(e) => {
                  if (link.url === "#") e.preventDefault();
                  onClose();
                }}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </a>
            );
          })}
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
        className={`fixed top-0 left-0 w-72 h-full bg-gray-900 transform transition-transform duration-300 ease-in-out z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="p-6 pt-12 space-y-4">
          {/* Mobile actions */}
          <div className="flex flex-col space-y-3 mb-6 border-b border-gray-800 pb-6">
            <Link href="/" className="block py-2 text-white hover:text-gray-300" onClick={onClose}>
              home
            </Link>
            <Link href="/services" className="block py-2 text-white hover:text-gray-300" onClick={onClose}>
              our services
            </Link>
            <Link href="/gallery" className="block py-2 text-white hover:text-gray-300" onClick={onClose}>
              gallery
            </Link>
            
            {/* Account links with separating line */}
            <div className="border-t border-gray-800 my-2 pt-2">
              <h3 className="text-sm uppercase text-gray-500 mb-2">account access</h3>
            </div>
            
            <Link href="/auth?role=admin" className="flex items-center py-2 text-amber-400 hover:text-amber-300" onClick={onClose}>
              <span className="mr-2">⚙️</span> admin login
            </Link>
            <Link href="/auth?role=staff" className="flex items-center py-2 text-blue-400 hover:text-blue-300" onClick={onClose}>
              <span className="mr-2">👤</span> staff login
            </Link>
            <Link href="/auth?role=client" className="flex items-center py-2 text-green-400 hover:text-green-300" onClick={onClose}>
              <span className="mr-2">🔑</span> client login
            </Link>
          </div>
          
          {/* Menu links */}
          <div className="space-y-1">
            <h3 className="text-sm uppercase text-gray-500 mb-2">our work</h3>
            {renderMenuLinks()}
          </div>
        </div>
      </div>
    </>
  );
}
