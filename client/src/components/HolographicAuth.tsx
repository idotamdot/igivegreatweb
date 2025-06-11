import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Fingerprint, 
  Shield, 
  Zap, 
  Lock, 
  Unlock,
  Scan,
  Brain,
  Network,
  Terminal
} from 'lucide-react';

interface BiometricScan {
  type: 'retinal' | 'neural' | 'quantum';
  status: 'scanning' | 'verified' | 'failed';
  confidence: number;
}

export default function HolographicAuth() {
  const [authStage, setAuthStage] = useState<'idle' | 'scanning' | 'processing' | 'authenticated'>('idle');
  const [biometrics, setBiometrics] = useState<BiometricScan[]>([]);
  const [neuralPattern, setNeuralPattern] = useState<number[]>([]);
  const [quantumSignature, setQuantumSignature] = useState('');
  const [hologramOpacity, setHologramOpacity] = useState(0);

  useEffect(() => {
    // Animate holographic effects
    const interval = setInterval(() => {
      setHologramOpacity(prev => {
        if (authStage === 'scanning') return 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
        if (authStage === 'authenticated') return 1;
        return 0.3;
      });

      // Generate neural patterns
      if (authStage === 'scanning') {
        setNeuralPattern(prev => {
          const newPattern = [...prev];
          if (newPattern.length > 50) newPattern.shift();
          newPattern.push(Math.random() * 100);
          return newPattern;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [authStage]);

  const initiateQuantumAuth = async () => {
    setAuthStage('scanning');
    
    // Simulate biometric scanning
    setBiometrics([
      { type: 'retinal', status: 'scanning', confidence: 0 },
      { type: 'neural', status: 'scanning', confidence: 0 },
      { type: 'quantum', status: 'scanning', confidence: 0 }
    ]);

    // Simulate progressive scanning
    setTimeout(() => {
      setBiometrics(prev => prev.map(b => 
        b.type === 'retinal' ? { ...b, status: 'verified', confidence: 97.8 } : b
      ));
    }, 1000);

    setTimeout(() => {
      setBiometrics(prev => prev.map(b => 
        b.type === 'neural' ? { ...b, status: 'verified', confidence: 94.2 } : b
      ));
    }, 2000);

    setTimeout(() => {
      setBiometrics(prev => prev.map(b => 
        b.type === 'quantum' ? { ...b, status: 'verified', confidence: 99.9 } : b
      ));
      setQuantumSignature('QNT-7X9A-MESH-AUTH-VERIFIED');
      setAuthStage('processing');
    }, 3000);

    setTimeout(() => {
      setAuthStage('authenticated');
    }, 4000);
  };

  const getBiometricIcon = (type: string) => {
    switch (type) {
      case 'retinal': return Eye;
      case 'neural': return Brain;
      case 'quantum': return Network;
      default: return Scan;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-cyber-green';
      case 'scanning': return 'text-neon-pink';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="card-hologram" style={{ opacity: hologramOpacity }}>
        <CardHeader className="text-center">
          <CardTitle className="text-hologram terminal-text flex items-center justify-center gap-3">
            <Shield className="w-6 h-6 neon-glow" />
            QUANTUM_AUTH_MATRIX
          </CardTitle>
          <div className="text-cyber-green terminal-text text-sm">
            &gt;&gt; Multi-dimensional security protocol
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Authentication Status */}
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full border-4 flex items-center justify-center mb-4 ${
              authStage === 'authenticated' 
                ? 'border-cyber-green bg-cyber-green/20 neon-glow' 
                : authStage === 'scanning' 
                ? 'border-neon-pink bg-neon-pink/20 animate-pulse' 
                : 'border-neon-blue bg-neon-blue/10'
            }`}>
              {authStage === 'authenticated' ? (
                <Unlock className="w-8 h-8 text-cyber-green" />
              ) : authStage === 'scanning' ? (
                <Scan className="w-8 h-8 text-neon-pink animate-spin" />
              ) : (
                <Lock className="w-8 h-8 text-neon-blue" />
              )}
            </div>

            <Badge className={`${
              authStage === 'authenticated' 
                ? 'bg-cyber-green text-black' 
                : authStage === 'scanning' 
                ? 'bg-neon-pink text-white' 
                : 'bg-neon-blue text-white'
            } neon-glow`}>
              {authStage === 'authenticated' 
                ? 'ACCESS_GRANTED' 
                : authStage === 'scanning' 
                ? 'QUANTUM_SCANNING' 
                : 'AWAITING_AUTH'}
            </Badge>
          </div>

          {/* Biometric Scanners */}
          {biometrics.length > 0 && (
            <div className="space-y-3">
              <div className="terminal-text text-cyber-green text-sm text-center">
                BIOMETRIC_ANALYSIS:
              </div>
              {biometrics.map((scan, index) => {
                const Icon = getBiometricIcon(scan.type);
                return (
                  <div key={index} className="cyber-glass p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${getStatusColor(scan.status)}`} />
                        <div>
                          <div className="terminal-text text-sm font-medium">
                            {scan.type.toUpperCase()}_SCAN
                          </div>
                          <div className="text-xs text-gray-400">
                            Confidence: {scan.confidence.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        scan.status === 'verified' ? 'bg-cyber-green' :
                        scan.status === 'scanning' ? 'bg-neon-pink animate-pulse' :
                        'bg-gray-500'
                      } neon-glow`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Neural Pattern Visualization */}
          {neuralPattern.length > 0 && (
            <div className="cyber-glass p-3 rounded-lg">
              <div className="terminal-text text-cyber-green text-sm mb-2">
                NEURAL_PATTERN_ANALYSIS:
              </div>
              <div className="h-16 relative overflow-hidden bg-gray-900/50 rounded">
                <svg className="w-full h-full">
                  {neuralPattern.map((value, index) => (
                    <line
                      key={index}
                      x1={index * 2}
                      y1={32}
                      x2={index * 2}
                      y2={32 - (value * 0.3)}
                      stroke="#00ff41"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  ))}
                </svg>
              </div>
            </div>
          )}

          {/* Quantum Signature */}
          {quantumSignature && (
            <div className="cyber-glass p-3 rounded-lg">
              <div className="terminal-text text-cyber-green text-sm mb-2">
                QUANTUM_SIGNATURE:
              </div>
              <div className="terminal-text text-xs text-neon-pink font-mono">
                {quantumSignature}
              </div>
            </div>
          )}

          {/* Authentication Controls */}
          <div className="space-y-3">
            {authStage === 'idle' && (
              <Button 
                onClick={initiateQuantumAuth}
                className="w-full bg-neon-gradient neon-glow terminal-text"
              >
                <Fingerprint className="w-4 h-4 mr-2" />
                INITIATE_QUANTUM_AUTH
              </Button>
            )}

            {authStage === 'authenticated' && (
              <div className="space-y-2">
                <Button className="w-full bg-cyber-green text-black neon-glow terminal-text">
                  <Terminal className="w-4 h-4 mr-2" />
                  ACCESS_ADMIN_NEXUS
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-neon-pink text-neon-pink hover:bg-neon-pink/20"
                  onClick={() => {
                    setAuthStage('idle');
                    setBiometrics([]);
                    setNeuralPattern([]);
                    setQuantumSignature('');
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  RESET_MATRIX
                </Button>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="terminal-text text-xs text-center text-gray-400 pt-4 border-t border-cyber-green/20">
            &gt;&gt; QUANTUM_ENCRYPTION_ACTIVE<br/>
            &gt;&gt; NEURAL_FIREWALL_ENABLED<br/>
            &gt;&gt; ZERO_TRUST_ARCHITECTURE
          </div>
        </CardContent>
      </Card>
    </div>
  );
}