import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Star, 
  MapPin, 
  Clock, 
  Zap, 
  ExternalLink,
  ThumbsUp,
  Award,
  Leaf
} from 'lucide-react';

interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  website?: string;
  ethicalValues: string[];
  trending: boolean;
  featured: boolean;
  distance?: string;
  responseTime?: string;
  verifiedSeller: boolean;
  sustainabilityScore: number;
}

interface RecommendationProps {
  searchQuery?: string;
  selectedValues?: string[];
  userLocation?: string;
}

export default function BusinessRecommendation({ searchQuery, selectedValues, userLocation }: RecommendationProps) {
  const [recommendations, setRecommendations] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Intelligent recommendation algorithm
  const generateRecommendations = (): Business[] => {
    const sampleBusinesses: Business[] = [
      {
        id: 1,
        name: "Green Earth Organics",
        description: "Certified organic produce delivered fresh from local farms. Supporting sustainable agriculture and fair trade practices.",
        category: "Food & Nutrition",
        rating: 4.8,
        reviewCount: 127,
        location: "Portland, OR",
        website: "https://greenearthorganics.com",
        ethicalValues: ["Organic", "Local Business", "Fair Trade"],
        trending: true,
        featured: true,
        distance: "2.3 miles",
        responseTime: "Usually responds within 2 hours",
        verifiedSeller: true,
        sustainabilityScore: 95
      },
      {
        id: 2,
        name: "Mindful Wellness Studio",
        description: "Holistic wellness center offering meditation, yoga, and natural healing therapies. Woman-owned and community-focused.",
        category: "Healing & Wellness",
        rating: 4.9,
        reviewCount: 89,
        location: "Austin, TX",
        ethicalValues: ["Woman-Owned", "Community Supported", "Transparent Business"],
        trending: false,
        featured: true,
        distance: "1.8 miles",
        responseTime: "Usually responds within 1 hour",
        verifiedSeller: true,
        sustainabilityScore: 88
      },
      {
        id: 3,
        name: "Artisan Pottery Collective",
        description: "Handcrafted ceramics made by local artisans using sustainable materials and traditional techniques.",
        category: "Arts & Crafts",
        rating: 4.7,
        reviewCount: 156,
        location: "Asheville, NC",
        website: "https://artisanpottery.coop",
        ethicalValues: ["Handmade", "Local Business", "Sustainable Living"],
        trending: true,
        featured: false,
        distance: "5.2 miles",
        responseTime: "Usually responds within 4 hours",
        verifiedSeller: true,
        sustainabilityScore: 92
      },
      {
        id: 4,
        name: "Solar Solutions Co-op",
        description: "Community-owned renewable energy solutions. Helping families transition to clean, affordable solar power.",
        category: "Technology & Software",
        rating: 4.6,
        reviewCount: 203,
        location: "Denver, CO",
        website: "https://solarsolutions.coop",
        ethicalValues: ["Carbon Neutral", "Community Supported", "Transparent Business"],
        trending: true,
        featured: true,
        distance: "12.7 miles",
        responseTime: "Usually responds within 6 hours",
        verifiedSeller: true,
        sustainabilityScore: 98
      },
      {
        id: 5,
        name: "Fair Trade Fashion",
        description: "Ethically-made clothing from certified fair trade suppliers. Supporting workers' rights and sustainable fashion.",
        category: "Sustainable Living",
        rating: 4.5,
        reviewCount: 74,
        location: "San Francisco, CA",
        website: "https://fairtrade-fashion.com",
        ethicalValues: ["Fair Trade", "Cruelty-Free", "Sustainable Living"],
        trending: false,
        featured: false,
        distance: "8.9 miles",
        responseTime: "Usually responds within 3 hours",
        verifiedSeller: true,
        sustainabilityScore: 90
      }
    ];

    let filtered = sampleBusinesses;

    // Filter by search query
    if (searchQuery && searchQuery.length > 0) {
      filtered = filtered.filter(business => 
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.ethicalValues.some(value => 
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by selected ethical values
    if (selectedValues && selectedValues.length > 0) {
      filtered = filtered.filter(business => 
        selectedValues.some(value => business.ethicalValues.includes(value))
      );
    }

    // Sort by relevance algorithm
    return filtered.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Boost featured businesses
      if (a.featured) scoreA += 10;
      if (b.featured) scoreB += 10;

      // Boost trending businesses
      if (a.trending) scoreA += 5;
      if (b.trending) scoreB += 5;

      // Boost by rating
      scoreA += a.rating;
      scoreB += b.rating;

      // Boost by sustainability score
      scoreA += a.sustainabilityScore / 10;
      scoreB += b.sustainabilityScore / 10;

      // Boost verified sellers
      if (a.verifiedSeller) scoreA += 3;
      if (b.verifiedSeller) scoreB += 3;

      return scoreB - scoreA;
    }).slice(0, 6);
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call with realistic delay
    const timer = setTimeout(() => {
      setRecommendations(generateRecommendations());
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedValues]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="skeleton h-4 w-3/4 mb-2"></div>
              <div className="skeleton h-3 w-full mb-1"></div>
              <div className="skeleton h-3 w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-gray-500 mb-4">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matching businesses found</h3>
            <p>Try adjusting your search criteria or ethical values filters.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((business, index) => (
        <Card 
          key={business.id} 
          className={`hover-lift transition-all duration-300 ${
            business.featured ? 'ring-2 ring-spring-fresh-green' : ''
          } ${
            business.trending ? 'bg-summer-gradient bg-opacity-5' : ''
          }`}
          style={{
            animationDelay: `${index * 0.1}s`
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg text-winter-pine flex items-center gap-2">
                  {business.name}
                  {business.verifiedSeller && (
                    <Award className="w-4 h-4 text-spring-fresh-green" />
                  )}
                  {business.featured && (
                    <Badge variant="secondary" className="bg-spring-fresh-green text-white text-xs">
                      Featured
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{business.rating}</span>
                    <span>({business.reviewCount})</span>
                  </div>
                  {business.trending && (
                    <div className="flex items-center gap-1 text-summer-coral">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">Trending</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                <Leaf className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700 font-medium">{business.sustainabilityScore}%</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {business.description}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{business.location}</span>
                {business.distance && (
                  <span className="text-spring-fresh-green">• {business.distance}</span>
                )}
              </div>

              {business.responseTime && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{business.responseTime}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {business.ethicalValues.slice(0, 3).map(value => (
                <Badge 
                  key={value} 
                  variant="outline" 
                  className="text-xs border-spring-fresh-green text-spring-fresh-green"
                >
                  {value}
                </Badge>
              ))}
              {business.ethicalValues.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{business.ethicalValues.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-spring-gradient hover:bg-summer-gradient">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Connect
              </Button>
              {business.website && (
                <Button size="sm" variant="outline" className="border-spring-fresh-green text-spring-fresh-green">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}