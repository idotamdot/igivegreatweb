import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign, 
  Target, 
  Zap,
  Brain,
  Calculator,
  Banknote,
  PieChart,
  LineChart,
  Activity
} from "lucide-react";

interface FinancialForecast {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  growthRate: number;
  confidence: number;
  marketFactors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface MarketOpportunity {
  id: string;
  sector: string;
  opportunity: string;
  potentialRevenue: number;
  timeToMarket: number;
  investmentRequired: number;
  probabilitySuccess: number;
  neuralScore: number;
  competitiveAdvantage: string[];
}

interface FinancialMetric {
  name: string;
  current: number;
  projected: number;
  variance: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  quantumEnhanced: boolean;
}

interface RevenueStream {
  name: string;
  currentRevenue: number;
  projectedGrowth: number;
  marketShare: number;
  saturationPoint: number;
}

export function QuantumFinancialForecasting() {
  const [forecasts, setForecasts] = useState<FinancialForecast[]>([]);
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [totalForecastedRevenue, setTotalForecastedRevenue] = useState(0);
  const [quantumAccuracy, setQuantumAccuracy] = useState(0);

  useEffect(() => {
    // Initialize quantum financial forecasting data
    const forecastData: FinancialForecast[] = [
      {
        period: 'Q3 2025',
        revenue: 4200000,
        expenses: 1890000,
        profit: 2310000,
        growthRate: 34.7,
        confidence: 94.2,
        marketFactors: ['AI adoption surge', 'Enterprise digital transformation', 'Quantum computing breakthrough'],
        riskLevel: 'low'
      },
      {
        period: 'Q4 2025',
        revenue: 5600000,
        expenses: 2350000,
        profit: 3250000,
        growthRate: 33.3,
        confidence: 91.8,
        marketFactors: ['Holiday tech spending', 'Year-end enterprise budgets', 'New product launches'],
        riskLevel: 'medium'
      },
      {
        period: 'Q1 2026',
        revenue: 7200000,
        expenses: 2950000,
        profit: 4250000,
        growthRate: 28.6,
        confidence: 89.4,
        marketFactors: ['Market expansion', 'Strategic partnerships', 'Autonomous AI adoption'],
        riskLevel: 'medium'
      },
      {
        period: 'Q2 2026',
        revenue: 9100000,
        expenses: 3650000,
        profit: 5450000,
        growthRate: 26.4,
        confidence: 86.7,
        marketFactors: ['Global expansion', 'Enterprise AI integration', 'Quantum hosting dominance'],
        riskLevel: 'high'
      }
    ];

    const opportunityData: MarketOpportunity[] = [
      {
        id: 'mo-001',
        sector: 'Healthcare AI',
        opportunity: 'Neural Medical Diagnostics Platform',
        potentialRevenue: 15000000,
        timeToMarket: 8,
        investmentRequired: 2400000,
        probabilitySuccess: 87.3,
        neuralScore: 94.6,
        competitiveAdvantage: ['FDA compliance expertise', 'HIPAA security', 'Real-time diagnostics', 'Neural pattern recognition']
      },
      {
        id: 'mo-002',
        sector: 'Financial Technology',
        opportunity: 'Quantum Trading Algorithm Suite',
        potentialRevenue: 25000000,
        timeToMarket: 12,
        investmentRequired: 4200000,
        probabilitySuccess: 78.9,
        neuralScore: 92.1,
        competitiveAdvantage: ['Quantum advantage', 'Sub-millisecond execution', 'Risk prediction', 'Market sentiment analysis']
      },
      {
        id: 'mo-003',
        sector: 'Autonomous Vehicles',
        opportunity: 'Neural Navigation Systems',
        potentialRevenue: 35000000,
        timeToMarket: 18,
        investmentRequired: 7800000,
        probabilitySuccess: 72.4,
        neuralScore: 89.7,
        competitiveAdvantage: ['Real-time processing', 'Weather adaptation', 'Predictive routing', 'Safety optimization']
      },
      {
        id: 'mo-004',
        sector: 'Space Technology',
        opportunity: 'Quantum Communication Networks',
        potentialRevenue: 45000000,
        timeToMarket: 24,
        investmentRequired: 12500000,
        probabilitySuccess: 68.2,
        neuralScore: 91.3,
        competitiveAdvantage: ['Quantum encryption', 'Zero-latency communication', 'Satellite integration', 'Deep space capability']
      }
    ];

    const metricData: FinancialMetric[] = [
      { name: 'Revenue Growth Rate', current: 34.7, projected: 42.3, variance: 7.6, trend: 'bullish', quantumEnhanced: true },
      { name: 'Profit Margin', current: 78.3, projected: 82.1, variance: 3.8, trend: 'bullish', quantumEnhanced: true },
      { name: 'Market Penetration', current: 12.4, projected: 18.7, variance: 6.3, trend: 'bullish', quantumEnhanced: true },
      { name: 'Client Retention Rate', current: 96.8, projected: 98.2, variance: 1.4, trend: 'bullish', quantumEnhanced: false },
      { name: 'Operating Efficiency', current: 94.2, projected: 97.5, variance: 3.3, trend: 'bullish', quantumEnhanced: true },
      { name: 'R&D Investment ROI', current: 247.3, projected: 312.8, variance: 65.5, trend: 'bullish', quantumEnhanced: true }
    ];

    const streamData: RevenueStream[] = [
      { name: 'Autonomous Code Generation', currentRevenue: 47500000, projectedGrowth: 45.2, marketShare: 23.7, saturationPoint: 180000000 },
      { name: 'Quantum Cloud Hosting', currentRevenue: 32000000, projectedGrowth: 67.8, marketShare: 15.4, saturationPoint: 250000000 },
      { name: 'Neural Cybersecurity', currentRevenue: 28750000, projectedGrowth: 52.1, marketShare: 18.9, saturationPoint: 150000000 },
      { name: 'AI Strategy Consulting', currentRevenue: 16750000, projectedGrowth: 78.4, marketShare: 12.3, saturationPoint: 95000000 }
    ];

    setForecasts(forecastData);
    setOpportunities(opportunityData);
    setMetrics(metricData);
    setRevenueStreams(streamData);
    setTotalForecastedRevenue(forecastData.reduce((sum, f) => sum + f.revenue, 0));
    setQuantumAccuracy(92.3);
  }, []);

  const runQuantumAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate quantum financial analysis
    setTimeout(() => {
      // Update forecasts with enhanced predictions
      setForecasts(prev => prev.map(forecast => ({
        ...forecast,
        confidence: Math.min(99.9, forecast.confidence + 2.3),
        growthRate: forecast.growthRate + 1.7,
        revenue: Math.round(forecast.revenue * 1.04)
      })));
      
      setQuantumAccuracy(prev => Math.min(99.9, prev + 3.2));
      setIsAnalyzing(false);
    }, 6000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-cyber-green';
      case 'medium': return 'bg-yellow-600';
      case 'high': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-cyber-green';
      case 'bearish': return 'text-red-400';
      case 'neutral': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />;
      case 'bearish': return <TrendingDown className="w-4 h-4" />;
      case 'neutral': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantum Financial Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">FORECASTED_REVENUE</p>
                <p className="terminal-text text-2xl font-bold text-cyber-green">
                  ${(totalForecastedRevenue / 1000000).toFixed(1)}M
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-cyber-green neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">QUANTUM_ACCURACY</p>
                <p className="terminal-text text-2xl font-bold text-neon-blue">
                  {quantumAccuracy.toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-neon-blue neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">GROWTH_RATE</p>
                <p className="terminal-text text-2xl font-bold text-hologram">
                  +31.2%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-hologram neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <Button 
              onClick={runQuantumAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-blue-600 hover:to-green-600 terminal-text"
            >
              {isAnalyzing ? 'ANALYZING...' : 'QUANTUM_ANALYSIS'}
              <Brain className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forecasts" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-neon-blue/30">
          <TabsTrigger value="forecasts" className="terminal-text">Financial Forecasts</TabsTrigger>
          <TabsTrigger value="opportunities" className="terminal-text">Market Opportunities</TabsTrigger>
          <TabsTrigger value="streams" className="terminal-text">Revenue Streams</TabsTrigger>
          <TabsTrigger value="metrics" className="terminal-text">Financial Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts" className="space-y-4">
          <div className="grid gap-4">
            {forecasts.map((forecast, index) => (
              <Card key={index} className="card-hologram">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5 text-neon-blue" />
                      <CardTitle className="terminal-text text-white">
                        {forecast.period} FORECAST
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getRiskColor(forecast.riskLevel)} terminal-text`}>
                        {forecast.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <Badge className="bg-neon-blue terminal-text">
                        {forecast.confidence.toFixed(1)}% CONFIDENCE
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">REVENUE</p>
                      <p className="terminal-text text-xl font-bold text-cyber-green">
                        ${(forecast.revenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">PROFIT</p>
                      <p className="terminal-text text-xl font-bold text-neon-blue">
                        ${(forecast.profit / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">GROWTH_RATE</p>
                      <div className="flex items-center space-x-1">
                        <p className="terminal-text text-xl font-bold text-hologram">
                          +{forecast.growthRate.toFixed(1)}%
                        </p>
                        <TrendingUp className="w-4 h-4 text-hologram" />
                      </div>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">MARGIN</p>
                      <p className="terminal-text text-xl font-bold text-purple-400">
                        {((forecast.profit / forecast.revenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Forecast Confidence</span>
                        <span>{forecast.confidence.toFixed(1)}%</span>
                      </div>
                      <Progress value={forecast.confidence} className="h-2" />
                    </div>
                    
                    <div>
                      <p className="terminal-text text-gray-400 text-sm mb-2">MARKET_FACTORS</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {forecast.marketFactors.map((factor, factorIndex) => (
                          <Badge key={factorIndex} variant="outline" className="terminal-text text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid gap-4">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="card-hologram">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-hologram" />
                      <div>
                        <CardTitle className="terminal-text text-white">
                          {opportunity.opportunity}
                        </CardTitle>
                        <p className="terminal-text text-gray-400 text-sm">
                          {opportunity.sector}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-hologram terminal-text">
                      {opportunity.probabilitySuccess.toFixed(1)}% SUCCESS
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">POTENTIAL_REVENUE</p>
                      <p className="terminal-text text-lg font-bold text-cyber-green">
                        ${(opportunity.potentialRevenue / 1000000).toFixed(0)}M
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">INVESTMENT</p>
                      <p className="terminal-text text-lg font-bold text-orange-400">
                        ${(opportunity.investmentRequired / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">TIME_TO_MARKET</p>
                      <p className="terminal-text text-lg font-bold text-neon-blue">
                        {opportunity.timeToMarket} months
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">NEURAL_SCORE</p>
                      <p className="terminal-text text-lg font-bold text-purple-400">
                        {opportunity.neuralScore.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>ROI Potential</span>
                        <span>{((opportunity.potentialRevenue / opportunity.investmentRequired) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(100, (opportunity.potentialRevenue / opportunity.investmentRequired) * 10)} className="h-2" />
                    </div>
                    
                    <div>
                      <p className="terminal-text text-gray-400 text-sm mb-2">COMPETITIVE_ADVANTAGES</p>
                      <div className="grid grid-cols-2 gap-1">
                        {opportunity.competitiveAdvantage.map((advantage, index) => (
                          <Badge key={index} variant="outline" className="terminal-text text-xs">
                            {advantage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="streams" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {revenueStreams.map((stream, index) => (
              <Card key={index} className="card-hologram">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="terminal-text text-white">
                      {stream.name}
                    </CardTitle>
                    <Badge className="bg-cyber-green terminal-text">
                      ACTIVE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="terminal-text text-gray-400 text-sm">CURRENT_REVENUE</p>
                        <p className="terminal-text text-xl font-bold text-cyber-green">
                          ${(stream.currentRevenue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div>
                        <p className="terminal-text text-gray-400 text-sm">GROWTH_RATE</p>
                        <p className="terminal-text text-xl font-bold text-neon-blue">
                          +{stream.projectedGrowth.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Market Share</span>
                        <span>{stream.marketShare.toFixed(1)}%</span>
                      </div>
                      <Progress value={stream.marketShare} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Market Saturation</span>
                        <span>{((stream.currentRevenue / stream.saturationPoint) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(stream.currentRevenue / stream.saturationPoint) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">SATURATION_POINT</p>
                      <p className="terminal-text text-lg font-bold text-hologram">
                        ${(stream.saturationPoint / 1000000).toFixed(0)}M
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="card-hologram">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="terminal-text text-gray-400 text-sm">
                        {metric.name.toUpperCase()}
                      </p>
                      <div className="flex items-center space-x-1">
                        {metric.quantumEnhanced && (
                          <Zap className="w-4 h-4 text-neon-blue" />
                        )}
                        <div className={`${getTrendColor(metric.trend)} flex items-center space-x-1`}>
                          {getTrendIcon(metric.trend)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="terminal-text text-lg font-bold text-cyber-green">
                          {metric.name.includes('ROI') ? `${metric.current.toFixed(0)}%` : 
                           metric.name.includes('Rate') && metric.current < 100 ? `${metric.current.toFixed(1)}%` :
                           `${metric.current.toFixed(1)}%`}
                        </p>
                        <p className="terminal-text text-xs text-gray-400">
                          Current
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="terminal-text text-lg font-bold text-neon-blue">
                          {metric.name.includes('ROI') ? `${metric.projected.toFixed(0)}%` : 
                           metric.name.includes('Rate') && metric.projected < 100 ? `${metric.projected.toFixed(1)}%` :
                           `${metric.projected.toFixed(1)}%`}
                        </p>
                        <p className="terminal-text text-xs text-gray-400">
                          Projected
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Progress to Target</span>
                        <span>+{metric.variance.toFixed(1)}%</span>
                      </div>
                      <Progress value={(metric.current / metric.projected) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}