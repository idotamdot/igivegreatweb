import { useState, useEffect } from 'react';
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
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  Code,
  Database,
  Lock,
  Cpu,
  Activity,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  Settings
} from 'lucide-react';

interface AIAgent {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'security' | 'optimization' | 'testing' | 'deployment';
  status: 'active' | 'idle' | 'processing' | 'error';
  currentTask: string;
  efficiency: number;
  tasksCompleted: number;
  lastActivity: string;
}

interface NeuralProject {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'development' | 'testing' | 'deployment' | 'completed';
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  aiAgents: AIAgent[];
  complexity: 'quantum' | 'neural' | 'standard';
  budget: number;
  spentBudget: number;
  milestones: {
    name: string;
    completed: boolean;
    date: string;
  }[];
}

export default function NeuralProjectManager() {
  const [projects, setProjects] = useState<NeuralProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [systemMetrics, setSystemMetrics] = useState({
    totalProjects: 0,
    activeAgents: 0,
    totalEfficiency: 0,
    quantumProcessing: 0
  });

  useEffect(() => {
    // Initialize neural project data
    const neuralProjects: NeuralProject[] = [
      {
        id: 'proj-001',
        name: 'QuantumCommerce AI Platform',
        client: 'TechCorp Industries',
        status: 'development',
        progress: 68,
        startDate: '2024-11-15',
        estimatedCompletion: '2024-12-30',
        complexity: 'quantum',
        budget: 89000,
        spentBudget: 54200,
        milestones: [
          { name: 'Neural Architecture Design', completed: true, date: '2024-11-20' },
          { name: 'AI Agent Deployment', completed: true, date: '2024-11-28' },
          { name: 'Quantum Integration', completed: false, date: '2024-12-10' },
          { name: 'Security Mesh Implementation', completed: false, date: '2024-12-20' }
        ],
        aiAgents: [
          {
            id: 'agent-001',
            name: 'Frontend Neural AI',
            type: 'frontend',
            status: 'active',
            currentTask: 'Optimizing React components with neural patterns',
            efficiency: 94,
            tasksCompleted: 127,
            lastActivity: '2 minutes ago'
          },
          {
            id: 'agent-002',
            name: 'Backend Quantum AI',
            type: 'backend',
            status: 'processing',
            currentTask: 'Implementing quantum database optimizations',
            efficiency: 89,
            tasksCompleted: 93,
            lastActivity: '1 minute ago'
          },
          {
            id: 'agent-003',
            name: 'Security Guardian AI',
            type: 'security',
            status: 'active',
            currentTask: 'Running neural threat analysis',
            efficiency: 97,
            tasksCompleted: 156,
            lastActivity: '30 seconds ago'
          }
        ]
      },
      {
        id: 'proj-002',
        name: 'Neural HealthTech Portal',
        client: 'MedTech Solutions',
        status: 'testing',
        progress: 85,
        startDate: '2024-10-01',
        estimatedCompletion: '2024-12-15',
        complexity: 'neural',
        budget: 67000,
        spentBudget: 58900,
        milestones: [
          { name: 'AI Model Training', completed: true, date: '2024-10-15' },
          { name: 'Neural Interface Development', completed: true, date: '2024-11-01' },
          { name: 'Security Compliance Testing', completed: true, date: '2024-11-20' },
          { name: 'Deployment Preparation', completed: false, date: '2024-12-10' }
        ],
        aiAgents: [
          {
            id: 'agent-004',
            name: 'Medical AI Specialist',
            type: 'optimization',
            status: 'active',
            currentTask: 'Optimizing patient data algorithms',
            efficiency: 92,
            tasksCompleted: 89,
            lastActivity: '5 minutes ago'
          },
          {
            id: 'agent-005',
            name: 'Testing Automation AI',
            type: 'testing',
            status: 'processing',
            currentTask: 'Running comprehensive neural tests',
            efficiency: 88,
            tasksCompleted: 156,
            lastActivity: '1 minute ago'
          }
        ]
      },
      {
        id: 'proj-003',
        name: 'Quantum Trading Platform',
        client: 'FinanceAI Corp',
        status: 'planning',
        progress: 15,
        startDate: '2024-12-01',
        estimatedCompletion: '2025-02-28',
        complexity: 'quantum',
        budget: 125000,
        spentBudget: 18750,
        milestones: [
          { name: 'Quantum Algorithm Design', completed: true, date: '2024-12-05' },
          { name: 'AI Trading Models', completed: false, date: '2024-12-20' },
          { name: 'Neural Risk Analysis', completed: false, date: '2025-01-15' },
          { name: 'Quantum Deployment', completed: false, date: '2025-02-20' }
        ],
        aiAgents: [
          {
            id: 'agent-006',
            name: 'Quantum Finance AI',
            type: 'backend',
            status: 'idle',
            currentTask: 'Awaiting quantum model completion',
            efficiency: 96,
            tasksCompleted: 23,
            lastActivity: '15 minutes ago'
          }
        ]
      }
    ];

    setProjects(neuralProjects);
    setSelectedProject(neuralProjects[0].id);

    // Calculate system metrics
    const totalAgents = neuralProjects.reduce((sum, project) => sum + project.aiAgents.length, 0);
    const activeAgents = neuralProjects.reduce((sum, project) => 
      sum + project.aiAgents.filter(agent => agent.status === 'active' || agent.status === 'processing').length, 0
    );
    const avgEfficiency = neuralProjects.reduce((sum, project) => 
      sum + project.aiAgents.reduce((agentSum, agent) => agentSum + agent.efficiency, 0), 0
    ) / Math.max(totalAgents, 1);

    setSystemMetrics({
      totalProjects: neuralProjects.length,
      activeAgents,
      totalEfficiency: Math.round(avgEfficiency),
      quantumProcessing: neuralProjects.filter(p => p.complexity === 'quantum').length
    });
  }, []);

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'text-yellow-400 bg-yellow-400/20';
      case 'development': return 'text-cyber-green bg-cyber-green/20';
      case 'testing': return 'text-neon-blue bg-neon-blue/20';
      case 'deployment': return 'text-orange-400 bg-orange-400/20';
      case 'completed': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-cyber-green';
      case 'processing': return 'text-neon-blue';
      case 'idle': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'frontend': return Code;
      case 'backend': return Database;
      case 'security': return Lock;
      case 'optimization': return TrendingUp;
      case 'testing': return CheckCircle2;
      case 'deployment': return Cpu;
      default: return Bot;
    }
  };

  return (
    <div className="space-y-6">
      {/* Neural System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-cyber">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-cyber-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyber-green terminal-text">
              {systemMetrics.totalProjects}
            </div>
            <div className="text-xs terminal-text text-gray-400">ACTIVE_PROJECTS</div>
          </CardContent>
        </Card>
        <Card className="card-cyber">
          <CardContent className="p-4 text-center">
            <Bot className="w-8 h-8 text-neon-pink mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-pink terminal-text">
              {systemMetrics.activeAgents}
            </div>
            <div className="text-xs terminal-text text-gray-400">AI_AGENTS_ACTIVE</div>
          </CardContent>
        </Card>
        <Card className="card-cyber">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-neon-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-blue terminal-text">
              {systemMetrics.totalEfficiency}%
            </div>
            <div className="text-xs terminal-text text-gray-400">NEURAL_EFFICIENCY</div>
          </CardContent>
        </Card>
        <Card className="card-cyber">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400 terminal-text">
              {systemMetrics.quantumProcessing}
            </div>
            <div className="text-xs terminal-text text-gray-400">QUANTUM_PROJECTS</div>
          </CardContent>
        </Card>
      </div>

      {/* Project Selection */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="text-hologram terminal-text flex items-center gap-2">
            <Network className="w-6 h-6" />
            NEURAL_PROJECT_MANAGEMENT_SYSTEM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map(project => (
              <Card 
                key={project.id}
                className={`cursor-pointer transition-all hover-lift ${
                  selectedProject === project.id ? 'card-cyber border-cyber-green' : 'card-cyber'
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="terminal-text text-cyber-green text-sm font-medium">
                      {project.name}
                    </h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 terminal-text mb-3">
                    {project.client}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="terminal-text text-gray-400">Progress</span>
                      <span className="terminal-text text-neon-blue">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="terminal-text text-gray-400">
                      {project.aiAgents.length} AI Agents
                    </span>
                    <span className="terminal-text text-purple-400">
                      {project.complexity.toUpperCase()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Project Details */}
      {selectedProjectData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Overview */}
          <Card className="card-cyber">
            <CardHeader>
              <CardTitle className="text-cyber-green terminal-text">
                PROJECT_OVERVIEW
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="terminal-text text-hologram text-lg mb-2">
                  {selectedProjectData.name}
                </h3>
                <p className="text-gray-400 terminal-text text-sm">
                  Client: {selectedProjectData.client}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="terminal-text text-neon-blue text-sm">Start Date:</span>
                  <div className="terminal-text text-gray-300 text-sm">
                    {new Date(selectedProjectData.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="terminal-text text-neon-blue text-sm">Completion:</span>
                  <div className="terminal-text text-gray-300 text-sm">
                    {new Date(selectedProjectData.estimatedCompletion).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="terminal-text text-neon-blue">Progress</span>
                  <span className="terminal-text text-cyber-green">{selectedProjectData.progress}%</span>
                </div>
                <Progress value={selectedProjectData.progress} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="terminal-text text-neon-blue">Budget Usage</span>
                  <span className="terminal-text text-neon-pink">
                    ${selectedProjectData.spentBudget.toLocaleString()} / ${selectedProjectData.budget.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={(selectedProjectData.spentBudget / selectedProjectData.budget) * 100} 
                  className="h-2" 
                />
              </div>

              {/* Milestones */}
              <div>
                <h4 className="terminal-text text-neon-blue text-sm mb-3">PROJECT_MILESTONES</h4>
                <div className="space-y-2">
                  {selectedProjectData.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {milestone.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`terminal-text text-sm flex-1 ${
                        milestone.completed ? 'text-gray-300' : 'text-gray-400'
                      }`}>
                        {milestone.name}
                      </span>
                      <span className="terminal-text text-xs text-gray-500">
                        {new Date(milestone.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Agents Status */}
          <Card className="card-cyber">
            <CardHeader>
              <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI_AGENTS_STATUS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProjectData.aiAgents.map(agent => {
                const AgentIcon = getAgentIcon(agent.type);
                return (
                  <Card key={agent.id} className="cyber-glass p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <AgentIcon className={`w-5 h-5 ${getAgentStatusColor(agent.status)}`} />
                        <div>
                          <h4 className="terminal-text text-sm font-medium text-gray-300">
                            {agent.name}
                          </h4>
                          <Badge className={`text-xs ${getAgentStatusColor(agent.status)} bg-opacity-20`}>
                            {agent.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="terminal-text text-neon-blue text-sm">
                          {agent.efficiency}%
                        </div>
                        <div className="terminal-text text-xs text-gray-400">
                          EFFICIENCY
                        </div>
                      </div>
                    </div>
                    
                    <p className="terminal-text text-xs text-gray-400 mb-2">
                      {agent.currentTask}
                    </p>
                    
                    <div className="flex justify-between text-xs">
                      <span className="terminal-text text-gray-400">
                        {agent.tasksCompleted} tasks completed
                      </span>
                      <span className="terminal-text text-gray-500">
                        {agent.lastActivity}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="border-cyber-green text-cyber-green hover:bg-cyber-green/20">
                        <PlayCircle className="w-3 h-3 mr-1" />
                        BOOST
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-600/20">
                        <Settings className="w-3 h-3 mr-1" />
                        CONFIG
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}