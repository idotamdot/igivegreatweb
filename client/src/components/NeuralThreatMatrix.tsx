import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  Zap, 
  Eye, 
  Brain, 
  Lock,
  Activity,
  Server,
  Network,
  Skull,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface ThreatVector {
  id: string;
  type: 'malware' | 'intrusion' | 'ddos' | 'phishing' | 'ransomware' | 'zero-day';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  status: 'detected' | 'analyzing' | 'neutralizing' | 'contained' | 'eliminated';
  aiOperator: string;
  detectionTime: string;
  neuralConfidence: number;
  clientName: string;
  mitigationActions: string[];
}

interface DefenseMetric {
  name: string;
  value: number;
  max: number;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ClientShield {
  clientName: string;
  infrastructure: string;
  shieldStrength: number;
  threatsBlocked: number;
  uptime: number;
  lastScan: string;
}

export function NeuralThreatMatrix() {
  const [threatVectors, setThreatVectors] = useState<ThreatVector[]>([]);
  const [defenseMetrics, setDefenseMetrics] = useState<DefenseMetric[]>([]);
  const [clientShields, setClientShields] = useState<ClientShield[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [totalThreatsBlocked, setTotalThreatsBlocked] = useState(0);
  const [systemStatus, setSystemStatus] = useState<'secure' | 'monitoring' | 'active-threat'>('secure');

  useEffect(() => {
    // Initialize threat detection system
    const threats: ThreatVector[] = [
      {
        id: 'tv-001',
        type: 'zero-day',
        severity: 'critical',
        source: '203.45.67.89',
        target: 'Nexus Financial Corp - Database Cluster',
        status: 'neutralizing',
        aiOperator: 'CIPHER-9',
        detectionTime: '2025-06-13T08:15:32Z',
        neuralConfidence: 97.8,
        clientName: 'Nexus Financial Corp',
        mitigationActions: ['Isolate affected systems', 'Deploy counter-exploit', 'Patch vulnerability']
      },
      {
        id: 'tv-002',
        type: 'ddos',
        severity: 'high',
        source: 'Botnet-Alpha-7',
        target: 'Quantum Aerospace Corp - Web Services',
        status: 'contained',
        aiOperator: 'VORTEX-1',
        detectionTime: '2025-06-13T07:42:18Z',
        neuralConfidence: 94.2,
        clientName: 'Quantum Aerospace Corp',
        mitigationActions: ['Traffic filtering activated', 'Load balancing optimized', 'Rate limiting enforced']
      },
      {
        id: 'tv-003',
        type: 'ransomware',
        severity: 'critical',
        source: 'CrimsonViper Group',
        target: 'Aurora Biotech Industries - File Servers',
        status: 'eliminated',
        aiOperator: 'NEXUS-3',
        detectionTime: '2025-06-13T06:28:45Z',
        neuralConfidence: 99.1,
        clientName: 'Aurora Biotech Industries',
        mitigationActions: ['Quarantine infected files', 'Restore from clean backup', 'Update security protocols']
      },
      {
        id: 'tv-004',
        type: 'phishing',
        severity: 'medium',
        source: 'social-eng@fake-domain.net',
        target: 'Neural Medical Systems - Email Gateway',
        status: 'contained',
        aiOperator: 'ECHO-5',
        detectionTime: '2025-06-13T05:13:22Z',
        neuralConfidence: 91.7,
        clientName: 'Neural Medical Systems',
        mitigationActions: ['Block sender domain', 'Quarantine emails', 'User education deployed']
      }
    ];

    const metrics: DefenseMetric[] = [
      { name: 'Neural Detection Rate', value: 99.7, max: 100, status: 'optimal', trend: 'up' },
      { name: 'Response Time', value: 0.3, max: 1.0, status: 'optimal', trend: 'down' },
      { name: 'False Positive Rate', value: 0.02, max: 0.1, status: 'optimal', trend: 'down' },
      { name: 'System Integrity', value: 98.9, max: 100, status: 'optimal', trend: 'stable' },
      { name: 'Threat Intelligence', value: 96.4, max: 100, status: 'optimal', trend: 'up' },
      { name: 'Auto-Mitigation', value: 94.8, max: 100, status: 'optimal', trend: 'up' }
    ];

    const shields: ClientShield[] = [
      {
        clientName: 'Nexus Financial Corp',
        infrastructure: 'Cloud + On-Premise Hybrid',
        shieldStrength: 97.3,
        threatsBlocked: 1247,
        uptime: 99.97,
        lastScan: '2025-06-13T08:00:00Z'
      },
      {
        clientName: 'Quantum Aerospace Corp',
        infrastructure: 'Multi-Cloud Architecture',
        shieldStrength: 95.8,
        threatsBlocked: 892,
        uptime: 99.94,
        lastScan: '2025-06-13T07:45:00Z'
      },
      {
        clientName: 'Aurora Biotech Industries',
        infrastructure: 'Private Cloud',
        shieldStrength: 98.1,
        threatsBlocked: 756,
        uptime: 99.99,
        lastScan: '2025-06-13T08:10:00Z'
      },
      {
        clientName: 'Neural Medical Systems',
        infrastructure: 'Hybrid Cloud',
        shieldStrength: 96.2,
        threatsBlocked: 623,
        uptime: 99.91,
        lastScan: '2025-06-13T07:30:00Z'
      }
    ];

    setThreatVectors(threats);
    setDefenseMetrics(metrics);
    setClientShields(shields);
    setTotalThreatsBlocked(shields.reduce((sum, shield) => sum + shield.threatsBlocked, 0));
    
    // Determine system status based on active threats
    const activeCritical = threats.filter(t => t.severity === 'critical' && t.status !== 'eliminated').length;
    if (activeCritical > 0) {
      setSystemStatus('active-threat');
    } else if (threats.some(t => t.status === 'analyzing' || t.status === 'neutralizing')) {
      setSystemStatus('monitoring');
    } else {
      setSystemStatus('secure');
    }
  }, []);

  const initiateDeepScan = async () => {
    setIsScanning(true);
    
    // Simulate neural deep scan
    setTimeout(() => {
      const newThreats: ThreatVector[] = [
        {
          id: `tv-${Date.now()}`,
          type: 'intrusion',
          severity: 'high',
          source: '157.92.45.78',
          target: 'Synergy Tech Dynamics - API Gateway',
          status: 'analyzing',
          aiOperator: 'PULSE-4',
          detectionTime: new Date().toISOString(),
          neuralConfidence: 89.4,
          clientName: 'Synergy Tech Dynamics',
          mitigationActions: ['Analyze attack pattern', 'Strengthen access controls', 'Monitor lateral movement']
        }
      ];
      
      setThreatVectors(prev => [...prev, ...newThreats]);
      setSystemStatus('monitoring');
      setIsScanning(false);
    }, 5000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'high': return 'bg-orange-600';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'bg-yellow-600';
      case 'analyzing': return 'bg-neon-blue';
      case 'neutralizing': return 'bg-orange-600';
      case 'contained': return 'bg-hologram';
      case 'eliminated': return 'bg-cyber-green';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'detected': return <Eye className="w-4 h-4" />;
      case 'analyzing': return <Brain className="w-4 h-4" />;
      case 'neutralizing': return <Zap className="w-4 h-4" />;
      case 'contained': return <Lock className="w-4 h-4" />;
      case 'eliminated': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'secure': return 'text-cyber-green';
      case 'monitoring': return 'text-neon-blue';
      case 'active-threat': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Neural Threat Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">SYSTEM_STATUS</p>
                <p className={`terminal-text text-xl font-bold ${getSystemStatusColor()}`}>
                  {systemStatus.toUpperCase().replace('-', '_')}
                </p>
              </div>
              <Shield className={`w-8 h-8 neon-glow ${getSystemStatusColor()}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">THREATS_BLOCKED</p>
                <p className="terminal-text text-2xl font-bold text-cyber-green">
                  {totalThreatsBlocked.toLocaleString()}
                </p>
              </div>
              <Skull className="w-8 h-8 text-cyber-green neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="terminal-text text-gray-400 text-sm">ACTIVE_THREATS</p>
                <p className="terminal-text text-2xl font-bold text-orange-400">
                  {threatVectors.filter(t => t.status !== 'eliminated').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400 neon-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardContent className="p-6">
            <Button 
              onClick={initiateDeepScan}
              disabled={isScanning}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-600 hover:to-red-600 terminal-text"
            >
              {isScanning ? 'SCANNING...' : 'NEURAL_SCAN'}
              <Brain className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-neon-blue/30">
          <TabsTrigger value="threats" className="terminal-text">Active Threats</TabsTrigger>
          <TabsTrigger value="shields" className="terminal-text">Client Shields</TabsTrigger>
          <TabsTrigger value="metrics" className="terminal-text">Defense Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          <div className="grid gap-4">
            {threatVectors.map((threat) => (
              <Card key={threat.id} className="card-hologram">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <div>
                        <CardTitle className="terminal-text text-white text-lg">
                          {threat.type.toUpperCase()} ATTACK
                        </CardTitle>
                        <p className="terminal-text text-gray-400 text-sm">
                          {threat.clientName} • {threat.target}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getSeverityColor(threat.severity)} terminal-text`}>
                        {threat.severity.toUpperCase()}
                      </Badge>
                      <Badge className={`${getStatusColor(threat.status)} terminal-text flex items-center space-x-1`}>
                        {getStatusIcon(threat.status)}
                        <span>{threat.status.toUpperCase()}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">SOURCE</p>
                      <p className="terminal-text text-sm font-mono text-red-400">
                        {threat.source}
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">CONFIDENCE</p>
                      <p className="terminal-text text-lg font-bold text-cyber-green">
                        {threat.neuralConfidence}%
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">AI_OPERATOR</p>
                      <p className="terminal-text text-lg font-bold text-neon-blue">
                        {threat.aiOperator}
                      </p>
                    </div>
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">DETECTED</p>
                      <p className="terminal-text text-sm text-gray-300">
                        {new Date(threat.detectionTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="terminal-text text-gray-400 text-sm mb-2">MITIGATION_ACTIONS</p>
                      <div className="space-y-1">
                        {threat.mitigationActions.map((action, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-cyber-green" />
                            <span className="terminal-text text-sm text-gray-300">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Neural Confidence</span>
                        <span>{threat.neuralConfidence}%</span>
                      </div>
                      <Progress value={threat.neuralConfidence} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shields" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientShields.map((shield, index) => (
              <Card key={index} className="card-hologram">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-cyber-green" />
                      <CardTitle className="terminal-text text-white">
                        {shield.clientName}
                      </CardTitle>
                    </div>
                    <Badge className="bg-cyber-green terminal-text">
                      PROTECTED
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">INFRASTRUCTURE</p>
                      <p className="terminal-text text-sm text-gray-300">{shield.infrastructure}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="terminal-text text-gray-400 text-sm">THREATS_BLOCKED</p>
                        <p className="terminal-text text-xl font-bold text-red-400">
                          {shield.threatsBlocked}
                        </p>
                      </div>
                      <div>
                        <p className="terminal-text text-gray-400 text-sm">UPTIME</p>
                        <p className="terminal-text text-xl font-bold text-cyber-green">
                          {shield.uptime}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Shield Strength</span>
                        <span>{shield.shieldStrength}%</span>
                      </div>
                      <Progress value={shield.shieldStrength} className="h-3" />
                    </div>
                    
                    <div>
                      <p className="terminal-text text-gray-400 text-sm">LAST_SCAN</p>
                      <p className="terminal-text text-sm text-gray-300">
                        {new Date(shield.lastScan).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defenseMetrics.map((metric, index) => (
              <Card key={index} className="card-hologram">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="terminal-text text-gray-400 text-sm">
                        {metric.name.toUpperCase()}
                      </p>
                      <Badge 
                        className={`terminal-text ${
                          metric.status === 'optimal' ? 'bg-cyber-green' :
                          metric.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                      >
                        {metric.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="terminal-text text-2xl font-bold text-cyber-green">
                        {metric.name.includes('Time') ? `${metric.value}s` : 
                         metric.name.includes('Rate') && metric.value < 1 ? `${metric.value}%` :
                         `${metric.value}%`}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Activity className={`w-4 h-4 ${
                          metric.trend === 'up' ? 'text-cyber-green' :
                          metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`} />
                        <span className="terminal-text text-gray-400 text-sm">
                          {metric.trend.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm terminal-text text-gray-400 mb-1">
                        <span>Performance</span>
                        <span>{((metric.value / metric.max) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(metric.value / metric.max) * 100} className="h-2" />
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