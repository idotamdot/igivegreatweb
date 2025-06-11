import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Network, 
  Shield, 
  Zap, 
  Server, 
  Globe,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Database,
  Lock,
  Target,
  Bot,
  Sparkles
} from 'lucide-react';

interface ProjectRequirement {
  id: string;
  category: 'ai-web' | 'quantum-hosting' | 'cybersecurity' | 'neural-ops';
  name: string;
  description: string;
  complexity: 'quantum' | 'neural' | 'standard';
  estimatedTime: string;
  aiAgents: string[];
  price: number;
}

export default function QuantumClientOnboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientData, setClientData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    projectType: '',
    businessGoals: '',
    currentChallenges: '',
    timeline: '',
    budget: '',
    technicalRequirements: '',
    aiPreferences: []
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [projectAnalysis, setProjectAnalysis] = useState<ProjectRequirement[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const neuralServices = [
    {
      id: 'autonomous-coding',
      name: 'Autonomous AI Coding',
      icon: Bot,
      description: 'Neural networks write and optimize code independently',
      features: ['Self-learning algorithms', 'Code generation AI', 'Bug prediction', 'Performance optimization']
    },
    {
      id: 'quantum-hosting',
      name: 'Quantum Cloud Infrastructure',
      icon: Server,
      description: 'Quantum-encrypted hosting with neural load balancing',
      features: ['99.999% uptime', 'Quantum encryption', 'AI scaling', 'Neural traffic routing']
    },
    {
      id: 'cybersecurity-mesh',
      name: 'Neural Cybersecurity Mesh',
      icon: Shield,
      description: 'AI-powered threat detection and quantum defense',
      features: ['Real-time threat AI', 'Quantum encryption', 'Neural intrusion detection', 'Automated response']
    },
    {
      id: 'neural-optimization',
      name: 'Neural Performance Engine',
      icon: Zap,
      description: 'AI algorithms optimize every aspect of your application',
      features: ['Performance AI', 'User behavior analysis', 'Neural caching', 'Predictive scaling']
    }
  ];

  const aiAgentTypes = [
    { id: 'frontend-ai', name: 'Frontend Development AI', icon: Globe },
    { id: 'backend-ai', name: 'Backend Architecture AI', icon: Database },
    { id: 'security-ai', name: 'Security Analysis AI', icon: Lock },
    { id: 'optimization-ai', name: 'Performance Optimization AI', icon: Target },
    { id: 'testing-ai', name: 'Quality Assurance AI', icon: CheckCircle2 },
    { id: 'deployment-ai', name: 'Deployment Automation AI', icon: Cpu }
  ];

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const runQuantumAnalysis = () => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          generateProjectRequirements();
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const generateProjectRequirements = () => {
    const requirements: ProjectRequirement[] = selectedServices.map((serviceId, index) => {
      const service = neuralServices.find(s => s.id === serviceId);
      return {
        id: `req-${index + 1}`,
        category: serviceId.includes('hosting') ? 'quantum-hosting' 
                : serviceId.includes('security') ? 'cybersecurity'
                : serviceId.includes('coding') ? 'ai-web' : 'neural-ops',
        name: `${service?.name} Implementation`,
        description: `Advanced ${service?.name.toLowerCase()} with quantum-enhanced capabilities`,
        complexity: index % 3 === 0 ? 'quantum' : index % 2 === 0 ? 'neural' : 'standard',
        estimatedTime: `${4 + index * 2}-${6 + index * 3} weeks`,
        aiAgents: aiAgentTypes.slice(0, 2 + index).map(agent => agent.name),
        price: 2999 + (index * 1500)
      };
    });
    setProjectAnalysis(requirements);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'quantum': return 'text-purple-400 bg-purple-400/20';
      case 'neural': return 'text-cyber-green bg-cyber-green/20';
      default: return 'text-neon-blue bg-neon-blue/20';
    }
  };

  const totalProjectCost = projectAnalysis.reduce((sum, req) => sum + req.price, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Neural Onboarding Header */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="text-hologram terminal-text flex items-center gap-2">
            <Brain className="w-6 h-6" />
            NEURAL_CLIENT_ONBOARDING_SYSTEM
          </CardTitle>
          <div className="flex items-center gap-4 mt-4">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center terminal-text text-sm ${
                  currentStep >= step 
                    ? 'bg-cyber-green text-black neon-glow' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-cyber-green' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Step 1: Client Information */}
      {currentStep === 1 && (
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-cyber-green terminal-text">
              STEP_01: CLIENT_DATA_ACQUISITION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company" className="terminal-text text-neon-blue">COMPANY_NAME</Label>
                <Input
                  id="company"
                  value={clientData.companyName}
                  onChange={(e) => setClientData({...clientData, companyName: e.target.value})}
                  className="cyber-input"
                  placeholder="Enter company name..."
                />
              </div>
              <div>
                <Label htmlFor="contact" className="terminal-text text-neon-blue">CONTACT_PERSON</Label>
                <Input
                  id="contact"
                  value={clientData.contactPerson}
                  onChange={(e) => setClientData({...clientData, contactPerson: e.target.value})}
                  className="cyber-input"
                  placeholder="Primary contact..."
                />
              </div>
              <div>
                <Label htmlFor="email" className="terminal-text text-neon-blue">EMAIL_ADDRESS</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData({...clientData, email: e.target.value})}
                  className="cyber-input"
                  placeholder="contact@company.com"
                />
              </div>
              <div>
                <Label htmlFor="timeline" className="terminal-text text-neon-blue">PROJECT_TIMELINE</Label>
                <Input
                  id="timeline"
                  value={clientData.timeline}
                  onChange={(e) => setClientData({...clientData, timeline: e.target.value})}
                  className="cyber-input"
                  placeholder="Target completion..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="goals" className="terminal-text text-neon-blue">BUSINESS_OBJECTIVES</Label>
              <Textarea
                id="goals"
                value={clientData.businessGoals}
                onChange={(e) => setClientData({...clientData, businessGoals: e.target.value})}
                className="cyber-input"
                placeholder="Describe your business goals and success metrics..."
                rows={3}
              />
            </div>
            <Button 
              onClick={() => setCurrentStep(2)}
              className="w-full bg-neon-gradient neon-glow terminal-text"
              disabled={!clientData.companyName || !clientData.email}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              PROCEED_TO_SERVICE_SELECTION
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Service Selection */}
      {currentStep === 2 && (
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-cyber-green terminal-text">
              STEP_02: NEURAL_SERVICE_SELECTION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {neuralServices.map(service => {
                const Icon = service.icon;
                const isSelected = selectedServices.includes(service.id);
                return (
                  <Card 
                    key={service.id}
                    className={`cursor-pointer transition-all hover-lift ${
                      isSelected ? 'card-hologram neon-glow' : 'card-cyber'
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 mt-1 ${
                          isSelected ? 'text-hologram' : 'text-cyber-green'
                        }`} />
                        <div className="flex-1">
                          <h3 className={`font-medium terminal-text mb-2 ${
                            isSelected ? 'text-hologram' : 'text-cyber-green'
                          }`}>
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-400 terminal-text mb-3">
                            {service.description}
                          </p>
                          <div className="space-y-1">
                            {service.features.slice(0, 2).map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-neon-pink rounded-full"></div>
                                <span className="text-xs text-gray-400 terminal-text">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-hologram neon-glow" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Button 
              onClick={() => setCurrentStep(3)}
              className="w-full bg-neon-gradient neon-glow terminal-text"
              disabled={selectedServices.length === 0}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              INITIATE_QUANTUM_ANALYSIS
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: AI Analysis */}
      {currentStep === 3 && (
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-cyber-green terminal-text">
              STEP_03: NEURAL_PROJECT_ANALYSIS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysisProgress === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-16 h-16 text-cyber-green mx-auto mb-4 neon-glow" />
                <h3 className="text-lg terminal-text text-cyber-green mb-2">
                  QUANTUM_ANALYSIS_READY
                </h3>
                <p className="text-gray-400 terminal-text mb-6">
                  Neural networks will analyze your requirements and generate optimal project architecture
                </p>
                <Button 
                  onClick={runQuantumAnalysis}
                  className="bg-neon-gradient neon-glow terminal-text"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  RUN_NEURAL_ANALYSIS
                </Button>
              </div>
            ) : analysisProgress < 100 ? (
              <div className="py-8">
                <div className="text-center mb-6">
                  <Network className="w-12 h-12 text-cyber-green mx-auto mb-4 animate-pulse neon-glow" />
                  <h3 className="text-lg terminal-text text-cyber-green mb-2">
                    ANALYZING_PROJECT_REQUIREMENTS
                  </h3>
                  <p className="text-gray-400 terminal-text">
                    AI agents processing specifications...
                  </p>
                </div>
                <Progress value={analysisProgress} className="w-full" />
                <div className="text-center mt-2">
                  <span className="terminal-text text-neon-blue text-sm">
                    {analysisProgress}% COMPLETE
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-cyber-green mx-auto mb-4 neon-glow" />
                  <h3 className="text-lg terminal-text text-cyber-green mb-2">
                    ANALYSIS_COMPLETE
                  </h3>
                </div>
                
                {projectAnalysis.map(requirement => (
                  <Card key={requirement.id} className="card-hologram">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="terminal-text text-hologram font-medium">
                          {requirement.name}
                        </h3>
                        <Badge className={getComplexityColor(requirement.complexity)}>
                          {requirement.complexity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 terminal-text mb-3">
                        {requirement.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-neon-blue terminal-text">Timeline:</span>
                          <div className="text-gray-300 terminal-text">{requirement.estimatedTime}</div>
                        </div>
                        <div>
                          <span className="text-neon-blue terminal-text">AI Agents:</span>
                          <div className="text-gray-300 terminal-text">{requirement.aiAgents.length} assigned</div>
                        </div>
                        <div>
                          <span className="text-neon-blue terminal-text">Investment:</span>
                          <div className="text-cyber-green terminal-text font-bold">
                            ${requirement.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="card-cyber border-cyber-green">
                  <CardContent className="p-4 text-center">
                    <h3 className="terminal-text text-cyber-green text-lg mb-2">
                      TOTAL_PROJECT_INVESTMENT
                    </h3>
                    <div className="text-3xl font-bold text-neon-pink terminal-text neon-glow">
                      ${totalProjectCost.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Button 
                  onClick={() => setCurrentStep(4)}
                  className="w-full bg-neon-gradient neon-glow terminal-text"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  FINALIZE_PROJECT_PROPOSAL
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Project Proposal */}
      {currentStep === 4 && (
        <Card className="card-hologram">
          <CardHeader>
            <CardTitle className="text-hologram terminal-text">
              STEP_04: NEURAL_PROJECT_PROPOSAL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <Sparkles className="w-16 h-16 text-hologram mx-auto mb-4 neon-glow" />
              <h2 className="text-2xl terminal-text text-hologram mb-4">
                PROJECT_PROPOSAL_GENERATED
              </h2>
              <p className="text-gray-300 terminal-text mb-6">
                Your custom Neural Web Labs development proposal is ready for review
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card-cyber p-4">
                  <Server className="w-8 h-8 text-cyber-green mx-auto mb-2" />
                  <div className="terminal-text text-cyber-green font-bold">
                    {selectedServices.length} SERVICES
                  </div>
                </div>
                <div className="card-cyber p-4">
                  <Bot className="w-8 h-8 text-neon-pink mx-auto mb-2" />
                  <div className="terminal-text text-neon-pink font-bold">
                    {projectAnalysis.reduce((sum, req) => sum + req.aiAgents.length, 0)} AI_AGENTS
                  </div>
                </div>
                <div className="card-cyber p-4">
                  <Zap className="w-8 h-8 text-neon-blue mx-auto mb-2" />
                  <div className="terminal-text text-neon-blue font-bold">
                    QUANTUM_ENHANCED
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button className="bg-neon-gradient neon-glow terminal-text">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  APPROVE_PROPOSAL
                </Button>
                <Button 
                  variant="outline" 
                  className="border-cyber-green text-cyber-green hover:bg-cyber-green/20"
                  onClick={() => setCurrentStep(1)}
                >
                  MODIFY_REQUIREMENTS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}