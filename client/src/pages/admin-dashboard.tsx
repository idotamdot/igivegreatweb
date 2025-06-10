import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import DashboardManager from "@/components/dashboard/dashboard-manager";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex space-x-4 items-center">
              <span className="text-sm text-muted-foreground">
                Logged in as <span className="text-foreground font-medium">{user.username}</span>
              </span>
              <button
                onClick={() => logoutMutation.mutate()}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        <TabsList className="bg-muted">
          <TabsTrigger value="dashboard" className="text-foreground">Dashboard</TabsTrigger>
          <TabsTrigger value="connections" className="text-foreground">Connections</TabsTrigger>
          <TabsTrigger value="menu-links" className="text-foreground">Menu Links</TabsTrigger>
          <TabsTrigger value="gallery" className="text-foreground">Gallery</TabsTrigger>
          <TabsTrigger value="content" className="text-foreground">Content</TabsTrigger>
          <TabsTrigger value="account" className="text-foreground">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <DashboardManager role={user.role} canReorder={true} />
        </TabsContent>
        
        <TabsContent value="connections" className="mt-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl mb-4 text-foreground">Connections</h2>
            <p className="text-muted-foreground">View and manage user connections.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="menu-links" className="mt-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl mb-4 text-foreground">Menu Links</h2>
            <p className="text-muted-foreground">Manage site navigation and menu links.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="gallery" className="mt-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl mb-4 text-foreground">Gallery Management</h2>
            <p className="text-muted-foreground">Manage artwork and prints.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl mb-4 text-foreground">Content Management</h2>
            <p className="text-muted-foreground">Edit website content and blocks.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl mb-4 text-foreground">Account Settings</h2>
            <p className="text-muted-foreground">Update your account settings and preferences.</p>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}