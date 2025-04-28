import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeSelector } from "@/components/theme-selector";
import AnimatedText from "@/components/animated-text";
import { GlowButton } from "@/components/ui/glow-button";
import { 
  Loader2, 
  Trash2, 
  LinkIcon, 
  PencilIcon, 
  ToggleLeft, 
  ToggleRight,
  Lock,
  Save,
  FileText,
  ImageIcon,
  DollarSign,
  PlusCircle,
  Package,
  Ruler,
  ShoppingCart,
  Printer,
  Settings
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { User, MenuLink, ContentBlock } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



const menuLinkSchema = z.object({
  label: z.string().min(2, {
    message: "label must be at least 2 characters.",
  }),
  url: z.string().min(1, {
    message: "url is required.",
  }),
  hasPage: z.boolean().optional().default(false),
  pageContent: z.string().optional(),
  order: z.number().min(0),
  active: z.boolean().optional().default(true),
});

const accountSchema = z.object({
  username: z.string().min(2, {
    message: "username must be at least 2 characters.",
  }),
  currentPassword: z.string().min(4, {
    message: "current password must be at least 4 characters.",
  }),
  newPassword: z.string().min(4, {
    message: "new password must be at least 4 characters.",
  }),
  confirmPassword: z.string().min(4, {
    message: "confirm password must be at least 4 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "passwords don't match",
  path: ["confirmPassword"],
});


const contentBlockSchema = z.object({
  key: z.string().min(2, {
    message: "key must be at least 2 characters.",
  }),
  title: z.string().min(1, {
    message: "title is required.",
  }),
  content: z.string().min(1, {
    message: "content is required.",
  }),
  placement: z.string().min(1, {
    message: "placement is required.",
  }),
  active: z.boolean().default(true),
  metaData: z.string().optional(),
});

type MenuLinkFormValues = z.infer<typeof menuLinkSchema>;
type AccountFormValues = z.infer<typeof accountSchema>;
type ContentBlockFormValues = z.infer<typeof contentBlockSchema>;

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"connections" | "menu-links" | "gallery" | "services" | "printing" | "account" | "themes" | "animations" | "content">("connections");
  const [editingMenuLink, setEditingMenuLink] = useState<MenuLink | null>(null);
  const [editingContentBlock, setEditingContentBlock] = useState<ContentBlock | null>(null);
  
  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: ["/api/connections"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch connections");
      }
      return res.json();
    },
  });
  
  const { data: menuLinks, isLoading: isLoadingMenuLinks } = useQuery<MenuLink[]>({
    queryKey: ["/api/menu-links"],
    enabled: tab === "menu-links",
  });
  
  const { data: contentBlocks, isLoading: isLoadingContentBlocks } = useQuery<ContentBlock[]>({
    queryKey: ["/api/content-blocks"],
    enabled: tab === "content",
  });
  
  const menuLinkForm = useForm<MenuLinkFormValues>({
    resolver: zodResolver(menuLinkSchema),
    defaultValues: {
      label: "",
      url: "",
      hasPage: false,
      pageContent: "",
      order: 0,
      active: true
    }
  });
  
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: user?.username || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  
  const contentBlockForm = useForm<ContentBlockFormValues>({
    resolver: zodResolver(contentBlockSchema),
    defaultValues: {
      key: "",
      title: "",
      content: "",
      placement: "home_hero",
      active: true,
      metaData: "{}"
    }
  });
  

  
  // Menu Link mutations
  const addMenuLinkMutation = useMutation({
    mutationFn: async (values: MenuLinkFormValues) => {
      const res = await apiRequest("POST", "/api/menu-links", values);
      return await res.json();
    },
    onSuccess: () => {
      menuLinkForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/menu-links"] });
      toast({
        title: "Menu link added",
        description: "New menu link has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add menu link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateMenuLinkMutation = useMutation({
    mutationFn: async (values: MenuLinkFormValues & { id: number }) => {
      const { id, ...linkData } = values;
      const res = await apiRequest("PATCH", `/api/menu-links/${id}`, linkData);
      return await res.json();
    },
    onSuccess: () => {
      setEditingMenuLink(null);
      menuLinkForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/menu-links"] });
      toast({
        title: "Menu link updated",
        description: "Menu link has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update menu link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const removeMenuLinkMutation = useMutation({
    mutationFn: async (menuLinkId: number) => {
      const res = await apiRequest("DELETE", `/api/menu-links/${menuLinkId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-links"] });
      toast({
        title: "Menu link removed",
        description: "Menu link has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove menu link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onMenuLinkSubmit = (values: MenuLinkFormValues) => {
    if (editingMenuLink) {
      updateMenuLinkMutation.mutate({ ...values, id: editingMenuLink.id });
    } else {
      addMenuLinkMutation.mutate(values);
    }
  };
  
  const handleEditMenuLink = (menuLink: MenuLink) => {
    setEditingMenuLink(menuLink);
    menuLinkForm.reset({
      label: menuLink.label,
      url: menuLink.url,
      hasPage: menuLink.hasPage,
      pageContent: menuLink.pageContent || "",
      order: menuLink.order,
      active: menuLink.active
    });
  };
  
  const handleRemoveMenuLink = (menuLinkId: number) => {
    removeMenuLinkMutation.mutate(menuLinkId);
  };
  
  const toggleMenuLinkActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number, active: boolean }) => {
      const res = await apiRequest("PATCH", `/api/menu-links/${id}`, { active });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-links"] });
      toast({
        title: "Menu link updated",
        description: "Link visibility has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update menu link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleActive = (menuLink: MenuLink) => {
    toggleMenuLinkActiveMutation.mutate({ 
      id: menuLink.id, 
      active: !menuLink.active 
    });
  };
  
  // Account update mutation
  const updateAccountMutation = useMutation({
    mutationFn: async (values: AccountFormValues) => {
      const res = await apiRequest("PATCH", "/api/user/owner", {
        username: values.username,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Account updated",
        description: "Your credentials have been updated successfully. You will be logged out now.",
      });
      
      // Logout after successful update
      setTimeout(() => {
        logoutMutation.mutate();
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update account",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onAccountSubmit = (values: AccountFormValues) => {
    updateAccountMutation.mutate(values);
  };
  
  // Content Block mutations
  const addContentBlockMutation = useMutation({
    mutationFn: async (values: ContentBlockFormValues) => {
      const res = await apiRequest("POST", "/api/content-blocks", values);
      return await res.json();
    },
    onSuccess: () => {
      contentBlockForm.reset({
        key: "",
        title: "",
        content: "",
        placement: "home_hero",
        active: true,
        metaData: "{}"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content-blocks"] });
      toast({
        title: "Content block added",
        description: "New content block has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add content block",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateContentBlockMutation = useMutation({
    mutationFn: async (values: ContentBlockFormValues & { id: number }) => {
      const { id, ...blockData } = values;
      const res = await apiRequest("PATCH", `/api/content-blocks/${id}`, blockData);
      return await res.json();
    },
    onSuccess: () => {
      setEditingContentBlock(null);
      contentBlockForm.reset({
        key: "",
        title: "",
        content: "",
        placement: "home_hero",
        active: true,
        metaData: "{}"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content-blocks"] });
      toast({
        title: "Content block updated",
        description: "Content block has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update content block",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const removeContentBlockMutation = useMutation({
    mutationFn: async (contentBlockId: number) => {
      const res = await apiRequest("DELETE", `/api/content-blocks/${contentBlockId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-blocks"] });
      toast({
        title: "Content block removed",
        description: "Content block has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove content block",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const toggleContentBlockActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number, active: boolean }) => {
      const res = await apiRequest("PATCH", `/api/content-blocks/${id}`, { active });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-blocks"] });
      toast({
        title: "Content block updated",
        description: "Block visibility has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update content block",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onContentBlockSubmit = (values: ContentBlockFormValues) => {
    if (editingContentBlock) {
      updateContentBlockMutation.mutate({ ...values, id: editingContentBlock.id });
    } else {
      addContentBlockMutation.mutate(values);
    }
  };
  
  const handleEditContentBlock = (contentBlock: ContentBlock) => {
    setEditingContentBlock(contentBlock);
    contentBlockForm.reset({
      key: contentBlock.key,
      title: contentBlock.title,
      content: contentBlock.content,
      placement: contentBlock.placement,
      active: contentBlock.active ?? true,
      metaData: contentBlock.metaData ?? "{}"
    });
  };
  
  const handleRemoveContentBlock = (contentBlockId: number) => {
    removeContentBlockMutation.mutate(contentBlockId);
  };
  
  const handleToggleContentBlockActive = (contentBlock: ContentBlock) => {
    toggleContentBlockActiveMutation.mutate({
      id: contentBlock.id,
      active: !contentBlock.active
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">owner dashboard</h1>
          <div className="flex items-center space-x-4">
            <GlowButton onClick={() => logoutMutation.mutate()}>
              logout
            </GlowButton>
          </div>
        </header>
        
        <div className="mb-6">
          <div className="flex flex-wrap border-b border-accent/30 mb-6">
            <button
              className={`px-4 py-2 ${tab === "connections" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setTab("connections")}
            >
              recent connections
            </button>

            <button
              className={`px-4 py-2 ${tab === "menu-links" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setTab("menu-links")}
            >
              menu links
            </button>
            <button
              className={`px-4 py-2 ${tab === "gallery" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setTab("gallery")}
            >
              gallery
            </button>
            <button
              className={`px-4 py-2 ${tab === "services" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setTab("services")}
            >
              services
            </button>
            <button
              className={`px-4 py-2 ${tab === "printing" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setTab("printing")}
            >
              printing
            </button>
            <button
              className={`px-4 py-2 ${tab === "themes" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setTab("themes")}
            >
              themes
            </button>
            <button
              className={`px-4 py-2 ${tab === "animations" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setTab("animations")}
            >
              animations
            </button>
            <button
              className={`px-4 py-2 ${tab === "content" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setTab("content")}
            >
              content
            </button>
            <button
              className={`px-4 py-2 ${tab === "account" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setTab("account")}
            >
              my account
            </button>
          </div>
        </div>
        
        {tab === "connections" && (
          <div className="bg-card p-6 rounded-lg border border-accent/20">
            <h2 className="text-xl mb-4">recent connections</h2>
            
            {isLoadingConnections ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : connections?.length > 0 ? (
              <div className="space-y-4">
                {connections.map((connection: any) => (
                  <div key={connection.id} className="border border-gray-700 p-4 rounded">
                    <p><strong>name:</strong> {connection.name}</p>
                    <p><strong>email:</strong> {connection.email}</p>
                    <p><strong>date:</strong> {new Date(connection.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 py-4">No connections yet.</p>
            )}
          </div>
        )}
        

        
        {tab === "gallery" && (
          <div className="bg-card p-6 rounded-lg border border-accent/20">
            <h2 className="text-xl mb-6">gallery management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-accent/30 rounded-lg flex flex-col items-center text-center hover:border-primary/70 transition-all">
                <ImageIcon className="h-12 w-12 mb-4"/>
                <h3 className="text-lg font-medium mb-2">manage artworks</h3>
                <p className="text-sm text-muted-foreground mb-4">Add, edit, or remove artwork from your gallery</p>
                <Link to="/admin-gallery-management">
                  <GlowButton className="w-full">
                    manage artworks
                  </GlowButton>
                </Link>
              </div>
              
              <div className="p-6 border border-accent/30 rounded-lg flex flex-col items-center text-center hover:border-primary/70 transition-all">
                <Ruler className="h-12 w-12 mb-4"/>
                <h3 className="text-lg font-medium mb-2">print sizes</h3>
                <p className="text-sm text-muted-foreground mb-4">Configure print sizes and pricing options</p>
                <Link to="/admin/gallery/sizes">
                  <GlowButton className="w-full">
                    manage sizes
                  </GlowButton>
                </Link>
              </div>
              
              <div className="p-6 border border-accent/30 rounded-lg flex flex-col items-center text-center hover:border-primary/70 transition-all">
                <ShoppingCart className="h-12 w-12 mb-4"/>
                <h3 className="text-lg font-medium mb-2">customer orders</h3>
                <p className="text-sm text-muted-foreground mb-4">View and manage customer print orders</p>
                <Link to="/admin/gallery/orders">
                  <GlowButton className="w-full">
                    view orders
                  </GlowButton>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {tab === "services" && (
          <div className="bg-card p-6 rounded-lg border border-accent/20">
            <h2 className="text-xl mb-6">services management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-accent/30 rounded-lg flex flex-col items-center text-center hover:border-primary/70 transition-all">
                <Settings className="h-12 w-12 mb-4"/>
                <h3 className="text-lg font-medium mb-2">manage services</h3>
                <p className="text-sm text-muted-foreground mb-4">Add, edit, or remove services from your catalog</p>
                <Link to="/admin/services/list">
                  <GlowButton className="w-full">
                    manage services
                  </GlowButton>
                </Link>
              </div>
              
              <div className="p-6 border border-accent/30 rounded-lg flex flex-col items-center text-center hover:border-primary/70 transition-all">
                <DollarSign className="h-12 w-12 mb-4"/>
                <h3 className="text-lg font-medium mb-2">pricing options</h3>
                <p className="text-sm text-muted-foreground mb-4">Set up service pricing and payment options</p>
                <Link to="/admin/services/pricing">
                  <GlowButton className="w-full">
                    manage pricing
                  </GlowButton>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {tab === "printing" && (
          <div className="bg-card p-6 rounded-lg border border-accent/20">
            <h2 className="text-xl mb-6">print service integration</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 border border-accent/30 rounded-lg flex flex-col">
                <div className="flex items-center mb-4">
                  <Printer className="h-8 w-8 mr-4"/>
                  <h3 className="text-lg font-medium">printing service settings</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect to your preferred printing service to fulfill artwork print orders automatically.
                  Your customers will be able to order prints and have them delivered directly.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">API Endpoint</label>
                    <Input 
                      className="bg-input border-input"
                      placeholder="https://api.yourprintservice.com/v1" 
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">API Key</label>
                    <Input 
                      className="bg-input border-input" 
                      type="password"
                      placeholder="Enter your print service API key" 
                    />
                  </div>
                  
                  <div className="flex flex-row items-center justify-between rounded-lg border border-input/20 p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <label>Enable automatic order processing</label>
                      <p className="text-xs text-muted-foreground">
                        Automatically send new orders to printing service
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <GlowButton className="w-full mt-2">
                  save settings
                </GlowButton>
              </div>
            </div>
          </div>
        )}
        
        {tab === "menu-links" && (
          <div className="grid gap-8">
            <div className="bg-card p-6 rounded-lg border border-accent/20">
              <h2 className="text-xl mb-4">
                {editingMenuLink ? "edit menu link" : "add menu link"}
                {editingMenuLink && (
                  <button 
                    onClick={() => {
                      setEditingMenuLink(null);
                      menuLinkForm.reset({
                        label: "",
                        url: "",
                        hasPage: false,
                        pageContent: "",
                        order: 0,
                        active: true
                      });
                    }}
                    className="ml-4 text-sm text-gray-400 hover:text-white"
                  >
                    (cancel)
                  </button>
                )}
              </h2>
              
              <Form {...menuLinkForm}>
                <form onSubmit={menuLinkForm.handleSubmit(onMenuLinkSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={menuLinkForm.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>label</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="about us" 
                              className="bg-input border-input" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={menuLinkForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>display order</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              className="bg-input border-input" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={menuLinkForm.control}
                    name="hasPage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input/20 p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>create a simple page</FormLabel>
                          <FormDescription className="text-muted-foreground">
                            Create a simple page instead of linking to external site
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={menuLinkForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{menuLinkForm.watch("hasPage") ? "page url (slug)" : "external url"}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={menuLinkForm.watch("hasPage") ? "about" : "https://example.com"} 
                            className="bg-input border-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-muted-foreground">
                          {menuLinkForm.watch("hasPage") 
                            ? "This will be accessible at /page/your-slug" 
                            : "Enter the full URL including https://"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {menuLinkForm.watch("hasPage") && (
                    <FormField
                      control={menuLinkForm.control}
                      name="pageContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>page content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="# My Page Title
                              
This is a paragraph of text.

## Subtitle

* List item 1
* List item 2" 
                              className="h-40 bg-input border-input" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-muted-foreground">
                            Use markdown syntax for formatting
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  

                  
                  <GlowButton 
                    type="submit"
                    disabled={addMenuLinkMutation.isPending || updateMenuLinkMutation.isPending}
                    className="mt-2"
                  >
                    {(addMenuLinkMutation.isPending || updateMenuLinkMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingMenuLink ? "updating..." : "adding..."}
                      </>
                    ) : (
                      <>
                        {editingMenuLink ? (
                          <PencilIcon className="mr-2 h-4 w-4" />
                        ) : (
                          <LinkIcon className="mr-2 h-4 w-4" />
                        )}
                        {editingMenuLink ? "update menu link" : "add menu link"}
                      </>
                    )}
                  </GlowButton>
                </form>
              </Form>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-accent/20">
              <h2 className="text-xl mb-4">menu links</h2>
              
              {isLoadingMenuLinks ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : menuLinks && menuLinks.length > 0 ? (
                <div className="space-y-3">
                  {menuLinks.map((menuLink: MenuLink) => (
                    <div key={menuLink.id} className="flex justify-between items-center border border-input/20 p-3 rounded">
                      <div className="flex flex-col">
                        <span className="font-medium">{menuLink.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {menuLink.hasPage ? `Page: /page/${menuLink.url}` : menuLink.url}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">show in menu</span>
                          <Switch
                            checked={menuLink.active}
                            onCheckedChange={() => handleToggleActive(menuLink)}
                            disabled={toggleMenuLinkActiveMutation.isPending}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-400"
                            onClick={() => handleEditMenuLink(menuLink)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          {/* Delete button removed, only using toggle functionality */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-4">No menu links found.</p>
              )}
            </div>
          </div>
        )}
        
        {tab === "themes" && (
          <div className="bg-card p-6 rounded-lg border border-accent/20">
            <h2 className="text-xl mb-6">theme settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-3">current theme</h3>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg mb-3">theme colors</h3>
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose from various seasonal, holiday, and custom themes. 
                    Changes will apply sitewide for all visitors.
                  </p>
                  <div className="w-full md:w-1/2">
                    <ThemeSelector />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-input/20 pt-6">
                <h3 className="text-lg mb-3">theme guidelines</h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                  <li>Theme changes apply to everyone visiting your site</li>
                  <li>Consider choosing themes that match your brand or current season</li>
                  <li>Dark/light mode preference is set per visitor's device</li>
                  <li>Custom themes have unique color combinations not tied to specific seasons</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {tab === "animations" && (
          <div className="bg-card p-6 rounded-lg border border-accent/20">
            <h2 className="text-xl mb-6">animation settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-3">site title animation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose how the site title "igivegreatweb.com" animates on the homepage.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="border border-input/20 p-4 rounded-lg">
                    <h4 className="mb-2">fade in</h4>
                    <div className="h-12 flex items-center">
                      <AnimatedText 
                        text="igivegreatweb.com" 
                        animationStyle="fade" 
                        hoverTrigger={true}
                        className="text-lg"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Text fades in gradually when page loads
                    </p>
                  </div>
                  
                  <div className="border border-input/20 p-4 rounded-lg">
                    <h4 className="mb-2">slide in</h4>
                    <div className="h-12 flex items-center">
                      <AnimatedText 
                        text="igivegreatweb.com" 
                        animationStyle="slide" 
                        hoverTrigger={true}
                        className="text-lg"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Text slides up smoothly into position
                    </p>
                  </div>
                  
                  <div className="border border-input/20 p-4 rounded-lg">
                    <h4 className="mb-2">bounce</h4>
                    <div className="h-12 flex items-center">
                      <AnimatedText 
                        text="igivegreatweb.com" 
                        animationStyle="bounce" 
                        hoverTrigger={true}
                        className="text-lg"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Text bounces playfully when displayed
                    </p>
                  </div>
                  
                  <div className="border border-input/20 p-4 rounded-lg">
                    <h4 className="mb-2">typing</h4>
                    <div className="h-12 flex items-center">
                      <AnimatedText 
                        text="igivegreatweb.com" 
                        animationStyle="typing" 
                        hoverTrigger={true}
                        className="text-lg"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Text appears as if being typed
                    </p>
                  </div>
                  
                  <div className="border border-input/20 p-4 rounded-lg">
                    <h4 className="mb-2">glow</h4>
                    <div className="h-12 flex items-center">
                      <AnimatedText 
                        text="igivegreatweb.com" 
                        animationStyle="glow" 
                        hoverTrigger={true}
                        className="text-lg"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Text glows with pulsing light effects
                    </p>
                  </div>
                  
                  <div className="border border-input/20 p-4 rounded-lg">
                    <h4 className="mb-2">none</h4>
                    <div className="h-12 flex items-center">
                      <span className="text-lg">igivegreatweb.com</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      No animation effect (static text)
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-input/20 pt-6">
                  <h3 className="text-lg mb-3">animation options</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure additional animation settings.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-lg border border-input/20 p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">hover animation</h4>
                        <p className="text-sm text-muted-foreground">
                          Trigger animation when visitors hover over the site title
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between rounded-lg border border-input/20 p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">repeat animation</h4>
                        <p className="text-sm text-muted-foreground">
                          Repeat animation periodically while on the site
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {tab === "account" && (
          <div className="bg-card p-6 rounded-lg border border-accent/20">
            <h2 className="text-xl mb-4">update owner credentials</h2>
            
            <div className="max-w-md">
              <Form {...accountForm}>
                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
                  <FormField
                    control={accountForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>new username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="owner" 
                            className="bg-input border-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={accountForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>current password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="your current password" 
                            className="bg-input border-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={accountForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>new password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="your new password" 
                            className="bg-input border-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={accountForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>confirm new password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="confirm your new password" 
                            className="bg-input border-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <GlowButton 
                    type="submit"
                    disabled={updateAccountMutation.isPending}
                    className="mt-4"
                  >
                    {updateAccountMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        updating...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        update credentials
                      </>
                    )}
                  </GlowButton>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}