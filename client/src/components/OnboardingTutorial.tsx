import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Shield, 
  Terminal, 
  Cpu,
  Network,
  ArrowRight,
  ArrowLeft,
  Play,
  Check,
  Star,
  Globe,
  Rocket,
  Code,
  Database,
  Lock,
  Eye,
  ChevronRight,
  CreditCard,
  Bot,
  Layers
} from 'lucide-react';
import { useLocation } from 'wouter';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  content: string;
  icon: any;
  component: string;
  duration: number;
  actions: string[];
  nextStep?: string;
  isInteractive: boolean;
}

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTutorial({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [networkPulse, setNetworkPulse] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [, navigate] = useLocation();

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 1,
      title: 'NEURAL_INTERFACE_ACTIVATED',
      description: 'Welcome to the Neural Web Labs quantum development platform',
      content: 'You have successfully connected to our quantum-enhanced AI development network. Our 6 autonomous AI operators are standing by to revolutionize your digital presence.',
      icon: Brain,
      component: 'neural-dashboard',
      duration: 4000,
      actions: ['Initialize neural pathways', 'Calibrate quantum processors', 'Establish secure connection'],
      isInteractive: false
    },
    {
      id: 2,
      title: 'AI_OPERATORS_OVERVIEW',
      description: 'Meet your autonomous development team',
      content: 'ARIA-7, CIPHER-9, NEXUS-3, VORTEX-1, ECHO-5, and PULSE-4 are your dedicated AI operators. Each specializes in different aspects of quantum web development.',
      icon: Cpu,
      component: 'ai-operators',
      duration: 5000,
      actions: ['Scan operator capabilities', 'Review performance metrics', 'Establish communication protocols'],
      nextStep: '/neural-command-center',
      isInteractive: true
    },
    {
      id: 3,
      title: 'QUANTUM_SERVICES_MATRIX',
      description: 'Explore our revolutionary service offerings',
      content: 'Discover AI Autonomous Web Development, Quantum Cloud Infrastructure, Cybersecurity Mesh, and Neural Operations. Each service is enhanced with quantum computing capabilities.',
      icon: Network,
      component: 'quantum-services',
      duration: 6000,
      actions: ['Browse service categories', 'Preview service specifications', 'Configure deployment options'],
      nextStep: '/quantum-services',
      isInteractive: true
    },
    {
      id: 4,
      title: 'CRYPTO_PAYMENT_PROTOCOL',
      description: 'Secure multi-currency payment processing',
      content: 'Experience our advanced cryptocurrency payment system supporting Bitcoin, Ethereum, USDC, and USDT with quantum-encrypted security protocols.',
      icon: Shield,
      component: 'crypto-payments',
      duration: 4000,
      actions: ['Generate payment addresses', 'Verify blockchain connections', 'Initialize security protocols'],
      nextStep: '/crypto-checkout',
      isInteractive: true
    },
    {
      id: 5,
      title: 'MISSION_CONTROL_ACCESS',
      description: 'Your neural command center awaits',
      content: 'Access the Neural Command Center to monitor AI operations, track project progress, and control your autonomous development ecosystem.',
      icon: Terminal,
      component: 'command-center',
      duration: 3000,
      actions: ['Establish command protocols', 'Initialize monitoring systems', 'Activate mission control'],
      nextStep: '/neural-command-center',
      isInteractive: true
    }
  ];

  useEffect(() => {
    // Animate network pulse
    const pulseInterval = setInterval(() => {
      setNetworkPulse(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(pulseInterval);
  }, []);

  useEffect(() => {
    // Typing animation effect
    if (currentStep < onboardingSteps.length) {
      setIsTyping(true);
      setTypedText('');
      
      const text = onboardingSteps[currentStep].content;
      let index = 0;
      
      const typeTimer = setInterval(() => {
        if (index < text.length) {
          setTypedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typeTimer);
        }
      }, 30);

      return () => clearInterval(typeTimer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    } else {
      setCompletedSteps(prev => [...prev, currentStep]);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    onSkip();
  };

  const handleNavigateToComponent = () => {
    const step = onboardingSteps[currentStep];
    if (step.nextStep && step.isInteractive) {
      // For quantum services step, show preview dialog instead of navigation
      if (step.id === 3) {
        setShowPreview(true);
      } else {
        navigate(step.nextStep);
      }
    }
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];

  if (!isActive) return null;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl bg-black/98 border-cyber-green/30 overflow-hidden">
        <div className="relative">
          {/* Neural Network Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="neural-network-bg h-full w-full"></div>
          </div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-cyber-green terminal-text flex items-center gap-3">
                <div className="relative">
                  <currentStepData.icon className="w-8 h-8 neon-glow" />
                  <div className="absolute -inset-2 border border-cyber-green/30 rounded-full animate-pulse"></div>
                </div>
                {currentStepData.title}
              </DialogTitle>
              <Badge className="bg-purple-400/20 text-purple-300 neon-glow">
                STEP {currentStep + 1}/{onboardingSteps.length}
              </Badge>
            </div>
            
            <Progress 
              value={progress} 
              className="w-full h-2 bg-gray-800 border border-cyber-green/30"
            />
          </DialogHeader>

          <div className="space-y-6 relative z-10">
            {/* Main Content Area */}
            <Card className="card-cyber">
              <CardHeader>
                <CardTitle className="text-cyber-green terminal-text text-lg">
                  {currentStepData.description}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Typed Content */}
                  <div className="min-h-[100px] p-4 cyber-glass border-cyber-green/20">
                    <p className="text-gray-300 leading-relaxed terminal-text text-sm">
                      {typedText}
                      {isTyping && <span className="animate-pulse text-cyber-green">|</span>}
                    </p>
                  </div>

                  {/* Action Items */}
                  <div className="space-y-3">
                    <h4 className="text-cyber-green terminal-text text-sm font-semibold">
                      NEURAL_PROCESSES:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {currentStepData.actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 cyber-glass border-cyber-green/10">
                          <div className="w-2 h-2 bg-cyber-green rounded-full neon-glow animate-pulse"></div>
                          <span className="text-gray-300 text-xs terminal-text">{action}</span>
                          <Check className="w-4 h-4 text-cyber-green ml-auto" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Component Preview */}
                  {currentStepData.isInteractive && currentStepData.nextStep && (
                    <Card className="card-hologram">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-hologram terminal-text text-sm font-semibold">
                              EXPLORE_COMPONENT
                            </h5>
                            <p className="text-gray-400 text-xs">
                              Click to experience this feature live
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-hologram text-hologram hover:bg-hologram/10"
                            onClick={handleNavigateToComponent}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            PREVIEW
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Network Status */}
            <Card className="card-cyber">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Network className="w-5 h-5 text-cyber-green" />
                      <div 
                        className="absolute -inset-1 border border-cyber-green/50 rounded-full"
                        style={{ transform: `scale(${1 + networkPulse * 0.01})` }}
                      ></div>
                    </div>
                    <div>
                      <div className="text-cyber-green terminal-text text-sm font-semibold">
                        NEURAL_NETWORK_STATUS
                      </div>
                      <div className="text-gray-400 text-xs">
                        Connection: QUANTUM_ENCRYPTED | Latency: 0.2ms
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {completedSteps.map(step => (
                      <div key={step} className="w-2 h-2 bg-cyber-green rounded-full neon-glow"></div>
                    ))}
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    {Array.from({ length: onboardingSteps.length - currentStep - 1 }, (_, i) => (
                      <div key={i} className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  className="border-gray-600 text-gray-400 hover:bg-gray-800/50"
                >
                  SKIP_TUTORIAL
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-cyber-green/50 text-cyber-green hover:bg-cyber-green/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  PREVIOUS
                </Button>
              </div>
              
              <Button 
                onClick={handleNext}
                className="bg-neon-gradient neon-glow terminal-text"
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    LAUNCH_PLATFORM
                  </>
                ) : (
                  <>
                    CONTINUE
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Service Preview Dialog */}
      {showPreview && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-3xl bg-black/95 border-cyber-green/30">
            <DialogHeader>
              <DialogTitle className="text-cyber-green terminal-text flex items-center gap-3">
                <Layers className="w-6 h-6 neon-glow" />
                QUANTUM_SERVICE_PREVIEW
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Experience our AI-powered web development service in action
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Service Overview */}
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle className="text-hologram terminal-text text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Neural Web Development Suite
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="cyber-glass p-4 border-cyber-green/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Code className="w-4 h-4 text-cyber-green" />
                        <span className="text-cyber-green terminal-text text-sm font-semibold">AI_CODING</span>
                      </div>
                      <p className="text-gray-300 text-xs">Autonomous code generation with 99.7% accuracy</p>
                    </div>
                    <div className="cyber-glass p-4 border-purple-400/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400 terminal-text text-sm font-semibold">QUANTUM_DB</span>
                      </div>
                      <p className="text-gray-300 text-xs">Neural database optimization and scaling</p>
                    </div>
                    <div className="cyber-glass p-4 border-blue-400/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 terminal-text text-sm font-semibold">CYBER_SECURITY</span>
                      </div>
                      <p className="text-gray-300 text-xs">Advanced threat detection and prevention</p>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="border-t border-cyber-green/20 pt-4">
                    <h4 className="text-cyber-green terminal-text text-sm font-semibold mb-3">PRICING_MATRIX</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="cyber-glass p-3 border-cyber-green/10">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-xs">Basic Web App</span>
                          <span className="text-cyber-green terminal-text text-sm">$2,499</span>
                        </div>
                      </div>
                      <div className="cyber-glass p-3 border-purple-400/10">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-xs">Enterprise Solution</span>
                          <span className="text-purple-400 terminal-text text-sm">$9,999</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Demo Simulation */}
                  <div className="border-t border-cyber-green/20 pt-4">
                    <h4 className="text-cyber-green terminal-text text-sm font-semibold mb-3">LIVE_DEMO_SIMULATION</h4>
                    <div className="cyber-glass p-4 border-cyber-green/10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyber-green rounded-full neon-glow animate-pulse"></div>
                          <span className="text-gray-300 text-xs">AI Operator ARIA-7 analyzing requirements...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full neon-glow animate-pulse"></div>
                          <span className="text-gray-300 text-xs">Neural network generating optimized code structure...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full neon-glow animate-pulse"></div>
                          <span className="text-gray-300 text-xs">Quantum database schema deployed successfully</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreview(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Close Preview
                </Button>
                <Button 
                  className="bg-neon-gradient neon-glow terminal-text"
                  onClick={() => {
                    setShowPreview(false);
                    navigate('/crypto-checkout/web-app');
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Deploy Service
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}