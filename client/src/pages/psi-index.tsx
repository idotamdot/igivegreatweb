import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchEnhancer from "@/components/SearchEnhancer";
import BusinessRecommendation from "@/components/BusinessRecommendation";
import EngagementAnalytics from "@/components/EngagementAnalytics";
import SmartNotifications from "@/components/SmartNotifications";
import { 
  Search, 
  Filter, 
  Heart, 
  Leaf, 
  Shield, 
  Users, 
  Globe, 
  Star,
  MapPin,
  ExternalLink,
  Sparkles,
  BookOpen,
  ArrowRight
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PSIIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIntent, setSearchIntent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Mock data for demonstration - in real app this would come from API
  const categories = [
    { id: 1, name: "Healing & Wellness", icon: "Heart", description: "Tools for physical and emotional well-being" },
    { id: 2, name: "Creative Tools", icon: "Sparkles", description: "Support focused creativity and artistic expression" },
    { id: 3, name: "Sustainable Living", icon: "Leaf", description: "Eco-conscious products and services" },
    { id: 4, name: "Learning & Growth", icon: "BookOpen", description: "Educational resources and personal development" },
    { id: 5, name: "Community & Connection", icon: "Users", description: "Building meaningful relationships" },
  ];

  const ethicalValues = [
    { id: 1, name: "Fair Trade", icon: Shield, color: "bg-spring-fresh-green" },
    { id: 2, name: "Handmade", icon: Heart, color: "bg-spring-bloom-pink" },
    { id: 3, name: "Biodegradable", icon: Leaf, color: "bg-summer-sage" },
    { id: 4, name: "Transparent Business", icon: Globe, color: "bg-summer-ocean" },
    { id: 5, name: "No Behavioral Ads", icon: Shield, color: "bg-winter-pine" },
    { id: 6, name: "Community Supported", icon: Users, color: "bg-winter-berry" },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Handwoven Meditation Cushions",
      description: "Crafted by artisans using organic materials, supporting fair wages and mindful living.",
      price: "$89",
      location: "Portland, Oregon",
      values: ["Fair Trade", "Handmade", "Organic"],
      rating: 4.9,
      reviews: 127,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "Local Honey Subscription",
      description: "Raw honey from local beekeepers committed to sustainable practices and bee conservation.",
      price: "$24/month",
      location: "Within 50 miles",
      values: ["Local", "Biodegradable", "Transparent Business"],
      rating: 4.8,
      reviews: 89,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "Digital Detox Coaching",
      description: "One-on-one guidance for creating healthier relationships with technology and social media.",
      price: "$120/session",
      location: "Remote",
      values: ["No Ads", "Community Supported", "Transparent Business"],
      rating: 5.0,
      reviews: 34,
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-gradient cyber-grid">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Cyberpunk Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="text-cyber-green hover:text-neon-pink transition-colors terminal-text neon-glow">
              &lt;&lt; NEURAL_NETWORK_HOME
            </Link>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="cyber-glass border-neon-blue text-neon-blue hover:bg-neon-blue/20">
                <Users className="w-4 h-4 mr-2" />
                JOIN_COLLECTIVE
              </Button>
              <Button size="sm" className="bg-neon-gradient neon-glow">
                <Heart className="w-4 h-4 mr-2" />
                UPLOAD_ENTITY
              </Button>
            </div>
          </div>
          
          <div className="card-cyber max-w-4xl mx-auto p-8 rounded-3xl hologram-effect">
            <h1 className="text-4xl font-bold text-hologram mb-4 glitch-effect terminal-text">
              THE NEURAL INDEX
            </h1>
            <div className="text-cyber-green mb-6 terminal-text space-y-2">
              <div>&gt;&gt; SEEK_NOT_EXPLOIT PROTOCOL ACTIVE</div>
              <div>&gt;&gt; QUANTUM_ETHICS_ENGINE: ONLINE</div>
              <div>&gt;&gt; MANIPULATION_SHIELD: MAXIMUM</div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge className="bg-cyber-green text-black neon-glow">NO_BEHAVIORAL_ADS</Badge>
              <Badge className="bg-neon-pink text-white neon-glow">COMMUNITY_CURATED</Badge>
              <Badge className="bg-winter-pine">Transparency First</Badge>
              <Badge className="bg-spring-bloom-pink">Values Aligned</Badge>
            </div>
          </div>
        </header>

        {/* Search Section */}
        <section className="mb-12">
          <Card className="card-summer">
            <CardHeader>
              <CardTitle className="text-summer flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search by Meaning & Intent
              </CardTitle>
              <CardDescription>
                Describe what you're looking for using natural language - we understand intention, not just keywords.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">What are you looking for?</label>
                  <Input
                    placeholder="e.g., healing tools for grief, sustainable clothing, gifts for gratitude..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Your intention (optional)</label>
                  <Input
                    placeholder="e.g., supporting small businesses, reducing environmental impact..."
                    value={searchIntent}
                    onChange={(e) => setSearchIntent(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button className="bg-summer-gradient">
                  <Search className="w-4 h-4 mr-2" />
                  Search with Intention
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ethical Values Filter */}
        <section className="mb-12">
          <Card className="card-winter">
            <CardHeader>
              <CardTitle className="text-winter flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter by Ethical Values
              </CardTitle>
              <CardDescription>
                Select the values that matter to you - we'll prioritize businesses that share them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {ethicalValues.map(value => {
                  const Icon = value.icon;
                  const isSelected = selectedValues.includes(value.name);
                  return (
                    <button
                      key={value.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedValues(prev => prev.filter(v => v !== value.name));
                        } else {
                          setSelectedValues(prev => [...prev, value.name]);
                        }
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        isSelected 
                          ? `${value.color} border-white text-white shadow-lg` 
                          : 'bg-white/90 border-winter-pine/30 text-winter-pine hover:bg-white hover:border-winter-pine'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">{value.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Categories Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-winter mb-6">Browse by Purpose</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const seasonClass = index % 3 === 0 ? 'card-spring' : index % 3 === 1 ? 'card-summer' : 'card-winter';
              const textClass = index % 3 === 0 ? 'text-spring' : index % 3 === 1 ? 'text-summer' : 'text-winter';
              
              return (
                <Card key={category.id} className={`${seasonClass} hover:scale-105 transition-transform cursor-pointer`}>
                  <CardHeader>
                    <CardTitle className={`${textClass} flex items-center gap-2`}>
                      <BookOpen className="w-5 h-5" />
                      {category.name}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="w-full">
                      Explore Category
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Intelligent Business Recommendations */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-winter animate-slide-in-left">
              {searchQuery ? `Results for "${searchQuery}"` : 'Featured Ethical Businesses'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live recommendations</span>
            </div>
          </div>
          
          <BusinessRecommendation
            searchQuery={searchQuery}
            selectedValues={selectedValues}
            userLocation="Your Location"
          />
        </section>

        {/* Philosophy Footer */}
        <footer className="text-center">
          <Card className="bg-winter-gradient text-white border-2 border-white/20">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold mb-4 text-white">Why We Index, Not Advertise</h3>
              <p className="text-white mb-4 max-w-2xl mx-auto">
                We believe in respecting your autonomy and attention. Instead of bombarding you with manipulative ads, 
                we provide a transparent index where you can find what you need by seeking, not by being exploited.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-white">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-white" />
                  <strong className="text-white">No Behavioral Manipulation</strong>
                  <p className="text-white/90 mt-1">We rank by integrity and value, not ad spend</p>
                </div>
                <div className="text-white">
                  <Users className="w-6 h-6 mx-auto mb-2 text-white" />
                  <strong className="text-white">Community Curated</strong>
                  <p className="text-white/90 mt-1">Real reviews from people, not bots or paid promotions</p>
                </div>
                <div className="text-white">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-white" />
                  <strong className="text-white">Values Aligned</strong>
                  <p className="text-white/90 mt-1">Find businesses that share your ethical commitments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </footer>
      </div>

      {/* Real-time Analytics & Smart Notifications */}
      <EngagementAnalytics />
      <SmartNotifications />
    </div>
  );
}