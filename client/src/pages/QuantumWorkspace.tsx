import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Network, 
  Activity, 
  Code, 
  Database, 
  Shield, 
  Rocket,
  Eye,
  Sparkles,
  GitBranch,
  Cloud,
  Globe
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface QuantumTask {
  id: string;
  title: string;
  description: string;
  operator: string;
  status: 'queued' | 'processing' | 'completed' | 'optimizing';
  progress: number;
  quantumEfficiency: number;
  neuralComplexity: number;
  estimatedCompletion: string;
  type: 'development' | 'analysis' | 'security' | 'optimization';
}

interface QuantumEnvironment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production' | 'quantum';
  status: 'active' | 'standby' | 'syncing';
  aiOperators: number;
  computeUnits: number;
  neuralLoad: number;
}

export default function QuantumWorkspace() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [quantumField, setQuantumField] = useState(0);
  const [neuralActivity, setNeuralActivity] = useState<Array<{x: number, y: number, intensity: number}>>([]);

  const { data: aiOperators = [] } = useQuery<any[]>({
    queryKey: ['/api/ai-operators'],
    refetchInterval: 5000,
  });

  useEffect(() => {
    // Animate quantum field fluctuations
    const interval = setInterval(() => {
      setQuantumField(prev => (prev + 1) % 360);
      
      // Generate neural activity points
      setNeuralActivity(prev => {
        const newActivity = Array.from({ length: 15 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          intensity: Math.random(),
        }));
        return newActivity;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const quantumTasks: QuantumTask[] = [
    {
      id: 'qt-001',
      title: 'Neural E-commerce Platform',
      description: 'Building quantum-enhanced shopping experience with AI product recommendations',
      operator: 'ARIA-7',
      status: 'processing',
      progress: 73,
      quantumEfficiency: 0.94,
      neuralComplexity: 8.2,
      estimatedCompletion: '2.3 hours',
      type: 'development'
    },
    {
      id: 'qt-002',
      title: 'Blockchain Security Audit',
      description: 'Analyzing smart contract vulnerabilities with quantum cryptography',
      operator: 'NEXUS-3',
      status: 'processing',
      progress: 45,
      quantumEfficiency: 0.97,
      neuralComplexity: 9.1,
      estimatedCompletion: '4.7 hours',
      type: 'security'
    },
    {
      id: 'qt-003',
      title: 'Market Sentiment Analysis',
      description: 'Real-time crypto market analysis using quantum prediction algorithms',
      operator: 'PULSE-4',
      status: 'completed',
      progress: 100,
      quantumEfficiency: 0.99,
      neuralComplexity: 7.8,
      estimatedCompletion: 'Completed',
      type: 'analysis'
    },
    {
      id: 'qt-004',
      title: 'Infrastructure Optimization',
      description: 'Quantum load balancing and auto-scaling optimization',
      operator: 'VORTEX-1',
      status: 'queued',
      progress: 12,
      quantumEfficiency: 0.91,
      neuralComplexity: 6.5,
      estimatedCompletion: '1.8 hours',
      type: 'optimization'
    }
  ];

  const quantumEnvironments: QuantumEnvironment[] = [
    {
      id: 'qe-001',
      name: 'Development Nexus',
      type: 'development',
      status: 'active',
      aiOperators: 3,
      computeUnits: 847,
      neuralLoad: 0.67
    },
    {
      id: 'qe-002',
      name: 'Staging Matrix',
      type: 'staging',
      status: 'standby',
      aiOperators: 2,
      computeUnits: 524,
      neuralLoad: 0.34
    },
    {
      id: 'qe-003',
      name: 'Production Grid',
      type: 'production',
      status: 'active',
      aiOperators: 6,
      computeUnits: 1247,
      neuralLoad: 0.89
    },
    {
      id: 'qe-004',
      name: 'Quantum Core',
      type: 'quantum',
      status: 'syncing',
      aiOperators: 6,
      computeUnits: 2048,
      neuralLoad: 0.95
    }
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'development': return Code;
      case 'analysis': return Brain;
      case 'security': return Shield;
      case 'optimization': return Zap;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-blue-400';
      case 'queued': return 'text-yellow-400';
      case 'optimizing': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getEnvironmentStatus = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'syncing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Quantum Field Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, 
              hsl(${quantumField}, 70%, 50%) 0%, 
              transparent 50%)`,
            transform: `rotate(${quantumField}deg) scale(1.5)`,
          }}
        />
        
        {/* Neural Activity Visualization */}
        {neuralActivity.map((point, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              opacity: point.intensity * 0.6,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [point.intensity * 0.6, point.intensity * 0.9, point.intensity * 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <Brain className="w-10 h-10 text-purple-400" />
              <div className="absolute inset-0 bg-purple-400 blur-lg opacity-30"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Quantum Workspace
              </h1>
              <p className="text-slate-300">Neural Web Labs AI Operations Center</p>
            </div>
          </div>

          {/* Quantum Status Bar */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-slate-300">Neural Activity</p>
                    <p className="text-lg font-bold text-green-400">97.3%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-300">Quantum Efficiency</p>
                    <p className="text-lg font-bold text-blue-400">94.7%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Network className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-slate-300">AI Operators</p>
                    <p className="text-lg font-bold text-purple-400">{Array.isArray(aiOperators) ? aiOperators.length : 0}/6</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-slate-300">Power Level</p>
                    <p className="text-lg font-bold text-yellow-400">99.1%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="tasks">Quantum Tasks</TabsTrigger>
            <TabsTrigger value="environments">Environments</TabsTrigger>
            <TabsTrigger value="monitoring">Neural Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid gap-6">
              {quantumTasks.map((task, index) => {
                const TaskIcon = getTaskIcon(task.type);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`bg-slate-800/50 border-purple-500/30 cursor-pointer transition-all hover:border-purple-400/50 ${
                        selectedTask === task.id ? 'border-purple-400 shadow-lg shadow-purple-400/20' : ''
                      }`}
                      onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <TaskIcon className="w-6 h-6 text-purple-400" />
                              <div className="absolute inset-0 bg-purple-400 blur-md opacity-30"></div>
                            </div>
                            <div>
                              <CardTitle className="text-slate-100">{task.title}</CardTitle>
                              <CardDescription className="text-slate-300">
                                Operator: {task.operator} • {task.estimatedCompletion}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-slate-300 mb-4">{task.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-slate-300">{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-2" />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Quantum Efficiency: </span>
                              <span className="text-green-400">{(task.quantumEfficiency * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Neural Complexity: </span>
                              <span className="text-purple-400">{task.neuralComplexity}/10</span>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {selectedTask === task.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-slate-600"
                            >
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Monitor
                                </Button>
                                <Button size="sm" variant="outline">
                                  <GitBranch className="w-4 h-4 mr-2" />
                                  Fork Task
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Optimize
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="environments" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {quantumEnvironments.map((env, index) => (
                <motion.div
                  key={env.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-purple-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getEnvironmentStatus(env.status)}`}></div>
                            <Cloud className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <CardTitle className="text-slate-100">{env.name}</CardTitle>
                            <CardDescription className="text-slate-400">
                              {env.type.charAt(0).toUpperCase() + env.type.slice(1)} Environment
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-slate-300">
                          {env.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">AI Operators</p>
                            <p className="text-lg font-bold text-purple-400">{env.aiOperators}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Compute Units</p>
                            <p className="text-lg font-bold text-blue-400">{env.computeUnits}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Neural Load</p>
                            <p className="text-lg font-bold text-green-400">{(env.neuralLoad * 100).toFixed(0)}%</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Resource Utilization</span>
                            <span className="text-slate-300">{(env.neuralLoad * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={env.neuralLoad * 100} className="h-2" />
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Globe className="w-4 h-4 mr-2" />
                            Access
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Rocket className="w-4 h-4 mr-2" />
                            Deploy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {Array.isArray(aiOperators) && aiOperators.map((operator: any, index: number) => (
                <motion.div
                  key={operator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-purple-500/30">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Brain className="w-6 h-6 text-purple-400" />
                          <div className="absolute inset-0 bg-purple-400 blur-md opacity-30"></div>
                        </div>
                        <div>
                          <CardTitle className="text-slate-100">{operator.name}</CardTitle>
                          <CardDescription className="text-slate-300">{operator.role}</CardDescription>
                        </div>
                        <div className="ml-auto">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Efficiency</p>
                            <p className="text-lg font-bold text-green-400">{(parseFloat(operator.efficiencyRating) * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Tasks Completed</p>
                            <p className="text-lg font-bold text-blue-400">{operator.tasksCompleted}</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Neural Activity</span>
                            <span className="text-slate-300">{(parseFloat(operator.efficiencyRating) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={parseFloat(operator.efficiencyRating) * 100} className="h-2" />
                        </div>

                        <div className="text-xs text-slate-400">
                          Network: {operator.neuralNetworkType}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}