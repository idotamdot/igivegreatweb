import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
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
  FileText
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
import { User, MenuLink } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";



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


type MenuLinkFormValues = z.infer<typeof menuLinkSchema>;
type AccountFormValues = z.infer<typeof accountSchema>;

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"connections" | "menu-links" | "account" | "themes" | "animations">("connections");
  const [editingMenuLink, setEditingMenuLink] = useState<MenuLink | null>(null);
  
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
          <div className="flex border-b border-accent/30 mb-6">
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
                          <button
                            className="text-red-500 hover:text-red-400"
                            onClick={() => handleRemoveMenuLink(menuLink.id)}
                            disabled={removeMenuLinkMutation.isPending}
                          >
                            {removeMenuLinkMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
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