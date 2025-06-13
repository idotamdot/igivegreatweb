import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, 
  GitBranch, 
  Server, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  Cloud,
  Database,
  Network,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Activity,
  Terminal,
  Globe,
  Cpu
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface DeploymentStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration: number;
  startTime?: string;
  completedTime?: string;
  logs: string[];
  aiOperator: string;
}

interface Deployment {
  id: string;
  projectName: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  status: 'queued' | 'deploying' | 'deployed' | 'failed' | 'rolled-back';
  progress: number;
  stages: DeploymentStage[];
  repository: string;
  deployedUrl?: string;
  aiOptimizations: string[];
  metrics: {
    buildTime: string;
    deployTime: string;
    testCoverage: number;
    performanceScore: number;
  };
}

interface InfrastructureNode {
  id: string;
  name: string;
  type: 'compute' | 'database' | 'load-balancer' | 'cdn' | 'storage';
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  network: number;
  location: string;
  uptime: string;
}

export default function DeploymentPipeline() {
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);
  const [infrastructureMetrics, setInfrastructureMetrics] = useState<any>({});

  const { data: deployments = [], refetch: refetchDeployments } = useQuery<Deployment[]>({
    queryKey: ['/api/deployments'],
    refetchInterval: 3000,
  });

  const { data: infrastructure = [] } = useQuery<InfrastructureNode[]>({
    queryKey: ['/api/infrastructure/nodes'],
    refetchInterval: 5000,
  });

  useEffect(() => {
    // Simulate real-time infrastructure metrics
    const interval = setInterval(() => {
      setInfrastructureMetrics({
        totalRequests: Math.floor(Math.random() * 1000) + 5000,
        responseTime: Math.floor(Math.random() * 50) + 120,
        errorRate: Math.random() * 0.5,
        bandwidth: Math.floor(Math.random() * 500) + 800,
        activeConnections: Math.floor(Math.random() * 200) + 300,
        cacheHitRate: 85 + Math.random() * 15,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const triggerDeploymentMutation = useMutation({
    mutationFn: async (deploymentData: any) => {
      const response = await fetch('/api/deployments/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deploymentData),
      });
      if (!response.ok) throw new Error('Deployment failed');
      return response.json();
    },
    onSuccess: () => {
      refetchDeployments();
    },
  });

  // Mock deployment data
  const mockDeployments: Deployment[] = [
    {
      id: 'deploy-001',
      projectName: 'Neural E-commerce Platform',
      version: 'v2.1.3',
      environment: 'production',
      status: 'deployed',
      progress: 100,
      repository: 'neural-web-labs/ecommerce-platform',
      deployedUrl: 'https://shop.neural-labs.app',
      aiOptimizations: ['Auto-scaling enabled', 'Performance tuning', 'Security hardening'],
      stages: [
        {
          id: 'build',
          name: 'Build & Test',
          status: 'completed',
          duration: 180,
          aiOperator: 'ARIA-7',
          logs: ['✓ Dependencies installed', '✓ Tests passed (98% coverage)', '✓ Build optimized']
        },
        {
          id: 'security',
          name: 'Security Scan',
          status: 'completed',
          duration: 45,
          aiOperator: 'NEXUS-3',
          logs: ['✓ No vulnerabilities detected', '✓ Security headers configured', '✓ SSL certificates valid']
        },
        {
          id: 'deploy',
          name: 'Deploy to Production',
          status: 'completed',
          duration: 120,
          aiOperator: 'VORTEX-1',
          logs: ['✓ Blue-green deployment initiated', '✓ Health checks passed', '✓ Traffic switched']
        }
      ],
      metrics: {
        buildTime: '3m 15s',
        deployTime: '8m 45s',
        testCoverage: 98,
        performanceScore: 94
      }
    },
    {
      id: 'deploy-002',
      projectName: 'AI Chatbot Service',
      version: 'v1.4.2',
      environment: 'staging',
      status: 'deploying',
      progress: 67,
      repository: 'neural-web-labs/ai-chatbot',
      aiOptimizations: ['Model optimization', 'Response caching'],
      stages: [
        {
          id: 'build',
          name: 'Build & Test',
          status: 'completed',
          duration: 95,
          aiOperator: 'ARIA-7',
          logs: ['✓ ML models compiled', '✓ Integration tests passed']
        },
        {
          id: 'security',
          name: 'Security Scan',
          status: 'running',
          duration: 0,
          aiOperator: 'NEXUS-3',
          logs: ['→ Scanning dependencies...', '→ Analyzing API endpoints...']
        },
        {
          id: 'deploy',
          name: 'Deploy to Staging',
          status: 'pending',
          duration: 0,
          aiOperator: 'VORTEX-1',
          logs: []
        }
      ],
      metrics: {
        buildTime: '1m 35s',
        deployTime: 'In progress',
        testCoverage: 94,
        performanceScore: 0
      }
    }
  ];

  const mockInfrastructure: InfrastructureNode[] = [
    {
      id: 'node-001',
      name: 'Production Web Server',
      type: 'compute',
      status: 'healthy',
      cpu: 45,
      memory: 68,
      network: 23,
      location: 'US-East-1',
      uptime: '99.97%'
    },
    {
      id: 'node-002',
      name: 'Database Cluster',
      type: 'database',
      status: 'healthy',
      cpu: 32,
      memory: 78,
      network: 15,
      location: 'US-East-1',
      uptime: '99.99%'
    },
    {
      id: 'node-003',
      name: 'Load Balancer',
      type: 'load-balancer',
      status: 'warning',
      cpu: 78,
      memory: 45,
      network: 67,
      location: 'US-East-1',
      uptime: '99.95%'
    },
    {
      id: 'node-004',
      name: 'CDN Edge',
      type: 'cdn',
      status: 'healthy',
      cpu: 12,
      memory: 25,
      network: 89,
      location: 'Global',
      uptime: '99.98%'
    }
  ];

  const data = deployments.length > 0 ? deployments : mockDeployments;
  const infraData = infrastructure.length > 0 ? infrastructure : mockInfrastructure;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'text-green-400';
      case 'deploying': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      case 'queued': return 'text-yellow-400';
      case 'rolled-back': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'running': return <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'compute': return Server;
      case 'database': return Database;
      case 'load-balancer': return Network;
      case 'cdn': return Globe;
      case 'storage': return Cpu;
      default: return Server;
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Rocket className="w-10 h-10 text-purple-400" />
                <div className="absolute inset-0 bg-purple-400 blur-lg opacity-30"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Deployment Pipeline
                </h1>
                <p className="text-slate-300">Autonomous deployment and infrastructure management</p>
              </div>
            </div>
            <Button
              onClick={() => triggerDeploymentMutation.mutate({ type: 'auto-deploy' })}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Deploy Latest
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="deployments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="deployments">Active Deployments</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="deployments" className="space-y-6">
            <div className="grid gap-6">
              {data.map((deployment, index) => (
                <motion.div
                  key={deployment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`bg-slate-800/50 border-purple-500/30 cursor-pointer transition-all hover:border-purple-400/50 ${
                      selectedDeployment === deployment.id ? 'border-purple-400 shadow-lg shadow-purple-400/20' : ''
                    }`}
                    onClick={() => setSelectedDeployment(selectedDeployment === deployment.id ? null : deployment.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <GitBranch className="w-6 h-6 text-purple-400" />
                          <div>
                            <CardTitle className="text-slate-100">{deployment.projectName}</CardTitle>
                            <CardDescription className="text-slate-300">
                              {deployment.version} → {deployment.environment}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStatusColor(deployment.status)}>
                            {deployment.status.toUpperCase()}
                          </Badge>
                          {deployment.deployedUrl && (
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Deployment Progress</span>
                            <span className="text-slate-300">{deployment.progress}%</span>
                          </div>
                          <Progress value={deployment.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Build Time: </span>
                            <span className="text-green-400">{deployment.metrics.buildTime}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Deploy Time: </span>
                            <span className="text-blue-400">{deployment.metrics.deployTime}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Test Coverage: </span>
                            <span className="text-purple-400">{deployment.metrics.testCoverage}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Performance: </span>
                            <span className="text-cyan-400">{deployment.metrics.performanceScore || 'TBD'}</span>
                          </div>
                        </div>

                        <AnimatePresence>
                          {selectedDeployment === deployment.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-slate-600"
                            >
                              <div className="space-y-4">
                                {/* Deployment Stages */}
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-200 mb-3">Pipeline Stages</h4>
                                  <div className="space-y-3">
                                    {deployment.stages.map((stage) => (
                                      <div key={stage.id} className="flex items-start space-x-3">
                                        {getStageStatusIcon(stage.status)}
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-200">{stage.name}</span>
                                            <div className="flex items-center space-x-2 text-xs text-slate-400">
                                              <span>AI: {stage.aiOperator}</span>
                                              {stage.duration > 0 && <span>{stage.duration}s</span>}
                                            </div>
                                          </div>
                                          {stage.logs.length > 0 && (
                                            <div className="mt-1 text-xs space-y-1">
                                              {stage.logs.map((log, i) => (
                                                <div key={i} className="text-slate-400 font-mono">{log}</div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* AI Optimizations */}
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-200 mb-2">AI Optimizations</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {deployment.aiOptimizations.map((opt, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {opt}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Terminal className="w-4 h-4 mr-1" />
                                    Logs
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <RotateCcw className="w-4 h-4 mr-1" />
                                    Rollback
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Settings className="w-4 h-4 mr-1" />
                                    Configure
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {infraData.map((node, index) => {
                const IconComponent = getNodeTypeIcon(node.type);
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 border-purple-500/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-purple-400" />
                            <div>
                              <CardTitle className="text-slate-100 text-sm">{node.name}</CardTitle>
                              <CardDescription className="text-slate-400 text-xs">
                                {node.location} • {node.uptime}
                              </CardDescription>
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${getNodeStatusColor(node.status)}`}></div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">CPU</span>
                              <span className="text-slate-300">{node.cpu}%</span>
                            </div>
                            <Progress value={node.cpu} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">Memory</span>
                              <span className="text-slate-300">{node.memory}%</span>
                            </div>
                            <Progress value={node.memory} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">Network</span>
                              <span className="text-slate-300">{node.network}%</span>
                            </div>
                            <Progress value={node.network} className="h-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-slate-300">Total Requests</p>
                      <p className="text-lg font-bold text-green-400">
                        {infrastructureMetrics.totalRequests?.toLocaleString() || '5,247'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-slate-300">Response Time</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {infrastructureMetrics.responseTime || 145}ms
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-slate-300">Error Rate</p>
                      <p className="text-lg font-bold text-blue-400">
                        {(infrastructureMetrics.errorRate || 0.03).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Network className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-slate-300">Bandwidth</p>
                      <p className="text-lg font-bold text-cyan-400">
                        {infrastructureMetrics.bandwidth || 847} MB/s
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-slate-300">Active Connections</p>
                      <p className="text-lg font-bold text-purple-400">
                        {infrastructureMetrics.activeConnections || 324}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-slate-300">Cache Hit Rate</p>
                      <p className="text-lg font-bold text-emerald-400">
                        {(infrastructureMetrics.cacheHitRate || 92.3).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}