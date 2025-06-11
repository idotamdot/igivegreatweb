import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Network, 
  Shield, 
  Zap, 
  Database, 
  Globe,
  Code,
  Cpu,
  Eye,
  TrendingUp,
  Server,
  Lock
} from 'lucide-react';

interface NeuralProject {
  id: string;
  name: string;
  client: string;
  category: 'ai-web' | 'quantum-hosting' | 'cybersecurity' | 'neural-ops';
  description: string;
  technologies: string[];
  metrics: {
    performance_boost: number;
    ai_efficiency: number;
    security_level: number;
    uptime: number;
  };
  quantum_enhanced: boolean;
  completion_date: string;
  neural_features: string[];
}

export default function NeuralPortfolio() {
  const [projects, setProjects] = useState<NeuralProject[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    // Revolutionary Neural Web Labs project portfolio
    const neuralProjects: NeuralProject[] = [
      {
        id: 'quantum-ecommerce',
        name: 'QuantumShop Neural Commerce Platform',
        client: 'TechCorp Industries',
        category: 'ai-web',
        description: 'AI-powered e-commerce platform with quantum recommendation engine that increased sales by 340% through neural customer behavior analysis.',
        technologies: ['Neural Networks', 'Quantum Algorithms', 'AI Agents', 'Real-time Analytics'],
        metrics: {
          performance_boost: 340,
          ai_efficiency: 98,
          security_level: 99,
          uptime: 99.9
        },
        quantum_enhanced: true,
        completion_date: '2024-12',
        neural_features: [
          'Autonomous product recommendation AI',
          'Quantum-encrypted payment processing',
          'Neural inventory optimization',
          'Predictive customer analytics'
        ]
      },
      {
        id: 'cybersecurity-mesh',
        name: 'Neural Defense Grid',
        client: 'SecureBank Financial',
        category: 'cybersecurity',
        description: 'Quantum-level cybersecurity mesh that prevented 10,000+ attack attempts with AI-powered threat prediction and real-time neural response.',
        technologies: ['AI Threat Detection', 'Quantum Encryption', 'Neural Response', 'Behavioral Analysis'],
        metrics: {
          performance_boost: 1000,
          ai_efficiency: 96,
          security_level: 100,
          uptime: 100
        },
        quantum_enhanced: true,
        completion_date: '2024-11',
        neural_features: [
          'Real-time threat prediction AI',
          'Quantum encryption protocols',
          'Neural intrusion detection',
          'Autonomous security response'
        ]
      },
      {
        id: 'quantum-hosting',
        name: 'Neural Cloud Infrastructure',
        client: 'StartupAccelerator Inc',
        category: 'quantum-hosting',
        description: 'Quantum-powered hosting infrastructure with neural load balancing that achieved 99.999% uptime and reduced costs by 60%.',
        technologies: ['Quantum Computing', 'Neural Load Balancing', 'AI Scaling', 'Edge Computing'],
        metrics: {
          performance_boost: 250,
          ai_efficiency: 94,
          security_level: 98,
          uptime: 99.999
        },
        quantum_enhanced: true,
        completion_date: '2024-10',
        neural_features: [
          'Predictive auto-scaling',
          'Neural traffic optimization',
          'Quantum-encrypted data centers',
          'AI-powered resource allocation'
        ]
      },
      {
        id: 'ai-healthcare',
        name: 'MedNeural Patient Portal',
        client: 'HealthTech Solutions',
        category: 'ai-web',
        description: 'AI-enhanced healthcare platform with neural patient analysis that improved diagnosis accuracy by 85% and reduced wait times by 70%.',
        technologies: ['Medical AI', 'Neural Analysis', 'Quantum Processing', 'Predictive Health'],
        metrics: {
          performance_boost: 185,
          ai_efficiency: 97,
          security_level: 99,
          uptime: 99.8
        },
        quantum_enhanced: true,
        completion_date: '2024-09',
        neural_features: [
          'AI symptom analysis engine',
          'Neural treatment recommendations',
          'Quantum health data encryption',
          'Predictive health monitoring'
        ]
      },
      {
        id: 'neural-fintech',
        name: 'QuantumTrade AI Platform',
        client: 'InvestmentPro Group',
        category: 'neural-ops',
        description: 'Neural network trading platform with quantum market analysis that achieved 240% higher returns through AI-powered investment strategies.',
        technologies: ['Trading AI', 'Quantum Analysis', 'Neural Predictions', 'Risk Assessment'],
        metrics: {
          performance_boost: 240,
          ai_efficiency: 95,
          security_level: 99,
          uptime: 99.95
        },
        quantum_enhanced: true,
        completion_date: '2024-08',
        neural_features: [
          'AI market prediction engine',
          'Quantum risk analysis',
          'Neural portfolio optimization',
          'Real-time trading algorithms'
        ]
      },
      {
        id: 'education-ai',
        name: 'Neural Learning Academy',
        client: 'EduFuture Institute',
        category: 'ai-web',
        description: 'AI-powered educational platform with quantum knowledge mapping that improved student performance by 120% through personalized neural learning.',
        technologies: ['Educational AI', 'Neural Learning', 'Quantum Knowledge', 'Adaptive Systems'],
        metrics: {
          performance_boost: 120,
          ai_efficiency: 93,
          security_level: 97,
          uptime: 99.7
        },
        quantum_enhanced: true,
        completion_date: '2024-07',
        neural_features: [
          'Personalized AI tutoring',
          'Neural learning path optimization',
          'Quantum knowledge assessment',
          'Adaptive curriculum AI'
        ]
      }
    ];

    setProjects(neuralProjects);
  }, []);

  const categories = [
    { id: 'all', name: 'ALL_PROJECTS', icon: Globe },
    { id: 'ai-web', name: 'AI_WEB_DEV', icon: Brain },
    { id: 'quantum-hosting', name: 'QUANTUM_HOSTING', icon: Server },
    { id: 'cybersecurity', name: 'CYBERSECURITY', icon: Shield },
    { id: 'neural-ops', name: 'NEURAL_OPS', icon: Cpu }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai-web': return 'text-cyber-green';
      case 'quantum-hosting': return 'text-neon-pink';
      case 'cybersecurity': return 'text-neon-blue';
      case 'neural-ops': return 'text-purple-400';
      default: return 'text-cyber-green';
    }
  };

  const totalProjects = projects.length;
  const avgPerformanceBoost = Math.round(projects.reduce((sum, p) => sum + p.metrics.performance_boost, 0) / totalProjects);
  const avgAiEfficiency = Math.round(projects.reduce((sum, p) => sum + p.metrics.ai_efficiency, 0) / totalProjects);
  const quantumProjects = projects.filter(p => p.quantum_enhanced).length;

  return (
    <div className="space-y-8">
      {/* Neural Portfolio Header */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="text-hologram terminal-text flex items-center gap-2">
            <Brain className="w-6 h-6" />
            NEURAL_WEB_LABS_PORTFOLIO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyber-green">{totalProjects}</div>
              <div className="text-xs terminal-text text-gray-400">QUANTUM_PROJECTS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-pink">{avgPerformanceBoost}%</div>
              <div className="text-xs terminal-text text-gray-400">AVG_PERFORMANCE_BOOST</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-blue">{avgAiEfficiency}%</div>
              <div className="text-xs terminal-text text-gray-400">AI_EFFICIENCY</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{quantumProjects}</div>
              <div className="text-xs terminal-text text-gray-400">QUANTUM_ENHANCED</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Filters */}
      <Card className="card-cyber">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  onClick={() => setActiveFilter(category.id)}
                  className={`cyber-glass border-cyber-green/30 hover:bg-cyber-green/20 ${
                    activeFilter === category.id 
                      ? 'bg-cyber-green text-black neon-glow' 
                      : 'text-cyber-green'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="terminal-text text-xs">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Neural Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map(project => (
          <Card key={project.id} className="card-cyber hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-cyber-green terminal-text text-lg mb-2">
                    {project.name}
                  </CardTitle>
                  <div className="text-sm text-gray-400 terminal-text mb-3">
                    CLIENT: {project.client} | {project.completion_date}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Badge className={`${getCategoryColor(project.category)} bg-opacity-20 text-xs`}>
                      {project.category.toUpperCase().replace('-', '_')}
                    </Badge>
                    {project.quantum_enhanced && (
                      <Badge className="bg-purple-400 text-white text-xs neon-glow">
                        QUANTUM
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-300 terminal-text text-sm">
                {project.description}
              </p>

              {/* Neural Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="cyber-glass p-3 rounded-lg text-center">
                  <TrendingUp className="w-4 h-4 text-cyber-green mx-auto mb-1" />
                  <div className="text-lg font-bold text-cyber-green">+{project.metrics.performance_boost}%</div>
                  <div className="text-xs terminal-text text-gray-400">PERFORMANCE</div>
                </div>
                <div className="cyber-glass p-3 rounded-lg text-center">
                  <Brain className="w-4 h-4 text-neon-pink mx-auto mb-1" />
                  <div className="text-lg font-bold text-neon-pink">{project.metrics.ai_efficiency}%</div>
                  <div className="text-xs terminal-text text-gray-400">AI_EFFICIENCY</div>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <div className="terminal-text text-neon-blue text-sm font-medium mb-2">
                  NEURAL_TECHNOLOGIES:
                </div>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} className="bg-gray-700 text-gray-300 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Neural Features */}
              <div>
                <div className="terminal-text text-purple-400 text-sm font-medium mb-2">
                  AI_FEATURES:
                </div>
                <ul className="space-y-1">
                  {project.neural_features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-xs text-gray-400 terminal-text flex items-center gap-2">
                      <div className="w-1 h-1 bg-cyber-green rounded-full neon-glow"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-neon-gradient neon-glow terminal-text">
                  <Eye className="w-4 h-4 mr-2" />
                  VIEW_DETAILS
                </Button>
                <Button variant="outline" className="border-cyber-green text-cyber-green hover:bg-cyber-green/20">
                  <Code className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}