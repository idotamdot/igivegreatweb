import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NeuralAIDashboard from "@/components/NeuralAIDashboard";
import { QuantumRevenueEngine } from "@/components/QuantumRevenueEngine";
import { QuantumClientAcquisition } from "@/components/QuantumClientAcquisition";
import { NeuralThreatMatrix } from "@/components/NeuralThreatMatrix";
import { AutonomousProjectOrchestrator } from "@/components/AutonomousProjectOrchestrator";
import { QuantumFinancialForecasting } from "@/components/QuantumFinancialForecasting";
import { 
  Brain, 
  Shield, 
  DollarSign, 
  Users, 
  Rocket, 
  BarChart3,
  Activity,
  Zap,
  Globe,
  Cpu,
  Network,
  Eye
} from "lucide-react";

export default function NeuralCommandCenter() {
  const [systemStatus] = useState({
    aiOperators: 6,
    activeProjects: 12,
    monthlyRevenue: 125000,
    threatsBlocked: 3518,
    clientSatisfaction: 98.7,
    systemUptime: 99.97
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Neural Command Header */}
      <div className="border-b border-neon-blue/30 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-hologram rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold terminal-text text-white">
                  NEURAL WEB LABS
                </h1>
                <p className="terminal-text text-gray-400 text-sm">
                  Autonomous AI Command & Control Center
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-cyber-green terminal-text">
                SYSTEMS_ONLINE
              </Badge>
              <Badge className="bg-neon-blue terminal-text">
                QUANTUM_ACTIVE
              </Badge>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></div>
                <span className="terminal-text text-cyber-green text-sm">
                  {systemStatus.systemUptime}% UPTIME
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Overview Dashboard */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="card-hologram">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="terminal-text text-gray-400 text-xs">AI_OPERATORS</p>
                  <p className="terminal-text text-xl font-bold text-neon-blue">
                    {systemStatus.aiOperators}/6
                  </p>
                </div>
                <Cpu className="w-6 h-6 text-neon-blue neon-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hologram">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="terminal-text text-gray-400 text-xs">PROJECTS</p>
                  <p className="terminal-text text-xl font-bold text-hologram">
                    {systemStatus.activeProjects}
                  </p>
                </div>
                <Rocket className="w-6 h-6 text-hologram neon-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hologram">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="terminal-text text-gray-400 text-xs">REVENUE</p>
                  <p className="terminal-text text-xl font-bold text-cyber-green">
                    ${systemStatus.monthlyRevenue / 1000}K
                  </p>
                </div>
                <DollarSign className="w-6 h-6 text-cyber-green neon-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hologram">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="terminal-text text-gray-400 text-xs">THREATS</p>
                  <p className="terminal-text text-xl font-bold text-red-400">
                    {systemStatus.threatsBlocked}
                  </p>
                </div>
                <Shield className="w-6 h-6 text-red-400 neon-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hologram">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="terminal-text text-gray-400 text-xs">SATISFACTION</p>
                  <p className="terminal-text text-xl font-bold text-purple-400">
                    {systemStatus.clientSatisfaction}%
                  </p>
                </div>
                <Users className="w-6 h-6 text-purple-400 neon-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hologram">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="terminal-text text-gray-400 text-xs">NEURAL_STATUS</p>
                  <p className="terminal-text text-xl font-bold text-yellow-400">
                    OPTIMAL
                  </p>
                </div>
                <Activity className="w-6 h-6 text-yellow-400 neon-glow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Command Interface */}
        <Tabs defaultValue="neural-ai" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/50 border border-neon-blue/30 backdrop-blur-sm">
            <TabsTrigger value="neural-ai" className="terminal-text flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Neural AI</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="terminal-text flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="terminal-text flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="terminal-text flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="terminal-text flex items-center space-x-2">
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="terminal-text flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Finance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="neural-ai" className="mt-6">
            <Card className="card-hologram mb-4">
              <CardHeader>
                <CardTitle className="terminal-text text-white flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-neon-blue" />
                  <span>Neural AI Intelligence Center</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="terminal-text text-gray-400 mb-4">
                  Advanced autonomous intelligence systems managing all business operations with quantum-enhanced neural networks.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-neon-blue">94.7%</p>
                    <p className="terminal-text text-gray-400 text-sm">Neural Efficiency</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-cyber-green">2847</p>
                    <p className="terminal-text text-gray-400 text-sm">Tasks Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-hologram">99.8%</p>
                    <p className="terminal-text text-gray-400 text-sm">Network Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <NeuralAIDashboard />
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <Card className="card-hologram mb-4">
              <CardHeader>
                <CardTitle className="terminal-text text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-cyber-green" />
                  <span>Quantum Revenue Engine</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="terminal-text text-gray-400 mb-4">
                  Autonomous revenue generation with quantum-enhanced optimization algorithms driving exponential growth.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-cyber-green">$125K</p>
                    <p className="terminal-text text-gray-400 text-sm">Monthly Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-neon-blue">78.3%</p>
                    <p className="terminal-text text-gray-400 text-sm">Profit Margin</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-hologram">+34.7%</p>
                    <p className="terminal-text text-gray-400 text-sm">Growth Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <QuantumRevenueEngine />
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <Card className="card-hologram mb-4">
              <CardHeader>
                <CardTitle className="terminal-text text-white flex items-center space-x-2">
                  <Network className="w-5 h-5 text-hologram" />
                  <span>Quantum Client Acquisition</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="terminal-text text-gray-400 mb-4">
                  Neural pattern recognition for autonomous enterprise client acquisition with quantum signature matching.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-hologram">47</p>
                    <p className="terminal-text text-gray-400 text-sm">Active Clients</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-neon-blue">84.7%</p>
                    <p className="terminal-text text-gray-400 text-sm">Conversion Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-cyber-green">$2.65M</p>
                    <p className="terminal-text text-gray-400 text-sm">Avg Deal Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <QuantumClientAcquisition />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="card-hologram mb-4">
              <CardHeader>
                <CardTitle className="terminal-text text-white flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-red-400" />
                  <span>Neural Threat Matrix</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="terminal-text text-gray-400 mb-4">
                  Advanced autonomous cybersecurity with neural threat detection and quantum-encrypted defense protocols.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-red-400">3,518</p>
                    <p className="terminal-text text-gray-400 text-sm">Threats Blocked</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-cyber-green">99.7%</p>
                    <p className="terminal-text text-gray-400 text-sm">Detection Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-neon-blue">0.3s</p>
                    <p className="terminal-text text-gray-400 text-sm">Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <NeuralThreatMatrix />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Card className="card-hologram mb-4">
              <CardHeader>
                <CardTitle className="terminal-text text-white flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span>Autonomous Project Orchestrator</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="terminal-text text-gray-400 mb-4">
                  Complete autonomous software development lifecycle management from conception to deployment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-purple-400">12</p>
                    <p className="terminal-text text-gray-400 text-sm">Active Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-cyber-green">96.8%</p>
                    <p className="terminal-text text-gray-400 text-sm">Delivery Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-neon-blue">93.6%</p>
                    <p className="terminal-text text-gray-400 text-sm">Autonomy Level</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <AutonomousProjectOrchestrator />
          </TabsContent>

          <TabsContent value="forecasting" className="mt-6">
            <Card className="card-hologram mb-4">
              <CardHeader>
                <CardTitle className="terminal-text text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                  <span>Quantum Financial Forecasting</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="terminal-text text-gray-400 mb-4">
                  Neural network-powered financial predictions with quantum market analysis for optimal investment strategies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-yellow-400">$26.1M</p>
                    <p className="terminal-text text-gray-400 text-sm">Forecasted Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-cyan-400">92.3%</p>
                    <p className="terminal-text text-gray-400 text-sm">Prediction Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="terminal-text text-2xl font-bold text-green-400">$120M</p>
                    <p className="terminal-text text-gray-400 text-sm">Market Opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <QuantumFinancialForecasting />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}