import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Network, 
  Shield, 
  Zap, 
  Server, 
  Bot,
  Activity,
  Users,
  Globe,
  Database,
  Cpu,
  Eye,
  Target,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  Settings,
  Sparkles,
  Command,
  Terminal
} from 'lucide-react';

interface QuantumAI {
  id: string;
  name: string;
  role: 'operations' | 'security' | 'client' | 'development' | 'analytics' | 'oversight';
  status: 'online' | 'processing' | 'sleeping' | 'learning';
  efficiency: number;
  tasksCompleted: number;
  currentTask: string;
  autonomyLevel: number;
  lastDecision: string;
  nextAction: string;
}

interface AIDecision {
  timestamp: string;
  aiName: string;
  category: 'client_onboard' | 'project_manage' | 'security_scan' | 'optimization' | 'resource_allocation';
  decision: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  outcome?: string;
}

export default function QuantumAIOperations() {
  const { data: aiOperators = [] } = useQuery({
    queryKey: ['/api/neural/ai-operators'],
  });

  const [quantumAIs, setQuantumAIs] = useState<QuantumAI[]>([]);
  const [aiDecisions, setAIDecisions] = useState<AIDecision[]>([]);
  const [systemAutonomy, setSystemAutonomy] = useState(87);
  const [overrideMode, setOverrideMode] = useState(false);

  useEffect(() => {
    if (aiOperators.length > 0) {
      // Transform database AI operators to component format
      const transformedAIs: QuantumAI[] = aiOperators.map((operator: any) => ({
        id: `qai-${operator.id.toString().padStart(3, '0')}`,
        name: operator.name,
        role: getRoleFromName(operator.role),
        status: 'online',
        efficiency: Math.round(parseFloat(operator.efficiency_rating) * 100),
        tasksCompleted: operator.tasks_completed,
        currentTask: getCurrentTask(operator.role),
        autonomyLevel: Math.round(parseFloat(operator.efficiency_rating) * 100),
        lastDecision: getLastDecision(operator.role),
        nextAction: getNextAction(operator.role)
      }));
      setQuantumAIs(transformedAIs);
    }
  }, [aiOperators]);

  // Helper functions to map database data to UI expectations
  const getRoleFromName = (role: string): QuantumAI['role'] => {
    if (role.includes('Operations') || role.includes('Business')) return 'operations';
    if (role.includes('Security') || role.includes('Defense')) return 'security';
    if (role.includes('Client') || role.includes('Relations')) return 'client';
    if (role.includes('Development') || role.includes('Lead')) return 'development';
    if (role.includes('Market') || role.includes('Analysis')) return 'analytics';
    return 'oversight';
  };

  const getCurrentTask = (role: string): string => {
    if (role.includes('Operations')) return 'Optimizing neural network resource allocation';
    if (role.includes('Security')) return 'Monitoring quantum encryption protocols';
    if (role.includes('Client')) return 'Processing client interaction algorithms';
    if (role.includes('Development')) return 'Compiling autonomous code generation';
    if (role.includes('Infrastructure')) return 'Managing quantum server infrastructure';
    if (role.includes('Market')) return 'Analyzing market trend patterns';
    return 'Executing strategic oversight protocols';
  };

  const getLastDecision = (role: string): string => {
    if (role.includes('Operations')) return 'Allocated quantum cores to high-priority projects';
    if (role.includes('Security')) return 'Enhanced neural firewall configurations';
    if (role.includes('Client')) return 'Approved automated client onboarding sequence';
    if (role.includes('Development')) return 'Deployed neural code optimization patches';
    if (role.includes('Infrastructure')) return 'Scaled quantum hosting infrastructure';
    if (role.includes('Market')) return 'Updated predictive market algorithms';
    return 'Executed strategic system optimization';
  };

  const getNextAction = (role: string): string => {
    if (role.includes('Operations')) return 'Schedule quantum maintenance protocols';
    if (role.includes('Security')) return 'Deploy advanced threat detection systems';
    if (role.includes('Client')) return 'Initiate client satisfaction analysis';
    if (role.includes('Development')) return 'Begin neural architecture upgrades';
    if (role.includes('Infrastructure')) return 'Optimize quantum server performance';
    if (role.includes('Market')) return 'Generate market expansion strategies';
    return 'Monitor system-wide performance metrics';
  };

  useEffect(() => {
    // Initialize mock decisions for demonstration
    const mockDecisions: AIDecision[] = [
      {
        id: 'qai-001',
        name: 'NEXUS_OPERATIONS_AI',
        role: 'operations',
        status: 'online',
        efficiency: 96,
        tasksCompleted: 2847,
        currentTask: 'Optimizing server allocation across 7 active projects',
        autonomyLevel: 95,
        lastDecision: 'Allocated 3 additional quantum cores to MedTech project',
        nextAction: 'Schedule maintenance window for Infrastructure-Beta'
      },
      {
        id: 'qai-002',
        name: 'GUARDIAN_SECURITY_AI',
        role: 'security',
        status: 'processing',
        efficiency: 99,
        tasksCompleted: 1456,
        currentTask: 'Analyzing 247 potential security threats',
        autonomyLevel: 98,
        lastDecision: 'Implemented enhanced encryption on FinanceAI project',
        nextAction: 'Deploy neural firewall patch to all client systems'
      },
      {
        id: 'qai-003',
        name: 'CONSUL_CLIENT_AI',
        role: 'client',
        status: 'online',
        efficiency: 92,
        tasksCompleted: 892,
        currentTask: 'Processing 3 new client onboarding requests',
        autonomyLevel: 89,
        lastDecision: 'Approved TechCorp expansion proposal automatically',
        nextAction: 'Schedule client review meeting for HealthTech Solutions'
      },
      {
        id: 'qai-004',
        name: 'ARCHITECT_DEV_AI',
        role: 'development',
        status: 'learning',
        efficiency: 94,
        tasksCompleted: 3421,
        currentTask: 'Learning new neural architecture patterns',
        autonomyLevel: 91,
        lastDecision: 'Deployed performance optimization to 4 projects',
        nextAction: 'Implement quantum database optimization protocols'
      },
      {
        id: 'qai-005',
        name: 'ANALYTICS_NEURAL_AI',
        role: 'analytics',
        status: 'online',
        efficiency: 88,
        tasksCompleted: 1987,
        currentTask: 'Generating predictive analytics for Q1 2025',
        autonomyLevel: 86,
        lastDecision: 'Identified 3 optimization opportunities',
        nextAction: 'Compile quarterly performance metrics report'
      },
      {
        id: 'qai-006',
        name: 'OVERSEER_QUANTUM_AI',
        role: 'oversight',
        status: 'online',
        efficiency: 97,
        tasksCompleted: 756,
        currentTask: 'Monitoring all AI operations and decision quality',
        autonomyLevel: 99,
        lastDecision: 'Approved budget reallocation for quantum infrastructure',
        nextAction: 'Review AI performance metrics and optimize neural networks'
      }
    ];

    const recentDecisions: AIDecision[] = [
      {
        timestamp: '2 minutes ago',
        aiName: 'NEXUS_OPERATIONS_AI',
        category: 'resource_allocation',
        decision: 'Allocated 3 additional quantum processing cores to MedTech project due to increased computational demands',
        confidence: 94,
        impact: 'medium',
        outcome: 'Performance improved by 23%'
      },
      {
        timestamp: '5 minutes ago',
        aiName: 'GUARDIAN_SECURITY_AI',
        category: 'security_scan',
        decision: 'Automatically blocked 47 threat attempts and upgraded firewall protocols',
        confidence: 99,
        impact: 'high',
        outcome: 'Zero security breaches detected'
      },
      {
        timestamp: '8 minutes ago',
        aiName: 'CONSUL_CLIENT_AI',
        category: 'client_onboard',
        decision: 'Pre-approved TechCorp Industries expansion proposal based on historical performance data',
        confidence: 91,
        impact: 'high',
        outcome: 'Client satisfaction increased to 98%'
      },
      {
        timestamp: '12 minutes ago',
        aiName: 'ARCHITECT_DEV_AI',
        category: 'optimization',
        decision: 'Implemented neural load balancing across 4 active development projects',
        confidence: 96,
        impact: 'medium',
        outcome: 'Development speed increased by 18%'
      },
      {
        timestamp: '15 minutes ago',
        aiName: 'ANALYTICS_NEURAL_AI',
        category: 'project_manage',
        decision: 'Predicted QuantumCommerce project completion 3 days ahead of schedule',
        confidence: 89,
        impact: 'medium',
        outcome: 'Resource optimization achieved'
      },
      {
        timestamp: '18 minutes ago',
        aiName: 'OVERSEER_QUANTUM_AI',
        category: 'resource_allocation',
        decision: 'Approved autonomous budget adjustment for quantum infrastructure expansion',
        confidence: 97,
        impact: 'critical',
        outcome: 'System capacity increased by 40%'
      }
    ];

    setQuantumAIs(aiOperators);
    setAIDecisions(recentDecisions);

    // Simulate AI operations
    const interval = setInterval(() => {
      setQuantumAIs(prev => prev.map(ai => ({
        ...ai,
        tasksCompleted: ai.tasksCompleted + Math.floor(Math.random() * 3),
        efficiency: Math.max(85, Math.min(100, ai.efficiency + (Math.random() - 0.5) * 2))
      })));

      setSystemAutonomy(prev => Math.max(80, Math.min(99, prev + (Math.random() - 0.5) * 2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'operations': return 'text-cyber-green';
      case 'security': return 'text-neon-pink';
      case 'client': return 'text-neon-blue';
      case 'development': return 'text-purple-400';
      case 'analytics': return 'text-orange-400';
      case 'oversight': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-cyber-green';
      case 'processing': return 'text-neon-blue';
      case 'learning': return 'text-purple-400';
      case 'sleeping': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-gray-400 bg-gray-400/20';
      case 'medium': return 'text-neon-blue bg-neon-blue/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'critical': return 'text-neon-pink bg-neon-pink/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'client_onboard': return Users;
      case 'project_manage': return Brain;
      case 'security_scan': return Shield;
      case 'optimization': return Zap;
      case 'resource_allocation': return Database;
      default: return Activity;
    }
  };

  const avgEfficiency = Math.round(quantumAIs.reduce((sum, ai) => sum + ai.efficiency, 0) / quantumAIs.length);
  const totalTasks = quantumAIs.reduce((sum, ai) => sum + ai.tasksCompleted, 0);
  const onlineAIs = quantumAIs.filter(ai => ai.status === 'online' || ai.status === 'processing').length;

  return (
    <div className="space-y-6">
      {/* Quantum AI Control Center Header */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="text-hologram terminal-text flex items-center gap-2">
            <Brain className="w-6 h-6" />
            QUANTUM_AI_OPERATIONS_CENTER
          </CardTitle>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-green terminal-text">{systemAutonomy}%</div>
                <div className="text-xs terminal-text text-gray-400">SYSTEM_AUTONOMY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue terminal-text">{onlineAIs}/{quantumAIs.length}</div>
                <div className="text-xs terminal-text text-gray-400">AI_ONLINE</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 terminal-text">{avgEfficiency}%</div>
                <div className="text-xs terminal-text text-gray-400">AVG_EFFICIENCY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 terminal-text">{totalTasks.toLocaleString()}</div>
                <div className="text-xs terminal-text text-gray-400">TASKS_COMPLETED</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant={overrideMode ? "destructive" : "outline"}
                onClick={() => setOverrideMode(!overrideMode)}
                className={`terminal-text ${overrideMode ? 'bg-red-600 text-white' : 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/20'}`}
              >
                <Command className="w-4 h-4 mr-2" />
                {overrideMode ? 'EXIT_OVERRIDE' : 'MANUAL_OVERRIDE'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quantum AI Operators */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AUTONOMOUS_AI_OPERATORS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quantumAIs.map(ai => (
              <Card key={ai.id} className="cyber-glass p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`terminal-text font-medium ${getRoleColor(ai.role)}`}>
                      {ai.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getRoleColor(ai.role)} bg-opacity-20`}>
                        {ai.role.toUpperCase().replace('_', ' ')}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(ai.status)} neon-glow`}></div>
                      <span className={`terminal-text text-xs ${getStatusColor(ai.status)}`}>
                        {ai.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="terminal-text text-lg font-bold text-white">
                      {ai.efficiency}%
                    </div>
                    <div className="terminal-text text-xs text-gray-400">
                      EFFICIENCY
                    </div>
                  </div>
                </div>

                <p className="terminal-text text-sm text-gray-300 mb-3">
                  {ai.currentTask}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="terminal-text text-gray-400">Autonomy Level</span>
                    <span className="terminal-text text-neon-blue">{ai.autonomyLevel}%</span>
                  </div>
                  <Progress value={ai.autonomyLevel} className="h-1" />
                </div>

                <div className="mt-3 space-y-1">
                  <div className="terminal-text text-xs text-gray-400">
                    Last Decision: <span className="text-gray-300">{ai.lastDecision}</span>
                  </div>
                  <div className="terminal-text text-xs text-gray-400">
                    Next Action: <span className="text-neon-blue">{ai.nextAction}</span>
                  </div>
                  <div className="terminal-text text-xs text-gray-400">
                    Tasks Completed: <span className="text-cyber-green">{ai.tasksCompleted.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-cyber-green text-cyber-green hover:bg-cyber-green/20 disabled:opacity-50"
                    disabled={!overrideMode}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    CONFIG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-purple-400 text-purple-400 hover:bg-purple-400/20 disabled:opacity-50"
                    disabled={!overrideMode}
                  >
                    <Brain className="w-3 h-3 mr-1" />
                    ENHANCE
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* AI Decision Log */}
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
              <Activity className="w-5 h-5" />
              AUTONOMOUS_DECISION_LOG
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {aiDecisions.map((decision, index) => {
                const CategoryIcon = getCategoryIcon(decision.category);
                return (
                  <Card key={index} className="cyber-glass p-3">
                    <div className="flex items-start gap-3">
                      <CategoryIcon className="w-5 h-5 text-neon-blue mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="terminal-text text-sm font-medium text-cyber-green">
                            {decision.aiName}
                          </span>
                          <Badge className={`text-xs ${getImpactColor(decision.impact)}`}>
                            {decision.impact.toUpperCase()}
                          </Badge>
                          <span className="terminal-text text-xs text-gray-500">
                            {decision.timestamp}
                          </span>
                        </div>
                        
                        <p className="terminal-text text-sm text-gray-300 mb-2">
                          {decision.decision}
                        </p>
                        
                        {decision.outcome && (
                          <div className="terminal-text text-xs text-neon-blue">
                            Outcome: {decision.outcome}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-purple-400" />
                            <span className="terminal-text text-xs text-purple-400">
                              {decision.confidence}% confidence
                            </span>
                          </div>
                          <Badge className="bg-gray-700 text-gray-300 text-xs">
                            {decision.category.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Override Panel */}
      {overrideMode && (
        <Card className="card-cyber border-yellow-400">
          <CardHeader>
            <CardTitle className="text-yellow-400 terminal-text flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              MANUAL_OVERRIDE_ACTIVE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-neon-gradient neon-glow terminal-text">
                <Terminal className="w-4 h-4 mr-2" />
                DIRECT_AI_COMMAND
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 terminal-text">
                <Settings className="w-4 h-4 mr-2" />
                SYSTEM_CONFIG
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 terminal-text">
                <PauseCircle className="w-4 h-4 mr-2" />
                EMERGENCY_HALT
              </Button>
            </div>
            <div className="mt-4 p-3 cyber-glass rounded-lg">
              <p className="terminal-text text-sm text-yellow-400">
                ⚠️ Manual override enabled. AI autonomy temporarily suspended. All AI decisions require human approval.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quantum Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-cyber">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-cyber-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyber-green terminal-text">247</div>
            <div className="text-xs terminal-text text-gray-400">DECISIONS_TODAY</div>
          </CardContent>
        </Card>
        
        <Card className="card-cyber">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-neon-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-blue terminal-text">99.7%</div>
            <div className="text-xs terminal-text text-gray-400">SUCCESS_RATE</div>
          </CardContent>
        </Card>
        
        <Card className="card-cyber">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400 terminal-text">2.3s</div>
            <div className="text-xs terminal-text text-gray-400">AVG_RESPONSE</div>
          </CardContent>
        </Card>
        
        <Card className="card-cyber">
          <CardContent className="p-4 text-center">
            <Network className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-400 terminal-text">$24.7K</div>
            <div className="text-xs terminal-text text-gray-400">COST_SAVED</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}