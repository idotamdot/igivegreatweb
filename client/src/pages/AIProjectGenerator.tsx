import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Code, 
  Database, 
  Shield, 
  Rocket,
  Sparkles,
  Globe,
  Network,
  Bot,
  Wand2,
  Settings,
  Eye,
  Download,
  Play,
  GitBranch
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'web-app' | 'mobile-app' | 'blockchain' | 'ai-model' | 'api' | 'infrastructure';
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  estimatedHours: number;
  technologies: string[];
  aiOperators: string[];
  features: string[];
  icon: any;
}

interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  template: string;
  status: 'generating' | 'planning' | 'coding' | 'testing' | 'deploying' | 'completed';
  progress: number;
  assignedOperators: string[];
  estimatedCompletion: string;
  repository: string;
  liveDemo?: string;
  codeStructure: any[];
}

export default function AIProjectGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [generatedProjects, setGeneratedProjects] = useState<GeneratedProject[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState<GeneratedProject | null>(null);

  const { data: aiOperators = [] } = useQuery<any[]>({
    queryKey: ['/api/ai-operators'],
    refetchInterval: 5000,
  });

  const projectTemplates: ProjectTemplate[] = [
    {
      id: 'ecommerce-platform',
      name: 'E-commerce Platform',
      description: 'Full-stack shopping platform with AI recommendations',
      category: 'web-app',
      complexity: 'complex',
      estimatedHours: 72,
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AI/ML'],
      aiOperators: ['ARIA-7', 'CIPHER-9', 'NEXUS-3'],
      features: ['Product Catalog', 'AI Recommendations', 'Payment Processing', 'Admin Dashboard'],
      icon: Globe
    },
    {
      id: 'blockchain-dapp',
      name: 'DeFi Application',
      description: 'Decentralized finance platform with smart contracts',
      category: 'blockchain',
      complexity: 'enterprise',
      estimatedHours: 120,
      technologies: ['Solidity', 'Web3.js', 'React', 'IPFS', 'Ethereum'],
      aiOperators: ['NEXUS-3', 'CIPHER-9', 'VORTEX-1'],
      features: ['Smart Contracts', 'Token Staking', 'Yield Farming', 'Security Audits'],
      icon: Shield
    },
    {
      id: 'ai-chatbot',
      name: 'AI Customer Support',
      description: 'Intelligent chatbot with natural language processing',
      category: 'ai-model',
      complexity: 'moderate',
      estimatedHours: 48,
      technologies: ['Python', 'TensorFlow', 'NLP', 'FastAPI', 'Docker'],
      aiOperators: ['ARIA-7', 'ECHO-5'],
      features: ['Natural Language Understanding', 'Multi-language Support', 'Learning System'],
      icon: Bot
    },
    {
      id: 'mobile-fintech',
      name: 'Mobile Banking App',
      description: 'Secure mobile banking with biometric authentication',
      category: 'mobile-app',
      complexity: 'complex',
      estimatedHours: 96,
      technologies: ['React Native', 'Node.js', 'MongoDB', 'Biometric APIs'],
      aiOperators: ['NEXUS-3', 'ECHO-5', 'PULSE-4'],
      features: ['Biometric Auth', 'Real-time Transactions', 'Investment Tracking'],
      icon: Database
    },
    {
      id: 'microservices-api',
      name: 'Microservices Architecture',
      description: 'Scalable API gateway with microservices',
      category: 'api',
      complexity: 'enterprise',
      estimatedHours: 80,
      technologies: ['Node.js', 'Docker', 'Kubernetes', 'Redis', 'GraphQL'],
      aiOperators: ['VORTEX-1', 'ARIA-7'],
      features: ['API Gateway', 'Service Discovery', 'Load Balancing', 'Monitoring'],
      icon: Network
    },
    {
      id: 'cloud-infrastructure',
      name: 'Auto-scaling Infrastructure',
      description: 'Cloud infrastructure with AI-powered scaling',
      category: 'infrastructure',
      complexity: 'enterprise',
      estimatedHours: 64,
      technologies: ['Terraform', 'AWS', 'Kubernetes', 'Prometheus', 'Grafana'],
      aiOperators: ['VORTEX-1', 'NEXUS-3'],
      features: ['Auto-scaling', 'Monitoring', 'Security Hardening', 'Cost Optimization'],
      icon: Cpu
    }
  ];

  const generateProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error('Generation failed');
      return response.json();
    },
    onSuccess: (data) => {
      const newProject: GeneratedProject = {
        id: `proj-${Date.now()}`,
        name: projectName,
        description: projectDescription,
        template: selectedTemplate,
        status: 'generating',
        progress: 0,
        assignedOperators: data.operators || [],
        estimatedCompletion: data.estimatedCompletion || '2-4 hours',
        repository: `https://github.com/neural-web-labs/${projectName.toLowerCase().replace(/\s+/g, '-')}`,
        codeStructure: data.codeStructure || []
      };
      
      setCurrentGeneration(newProject);
      setGeneratedProjects(prev => [newProject, ...prev]);
      
      // Simulate project generation progress
      simulateGeneration(newProject);
    },
  });

  const simulateGeneration = (project: GeneratedProject) => {
    const phases = [
      { status: 'planning', duration: 2000, progress: 20 },
      { status: 'coding', duration: 8000, progress: 70 },
      { status: 'testing', duration: 3000, progress: 90 },
      { status: 'deploying', duration: 2000, progress: 95 },
      { status: 'completed', duration: 1000, progress: 100 }
    ];

    let currentPhase = 0;
    
    const advancePhase = () => {
      if (currentPhase < phases.length) {
        const phase = phases[currentPhase];
        
        setCurrentGeneration(prev => prev ? {
          ...prev,
          status: phase.status as any,
          progress: phase.progress
        } : null);
        
        setGeneratedProjects(prev => prev.map(p => 
          p.id === project.id ? {
            ...p,
            status: phase.status as any,
            progress: phase.progress
          } : p
        ));
        
        currentPhase++;
        setTimeout(advancePhase, phase.duration);
      }
    };
    
    setTimeout(advancePhase, 1000);
  };

  const handleGenerateProject = () => {
    if (!selectedTemplate || !projectName) return;
    
    const template = projectTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    generateProjectMutation.mutate({
      template: selectedTemplate,
      name: projectName,
      description: projectDescription,
      requirements: customRequirements,
      operators: template.aiOperators
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating': return 'text-blue-400';
      case 'planning': return 'text-purple-400';
      case 'coding': return 'text-green-400';
      case 'testing': return 'text-yellow-400';
      case 'deploying': return 'text-orange-400';
      case 'completed': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-app': return Globe;
      case 'mobile-app': return Database;
      case 'blockchain': return Shield;
      case 'ai-model': return Bot;
      case 'api': return Network;
      case 'infrastructure': return Cpu;
      default: return Code;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <Wand2 className="w-10 h-10 text-purple-400" />
              <div className="absolute inset-0 bg-purple-400 blur-lg opacity-30"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI Project Generator
              </h1>
              <p className="text-slate-300">Autonomous project creation powered by neural networks</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Project Templates</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Choose a template for autonomous AI development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectTemplates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-purple-400 bg-purple-400/10'
                            : 'border-slate-600 hover:border-purple-500/50'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent className="w-6 h-6 text-purple-400 mt-1" />
                          <div className="flex-1">
                            <h3 className="text-slate-100 font-semibold">{template.name}</h3>
                            <p className="text-sm text-slate-400 mb-2">{template.description}</p>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {template.complexity}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                ~{template.estimatedHours}h
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {template.technologies.slice(0, 3).map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {template.technologies.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{template.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Project Configuration */}
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-purple-400" />
                      <span>Project Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="projectName" className="text-slate-200">Project Name</Label>
                      <Input
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Enter project name"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="projectDescription" className="text-slate-200">Description</Label>
                      <Textarea
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Describe your project requirements"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="requirements" className="text-slate-200">Custom Requirements</Label>
                      <Textarea
                        id="requirements"
                        value={customRequirements}
                        onChange={(e) => setCustomRequirements(e.target.value)}
                        placeholder="Any specific features or technical requirements"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleGenerateProject}
                      disabled={!projectName || generateProjectMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    >
                      {generateProjectMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Initializing AI Generation...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Rocket className="w-4 h-4" />
                          <span>Generate Project</span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Generation Status & History */}
          <div className="space-y-6">
            {/* Current Generation */}
            {currentGeneration && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span>Generation Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-slate-100 font-semibold">{currentGeneration.name}</h3>
                        <p className="text-sm text-slate-400">{currentGeneration.description}</p>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Progress</span>
                          <span className={`${getStatusColor(currentGeneration.status)} font-semibold`}>
                            {currentGeneration.status.toUpperCase()}
                          </span>
                        </div>
                        <Progress value={currentGeneration.progress} className="h-2" />
                        <p className="text-xs text-slate-500 mt-1">{currentGeneration.progress}% Complete</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-2">Assigned AI Operators:</p>
                        <div className="flex flex-wrap gap-1">
                          {currentGeneration.assignedOperators.map((operator) => (
                            <Badge key={operator} variant="outline" className="text-xs">
                              {operator}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {currentGeneration.status === 'completed' && (
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View Repository
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Live Demo
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Code
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* AI Operators Status */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center space-x-2">
                  <Network className="w-5 h-5 text-purple-400" />
                  <span>AI Operators</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.isArray(aiOperators) && aiOperators.map((operator: any) => (
                    <div key={operator.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-200 font-medium">{operator.name}</p>
                        <p className="text-xs text-slate-400">{operator.role}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Online</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            {generatedProjects.length > 0 && (
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center space-x-2">
                    <GitBranch className="w-5 h-5 text-purple-400" />
                    <span>Recent Projects</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="p-3 rounded border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm text-slate-200 font-medium">{project.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(project.status)}`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <Progress value={project.progress} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}