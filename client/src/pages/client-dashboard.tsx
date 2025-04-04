import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2, Image as ImageIcon, FileText, Calendar, MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeSelector } from "@/components/theme-selector";
import { GlowButton } from "@/components/ui/glow-button";
import AnimatedText from "@/components/animated-text";

export default function ClientDashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"projects" | "files" | "calendar" | "messages" | "settings">("projects");
  
  // Mock projects for the client dashboard
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["/api/client-projects"],
    queryFn: async () => {
      // This will be replaced with actual API calls in the future
      return [
        { id: 1, name: "Portfolio Site", status: "In Progress", completion: 65, lastUpdate: "2025-03-28" },
        { id: 2, name: "E-commerce Integration", status: "Planning", completion: 15, lastUpdate: "2025-04-01" },
        { id: 3, name: "Social Media Campaign", status: "Completed", completion: 100, lastUpdate: "2025-03-15" }
      ];
    },
  });

  // Mock messages for the client dashboard
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["/api/client-messages"],
    queryFn: async () => {
      // This will be replaced with actual API calls in the future
      return [
        { id: 1, sender: "Design Team", subject: "Homepage mockup ready for review", date: "2025-04-03", read: false },
        { id: 2, sender: "Project Manager", subject: "Weekly status update", date: "2025-04-01", read: true },
        { id: 3, sender: "Support", subject: "Your ticket has been resolved", date: "2025-03-29", read: true }
      ];
    },
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed": return "text-green-500";
      case "In Progress": return "text-blue-500";
      case "Planning": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <AnimatedText 
              text="client dashboard" 
              className="text-2xl" 
              animationStyle="fade"
            />
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <GlowButton size="sm">
                home
              </GlowButton>
            </Link>
            <GlowButton onClick={() => logoutMutation.mutate()}>
              logout
            </GlowButton>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-accent/20">
              <div className="space-y-2">
                <button
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${tab === "projects" ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`}
                  onClick={() => setTab("projects")}
                >
                  <FileText className="h-5 w-5" />
                  <span>projects</span>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${tab === "files" ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`}
                  onClick={() => setTab("files")}
                >
                  <ImageIcon className="h-5 w-5" />
                  <span>files & assets</span>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${tab === "calendar" ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`}
                  onClick={() => setTab("calendar")}
                >
                  <Calendar className="h-5 w-5" />
                  <span>calendar</span>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${tab === "messages" ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`}
                  onClick={() => setTab("messages")}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>messages</span>
                  {messages && messages.filter(m => !m.read).length > 0 && (
                    <span className="bg-primary text-background text-xs px-2 py-1 rounded-full">
                      {messages.filter(m => !m.read).length}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="mt-10">
                <h3 className="text-sm font-medium mb-3">customize theme</h3>
                <ThemeSelector />
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-card p-6 rounded-lg border border-accent/20">
              {tab === "projects" && (
                <>
                  <h2 className="text-xl mb-4">your projects</h2>
                  
                  {isLoadingProjects ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  ) : projects && projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project: any) => (
                        <div key={project.id} className="border border-accent/20 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">{project.name}</h3>
                            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </div>
                          
                          <div className="mt-3">
                            <div className="w-full bg-background rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${project.completion}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                              <span>{project.completion}% complete</span>
                              <span>Last updated: {project.lastUpdate}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <GlowButton size="sm">view details</GlowButton>
                            <GlowButton size="sm">provide feedback</GlowButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No projects found.</p>
                  )}
                </>
              )}
              
              {tab === "messages" && (
                <>
                  <h2 className="text-xl mb-4">messages</h2>
                  
                  {isLoadingMessages ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-2">
                      {messages.map((message: any) => (
                        <div 
                          key={message.id} 
                          className={`border ${message.read ? 'border-accent/20' : 'border-primary'} p-4 rounded-lg`}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className={`text-lg ${message.read ? '' : 'font-bold'}`}>{message.subject}</h3>
                            <span className="text-sm text-muted-foreground">{message.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">From: {message.sender}</p>
                          
                          <div className="mt-3 flex space-x-2">
                            <GlowButton size="sm">read</GlowButton>
                            <GlowButton size="sm">reply</GlowButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No messages found.</p>
                  )}
                </>
              )}
              
              {tab === "files" && (
                <div className="text-center py-10">
                  <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl mb-2">file repository</h2>
                  <p className="text-muted-foreground mb-6">Access your project files and assets</p>
                  <GlowButton>upload new file</GlowButton>
                </div>
              )}
              
              {tab === "calendar" && (
                <div className="text-center py-10">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl mb-2">project timeline</h2>
                  <p className="text-muted-foreground mb-6">View upcoming milestones and deadlines</p>
                  <GlowButton>view calendar</GlowButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}