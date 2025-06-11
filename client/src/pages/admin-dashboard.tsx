import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import DashboardManager from "@/components/dashboard/dashboard-manager";
import AdminConnections from "./admin-connections";
import AdminMenuLinks from "./admin-menu-links";
import AdminGallery from "./admin-gallery";
import AdminContent from "./admin-content";
import CyberMatrix from "@/components/CyberMatrix";
import NeuralNavigation from "@/components/NeuralNavigation";
import QuantumDashboard from "@/components/QuantumDashboard";
import HolographicAuth from "@/components/HolographicAuth";
import NeuralMarketplace from "@/components/NeuralMarketplace";
import NeuralPortfolio from "@/components/NeuralPortfolio";
import QuantumClientOnboard from "@/components/QuantumClientOnboard";
import NeuralProjectManager from "@/components/NeuralProjectManager";
import QuantumAnalytics from "@/components/QuantumAnalytics";
import QuantumAIOperations from "@/components/QuantumAIOperations";
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
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check if user has the appropriate role
  const isAuthorized = user && (user.role === "admin" || user.role === "owner");

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You don't have permission to view this page.</p>
        <Link to="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-gradient cyber-grid">
      <CyberMatrix />
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
              <h1 className="text-3xl font-bold text-spring accent-spring">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex space-x-4 items-center">
              <span className="text-sm text-winter-pine">
                Welcome <span className="text-summer font-medium">{user.username}</span>
              </span>
              <button
                onClick={() => logoutMutation.mutate()}
                className="text-sm text-winter-pine hover:text-summer transition-colors px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm"
              >
                Logout
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
          <TabsTrigger value="quantum" className="text-neon-pink data-[state=active]:bg-neon-pink data-[state=active]:text-white terminal-text">
            <Database className="w-4 h-4 mr-2" />
            QUANTUM_OPS
          </TabsTrigger>
          <TabsTrigger value="auth" className="text-neon-blue data-[state=active]:bg-neon-blue data-[state=active]:text-white terminal-text">
            <Shield className="w-4 h-4 mr-2" />
            AUTH_MATRIX
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="text-purple-400 data-[state=active]:bg-purple-400 data-[state=active]:text-white terminal-text">
            <Network className="w-4 h-4 mr-2" />
            NEURAL_MARKET
          </TabsTrigger>
          <TabsTrigger value="connections" className="text-cyber-green data-[state=active]:bg-cyber-green/80 data-[state=active]:text-black terminal-text">
            <Users className="w-4 h-4 mr-2" />
            CONNECTIONS
          </TabsTrigger>
          <TabsTrigger value="gallery" className="text-neon-pink data-[state=active]:bg-neon-pink/80 data-[state=active]:text-white terminal-text">
            <Image className="w-4 h-4 mr-2" />
            HOLO_GALLERY
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="text-orange-400 data-[state=active]:bg-orange-400/80 data-[state=active]:text-white terminal-text">
            <Eye className="w-4 h-4 mr-2" />
            NEURAL_PORTFOLIO
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
          <TabsTrigger value="settings" className="text-neon-blue data-[state=active]:bg-neon-blue/80 data-[state=active]:text-white terminal-text">
            <Terminal className="w-4 h-4 mr-2" />
            CONFIG
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <QuantumAIOperations />
        </TabsContent>

        <TabsContent value="quantum" className="mt-6">
          <QuantumDashboard />
        </TabsContent>

        <TabsContent value="auth" className="mt-6">
          <HolographicAuth />
        </TabsContent>

        <TabsContent value="marketplace" className="mt-6">
          <NeuralMarketplace />
        </TabsContent>
        
        <TabsContent value="connections" className="mt-6">
          <AdminConnections />
        </TabsContent>
        
        <TabsContent value="gallery" className="mt-6">
          <AdminGallery />
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <NeuralPortfolio />
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
        
        <TabsContent value="settings" className="mt-6">
          <AdminContent />
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <div className="space-y-6">
            <div className="card-winter p-6 rounded-xl">
              <h2 className="text-xl mb-4 text-winter accent-winter">Account Settings</h2>
              <p className="text-muted-foreground mb-6">Manage your admin account and preferences</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-spring p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-spring mb-2">Profile Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Username: <span className="text-foreground font-medium">{user.username}</span></p>
                    <p className="text-sm text-muted-foreground">Role: <span className="text-foreground font-medium">{user.role}</span></p>
                    <p className="text-sm text-muted-foreground">Account Type: <span className="text-foreground font-medium">Administrator</span></p>
                  </div>
                </div>
                
                <div className="card-summer p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-summer mb-2">Security Settings</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full">
                      Update Email
                    </Button>
                    <Button variant="outline" className="w-full">
                      Manage Sessions
                    </Button>
                  </div>
                </div>
                
                <div className="card-winter p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-winter mb-2">Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dashboard Widgets</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-save</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="bg-spring-gradient p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">System Information</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Last Login: Today at 10:00 AM</p>
                    <p>Session Duration: 2 hours</p>
                    <p>Dashboard Version: 2.1.0</p>
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