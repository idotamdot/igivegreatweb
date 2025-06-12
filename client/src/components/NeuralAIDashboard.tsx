import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Activity, 
  Cpu, 
  Database,
  Network,
  Target,
  Layers,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface NeuralPrediction {
  action: string;
  confidence: number;
  reasoning: string;
  parameters: any;
}

interface BusinessInsights {
  insights: string[];
  recommendations: string[];
  predictions: any;
  confidence: number;
}

interface MarketAnalysis {
  market_trends: any;
  opportunities: string[];
  threats: string[];
  neural_recommendations: string[];
}

export default function NeuralAIDashboard() {
  const [selectedOperator, setSelectedOperator] = useState<string>('ARIA-7');
  const [activeTab, setActiveTab] = useState<'predictions' | 'insights' | 'market' | 'adaptations'>('predictions');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch AI operators data
  const { data: operators = [], isLoading: operatorsLoading } = useQuery({
    queryKey: ['/api/neural/operators'],
  });

  // Fetch business metrics for AI analysis
  const { data: businessMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/neural/business'],
  });

  // Fetch market analysis
  const { data: marketAnalysis, isLoading: marketLoading } = useQuery<MarketAnalysis>({
    queryKey: ['/api/neural/market-analysis'],
  });

  // Neural prediction mutation
  const predictActionMutation = useMutation({
    mutationFn: async (inputData: any) => {
      const response = await fetch('/api/neural/predict-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });
      if (!response.ok) throw new Error('Prediction failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Neural Prediction Complete",
        description: `Action: ${data.action} (${Math.round(data.confidence * 100)}% confidence)`,
      });
    }
  });

  // Business insights mutation
  const generateInsightsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/neural/business-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Insights generation failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Business Insights Generated",
        description: "Neural analysis complete with actionable recommendations",
      });
    }
  });

  // Neural adaptation mutation
  const adaptPatternsMutation = useMutation({
    mutationFn: async ({ operatorId, performanceData }: { operatorId: string; performanceData: any }) => {
      const response = await fetch(`/api/neural/adapt-patterns/${operatorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(performanceData),
      });
      if (!response.ok) throw new Error('Neural adaptation failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Neural Patterns Adapted",
        description: "AI operator enhanced with improved decision algorithms",
      });
    }
  });

  const handlePredictAction = () => {
    const inputData = {
      operatorId: selectedOperator,
      currentMetrics: {
        efficiency: 0.95,
        tasksCompleted: 147,
        clientSatisfaction: 0.91
      },
      marketConditions: {
        revenue: 125000,
        growth: 0.18,
        competition: 'moderate'
      },
      clientRequests: Array(67).fill({}).map((_, i) => ({ id: i, priority: 'high' }))
    };

    predictActionMutation.mutate(inputData);
  };

  const handleGenerateInsights = () => {
    const data = {
      revenue: 125000,
      clients: 89,
      projects: 156,
      aiMetrics: operators.map((op: any) => ({
        efficiency: op.efficiency || 0.95,
        tasksCompleted: op.tasks_completed || 100
      }))
    };

    generateInsightsMutation.mutate(data);
  };

  const handleAdaptPatterns = () => {
    const performanceData = {
      efficiency: 0.94,
      taskSuccess: 0.89,
      clientSatisfaction: 0.92,
      learningRate: 0.15
    };

    adaptPatternsMutation.mutate({ 
      operatorId: selectedOperator, 
      performanceData 
    });
  };

  if (operatorsLoading || metricsLoading) {
    return (
      <div className="min-h-screen bg-cyber-gradient cyber-grid flex items-center justify-center">
        <div className="text-cyber-green terminal-text text-xl">
          LOADING_NEURAL_SYSTEMS...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Neural AI Header */}
      <div className="cyber-glass p-6 rounded-lg border border-cyan-400/20 neon-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-400 neon-glow" />
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 terminal-text neon-glow">
                NEURAL_AI_COMMAND_CENTER
              </h2>
              <p className="text-gray-300 terminal-text">
                Advanced quantum-enhanced autonomous decision systems
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/neural/market-analysis'] })}
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              REFRESH_NEURAL_DATA
            </Button>
          </div>
        </div>

        {/* Neural Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="cyber-glass p-4 rounded-lg border border-green-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400 terminal-text">NEURAL_PROCESSING</span>
            </div>
            <div className="text-2xl font-bold text-green-400 terminal-text">99.2%</div>
            <Progress value={99.2} className="mt-2" />
          </div>

          <div className="cyber-glass p-4 rounded-lg border border-blue-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-blue-400 terminal-text">QUANTUM_SYNC</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 terminal-text">94.7%</div>
            <Progress value={94.7} className="mt-2" />
          </div>

          <div className="cyber-glass p-4 rounded-lg border border-purple-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-purple-400 terminal-text">NEURAL_LAYERS</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 terminal-text">847</div>
            <div className="text-xs text-gray-400 terminal-text">Active Connections</div>
          </div>

          <div className="cyber-glass p-4 rounded-lg border border-orange-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-orange-400 terminal-text">PREDICTION_ACC</span>
            </div>
            <div className="text-2xl font-bold text-orange-400 terminal-text">91.4%</div>
            <Progress value={91.4} className="mt-2" />
          </div>
        </div>
      </div>

      {/* Neural Navigation */}
      <div className="flex gap-4">
        {[
          { id: 'predictions', label: 'NEURAL_PREDICTIONS', icon: Brain },
          { id: 'insights', label: 'BUSINESS_INSIGHTS', icon: TrendingUp },
          { id: 'market', label: 'MARKET_ANALYSIS', icon: BarChart3 },
          { id: 'adaptations', label: 'PATTERN_ADAPTATION', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as any)}
              className={`cyber-glass border-cyan-400/30 hover:bg-cyan-400/20 ${
                activeTab === tab.id 
                  ? 'bg-cyan-400 text-black neon-glow' 
                  : 'text-cyan-400'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="terminal-text">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Neural Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-cyber">
            <CardHeader>
              <CardTitle className="text-cyan-400 terminal-text flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AUTONOMOUS_DECISION_ENGINE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 terminal-text">SELECT_OPERATOR</label>
                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full mt-1 p-2 cyber-glass border-cyan-400/30 text-cyan-400 terminal-text rounded-md"
                >
                  <option value="ARIA-7">ARIA-7 - Neural Coordinator</option>
                  <option value="NEXUS-3">NEXUS-3 - Quantum Processor</option>
                  <option value="CIPHER-9">CIPHER-9 - Security Specialist</option>
                  <option value="ECHO-5">ECHO-5 - Communication Hub</option>
                  <option value="VORTEX-1">VORTEX-1 - Data Analyzer</option>
                  <option value="PULSE-4">PULSE-4 - Performance Monitor</option>
                </select>
              </div>

              <Button
                onClick={handlePredictAction}
                disabled={predictActionMutation.isPending}
                className="w-full bg-cyan-gradient neon-glow terminal-text"
              >
                <Zap className="w-4 h-4 mr-2" />
                {predictActionMutation.isPending ? 'ANALYZING...' : 'PREDICT_NEURAL_ACTION'}
              </Button>

              {predictActionMutation.data && (
                <div className="cyber-glass p-4 rounded-lg border border-green-400/20">
                  <h4 className="text-green-400 terminal-text font-semibold mb-2">
                    NEURAL_PREDICTION_RESULT
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400 terminal-text">Action:</span>
                      <Badge className="bg-green-500 text-white">
                        {predictActionMutation.data.action.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 terminal-text">Confidence:</span>
                      <span className="text-green-400 terminal-text">
                        {Math.round(predictActionMutation.data.confidence * 100)}%
                      </span>
                    </div>
                    <div className="text-gray-300 terminal-text">
                      <strong>Reasoning:</strong> {predictActionMutation.data.reasoning}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-cyber">
            <CardHeader>
              <CardTitle className="text-purple-400 terminal-text flex items-center gap-2">
                <Settings className="w-5 h-5" />
                PATTERN_ADAPTATION
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 terminal-text">Current Efficiency:</span>
                  <span className="text-purple-400 terminal-text font-semibold">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 terminal-text">Learning Rate:</span>
                  <span className="text-purple-400 terminal-text font-semibold">0.15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 terminal-text">Neural Layers:</span>
                  <span className="text-purple-400 terminal-text font-semibold">847 Active</span>
                </div>
              </div>

              <Button
                onClick={handleAdaptPatterns}
                disabled={adaptPatternsMutation.isPending}
                className="w-full bg-purple-gradient neon-glow terminal-text"
              >
                <Activity className="w-4 h-4 mr-2" />
                {adaptPatternsMutation.isPending ? 'ADAPTING...' : 'ADAPT_NEURAL_PATTERNS'}
              </Button>

              {adaptPatternsMutation.data && (
                <div className="cyber-glass p-4 rounded-lg border border-purple-400/20">
                  <h4 className="text-purple-400 terminal-text font-semibold mb-2">
                    ADAPTATION_COMPLETE
                  </h4>
                  <div className="space-y-1 text-sm">
                    {adaptPatternsMutation.data.adaptations.map((adaptation: string, index: number) => (
                      <div key={index} className="text-gray-300 terminal-text">
                        • {adaptation}
                      </div>
                    ))}
                    <div className="text-purple-400 terminal-text font-semibold mt-2">
                      Efficiency Improvement: +{Math.round(adaptPatternsMutation.data.efficiency_improvement * 100)}%
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Business Insights Tab */}
      {activeTab === 'insights' && (
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-green-400 terminal-text flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              NEURAL_BUSINESS_INTELLIGENCE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGenerateInsights}
              disabled={generateInsightsMutation.isPending}
              className="bg-green-gradient neon-glow terminal-text"
            >
              <Database className="w-4 h-4 mr-2" />
              {generateInsightsMutation.isPending ? 'ANALYZING...' : 'GENERATE_NEURAL_INSIGHTS'}
            </Button>

            {generateInsightsMutation.data && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="cyber-glass p-4 rounded-lg border border-green-400/20">
                  <h4 className="text-green-400 terminal-text font-semibold mb-3">
                    NEURAL_INSIGHTS
                  </h4>
                  <div className="space-y-2">
                    {generateInsightsMutation.data.insights.map((insight: string, index: number) => (
                      <div key={index} className="text-gray-300 terminal-text text-sm">
                        • {insight}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cyber-glass p-4 rounded-lg border border-blue-400/20">
                  <h4 className="text-blue-400 terminal-text font-semibold mb-3">
                    RECOMMENDATIONS
                  </h4>
                  <div className="space-y-2">
                    {generateInsightsMutation.data.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="text-gray-300 terminal-text text-sm">
                        • {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Market Analysis Tab */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          {marketAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle className="text-yellow-400 terminal-text flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    MARKET_TRENDS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(marketAnalysis.market_trends).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-400 terminal-text text-sm">
                          {key.replace(/_/g, ' ').toUpperCase()}:
                        </span>
                        <span className="text-yellow-400 terminal-text text-sm font-semibold">
                          {value as string}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle className="text-green-400 terminal-text flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    OPPORTUNITIES
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {marketAnalysis.opportunities.map((opportunity, index) => (
                      <div key={index} className="text-gray-300 terminal-text text-sm">
                        • {opportunity}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-cyber lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-cyan-400 terminal-text flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    NEURAL_RECOMMENDATIONS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {marketAnalysis.neural_recommendations.map((rec, index) => (
                      <div key={index} className="cyber-glass p-3 rounded border border-cyan-400/20">
                        <div className="text-cyan-400 terminal-text text-sm">
                          • {rec}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}