import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchSuggestion {
  query: string;
  category: string;
  trending: boolean;
  recent: boolean;
}

interface SearchEnhancerProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchEnhancer({ onSearch, placeholder, className }: SearchEnhancerProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Intelligent search suggestions based on ethical marketplace categories
  const intelligentSuggestions: SearchSuggestion[] = [
    { query: 'organic skincare', category: 'Personal Care', trending: true, recent: false },
    { query: 'handmade pottery', category: 'Arts & Crafts', trending: false, recent: false },
    { query: 'sustainable clothing', category: 'Fashion', trending: true, recent: false },
    { query: 'local farmers market', category: 'Food', trending: false, recent: false },
    { query: 'fair trade coffee', category: 'Food & Beverage', trending: true, recent: false },
    { query: 'eco-friendly cleaning', category: 'Home & Garden', trending: false, recent: false },
    { query: 'holistic wellness', category: 'Health & Wellness', trending: true, recent: false },
    { query: 'artisan jewelry', category: 'Accessories', trending: false, recent: false },
    { query: 'renewable energy', category: 'Technology', trending: true, recent: false },
    { query: 'mindfulness coaching', category: 'Personal Development', trending: false, recent: false },
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('psi-recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = intelligentSuggestions.filter(s => 
        s.query.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase())
      );
      
      // Add recent searches that match
      const matchingRecent = recentSearches
        .filter(r => r.toLowerCase().includes(query.toLowerCase()))
        .map(r => ({ query: r, category: 'Recent', trending: false, recent: true }));
      
      setSuggestions([...matchingRecent.slice(0, 3), ...filtered.slice(0, 7)]);
      setShowSuggestions(true);
    } else {
      // Show trending and recent when no query
      const trending = intelligentSuggestions.filter(s => s.trending).slice(0, 4);
      const recent = recentSearches.slice(0, 3).map(r => ({ 
        query: r, category: 'Recent', trending: false, recent: true 
      }));
      setSuggestions([...recent, ...trending]);
      setShowSuggestions(query.length === 0 && inputRef.current === document.activeElement);
    }
  }, [query, recentSearches]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Update recent searches
      const updated = [searchQuery, ...recentSearches.filter(r => r !== searchQuery)].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('psi-recent-searches', JSON.stringify(updated));
      
      onSearch(searchQuery);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.query);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder || "Search for ethical products and services..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-4 py-3 text-lg border-2 border-winter-pine/20 focus:border-spring-fresh-green bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover-lift"
        />
        {query && (
          <button
            onClick={() => handleSearch(query)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-spring-gradient text-white px-4 py-1 rounded-lg text-sm hover-glow transition-all"
          >
            Search
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 glass-card border-winter-pine/20 animate-fade-in-up">
          <CardContent className="p-4">
            <div className="space-y-3">
              {suggestions.length > 0 && !query && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending & Recent Searches</span>
                </div>
              )}
              
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-spring-fresh-green/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {suggestion.recent ? (
                      <Clock className="w-4 h-4 text-gray-400" />
                    ) : suggestion.trending ? (
                      <TrendingUp className="w-4 h-4 text-summer-coral" />
                    ) : (
                      <Search className="w-4 h-4 text-winter-pine" />
                    )}
                    <span className="text-winter-pine group-hover:text-spring-fresh-green transition-colors">
                      {suggestion.query}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        suggestion.recent 
                          ? 'border-gray-300 text-gray-600' 
                          : suggestion.trending 
                          ? 'border-summer-coral text-summer-coral' 
                          : 'border-winter-pine text-winter-pine'
                      }`}
                    >
                      {suggestion.category}
                    </Badge>
                    {suggestion.trending && (
                      <Sparkles className="w-3 h-3 text-summer-coral" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}