import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  Shield, 
  Zap, 
  Eye, 
  Heart,
  Filter,
  Globe,
  Cpu,
  Database,
  Network,
  Brain
} from 'lucide-react';

interface NeuralProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  ethicsScore: number;
  neuralRating: number;
  quantumVerified: boolean;
  hologramData: number[];
  price: string;
  vendor: string;
  connections: number;
  dataIntegrity: number;
}

interface EthicsFilter {
  id: string;
  name: string;
  active: boolean;
  quantum_signature: string;
}

export default function NeuralMarketplace() {
  const [products, setProducts] = useState<NeuralProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ethicsFilters, setEthicsFilters] = useState<EthicsFilter[]>([]);
  const [marketPulse, setMarketPulse] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    // Initialize neural products
    setProducts([
      {
        id: 'np001',
        name: 'QuantumSecure VPN',
        description: 'Zero-trust neural encryption for absolute privacy protection',
        category: 'Security',
        ethicsScore: 98,
        neuralRating: 4.9,
        quantumVerified: true,
        hologramData: Array.from({length: 20}, () => Math.random() * 100),
        price: '29.99/month',
        vendor: 'CyberShield Corp',
        connections: 847,
        dataIntegrity: 99.7
      },
      {
        id: 'np002',
        name: 'EthicalAI Assistant',
        description: 'Consciousness-aware AI companion with moral reasoning engine',
        category: 'AI',
        ethicsScore: 96,
        neuralRating: 4.8,
        quantumVerified: true,
        hologramData: Array.from({length: 20}, () => Math.random() * 100),
        price: '49.99/month',
        vendor: 'Ethical Tech Labs',
        connections: 1203,
        dataIntegrity: 98.4
      },
      {
        id: 'np003',
        name: 'Neural Food Network',
        description: 'Sustainable supply chain with quantum-verified organic certification',
        category: 'Food',
        ethicsScore: 94,
        neuralRating: 4.7,
        quantumVerified: false,
        hologramData: Array.from({length: 20}, () => Math.random() * 100),
        price: 'Variable',
        vendor: 'Green Matrix Co',
        connections: 567,
        dataIntegrity: 97.1
      },
      {
        id: 'np004',
        name: 'Holographic Learning',
        description: 'Immersive education platform with neural-enhanced retention',
        category: 'Education',
        ethicsScore: 97,
        neuralRating: 4.9,
        quantumVerified: true,
        hologramData: Array.from({length: 20}, () => Math.random() * 100),
        price: '19.99/month',
        vendor: 'Future Learn Inc',
        connections: 2156,
        dataIntegrity: 99.2
      }
    ]);

    // Initialize ethics filters
    setEthicsFilters([
      { id: 'privacy', name: 'Privacy First', active: false, quantum_signature: 'PRIV_001' },
      { id: 'sustainable', name: 'Sustainable', active: false, quantum_signature: 'SUST_002' },
      { id: 'open', name: 'Open Source', active: false, quantum_signature: 'OPEN_003' },
      { id: 'fair', name: 'Fair Trade', active: false, quantum_signature: 'FAIR_004' },
      { id: 'verified', name: 'Quantum Verified', active: false, quantum_signature: 'QUAN_005' }
    ]);

    // Animate market pulse
    const interval = setInterval(() => {
      setMarketPulse(prev => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const toggleFilter = (filterId: string) => {
    setEthicsFilters(prev => 
      prev.map(filter => 
        filter.id === filterId 
          ? { ...filter, active: !filter.active }
          : filter
      )
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const activeFilters = ethicsFilters.filter(f => f.active);
    if (activeFilters.length === 0) return matchesSearch;
    
    // Simple filter logic for demo
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Neural Marketplace Header */}
      <div className="cyber-glass p-6 rounded-3xl neon-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Database className="w-8 h-8 text-cyber-green neon-glow" />
            <div>
              <h1 className="text-2xl font-bold text-hologram terminal-text">NEURAL_MARKETPLACE</h1>
              <p className="text-cyber-green terminal-text">&gt;&gt; Quantum-verified ethical commerce network</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyber-green text-black neon-glow">
              MARKET_PULSE: {marketPulse}%
            </Badge>
            <Badge className="bg-neon-pink text-white">
              {filteredProducts.length} ENTITIES
            </Badge>
          </div>
        </div>

        {/* Search Interface */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyber-green" />
            <Input
              placeholder="Search neural network entities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 cyber-glass border-cyber-green terminal-text"
            />
          </div>
          <Button className="cyber-glass border-neon-blue text-neon-blue hover:bg-neon-blue/20">
            <Filter className="w-4 h-4 mr-2" />
            QUANTUM_FILTER
          </Button>
        </div>
      </div>

      {/* Ethics Filters */}
      <Card className="card-neon">
        <CardHeader>
          <CardTitle className="text-neon-pink terminal-text flex items-center gap-2">
            <Shield className="w-5 h-5" />
            ETHICS_FILTER_MATRIX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ethicsFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`px-3 py-2 rounded-lg border transition-all terminal-text text-sm ${
                  filter.active
                    ? 'bg-cyber-green/20 border-cyber-green text-cyber-green neon-glow'
                    : 'cyber-glass border-gray-600 text-gray-400 hover:border-cyber-green'
                }`}
              >
                {filter.name}
                {filter.active && (
                  <span className="ml-2 text-xs opacity-70">
                    {filter.quantum_signature}
                  </span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Neural Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card 
            key={product.id} 
            className={`card-cyber hover-lift cursor-pointer transition-all ${
              selectedProduct === product.id ? 'neon-border' : ''
            }`}
            onClick={() => setSelectedProduct(product.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-cyber-green terminal-text text-lg">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-neon-blue text-white text-xs">
                      {product.category}
                    </Badge>
                    {product.quantumVerified && (
                      <Badge className="bg-cyber-green text-black text-xs neon-glow">
                        QUANTUM_VERIFIED
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-neon-pink font-bold terminal-text">
                    {product.price}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 text-cyber-green" />
                    <span className="text-cyber-green">{product.neuralRating}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300 terminal-text">
                {product.description}
              </p>

              {/* Neural Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="cyber-glass p-2 rounded">
                  <div className="text-cyber-green terminal-text">ETHICS_SCORE</div>
                  <div className="text-lg font-bold text-neon-pink">{product.ethicsScore}%</div>
                </div>
                <div className="cyber-glass p-2 rounded">
                  <div className="text-cyber-green terminal-text">DATA_INTEGRITY</div>
                  <div className="text-lg font-bold text-neon-blue">{product.dataIntegrity}%</div>
                </div>
              </div>

              {/* Hologram Visualization */}
              <div className="h-12 cyber-glass rounded overflow-hidden">
                <svg className="w-full h-full">
                  {product.hologramData.map((value, index) => (
                    <rect
                      key={index}
                      x={index * 8}
                      y={12 - (value * 0.12)}
                      width="6"
                      height={value * 0.12}
                      fill="url(#hologramGradient)"
                      opacity="0.8"
                    />
                  ))}
                  <defs>
                    <linearGradient id="hologramGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00ff41" />
                      <stop offset="50%" stopColor="#3a86ff" />
                      <stop offset="100%" stopColor="#ff006e" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Vendor & Network Info */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Network className="w-3 h-3 text-neon-blue" />
                  <span className="text-gray-400">{product.connections} connections</span>
                </div>
                <div className="terminal-text text-cyber-green">
                  {product.vendor}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-neon-gradient neon-glow terminal-text">
                  <Zap className="w-3 h-3 mr-1" />
                  CONNECT
                </Button>
                <Button size="sm" variant="outline" className="border-cyber-green text-cyber-green hover:bg-cyber-green/20">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="border-neon-pink text-neon-pink hover:bg-neon-pink/20">
                  <Heart className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Statistics */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="text-hologram terminal-text flex items-center gap-2">
            <Brain className="w-5 h-5" />
            NEURAL_NETWORK_ANALYTICS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyber-green">{products.length}</div>
              <div className="text-xs terminal-text text-gray-400">ACTIVE_ENTITIES</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-pink">97.3%</div>
              <div className="text-xs terminal-text text-gray-400">AVG_ETHICS_SCORE</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-blue">4.8</div>
              <div className="text-xs terminal-text text-gray-400">NEURAL_RATING</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">98.6%</div>
              <div className="text-xs terminal-text text-gray-400">QUANTUM_VERIFIED</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}