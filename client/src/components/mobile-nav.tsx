import { useEffect } from "react";
import { Link } from "wouter";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
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
          <a href="https://birthdaybook.life" className="block py-2 text-white hover:text-gray-300">
            birthdaybook.life
          </a>
          <a href="https://birthdaybook.pro" className="block py-2 text-white hover:text-gray-300">
            birthdaybook.pro
          </a>
          <a href="https://entangledwiththeword.cloud" className="block py-2 text-white hover:text-gray-300">
            entangledwiththeword.cloud
          </a>
          <a href="#" className="block py-2 text-white hover:text-gray-300">
            propertystar
          </a>
          <a href="#" className="block py-2 text-white hover:text-gray-300">
            acalltoaction
          </a>
          <span className="block py-2 text-gray-500">more coming soon!</span>
        </div>
      </div>
    </>
  );
}
