import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Target, 
  Zap, 
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign,
  Sparkles,
  Shield,
  Cpu,
  Bot,
  Network
} from "lucide-react";

interface QuantumLead {
  id: string;
  companyName: string;
  industry: string;
  revenue: number;
  probability: number;
  neuralScore: number;
  quantumSignature: string;
  acquisitionStage: 'scanning' | 'analyzing' | 'engaging' | 'converting' | 'onboarded';
  aiOperator: string;
  estimatedValue: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface AcquisitionMetric {
  name: string;
  current: number;
  target: number;
  growth: number;
  quantumEnhanced: boolean;
}

export function QuantumClientAcquisition() {
  const [quantumLeads, setQuantumLeads] = useState<QuantumLead[]>([]);
  const [acquisitionMetrics, setAcquisitionMetrics] = useState<AcquisitionMetric[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [totalPipelineValue, setTotalPipelineValue] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    // Initialize quantum leads from neural scan
    const leads: QuantumLead[] = [
      {
        id: 'ql-001',
        companyName: 'Nexus Financial Corp',
        industry: 'FinTech',
        revenue: 850000000,
        probability: 87.3,
        neuralScore: 94.2,
        quantumSignature: 'QS-NFC-7829',
        acquisitionStage: 'converting',
        aiOperator: 'ECHO-5',
        estimatedValue: 2400000,
        urgencyLevel: 'high'
      },
      {
        id: 'ql-002',
        companyName: 'Cyber Defense Solutions',
        industry: 'Cybersecurity',
        revenue: 320000000,
        probability: 91.7,
        neuralScore: 96.8,
        quantumSignature: 'QS-CDS-4521',
        acquisitionStage: 'engaging',
        aiOperator: 'CIPHER-9',
        estimatedValue: 1850000,
        urgencyLevel: 'critical'
      },
      {
        id: 'ql-003',
        companyName: 'Aurora Biotech Industries',
        industry: 'Biotechnology',
        revenue: 1200000000,
        probability: 73.4,
        neuralScore: 88.9,
        quantumSignature: 'QS-ABI-9876',
        acquisitionStage: 'analyzing',
        aiOperator: 'NEXUS-3',
        estimatedValue: 3200000,
        urgencyLevel: 'medium'
      },
      {
        id: 'ql-004',
        companyName: 'Quantum Aerospace Corp',
        industry: 'Aerospace',
        revenue: 2100000000,
        probability: 82.1,
        neuralScore: 92.5,
        quantumSignature: 'QS-QAC-1357',
        acquisitionStage: 'engaging',
        aiOperator: 'VORTEX-1',
        estimatedValue: 4500000,
        urgencyLevel: 'high'
      },
      {
        id: 'ql-005',
        companyName: 'Neural Medical Systems',
        industry: 'Healthcare',
        revenue: 750000000,
        probability: 68.9,
        neuralScore: 85.3,
        quantumSignature: 'QS-NMS-2468',
        acquisitionStage: 'scanning',
        aiOperator: 'ARIA-7',
        estimatedValue: 1950000,
        urgencyLevel: 'medium'
      }
    ];

    const metrics: AcquisitionMetric[] = [
      { name: 'Weekly Leads Generated', current: 47, target: 50, growth: 23.4, quantumEnhanced: true },
      { name: 'Conversion Rate', current: 84.7, target: 85, growth: 12.8, quantumEnhanced: true },
      { name: 'Average Deal Size', current: 2650000, target: 3000000, growth: 31.2, quantumEnhanced: true },
      { name: 'Pipeline Velocity', current: 21.3, target: 25, growth: 18.9, quantumEnhanced: true },
      { name: 'Neural Accuracy Score', current: 96.8, target: 98, growth: 7.4, quantumEnhanced: true },
      { name: 'Quantum Signature Match', current: 92.1, target: 95, growth: 15.7, quantumEnhanced: true }
    ];

    setQuantumLeads(leads);
    setAcquisitionMetrics(metrics);
    setTotalPipelineValue(leads.reduce((sum, lead) => sum + lead.estimatedValue, 0));
    setConversionRate(84.7);
  }, []);

