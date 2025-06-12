import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import DashboardManager from "@/components/dashboard/dashboard-manager";
import AdminConnections from "./admin-connections";
import AdminMenuLinks from "./admin-menu-links";
import AdminGallery from "./admin-gallery";
import AdminContent from "./admin-content";

import NeuralNavigation from "@/components/NeuralNavigation";
import QuantumDashboard from "@/components/QuantumDashboard";
import HolographicAuth from "@/components/HolographicAuth";
import NeuralMarketplace from "@/components/NeuralMarketplace";
import NeuralPortfolio from "@/components/NeuralPortfolio";
import QuantumClientOnboard from "@/components/QuantumClientOnboard";
import NeuralProjectManager from "@/components/NeuralProjectManager";
import QuantumAnalytics from "@/components/QuantumAnalytics";
import QuantumAIOperations from "@/components/QuantumAIOperations";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import BusinessValuation from "@/components/BusinessValuation";
import NeuralAIDashboard from "@/components/NeuralAIDashboard";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Home, 
  Users, 
  Link2, 
  Image, 
  FileText, 
  Settings,
  Brain,
  Shield,
  Database,
  Network,
  Terminal,
  Eye,
  Activity,
  Bot,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // For development - bypass authentication check
  const isAuthorized = true;

  return (
    <div className="min-h-screen bg-cyber-gradient cyber-grid">
      <NeuralNavigation />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-sm text-winter-pine hover:text-spring-fresh-green transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-cyber-green terminal-text neon-glow">
                QUANTUM_AI_OPERATIONS_CENTER
              </h1>
            </div>
            <div className="flex space-x-4 items-center">
              <span className="text-sm text-gray-400 terminal-text">
                Welcome <span className="text-cyber-green font-medium">NEURAL_OWNER</span>
              </span>
              <button
                className="text-sm text-gray-400 hover:text-cyber-green transition-colors px-4 py-2 cyber-glass rounded-lg backdrop-blur-sm terminal-text"
              >
                QUANTUM_LOGOUT
              </button>
            </div>
          </div>
        </header>

      <Tabs 
        defaultValue="dashboard" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="cyber-glass backdrop-blur-md border-2 border-cyber-green/20 rounded-xl neon-border">
          <TabsTrigger value="dashboard" className="text-cyber-green data-[state=active]:bg-cyber-green data-[state=active]:text-black terminal-text">
            <Bot className="w-4 h-4 mr-2" />
            AI_OPERATIONS
          </TabsTrigger>
          <TabsTrigger value="valuation" className="text-yellow-400 data-[state=active]:bg-yellow-400/80 data-[state=active]:text-black terminal-text">
            <DollarSign className="w-4 h-4 mr-2" />
            BUSINESS_VALUATION
          </TabsTrigger>
          <TabsTrigger value="clients" className="text-cyan-400 data-[state=active]:bg-cyan-400/80 data-[state=active]:text-white terminal-text">
            <Users className="w-4 h-4 mr-2" />
            CLIENT_ONBOARD
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-emerald-400 data-[state=active]:bg-emerald-400/80 data-[state=active]:text-white terminal-text">
            <Brain className="w-4 h-4 mr-2" />
            PROJECT_MANAGER
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-indigo-400 data-[state=active]:bg-indigo-400/80 data-[state=active]:text-white terminal-text">
            <Activity className="w-4 h-4 mr-2" />
            QUANTUM_ANALYTICS
          </TabsTrigger>
          <TabsTrigger value="invoicing" className="text-orange-400 data-[state=active]:bg-orange-400/80 data-[state=active]:text-white terminal-text">
            <FileText className="w-4 h-4 mr-2" />
            ENTERPRISE_INVOICING
          </TabsTrigger>
          <TabsTrigger value="neural" className="text-cyan-400 data-[state=active]:bg-cyan-400/80 data-[state=active]:text-white terminal-text">
            <Brain className="w-4 h-4 mr-2" />
            NEURAL_AI
          </TabsTrigger>
          <TabsTrigger value="account" className="text-neon-blue data-[state=active]:bg-neon-blue/80 data-[state=active]:text-white terminal-text">
            <Settings className="w-4 h-4 mr-2" />
            ACCOUNT
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <QuantumAIOperations />
        </TabsContent>

        <TabsContent value="valuation" className="mt-6">
          <BusinessValuation />
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <QuantumClientOnboard />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <NeuralProjectManager />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <QuantumAnalytics />
        </TabsContent>
        
        <TabsContent value="invoicing" className="mt-6">
          <div className="space-y-6">
            <div className="cyber-glass p-6 rounded-lg border border-orange-400/20 neon-border">
              <h2 className="text-2xl font-bold text-orange-400 terminal-text mb-4 neon-glow">
                ENTERPRISE_INVOICING_SYSTEM
              </h2>
              <p className="text-gray-300 terminal-text mb-6">
                Advanced contract management for large enterprise clients with automated billing cycles, 
                payment tracking, and comprehensive financial reporting.
              </p>
              <Link href="/invoicing">
                <Button className="bg-orange-gradient neon-glow terminal-text hover-lift">
                  <FileText className="w-4 h-4 mr-2" />
                  ACCESS_INVOICING_DASHBOARD
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="neural" className="mt-6">
          <NeuralAIDashboard />
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <div className="space-y-6">
            <div className="cyber-glass p-6 rounded-xl border border-cyber-green/20">
              <h2 className="text-xl mb-4 text-cyber-green terminal-text">ACCOUNT_SETTINGS</h2>
              <p className="text-gray-400 mb-6 terminal-text">Manage your owner account and neural configurations</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="cyber-glass p-4 rounded-lg border border-neon-blue/20">
                  <h3 className="text-lg font-semibold text-neon-blue terminal-text mb-2">OWNER_PROFILE</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 terminal-text">Username: <span className="text-cyber-green font-medium">jessica.elizabeth.mcglothern@gmail.com</span></p>
                    <p className="text-sm text-gray-400 terminal-text">Role: <span className="text-neon-pink font-medium">OWNER</span></p>
                    <p className="text-sm text-gray-400 terminal-text">Access Level: <span className="text-purple-400 font-medium">QUANTUM_OWNER</span></p>
                  </div>
                </div>
                
                <div className="w-full">
                  <PasswordChangeForm />
                </div>
                
                <div className="cyber-glass p-4 rounded-lg border border-purple-400/20">
                  <h3 className="text-lg font-semibold text-purple-400 terminal-text mb-2">NEURAL_PREFERENCES</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 terminal-text">AI_NOTIFICATIONS</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 terminal-text">QUANTUM_WIDGETS</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 terminal-text">AUTO_NEURAL_SAVE</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="cyber-glass p-4 rounded-lg border border-cyber-green/20">
                  <h3 className="text-lg font-semibold text-cyber-green terminal-text mb-2">SYSTEM_STATUS</h3>
                  <div className="space-y-2 text-sm text-gray-400 terminal-text">
                    <p>Last Neural Sync: <span className="text-cyber-green">ACTIVE</span></p>
                    <p>Session Quantum Time: <span className="text-neon-blue">∞ HOURS</span></p>
                    <p>Neural Web Labs Version: <span className="text-neon-pink">v3.0.QUANTUM</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}