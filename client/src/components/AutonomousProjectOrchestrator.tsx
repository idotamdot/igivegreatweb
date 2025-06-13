import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Rocket,
  GitBranch,
  Database,
  Cloud,
  TestTube,
  Shield,
  Cpu,
  Brain,
  Zap,
  CheckCircle,
  Clock,
  Users,
  DollarSign
} from "lucide-react";

interface AutonomousProject {
  id: string;
  name: string;
  client: string;
  type: 'web-app' | 'mobile-app' | 'api' | 'blockchain' | 'ai-model' | 'infrastructure';
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  stage: 'analysis' | 'design' | 'development' | 'testing' | 'deployment' | 'maintenance';
  progress: number;
  aiOperator: string;
  estimatedValue: number;
  startDate: string;
  estimatedCompletion: string;
  autonomyLevel: number;
  technologies: string[];
  metrics: {
    codeQuality: number;
    testCoverage: number;
    performance: number;
    security: number;
  };
}

interface OrchestrationMetric {
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  impact: 'low' | 'medium' | 'high';
}

interface DeploymentPipeline {
  projectId: string;
  stage: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  duration: number;
  aiActions: string[];
}

export function AutonomousProjectOrchestrator() {
  const [autonomousProjects, setAutonomousProjects] = useState<AutonomousProject[]>([]);
  const [orchestrationMetrics, setOrchestrationMetrics] = useState<OrchestrationMetric[]>([]);
  const [deploymentPipelines, setDeploymentPipelines] = useState<DeploymentPipeline[]>([]);
  const [isInitiating, setIsInitiating] = useState(false);
  const [totalProjectValue, setTotalProjectValue] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);

  useEffect(() => {
    // Initialize autonomous project orchestration
    const projects: AutonomousProject[] = [
      {
        id: 'ap-001',
        name: 'Quantum Trading Platform',
        client: 'Nexus Financial Corp',
        type: 'web-app',
        complexity: 'enterprise',
        stage: 'development',
        progress: 67.4,
        aiOperator: 'ARIA-7',
        estimatedValue: 2400000,
        startDate: '2025-05-15',
        estimatedCompletion: '2025-08-22',
        autonomyLevel: 94.2,
        technologies: ['React', 'Node.js', 'PostgreSQL', 'WebRTC', 'Machine Learning'],
        metrics: {
          codeQuality: 96.8,
          testCoverage: 94.2,
          performance: 97.5,
          security: 98.1
        }
      },
      {
        id: 'ap-002',
        name: 'Neural Defense Grid',
        client: 'Cyber Defense Solutions',
        type: 'infrastructure',
        complexity: 'complex',
        stage: 'testing',
        progress: 84.3,
        aiOperator: 'CIPHER-9',
        estimatedValue: 1850000,
        startDate: '2025-04-20',
        estimatedCompletion: '2025-07-10',
        autonomyLevel: 97.6,
        technologies: ['Kubernetes', 'Docker', 'AI/ML', 'Blockchain', 'Quantum Encryption'],
        metrics: {
          codeQuality: 98.2,
          testCoverage: 96.7,
          performance: 95.8,
          security: 99.4
        }
      },
      {
        id: 'ap-003',
        name: 'Biotech Data Analytics Suite',
        client: 'Aurora Biotech Industries',
        type: 'ai-model',
        complexity: 'complex',
        stage: 'deployment',
        progress: 91.7,
        aiOperator: 'NEXUS-3',
        estimatedValue: 3200000,
        startDate: '2025-03-10',
        estimatedCompletion: '2025-06-25',
        autonomyLevel: 92.8,
        technologies: ['Python', 'TensorFlow', 'Apache Spark', 'Cloud Computing', 'Genomics'],
        metrics: {
          codeQuality: 95.4,
          testCoverage: 93.1,
          performance: 96.3,
          security: 97.2
        }
      },
      {
        id: 'ap-004',
        name: 'Aerospace Simulation Engine',
        client: 'Quantum Aerospace Corp',
        type: 'api',
        complexity: 'enterprise',
        stage: 'design',
        progress: 23.8,
        aiOperator: 'VORTEX-1',
        estimatedValue: 4500000,
        startDate: '2025-06-01',
        estimatedCompletion: '2025-12-15',
        autonomyLevel: 89.5,
        technologies: ['C++', 'CUDA', 'OpenGL', 'Quantum Computing', 'Real-time Systems'],
        metrics: {
          codeQuality: 94.7,
          testCoverage: 91.3,
          performance: 98.6,
          security: 96.8
        }
      }
    ];

    const metrics: OrchestrationMetric[] = [
      { name: 'Autonomous Delivery Rate', value: 96.8, target: 97.5, trend: 'up', impact: 'high' },
      { name: 'Code Generation Speed', value: 847, target: 900, trend: 'up', impact: 'high' },
      { name: 'Quality Assurance Score', value: 94.2, target: 95.0, trend: 'up', impact: 'medium' },
      { name: 'Client Satisfaction', value: 98.7, target: 99.0, trend: 'stable', impact: 'high' },
      { name: 'Resource Optimization', value: 92.4, target: 94.0, trend: 'up', impact: 'medium' },
      { name: 'Innovation Index', value: 88.9, target: 90.0, trend: 'up', impact: 'low' }
    ];

    const pipelines: DeploymentPipeline[] = [
      {
        projectId: 'ap-001',
        stage: 'Integration Testing',
        status: 'running',
        duration: 23,
        aiActions: ['Running automated tests', 'Performance optimization', 'Security validation']
      },
      {
        projectId: 'ap-002',
        stage: 'Production Deployment',
        status: 'success',
        duration: 12,
        aiActions: ['Infrastructure provisioning', 'Service deployment', 'Health monitoring']
      },
      {
        projectId: 'ap-003',
        stage: 'Model Training',
        status: 'running',
        duration: 156,
        aiActions: ['Data preprocessing', 'Neural network training', 'Hyperparameter tuning']
      }
    ];

    setAutonomousProjects(projects);
    setOrchestrationMetrics(metrics);
    setDeploymentPipelines(pipelines);
    setTotalProjectValue(projects.reduce((sum, project) => sum + project.estimatedValue, 0));
    setActiveProjects(projects.filter(p => p.stage !== 'maintenance').length);
  }, []);

  const initiateNewProject = async () => {
    setIsInitiating(true);

    // Simulate autonomous project initiation
    setTimeout(() => {
      const newProject: AutonomousProject = {
        id: `ap-${Date.now()}`,
        name: 'Neural Healthcare Platform',
        client: 'Neural Medical Systems',
        type: 'web-app',
        complexity: 'complex',
        stage: 'analysis',
        progress: 5.2,
        aiOperator: 'PULSE-4',
        estimatedValue: 1950000,
        startDate: new Date().toISOString().split('T')[0],
        estimatedCompletion: '2025-10-30',
        autonomyLevel: 91.3,
        technologies: ['Vue.js', 'Django', 'MongoDB', 'AI/ML', 'HIPAA Compliance'],
        metrics: {
          codeQuality: 95.0,
          testCoverage: 92.0,
          performance: 94.5,
          security: 98.8
        }
      };

      setAutonomousProjects(prev => [...prev, newProject]);
      setTotalProjectValue(prev => prev + newProject.estimatedValue);
      setActiveProjects(prev => prev + 1);
      setIsInitiating(false);
    }, 4000);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'analysis': return 'bg-blue-600'; // Keep for distinct stage colors
      case 'design': return 'bg-purple-600'; // Keep for distinct stage colors
      case 'development': return 'bg-orange-600'; // Keep for distinct stage colors
      case 'testing': return 'bg-yellow-600'; // Keep for distinct stage colors
      case 'deployment': return 'bg-green-600'; // Keep for distinct stage colors
      case 'maintenance': return 'bg-gray-600'; // Keep for distinct stage colors
      default: return 'bg-gray-600';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-cyber-green';
      case 'moderate': return 'text-yellow-400';
      case 'complex': return 'text-orange-400';
      case 'enterprise': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    const iconColor = "text-neon-blue"; // A consistent color from your palette

    switch (type) {
      case 'web-app': return <Code className={`w-4 h-4 ${iconColor}`} />;
      case 'mobile-app': return <Cpu className={`w-4 h-4 ${iconColor}`} />;
      case 'api': return <Database className={`w-4 h-4 ${iconColor}`} />;
      case 'blockchain': return <GitBranch className={`w-4 h-4 ${iconColor}`} />;
      case 'ai-model': return <Brain className={`w-4 h-4 ${iconColor}`} />;
      case 'infrastructure': return <Cloud className={`w-4 h-4 ${iconColor}`} />;
      default: return <Code className={`w-4 h-4 ${iconColor}`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Autonomous Orchestration Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cyber-glass"> {/* Applied cyber-glass from your CSS */}
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">TOTAL_VALUE</p>
                <p className="terminal-text text-2xl font-bold text-cyber-green">
                  ${(totalProjectValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-cyber-green neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glass"> {/* Applied cyber-glass from your CSS */}
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">ACTIVE_PROJECTS</p>
                <p className="terminal-text text-2xl font-bold text-neon-blue">
                  {activeProjects}
                </p>
              </div>
              <Rocket className="w-8 h-8 text-neon-blue neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glass"> {/* Applied cyber-glass from your CSS */}
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">AUTONOMY_LEVEL</p>
                <p className="terminal-text text-2xl font-bold text-hologram">
                  93.6%
                </p>
              </div>
              <Brain className="w-8 h-8 text-hologram neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glass"> {/* Applied cyber-glass from your CSS */}
          <CardContent className="p-6">
            <Button
              onClick={initiateNewProject}
              disabled={isInitiating}
              // Using custom gradient and magnetic effect from provided CSS
              className="w-full bg-neon-gradient hover:bg-neon-gradient btn-magnetic terminal-text"
            >
              {isInitiating ? 'INITIATING...' : 'NEW_PROJECT'}
              <Zap className="w-4 h-4 ml-2 neon-glow" /> {/* Added neon-glow to Zap icon */}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-neon-blue/30">
          <TabsTrigger value="projects" className="terminal-text">Active Projects</TabsTrigger>
          <TabsTrigger value="pipelines" className="terminal-text">Deployment Pipelines</TabsTrigger>
          <TabsTrigger value="metrics" className="terminal-text">Orchestration Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4">
            {autonomousProjects.map((project) => (
              <Card key={project.id} className="cyber-glass"> {/* Applied cyber-glass from your CSS */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(project.type)}
                      <div>
                        <CardTitle className="terminal-text text-white text-lg">
                          {project.name}
                        </CardTitle>
                        <p className="terminal-text text-gray-400 text-sm">
                          {project.client} • {project.type.replace('-', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStageColor(project.stage)} terminal-text`}>
                        {project.stage.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={`terminal-text ${getComplexityColor(project.complexity)}`}>
                        {project.complexity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">VALUE</p>
                      <p className="terminal-text text-lg font-bold text-cyber-green">
                        ${(project.estimatedValue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">AUTONOMY</p>
                      <p className="terminal-text text-lg font-bold text-neon-blue">
                        {project.autonomyLevel}%
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">AI_OPERATOR</p>
                      <p className="terminal-text text-lg font-bold text-hologram">
                        {project.aiOperator}
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">COMPLETION</p>
                      <p className="terminal-text text-sm text-gray-300">
                        {new Date(project.estimatedCompletion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm terminal-text text-gray-400">
                      <span>Progress</span>
                      <span>{project.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={project.progress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="text-center">
                      <p className="terminal-text text-gray-400 text-xs">CODE_QUALITY</p>
                      <p className="terminal-text text-lg font-bold text-cyber-green">
                        {project.metrics.codeQuality}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="terminal-text text-gray-400 text-xs">TEST_COVERAGE</p>
                      <p className="terminal-text text-lg font-bold text-neon-blue">
                        {project.metrics.testCoverage}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="terminal-text text-gray-400 text-xs">PERFORMANCE</p>
                      <p className="terminal-text text-lg font-bold text-hologram">
                        {project.metrics.performance}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="terminal-text text-gray-400 text-xs">SECURITY</p>
                      <p className="terminal-text text-lg font-bold text-purple-400">
                        {project.metrics.security}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="terminal-text text-gray-400 text-sm mb-2">TECH_STACK</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="terminal-text text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          <div className="grid gap-4">
            {deploymentPipelines.map((pipeline, index) => (
              <Card key={index} className="cyber-glass"> {/* Applied cyber-glass from your CSS */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Rocket className="w-5 h-5 text-neon-blue neon-glow" /> {/* Added neon-glow */}
                      <CardTitle className="terminal-text text-white">
                        {autonomousProjects.find(p => p.id === pipeline.projectId)?.name || 'Unknown Project'}
                      </CardTitle>
                    </div>
                    <Badge className={`terminal-text ${
                      pipeline.status === 'success' ? 'bg-green-600' : // Keep distinct Tailwind colors for status
                      pipeline.status === 'running' ? 'bg-neon-blue' :
                      pipeline.status === 'failed' ? 'bg-red-600' : 'bg-gray-600'
                    }`}>
                      {pipeline.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="terminal-text text-gray-400 text-sm">CURRENT_STAGE</p>
                        <p className="terminal-text text-lg font-bold text-hologram">
                          {pipeline.stage}
                        </p>
                      </div>
                      <div>
                        <p className="terminal-text text-gray-400 text-sm">DURATION</p>
                        <p className="terminal-text text-lg font-bold text-neon-blue">
                          {pipeline.duration}min
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="terminal-text text-gray-400 text-sm mb-2">AI_ACTIONS</p>
                      <div className="space-y-1">
                        {pipeline.aiActions.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              pipeline.status === 'running' ? 'bg-neon-blue animate-pulse' : 'bg-cyber-green'
                            }`} />
                            <span className="terminal-text text-sm text-gray-300">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orchestrationMetrics.map((metric, index) => (
              <Card key={index} className="cyber-glass"> {/* Applied cyber-glass from your CSS */}
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="terminal-text text-gray-400 text-sm">
                        {metric.name.toUpperCase()}
                      </p>
                      <Badge className={`terminal-text ${
                        metric.impact === 'high' ? 'bg-red-600' : // Keep distinct Tailwind colors for status
                        metric.impact === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {metric.impact.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="terminal-text text-2xl font-bold text-cyber-green">
                        {metric.name.includes('Speed') ? metric.value : `${metric.value}%`}
                      </p>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          metric.trend === 'up' ? 'bg-cyber-green' :
                          metric.trend === 'down' ? 'bg-red-400' : 'bg-gray-400'
                        }`} />
                        <span className="terminal-text text-gray-400 text-sm">
                          {metric.trend.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Target</span>
                        <span>{metric.name.includes('Speed') ? metric.target : `${metric.target}%`}</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
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
