import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Cpu, 
  Activity, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Network
} from "lucide-react";

interface AIOperator {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'processing' | 'maintenance';
  efficiency: number;
  tasksCompleted: number;
  neuralNetworkType: string;
  currentTask: string;
}

interface NeuralMetric {
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'optimal' | 'warning' | 'critical';
}

export default function NeuralAIDashboard() {
  const [aiOperators, setAiOperators] = useState<AIOperator[]>([]);
  const [neuralMetrics, setNeuralMetrics] = useState<NeuralMetric[]>([]);
  const [systemLoad, setSystemLoad] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    // Initialize AI operators
    const operators: AIOperator[] = [
      {
        id: 'aria-7',
        name: 'ARIA-7',
        role: 'Quantum Code Generation',
        status: 'active',
        efficiency: 94.7,
        tasksCompleted: 847,
        neuralNetworkType: 'Transformer-GPT-Quantum',
        currentTask: 'Building Quantum Trading Platform'
      },
      {
        id: 'cipher-9',
        name: 'CIPHER-9',
        role: 'Cybersecurity Intelligence',
        status: 'processing',
        efficiency: 98.2,
        tasksCompleted: 1247,
        neuralNetworkType: 'Adversarial Defense Network',
        currentTask: 'Threat Vector Analysis'
      },
      {
        id: 'nexus-3',
        name: 'NEXUS-3',
        role: 'Data Analytics & AI/ML',
        status: 'active',
        efficiency: 91.8,
        tasksCompleted: 623,
        neuralNetworkType: 'Recurrent Neural Network',
        currentTask: 'Biotech Data Processing'
      },
      {
        id: 'vortex-1',
        name: 'VORTEX-1',
        role: 'High-Performance Computing',
        status: 'active',
        efficiency: 96.4,
        tasksCompleted: 456,
        neuralNetworkType: 'Convolutional Neural Network',
        currentTask: 'Aerospace Simulation Engine'
      },
      {
        id: 'echo-5',
        name: 'ECHO-5',
        role: 'Client Acquisition & CRM',
        status: 'processing',
        efficiency: 89.3,
        tasksCompleted: 734,
        neuralNetworkType: 'Graph Neural Network',
        currentTask: 'Lead Qualification Analysis'
      },
      {
        id: 'pulse-4',
        name: 'PULSE-4',
        role: 'Financial Optimization',
        status: 'idle',
        efficiency: 92.7,
        tasksCompleted: 512,
        neuralNetworkType: 'Long Short-Term Memory',
        currentTask: 'Market Sentiment Analysis'
      }
    ];

    const metrics: NeuralMetric[] = [
      { name: 'Neural Efficiency', value: 94.2, target: 95.0, trend: 'up', status: 'optimal' },
      { name: 'Task Completion Rate', value: 98.7, target: 99.0, trend: 'up', status: 'optimal' },
      { name: 'System Uptime', value: 99.97, target: 99.99, trend: 'stable', status: 'optimal' },
      { name: 'Learning Acceleration', value: 87.4, target: 90.0, trend: 'up', status: 'warning' },
      { name: 'Resource Optimization', value: 96.8, target: 97.0, trend: 'up', status: 'optimal' },
      { name: 'Error Rate', value: 0.03, target: 0.01, trend: 'down', status: 'warning' }
    ];

    setAiOperators(operators);
    setNeuralMetrics(metrics);
    setSystemLoad(73.4);
    setTotalTasks(operators.reduce((sum, op) => sum + op.tasksCompleted, 0));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-cyber-green';
      case 'processing': return 'bg-neon-blue';
      case 'idle': return 'bg-yellow-600';
      case 'maintenance': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Activity className="w-4 h-4" />;
      case 'idle': return <Brain className="w-4 h-4" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-cyber-green" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      case 'stable': return <Activity className="w-4 h-4 text-gray-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-cyber-green';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Neural System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="terminal-text text-gray-400 text-sm">SYSTEM_LOAD</h3>
              <Network className="w-5 h-5 text-neon-blue" />
            </div>
            <p className="terminal-text text-2xl font-bold text-neon-blue mb-2">
              {systemLoad}%
            </p>
            <Progress value={systemLoad} className="h-2" />
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="terminal-text text-gray-400 text-sm">ACTIVE_OPERATORS</h3>
              <Brain className="w-5 h-5 text-cyber-green" />
            </div>
            <p className="terminal-text text-2xl font-bold text-cyber-green">
              {aiOperators.filter(op => op.status === 'active' || op.status === 'processing').length}/6
            </p>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="terminal-text text-gray-400 text-sm">TASKS_COMPLETED</h3>
              <Zap className="w-5 h-5 text-hologram" />
            </div>
            <p className="terminal-text text-2xl font-bold text-hologram">
              {totalTasks.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Operators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiOperators.map((operator) => (
          <Card key={operator.id} className="card-hologram">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="terminal-text text-white text-lg">
                  {operator.name}
                </CardTitle>
                <Badge className={`${getStatusColor(operator.status)} terminal-text flex items-center space-x-1`}>
                  {getStatusIcon(operator.status)}
                  <span>{operator.status.toUpperCase()}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="terminal-text text-gray-400 text-sm">ROLE</p>
                  <p className="terminal-text text-sm text-gray-300">{operator.role}</p>
                </div>
                
                <div>
                  <p className="terminal-text text-gray-400 text-sm">NEURAL_NETWORK</p>
                  <p className="terminal-text text-xs text-neon-blue">{operator.neuralNetworkType}</p>
                </div>
                
                <div>
                  <p className="terminal-text text-gray-400 text-sm">CURRENT_TASK</p>
                  <p className="terminal-text text-xs text-gray-300">{operator.currentTask}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="terminal-text text-gray-400 text-sm">EFFICIENCY</p>
                    <p className="terminal-text text-lg font-bold text-cyber-green">
                      {operator.efficiency}%
                    </p>
                  </div>
                  <div>
                    <p className="terminal-text text-gray-400 text-sm">TASKS</p>
                    <p className="terminal-text text-lg font-bold text-hologram">
                      {operator.tasksCompleted}
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                    <span>Performance</span>
                    <span>{operator.efficiency}%</span>
                  </div>
                  <Progress value={operator.efficiency} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Neural Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {neuralMetrics.map((metric, index) => (
          <Card key={index} className="card-hologram">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="terminal-text text-gray-400 text-sm">
                    {metric.name.toUpperCase()}
                  </p>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`terminal-text text-xs ${getMetricStatusColor(metric.status)}`}>
                      {metric.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="terminal-text text-2xl font-bold text-cyber-green">
                    {metric.name === 'Error Rate' ? `${metric.value}%` : `${metric.value}%`}
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                    <span>Target</span>
                    <span>{metric.name === 'Error Rate' ? `${metric.target}%` : `${metric.target}%`}</span>
                  </div>
                  <Progress 
                    value={metric.name === 'Error Rate' ? 
                      Math.max(0, 100 - (metric.value / metric.target) * 100) : 
                      (metric.value / metric.target) * 100
                    } 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}