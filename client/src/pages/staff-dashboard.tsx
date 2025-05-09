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

export default function StaffDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check if user has the appropriate role
  const isAuthorized = user && user.role === "staff";

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
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-normal">
            <span className="text-gradient-glow">staff dashboard</span>
          </h1>
          <div className="flex space-x-4 items-center">
            <span className="text-sm text-gray-400">
              Logged in as <span className="text-white">{user.username}</span>
            </span>
            <button
              onClick={() => logoutMutation.mutate()}
              className="text-sm text-gray-400 hover:text-white"
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
        <TabsList className="bg-black border border-gray-800">
          <TabsTrigger value="dashboard">dashboard</TabsTrigger>
          <TabsTrigger value="menu-links">my menu links</TabsTrigger>
          <TabsTrigger value="content">content</TabsTrigger>
          <TabsTrigger value="account">account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <DashboardManager role={user.role} canReorder={true} />
        </TabsContent>
        
        <TabsContent value="menu-links" className="mt-6">
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl mb-4">My Menu Links</h2>
            <p className="text-gray-400">Manage your menu links and shared links.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl mb-4">Content Management</h2>
            <p className="text-gray-400">Edit website content for your sections.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl mb-4">Account Settings</h2>
            <p className="text-gray-400">Update your account settings and preferences.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}