  const initiateQuantumScan = async () => {
    setIsScanning(true);
    
    // Simulate quantum scanning process
    setTimeout(() => {
      // Add new quantum leads
      const newLeads: QuantumLead[] = [
        {
          id: `qg-${Date.now()}`,
          companyName: 'Synergy Tech Dynamics',
          industry: 'AI/ML',
          revenue: 450000000,
          probability: 79.2,
          neuralScore: 91.4,
          quantumSignature: `QS-STD-${Math.floor(Math.random() * 9999)}`,
          acquisitionStage: 'scanning',
          aiOperator: 'PULSE-4',
          estimatedValue: 1750000,
          urgencyLevel: 'high'
        }
      ];
      
      setQuantumLeads(prev => [...prev, ...newLeads]);
      setTotalPipelineValue(prev => prev + newLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0));
      setIsScanning(false);
    }, 4000);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'scanning': return 'bg-gray-500';
      case 'analyzing': return 'bg-neon-blue';
      case 'engaging': return 'bg-hologram';
      case 'converting': return 'bg-cyber-green';
      case 'onboarded': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-gray-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantum Acquisition Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">PIPELINE_VALUE</p>
                <p className="terminal-text text-2xl font-bold text-cyber-green">
                  ${(totalPipelineValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-cyber-green neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">CONVERSION_RATE</p>
                <p className="terminal-text text-2xl font-bold text-neon-blue">
                  {conversionRate}%
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
                <p className="terminal-text text-gray-400 text-sm">ACTIVE_LEADS</p>
                <p className="terminal-text text-2xl font-bold text-hologram">
                  {quantumLeads.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-hologram neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <Button 
              onClick={initiateQuantumScan}
              disabled={isScanning}
              className="w-full bg-gradient-to-r from-neon-blue to-hologram hover:from-hologram hover:to-neon-blue terminal-text"
            >
              {isScanning ? 'SCANNING...' : 'QUANTUM_SCAN'}
              <Brain className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-neon-blue/30">
          <TabsTrigger value="leads" className="terminal-text">Quantum Leads</TabsTrigger>
          <TabsTrigger value="metrics" className="terminal-text">Acquisition Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <div className="grid gap-4">
            {quantumLeads.map((lead) => (
              <Card key={lead.id} className="card-hologram">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-hologram" />
                      <div>
                        <CardTitle className="terminal-text text-white text-lg">
                          {lead.companyName}
                        </CardTitle>
                        <p className="terminal-text text-gray-400 text-sm">
                          {lead.industry} • ${(lead.revenue / 1000000).toFixed(0)}M Revenue
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStageColor(lead.acquisitionStage)} terminal-text`}>
                        {lead.acquisitionStage.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={`terminal-text ${getUrgencyColor(lead.urgencyLevel)}`}>
                        {lead.urgencyLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">PROBABILITY</p>
                      <p className="terminal-text text-lg font-bold text-cyber-green">
                        {lead.probability}%
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">NEURAL_SCORE</p>
                      <p className="terminal-text text-lg font-bold text-neon-blue">
                        {lead.neuralScore}
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">EST_VALUE</p>
                      <p className="terminal-text text-lg font-bold text-hologram">
                        ${(lead.estimatedValue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">AI_OPERATOR</p>
                      <p className="terminal-text text-lg font-bold text-white">
                        {lead.aiOperator}
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">QUANTUM_ID</p>
                      <p className="terminal-text text-sm font-mono text-gray-300">
                        {lead.quantumSignature}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm terminal-text text-gray-400">
                      <span>Conversion Probability</span>
                      <span>{lead.probability}%</span>
                    </div>
                    <Progress value={lead.probability} className="h-2" />
                    
                    <div className="flex justify-between text-sm terminal-text text-gray-400 mt-2">
                      <span>Neural Analysis Score</span>
                      <span>{lead.neuralScore}%</span>
                    </div>
                    <Progress value={lead.neuralScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {acquisitionMetrics.map((metric, index) => (
              <Card key={index} className="card-hologram">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="terminal-text text-gray-400 text-sm">
                      {metric.name.toUpperCase()}
                    </p>
                    {metric.quantumEnhanced && (
                      <Sparkles className="w-4 h-4 text-neon-blue" />
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="terminal-text text-2xl font-bold text-cyber-green">
                        {metric.name.includes('Rate') || metric.name.includes('Score') || metric.name.includes('Match') ? 
                          `${metric.current}%` : 
                          metric.name.includes('Deal Size') ? 
                            `$${(metric.current / 1000000).toFixed(1)}M` :
                            metric.current
                        }
                      </p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-cyber-green" />
                        <span className="terminal-text text-cyber-green text-sm">
                          +{metric.growth}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Target</span>
                        <span>
                          {metric.name.includes('Rate') || metric.name.includes('Score') || metric.name.includes('Match') ? 
                            `${metric.target}%` : 
                            metric.name.includes('Deal Size') ? 
                              `$${(metric.target / 1000000).toFixed(1)}M` :
                              metric.target
                          }
                        </span>
                      </div>
                      <Progress 
                        value={metric.name.includes('Deal Size') ? 
                          (metric.current / metric.target) * 100 : 
                          metric.current
                        } 
                        className="h-2" 
                      />
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