import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, 
  ArrowLeft, 
  Reply, 
  Trash2, 
  Download,
  Paperclip,
  User
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlowButton } from "@/components/ui/glow-button";
import AnimatedText from "@/components/animated-text";
import { Textarea } from "@/components/ui/textarea";

export default function MessageDetails() {
  const [matched, params] = useRoute('/message/:id');
  const messageId = params?.id ? parseInt(params.id, 10) : null;
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  
  // Mock message data
  const { data: message, isLoading: isLoadingMessage } = useQuery({
    queryKey: [`/api/client-messages/${messageId}`],
    queryFn: async () => {
      // This would fetch the specific message from the API
      // For now, returning mock data
      const messages = [
        { 
          id: 1, 
          sender: "Design Team", 
          email: "design@igivegreatweb.com",
          subject: "Homepage mockup ready for review", 
          date: "2025-04-03", 
          time: "10:32 AM",
          read: false,
          content: `Hello,

We've completed the homepage mockups for your portfolio site and would love to get your feedback. The design follows the minimalist approach we discussed, with emphasis on showcasing your work.

Key features:
- Animated hero section with your featured projects
- Custom cursor interaction on portfolio items
- Dark/light mode toggle with smooth transitions
- Mobile-optimized layout with touch interactions

Please review the attached files and let us know if you'd like any adjustments before we move to development.

Best regards,
The Design Team`,
          attachments: [
            { name: "homepage-mockup-desktop.jpg", size: "2.4 MB" },
            { name: "homepage-mockup-mobile.jpg", size: "1.8 MB" },
            { name: "interaction-prototype.fig", size: "5.2 MB" }
          ]
        },
        { 
          id: 2, 
          sender: "Project Manager", 
          email: "pm@igivegreatweb.com",
          subject: "Weekly status update", 
          date: "2025-04-01", 
          time: "2:15 PM",
          read: true,
          content: `Hello,

Here's your weekly project status update:

Progress:
- Design phase: 100% complete
- Frontend development: 65% complete
- Backend integration: 40% complete
- Content migration: 25% complete

This week's milestones:
- Completed responsive design implementation
- Initialized CMS structure
- Set up automated testing environment

Next week's goals:
- Complete main navigation functionality
- Implement user authentication flow
- Begin portfolio item detail pages

We're currently on track to meet the projected timeline. Our next team meeting is scheduled for Friday at 10:00 AM, and you're welcome to join if you'd like to discuss any aspects of the project.

Regards,
Your Project Manager`,
          attachments: [
            { name: "project-timeline-updated.pdf", size: "1.1 MB" },
            { name: "weekly-progress-report.xlsx", size: "890 KB" }
          ]
        },
        { 
          id: 3, 
          sender: "Support", 
          email: "support@igivegreatweb.com",
          subject: "Your ticket has been resolved", 
          date: "2025-03-29", 
          time: "11:45 AM",
          read: true,
          content: `Hello,

We're pleased to inform you that your support ticket (#2345) regarding "Portfolio filtering functionality" has been resolved.

Solution implemented:
We've added the custom category filtering you requested for your portfolio items, allowing visitors to filter projects by type, technology, or industry. This has been implemented with smooth animations and state persistence.

The changes have been deployed to your staging environment for review. Please let us know if everything works as expected or if you need any further adjustments.

Is there anything else we can help you with?

Best regards,
Support Team`,
          attachments: []
        }
      ];
      
      return messages.find(m => m.id === messageId);
    },
    enabled: messageId !== null,
  });

  if (isLoadingMessage) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <p className="text-xl mb-4">Message not found</p>
        <Link href="/client">
          <GlowButton>Return to Dashboard</GlowButton>
        </Link>
      </div>
    );
  }

  const handleSendReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully."
    });
    
    setReplying(false);
    setReplyContent("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/client">
              <a className="text-muted-foreground hover:text-foreground mr-4 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> back to inbox
              </a>
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

        <div className="bg-card rounded-lg border border-accent/20 overflow-hidden">
          <div className="p-6 border-b border-accent/20">
            <AnimatedText 
              text={message.subject} 
              className="text-2xl font-medium"
              animationStyle="fade"
            />
            <div className="flex items-center mt-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{message.sender}</p>
                <p className="text-sm text-muted-foreground">{message.email}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-muted-foreground">{message.date}</p>
                <p className="text-sm text-muted-foreground">{message.time}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              {message.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>
                  {paragraph.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {line}
                      {lineIdx < paragraph.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            {message.attachments.length > 0 && (
              <div className="mt-8 border-t border-accent/20 pt-6">
                <h3 className="text-lg font-medium mb-4">attachments ({message.attachments.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {message.attachments.map((attachment, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-lg border border-accent/20 flex items-center"
                    >
                      <Paperclip className="h-5 w-5 text-primary mr-3" />
                      <div className="flex-1">
                        <p className="font-medium truncate">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">{attachment.size}</p>
                      </div>
                      <button className="text-primary hover:text-primary/70">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex space-x-3">
              <GlowButton onClick={() => setReplying(!replying)}>
                <Reply className="h-4 w-4 mr-2" />
                reply
              </GlowButton>
              <GlowButton className="border border-primary bg-transparent text-foreground hover:bg-accent/10">
                <Trash2 className="h-4 w-4 mr-2" />
                delete
              </GlowButton>
            </div>

            {replying && (
              <div className="mt-6 border-t border-accent/20 pt-6">
                <h3 className="text-lg font-medium mb-4">reply to {message.sender}</h3>
                <Textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply here..."
                  className="min-h-[200px] mb-4"
                />
                <div className="flex space-x-3">
                  <GlowButton onClick={handleSendReply}>
                    send reply
                  </GlowButton>
                  <GlowButton className="border border-primary bg-transparent text-foreground hover:bg-accent/10" onClick={() => setReplying(false)}>
                    cancel
                  </GlowButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}