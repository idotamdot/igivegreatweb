import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Brain, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  Code,
  Database,
  Cpu,
  Network,
  BarChart3,
  PieChart,
  LineChart,
  Timer,
  Target,
  Sparkles
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AnalyticsData {
  performance: {
    totalProjects: number;
    completedProjects: number;
    activeProjects: number;
    averageCompletionTime: string;
    successRate: number;
    neuralEfficiency: number;
  };
  realTime: {
    currentOperations: number;
    quantumProcessing: number;
    networkLatency: number;
    powerConsumption: number;
    dataProcessed: string;
    requestsPerSecond: number;
  };
  operators: Array<{
    id: string;
    name: string;
    role: string;
    efficiency: number;
    tasksCompleted: number;
    currentTask: string;
    neuralLoad: number;
  }>;
  trends: {
    projectGeneration: Array<{
      date: string;
      count: number;
      type: string;
    }>;
    performance: Array<{
      timestamp: string;
      efficiency: number;
      throughput: number;
    }>;
  };
}

export default function NeuralAnalytics() {
  const [realtimeData, setRealtimeData] = useState<any>({});
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  const { data: analyticsData, refetch } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/neural'],
    refetchInterval: 2000,
  });

  const { data: aiOperators = [] } = useQuery<any[]>({
    queryKey: ['/api/ai-operators'],
    refetchInterval: 5000,
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealtimeData({
        cpuUsage: Math.random() * 30 + 70,
        memoryUsage: Math.random() * 20 + 60,
        networkThroughput: Math.random() * 1000 + 500,
        activeConnections: Math.floor(Math.random() * 50) + 150,
        quantumField: Math.random() * 100,
        neuralActivity: Math.random() * 100,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Mock analytics data while endpoint is being implemented
  const mockAnalytics: AnalyticsData = {
    performance: {
      totalProjects: 147,
      completedProjects: 134,
      activeProjects: 13,
      averageCompletionTime: "3.2 hours",
      successRate: 97.3,
      neuralEfficiency: 94.7
    },
    realTime: {
      currentOperations: 23,
      quantumProcessing: 89.4,
      networkLatency: 12,
      powerConsumption: 847,
      dataProcessed: "2.4 TB",
      requestsPerSecond: 1247
    },
    operators: Array.isArray(aiOperators) ? aiOperators.map((op: any) => ({
      id: op.id,
      name: op.name,
      role: op.role,
      efficiency: parseFloat(op.efficiencyRating) * 100,
      tasksCompleted: op.tasksCompleted,
      currentTask: `Processing ${op.name.split('-')[0]} operations`,
      neuralLoad: Math.random() * 40 + 60
    })) : [],
    trends: {
      projectGeneration: [
        { date: '2024-01', count: 23, type: 'web-app' },
        { date: '2024-02', count: 31, type: 'web-app' },
        { date: '2024-03', count: 28, type: 'blockchain' },
        { date: '2024-04', count: 34, type: 'ai-model' },
        { date: '2024-05', count: 41, type: 'web-app' },
        { date: '2024-06', count: 38, type: 'mobile-app' }
      ],
      performance: [
        { timestamp: '00:00', efficiency: 89, throughput: 1100 },
        { timestamp: '04:00', efficiency: 94, throughput: 1250 },
        { timestamp: '08:00', efficiency: 97, throughput: 1350 },
        { timestamp: '12:00', efficiency: 95, throughput: 1400 },
        { timestamp: '16:00', efficiency: 98, throughput: 1300 },
        { timestamp: '20:00', efficiency: 96, throughput: 1247 }
      ]
    }
  };

  const data = analyticsData || mockAnalytics;

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
    <Card className="bg-slate-800/50 border-purple-500/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          <div className="relative">
            <Icon className={`w-8 h-8 ${color.replace('text-', 'text-').replace('400', '300')}`} />
            <div className={`absolute inset-0 ${color.replace('text-', 'bg-').replace('400', '300')} blur-lg opacity-20`}></div>
          </div>
        </div>
        {trend && (
          <div className="mt-4">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+{trend}% vs last period</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <BarChart3 className="w-10 h-10 text-purple-400" />
              <div className="absolute inset-0 bg-purple-400 blur-lg opacity-30"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Neural Analytics
              </h1>
              <p className="text-slate-300">Real-time AI performance and quantum metrics</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="operators">AI Operators</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Projects"
                value={data.performance.totalProjects}
                subtitle="Lifetime generated"
                icon={Code}
                color="text-purple-400"
                trend={12.3}
              />
              <MetricCard
                title="Success Rate"
                value={`${data.performance.successRate}%`}
                subtitle="Project completion"
                icon={Target}
                color="text-green-400"
                trend={2.1}
              />
              <MetricCard
                title="Neural Efficiency"
                value={`${data.performance.neuralEfficiency}%`}
                subtitle="AI optimization"
                icon={Brain}
                color="text-cyan-400"
                trend={5.7}
              />
              <MetricCard
                title="Active Operations"
                value={data.realTime.currentOperations}
                subtitle="Real-time processing"
                icon={Activity}
                color="text-yellow-400"
              />
            </div>

            {/* Real-time Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>System Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">CPU Usage</span>
                      <span className="text-slate-300">{realtimeData.cpuUsage?.toFixed(1)}%</span>
                    </div>
                    <Progress value={realtimeData.cpuUsage || 75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Memory Usage</span>
                      <span className="text-slate-300">{realtimeData.memoryUsage?.toFixed(1)}%</span>
                    </div>
                    <Progress value={realtimeData.memoryUsage || 65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Quantum Field</span>
                      <span className="text-slate-300">{realtimeData.quantumField?.toFixed(1)}%</span>
                    </div>
                    <Progress value={realtimeData.quantumField || 89} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Neural Activity</span>
                      <span className="text-slate-300">{realtimeData.neuralActivity?.toFixed(1)}%</span>
                    </div>
                    <Progress value={realtimeData.neuralActivity || 94} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center space-x-2">
                    <Network className="w-5 h-5 text-cyan-400" />
                    <span>Network Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Throughput</p>
                      <p className="text-lg font-bold text-cyan-400">
                        {realtimeData.networkThroughput?.toFixed(0) || 750} MB/s
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Connections</p>
                      <p className="text-lg font-bold text-green-400">
                        {realtimeData.activeConnections || 180}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Latency</p>
                      <p className="text-lg font-bold text-yellow-400">{data.realTime.networkLatency}ms</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Requests/sec</p>
                      <p className="text-lg font-bold text-purple-400">{data.realTime.requestsPerSecond}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Status Overview */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-purple-400" />
                  <span>Project Status Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{data.performance.completedProjects}</p>
                    <p className="text-sm text-slate-400">Completed</p>
                    <Progress value={(data.performance.completedProjects / data.performance.totalProjects) * 100} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{data.performance.activeProjects}</p>
                    <p className="text-sm text-slate-400">Active</p>
                    <Progress value={(data.performance.activeProjects / data.performance.totalProjects) * 100} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{data.performance.totalProjects}</p>
                    <p className="text-sm text-slate-400">Total</p>
                    <Progress value={100} className="h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center space-x-2">
                    <LineChart className="w-5 h-5 text-green-400" />
                    <span>Efficiency Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.trends.performance.map((point, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">{point.timestamp}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={point.efficiency} className="w-24 h-2" />
                          <span className="text-sm text-green-400">{point.efficiency}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center space-x-2">
                    <Timer className="w-5 h-5 text-blue-400" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Average Completion Time</p>
                      <p className="text-xl font-bold text-blue-400">{data.performance.averageCompletionTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Data Processed Today</p>
                      <p className="text-xl font-bold text-cyan-400">{data.realTime.dataProcessed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Power Consumption</p>
                      <p className="text-xl font-bold text-yellow-400">{data.realTime.powerConsumption}W</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operators" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.operators.map((operator) => (
                <motion.div
                  key={operator.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-slate-800/50 border-purple-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Brain className="w-6 h-6 text-purple-400" />
                          <div>
                            <CardTitle className="text-slate-100">{operator.name}</CardTitle>
                            <CardDescription className="text-slate-400">{operator.role}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-400">
                          ACTIVE
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Efficiency</span>
                            <span className="text-slate-300">{operator.efficiency.toFixed(1)}%</span>
                          </div>
                          <Progress value={operator.efficiency} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Neural Load</span>
                            <span className="text-slate-300">{operator.neuralLoad.toFixed(1)}%</span>
                          </div>
                          <Progress value={operator.neuralLoad} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Tasks Completed</p>
                            <p className="text-lg font-bold text-cyan-400">{operator.tasksCompleted}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Current Task</p>
                            <p className="text-xs text-green-400">{operator.currentTask}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Project Generation Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.trends.projectGeneration.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-300">{trend.date}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {trend.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={(trend.count / 50) * 100} className="w-32 h-2" />
                        <span className="text-sm text-purple-400">{trend.count} projects</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}