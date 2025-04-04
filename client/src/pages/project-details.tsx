import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, 
  CalendarDays, 
  Users, 
  Clock, 
  CheckCircle2, 
  FileText,
  Image as ImageIcon,
  MessageSquare,
  BarChart4,
  UploadCloud
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlowButton } from "@/components/ui/glow-button";
import AnimatedText from "@/components/animated-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function ProjectDetails() {
  const [matched, params] = useRoute('/project/:id');
  const projectId = params?.id ? parseInt(params.id, 10) : null;
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock project data
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: [`/api/client-projects/${projectId}`],
    queryFn: async () => {
      // This would fetch the specific project from the API
      // For now, returning mock data
      return {
        id: projectId,
        name: projectId === 1 ? "Portfolio Site" 
             : projectId === 2 ? "E-commerce Integration" 
             : "Social Media Campaign",
        description: "A comprehensive web development project that includes multiple phases from design to deployment.",
        status: projectId === 1 ? "In Progress" 
              : projectId === 2 ? "Planning" 
              : "Completed",
        completion: projectId === 1 ? 65 
                  : projectId === 2 ? 15 
                  : 100,
        startDate: "2025-02-15",
        estimatedEndDate: "2025-05-30",
        team: [
          { name: "Alex Thompson", role: "Project Manager" },
          { name: "Sarah Kim", role: "Lead Designer" },
          { name: "Marcus Johnson", role: "Frontend Developer" },
          { name: "Nadia Patel", role: "Backend Developer" }
        ],
        milestones: [
          { id: 1, name: "Discovery & Planning", completed: true, date: "2025-02-20" },
          { id: 2, name: "Design Approval", completed: true, date: "2025-03-10" },
          { id: 3, name: "Frontend Development", completed: projectId === 3, date: "2025-04-05" },
          { id: 4, name: "Backend Integration", completed: projectId === 3, date: "2025-04-25" },
          { id: 5, name: "Testing & Quality Assurance", completed: projectId === 3, date: "2025-05-15" },
          { id: 6, name: "Launch", completed: projectId === 3, date: "2025-05-30" }
        ],
        tasks: [
          { id: 1, name: "Site Architecture", status: "Completed", assignee: "Marcus Johnson" },
          { id: 2, name: "Responsive Design Implementation", status: projectId === 1 ? "In Progress" : projectId === 3 ? "Completed" : "Pending", assignee: "Sarah Kim" },
          { id: 3, name: "CMS Integration", status: projectId === 1 ? "In Progress" : projectId === 3 ? "Completed" : "Pending", assignee: "Nadia Patel" },
          { id: 4, name: "Performance Optimization", status: projectId === 3 ? "Completed" : "Pending", assignee: "Marcus Johnson" },
          { id: 5, name: "Content Migration", status: projectId === 3 ? "Completed" : "Pending", assignee: "Alex Thompson" }
        ],
        files: [
          { id: 1, name: "Project Brief.pdf", type: "document", date: "2025-02-15", size: "1.2 MB" },
          { id: 2, name: "Design Mockups.fig", type: "design", date: "2025-03-05", size: "4.5 MB" },
          { id: 3, name: "Homepage Preview.jpg", type: "image", date: "2025-03-15", size: "2.8 MB" },
          { id: 4, name: "Technical Requirements.docx", type: "document", date: "2025-02-20", size: "950 KB" }
        ],
        updates: [
          { id: 1, date: "2025-04-01", content: "Frontend development is now 75% complete. Designs for mobile responsiveness have been implemented." },
          { id: 2, date: "2025-03-20", content: "All design mockups approved. Development phase beginning next week." },
          { id: 3, date: "2025-03-05", content: "Initial designs presented to the client. Feedback received and adjustments in progress." },
          { id: 4, date: "2025-02-20", content: "Project kickoff meeting held. Requirements documented and project plan approved." }
        ]
      };
    },
    enabled: projectId !== null,
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed": return "text-green-500";
      case "In Progress": return "text-blue-500";
      case "Planning": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <p className="text-xl mb-4">Project not found</p>
        <Link href="/client">
          <GlowButton>Return to Dashboard</GlowButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/client">
              <a className="text-muted-foreground hover:text-foreground mr-4">← back to dashboard</a>
            </Link>
            <ThemeToggle />
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

        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <AnimatedText 
                text={project.name}
                className="text-3xl font-medium" 
                animationStyle="fade"
              />
              <div className="flex items-center mt-2">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)} border border-current`}>
                  {project.status}
                </span>
                <span className="text-muted-foreground ml-4 flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  {project.startDate} - {project.estimatedEndDate}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <GlowButton>
                <MessageSquare className="h-4 w-4 mr-2" />
                contact team
              </GlowButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Progress Overview */}
          <div className="bg-card p-6 rounded-lg border border-accent/20">
            <h2 className="text-lg font-medium mb-4">project progress</h2>
            <div className="w-full bg-background rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full" 
                style={{ width: `${project.completion}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm">{project.completion}% completed</span>
              <span className="text-sm text-muted-foreground">Target: 100%</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-card rounded-lg border border-accent/20 overflow-hidden">
            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b border-accent/20">
                <TabsList className="p-0 bg-transparent border-b-0">
                  <TabsTrigger 
                    value="overview"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="milestones"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    milestones
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tasks"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    tasks
                  </TabsTrigger>
                  <TabsTrigger 
                    value="files"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    files
                  </TabsTrigger>
                  <TabsTrigger 
                    value="team"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    team
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">project description</h3>
                    <p className="text-muted-foreground mb-6">{project.description}</p>
                    
                    <h3 className="text-lg font-medium mb-3">key stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-accent/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm font-medium">timeline</span>
                        </div>
                        <p className="text-2xl font-light">
                          {project.milestones.filter(m => m.completed).length} / {project.milestones.length}
                        </p>
                        <p className="text-xs text-muted-foreground">milestones completed</p>
                      </div>
                      <div className="border border-accent/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm font-medium">tasks</span>
                        </div>
                        <p className="text-2xl font-light">
                          {project.tasks.filter(t => t.status === "Completed").length} / {project.tasks.length}
                        </p>
                        <p className="text-xs text-muted-foreground">tasks completed</p>
                      </div>
                      <div className="border border-accent/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm font-medium">documents</span>
                        </div>
                        <p className="text-2xl font-light">
                          {project.files.filter(f => f.type === "document").length}
                        </p>
                        <p className="text-xs text-muted-foreground">documents available</p>
                      </div>
                      <div className="border border-accent/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Users className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm font-medium">team</span>
                        </div>
                        <p className="text-2xl font-light">
                          {project.team.length}
                        </p>
                        <p className="text-xs text-muted-foreground">team members</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">recent updates</h3>
                    <div className="space-y-4">
                      {project.updates.map((update) => (
                        <div key={update.id} className="border-l-2 border-primary pl-4 py-1">
                          <p className="text-sm text-muted-foreground">{update.date}</p>
                          <p className="mt-1">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">project milestones</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.milestones.filter(m => m.completed).length} of {project.milestones.length} completed
                    </p>
                  </div>
                  
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute top-0 bottom-0 left-[15px] w-0.5 bg-accent/30"></div>
                    
                    {/* Milestones */}
                    <div className="space-y-8 relative">
                      {project.milestones.map((milestone) => (
                        <div key={milestone.id} className="pl-10 relative">
                          {/* Milestone dot */}
                          <div 
                            className={`absolute left-0 w-[31px] h-[31px] rounded-full flex items-center justify-center border-2 ${
                              milestone.completed 
                                ? "border-primary bg-primary/20" 
                                : "border-accent/50 bg-background"
                            }`}
                          >
                            {milestone.completed && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          
                          <div className="pb-2">
                            <div className="flex justify-between">
                              <h4 className="text-base font-medium">{milestone.name}</h4>
                              <p className="text-sm text-muted-foreground">{milestone.date}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {milestone.completed ? "Completed" : "Pending"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">project tasks</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.tasks.filter(t => t.status === "Completed").length} of {project.tasks.length} completed
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {project.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`p-4 rounded-lg border ${
                          task.status === "Completed" 
                            ? "border-green-500/30" 
                            : task.status === "In Progress" 
                              ? "border-blue-500/30" 
                              : "border-accent/20"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{task.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Assigned to: {task.assignee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="files" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">project files</h3>
                    <GlowButton size="sm">
                      <UploadCloud className="h-4 w-4 mr-2" />
                      upload file
                    </GlowButton>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.files.map((file) => (
                      <div 
                        key={file.id} 
                        className="p-4 rounded-lg border border-accent/20 flex items-center"
                      >
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center mr-4">
                          {file.type === "document" && <FileText className="h-5 w-5 text-primary" />}
                          {file.type === "image" && <ImageIcon className="h-5 w-5 text-primary" />}
                          {file.type === "design" && <BarChart4 className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{file.name}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span>{file.size}</span>
                            <span className="mx-2">•</span>
                            <span>{file.date}</span>
                          </div>
                        </div>
                        <GlowButton size="sm" className="border border-primary bg-transparent text-foreground hover:bg-accent/10">view</GlowButton>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="team" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">project team</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.team.map((member, idx) => (
                      <div 
                        key={idx} 
                        className="p-5 rounded-lg border border-accent/20 flex flex-col items-center text-center"
                      >
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                        <GlowButton size="sm" className="mt-3">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          contact
                        </GlowButton>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}