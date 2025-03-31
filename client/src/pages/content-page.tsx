import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { MenuLink } from '@shared/schema';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SiteHeader from "@/components/site-header";
import MobileNav from "@/components/mobile-nav";
import ConnectDialog from "@/components/connect-dialog";

export default function ContentPage() {
  const [, params] = useRoute('/page/:slug');
  const slug = params?.slug;
  const [content, setContent] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  const { data: menuLinks, isLoading: isLoadingMenuLinks } = useQuery<MenuLink[]>({
    queryKey: ['/api/menu-links'],
  });

  useEffect(() => {
    if (menuLinks && slug) {
      // Find the menu link that has hasPage=true and matches the slug
      const menuLink = menuLinks.find(link => 
        link.hasPage && 
        link.active && 
        link.label.toLowerCase().replace(/\s+/g, '-') === slug
      );
      
      if (menuLink && menuLink.pageContent) {
        setContent(menuLink.pageContent);
      } else {
        setContent(null);
      }
    }
  }, [menuLinks, slug]);

  if (isLoadingMenuLinks) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="relative min-h-screen bg-black text-white">
        <SiteHeader 
          onMenuClick={() => setMobileNavOpen(true)} 
          onConnectClick={() => setConnectOpen(true)}
        />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl mb-4">page not found</h1>
          <p className="text-gray-400">we couldn't find the page you're looking for.</p>
          <a href="/" className="mt-8 underline text-blue-400 hover:text-blue-300">
            return home
          </a>
        </div>
        <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <ConnectDialog open={connectOpen} onOpenChange={setConnectOpen} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <SiteHeader 
        onMenuClick={() => setMobileNavOpen(true)} 
        onConnectClick={() => setConnectOpen(true)}
      />
      <div className="container mx-auto px-6 pt-24 pb-16">
        <article className="prose prose-invert mx-auto max-w-3xl">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </div>
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <ConnectDialog open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}