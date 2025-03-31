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
import { GlowButton } from "@/components/ui/glow-button";
import { 
  Loader2, 
  Trash2, 
  UserPlus, 
  LinkIcon, 
  PencilIcon, 
  ToggleLeft, 
  ToggleRight,
  Lock,
  User as UserIcon,
  Save,
  FileText,
  FileSignature,
  CheckSquare,
  Square,
  Plus
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { User, MenuLink, Agreement, UserAgreement } from "@shared/schema";

const staffSchema = z.object({
  username: z.string().min(2, {
    message: "username must be at least 2 characters.",
  }),
  password: z.string().min(4, {
    message: "password must be at least 4 characters.",
  }),
});

const menuLinkSchema = z.object({
  label: z.string().min(2, {
    message: "label must be at least 2 characters.",
  }),
  url: z.string().min(1, {
    message: "url is required.",
  }),
  order: z.number().min(0),
  active: z.boolean(),
});

const agreementSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "content must be at least 10 characters.",
  }),
  version: z.string().min(1, {
    message: "version is required.",
  }),
  active: z.boolean(),
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

type StaffFormValues = z.infer<typeof staffSchema>;
type MenuLinkFormValues = z.infer<typeof menuLinkSchema>;
type AgreementFormValues = z.infer<typeof agreementSchema>;
type AccountFormValues = z.infer<typeof accountSchema>;

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"connections" | "staff" | "menu-links" | "agreements" | "account">("connections");
  const [editingMenuLink, setEditingMenuLink] = useState<MenuLink | null>(null);
  const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null);
  
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
  
  const { data: staff, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch staff members");
      }
      return res.json();
    },
  });
  
  const { data: menuLinks, isLoading: isLoadingMenuLinks } = useQuery<MenuLink[]>({
    queryKey: ["/api/menu-links"],
    enabled: tab === "menu-links",
  });
  
  const { data: agreements, isLoading: isLoadingAgreements } = useQuery<Agreement[]>({
    queryKey: ["/api/agreements"],
    enabled: tab === "agreements",
  });
  
  const { data: userAgreements, isLoading: isLoadingUserAgreements } = useQuery<UserAgreement[]>({
    queryKey: ["/api/user-agreements"],
    enabled: tab === "agreements",
  });
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const menuLinkForm = useForm<MenuLinkFormValues>({
    resolver: zodResolver(menuLinkSchema),
    defaultValues: {
      label: "",
      url: "",
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
  
  const agreementForm = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema),
    defaultValues: {
      title: "",
      content: "",
      version: "1.0",
      active: true
    }
  });
  
  const addStaffMutation = useMutation({
    mutationFn: async (values: StaffFormValues) => {
      const res = await apiRequest("POST", "/api/users", {
        ...values,
        role: "staff",
      });
      return await res.json();
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Staff member added",
        description: "New staff member has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const removeStaffMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("DELETE", `/api/users/${userId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Staff member removed",
        description: "Staff member has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: StaffFormValues) => {
    addStaffMutation.mutate(values);
  };
  
  const handleRemoveStaff = (userId: number) => {
    removeStaffMutation.mutate(userId);
  };
  
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
      order: menuLink.order,
      active: menuLink.active
    });
  };
  
  const handleRemoveMenuLink = (menuLinkId: number) => {
    removeMenuLinkMutation.mutate(menuLinkId);
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
  
  // Agreement mutations
  const addAgreementMutation = useMutation({
    mutationFn: async (values: AgreementFormValues) => {
      const res = await apiRequest("POST", "/api/agreements", values);
      return await res.json();
    },
    onSuccess: () => {
      agreementForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/agreements"] });
      toast({
        title: "Agreement created",
        description: "New agreement has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create agreement",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateAgreementMutation = useMutation({
    mutationFn: async (values: AgreementFormValues & { id: number }) => {
      const { id, ...agreementData } = values;
      const res = await apiRequest("PATCH", `/api/agreements/${id}`, agreementData);
      return await res.json();
    },
    onSuccess: () => {
      setEditingAgreement(null);
      agreementForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/agreements"] });
      toast({
        title: "Agreement updated",
        description: "Agreement has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update agreement",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const removeAgreementMutation = useMutation({
    mutationFn: async (agreementId: number) => {
      const res = await apiRequest("DELETE", `/api/agreements/${agreementId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agreements"] });
      toast({
        title: "Agreement removed",
        description: "Agreement has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove agreement",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const assignAgreementMutation = useMutation({
    mutationFn: async ({ userId, agreementId }: { userId: number, agreementId: number }) => {
      const res = await apiRequest("POST", "/api/user-agreements", {
        userId,
        agreementId,
        signed: false
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-agreements"] });
      toast({
        title: "Agreement assigned",
        description: "Agreement has been assigned to staff member successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to assign agreement",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onAgreementSubmit = (values: AgreementFormValues) => {
    if (editingAgreement) {
      updateAgreementMutation.mutate({ ...values, id: editingAgreement.id });
    } else {
      addAgreementMutation.mutate(values);
    }
  };
  
  const handleEditAgreement = (agreement: Agreement) => {
    setEditingAgreement(agreement);
    agreementForm.reset({
      title: agreement.title,
      content: agreement.content,
      version: agreement.version,
      active: agreement.active
    });
  };
  
  const handleRemoveAgreement = (agreementId: number) => {
    removeAgreementMutation.mutate(agreementId);
  };
  
  const handleAssignAgreement = (userId: number, agreementId: number) => {
    assignAgreementMutation.mutate({ userId, agreementId });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">owner dashboard</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <GlowButton onClick={() => logoutMutation.mutate()}>
              logout
            </GlowButton>
          </div>
        </header>
        
        <div className="mb-6">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`px-4 py-2 ${tab === "connections" ? "border-b-2 border-white" : ""}`}
              onClick={() => setTab("connections")}
            >
              recent connections
            </button>
            <button
              className={`px-4 py-2 ${tab === "staff" ? "border-b-2 border-white" : ""}`}
              onClick={() => setTab("staff")}
            >
              staff management
            </button>
            <button
              className={`px-4 py-2 ${tab === "menu-links" ? "border-b-2 border-white" : ""}`}
              onClick={() => setTab("menu-links")}
            >
              menu links
            </button>
            <button
              className={`px-4 py-2 ${tab === "agreements" ? "border-b-2 border-white" : ""}`}
              onClick={() => setTab("agreements")}
            >
              agreements
            </button>
            <button
              className={`px-4 py-2 ${tab === "account" ? "border-b-2 border-white" : ""}`}
              onClick={() => setTab("account")}
            >
              my account
            </button>
          </div>
        </div>
        
        {tab === "connections" && (
          <div className="bg-gray-900 p-6 rounded-lg">
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
        
        {tab === "staff" && (
          <div className="grid gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl mb-4">add staff member</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="staff username" 
                              className="bg-gray-800 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password"
                              placeholder="staff password" 
                              className="bg-gray-800 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <GlowButton 
                    type="submit"
                    disabled={addStaffMutation.isPending}
                    className="mt-2"
                  >
                    {addStaffMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        adding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        add staff member
                      </>
                    )}
                  </GlowButton>
                </form>
              </Form>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl mb-4">current staff</h2>
              
              {isLoadingStaff ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : staff?.length > 0 ? (
                <div className="space-y-3">
                  {staff.map((staffMember: User) => (
                    <div key={staffMember.id} className="flex justify-between items-center border border-gray-700 p-3 rounded">
                      <span>{staffMember.username}</span>
                      <button
                        className={`text-red-500 ${staffMember.role === "owner" ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => staffMember.role !== "owner" && handleRemoveStaff(staffMember.id)}
                        disabled={staffMember.role === "owner" || removeStaffMutation.isPending}
                      >
                        {removeStaffMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 py-4">No staff members found.</p>
              )}
            </div>
          </div>
        )}
        
        {tab === "agreements" && (
          <div className="grid gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl mb-4">
                {editingAgreement ? "edit agreement" : "create agreement"}
                {editingAgreement && (
                  <button 
                    onClick={() => {
                      setEditingAgreement(null);
                      agreementForm.reset({
                        title: "",
                        content: "",
                        version: "1.0",
                        active: true
                      });
                    }}
                    className="ml-4 text-sm text-gray-400 hover:text-white"
                  >
                    (cancel)
                  </button>
                )}
              </h2>
              
              <Form {...agreementForm}>
                <form onSubmit={agreementForm.handleSubmit(onAgreementSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={agreementForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Employee Handbook" 
                              className="bg-gray-800 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={agreementForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>content</FormLabel>
                          <FormControl>
                            <textarea 
                              placeholder="Agreement content..." 
                              className="w-full h-40 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={agreementForm.control}
                        name="version"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>version</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="1.0" 
                                className="bg-gray-800 text-white border-gray-700" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={agreementForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>active</FormLabel>
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
                    </div>
                  </div>
                  
                  <GlowButton 
                    type="submit"
                    disabled={addAgreementMutation.isPending || updateAgreementMutation.isPending}
                    className="mt-2"
                  >
                    {(addAgreementMutation.isPending || updateAgreementMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingAgreement ? "updating..." : "creating..."}
                      </>
                    ) : (
                      <>
                        {editingAgreement ? (
                          <PencilIcon className="mr-2 h-4 w-4" />
                        ) : (
                          <FileText className="mr-2 h-4 w-4" />
                        )}
                        {editingAgreement ? "update agreement" : "create agreement"}
                      </>
                    )}
                  </GlowButton>
                </form>
              </Form>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl mb-4">active agreements</h2>
              
              {isLoadingAgreements ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : agreements && agreements.length > 0 ? (
                <div className="space-y-4">
                  {agreements.filter((agreement: Agreement) => agreement.active).map((agreement: Agreement) => (
                    <div key={agreement.id} className="border border-gray-700 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium">{agreement.title}</h3>
                          <div className="flex items-center mt-1 space-x-2 text-sm text-gray-400">
                            <span>Version: {agreement.version}</span>
                            <span>•</span>
                            <span>Created: {new Date(agreement.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-400"
                            onClick={() => handleEditAgreement(agreement)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-400"
                            onClick={() => handleRemoveAgreement(agreement.id)}
                            disabled={removeAgreementMutation.isPending}
                          >
                            {removeAgreementMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">{agreement.content.length > 150 ? `${agreement.content.substring(0, 150)}...` : agreement.content}</p>
                      
                      {staff && staff.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <h4 className="text-sm font-medium mb-2">Assign to staff:</h4>
                          <div className="flex flex-wrap gap-2">
                            {staff.filter((s: User) => s.role !== "owner").map((staffMember: User) => {
                              const isAssigned = userAgreements?.some((ua: UserAgreement) => 
                                ua.userId === staffMember.id && 
                                ua.agreementId === agreement.id
                              );
                              
                              return (
                                <button
                                  key={staffMember.id}
                                  onClick={() => !isAssigned && handleAssignAgreement(staffMember.id, agreement.id)}
                                  disabled={isAssigned || assignAgreementMutation.isPending}
                                  className={`px-3 py-1.5 text-xs rounded-full flex items-center ${
                                    isAssigned 
                                      ? 'bg-green-900/30 text-green-400 border border-green-600/30'
                                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                                  }`}
                                >
                                  {isAssigned ? (
                                    <>
                                      <CheckSquare className="h-3 w-3 mr-1" />
                                      {staffMember.username}
                                    </>
                                  ) : (
                                    <>
                                      <Square className="h-3 w-3 mr-1" />
                                      {staffMember.username}
                                    </>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 py-4">No active agreements found.</p>
              )}
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl mb-4">inactive agreements</h2>
              
              {isLoadingAgreements ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : agreements && agreements.filter((a: Agreement) => !a.active).length > 0 ? (
                <div className="space-y-4">
                  {agreements.filter((agreement: Agreement) => !agreement.active).map((agreement: Agreement) => (
                    <div key={agreement.id} className="border border-gray-700/50 p-4 rounded opacity-70">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium">{agreement.title}</h3>
                          <div className="flex items-center mt-1 space-x-2 text-sm text-gray-400">
                            <span>Version: {agreement.version}</span>
                            <span>•</span>
                            <span>Created: {new Date(agreement.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-400"
                            onClick={() => handleEditAgreement(agreement)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-400"
                            onClick={() => handleRemoveAgreement(agreement.id)}
                            disabled={removeAgreementMutation.isPending}
                          >
                            {removeAgreementMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{agreement.content.length > 150 ? `${agreement.content.substring(0, 150)}...` : agreement.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 py-4">No inactive agreements found.</p>
              )}
            </div>
          </div>
        )}
        
        {tab === "account" && (
          <div className="bg-gray-900 p-6 rounded-lg">
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
                            className="bg-gray-800 text-white border-gray-700" 
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
                            className="bg-gray-800 text-white border-gray-700" 
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
                            className="bg-gray-800 text-white border-gray-700" 
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
                            placeholder="confirm new password" 
                            className="bg-gray-800 text-white border-gray-700" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <GlowButton 
                      type="submit"
                      disabled={updateAccountMutation.isPending}
                      className="w-full"
                    >
                      {updateAccountMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          updating credentials...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          update credentials
                        </>
                      )}
                    </GlowButton>
                  </div>
                </form>
              </Form>
              
              <div className="mt-6 p-4 border border-yellow-500/20 bg-yellow-500/10 rounded text-yellow-300 text-sm">
                <p className="flex items-start">
                  <Lock className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>After updating your credentials, you'll be logged out and will need to log in again with your new username and password.</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {tab === "menu-links" && (
          <div className="grid gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl mb-4">
                {editingMenuLink ? "edit menu link" : "add menu link"}
                {editingMenuLink && (
                  <button 
                    onClick={() => {
                      setEditingMenuLink(null);
                      menuLinkForm.reset({
                        label: "",
                        url: "",
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
                              placeholder="home" 
                              className="bg-gray-800 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={menuLinkForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>url</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="/" 
                              className="bg-gray-800 text-white border-gray-700" 
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
                          <FormLabel>order</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              className="bg-gray-800 text-white border-gray-700" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={menuLinkForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>active</FormLabel>
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
                  </div>
                  
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
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl mb-4">current menu links</h2>
              
              {isLoadingMenuLinks ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : menuLinks && menuLinks.length > 0 ? (
                <div className="space-y-3">
                  {menuLinks.map((menuLink: MenuLink) => (
                    <div key={menuLink.id} className="grid grid-cols-12 gap-2 border border-gray-700 p-3 rounded">
                      <div className="col-span-1 flex items-center">
                        <span className="text-gray-500 text-sm">{menuLink.order}</span>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <span className={`${!menuLink.active ? "line-through text-gray-500" : ""}`}>{menuLink.label}</span>
                      </div>
                      <div className="col-span-4 flex items-center">
                        <span className="text-blue-400">{menuLink.url}</span>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <span className={`text-sm ${menuLink.active ? "text-green-500" : "text-gray-500"}`}>
                          {menuLink.active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center justify-end space-x-2">
                        <button
                          className="text-yellow-500 hover:text-yellow-400"
                          onClick={() => handleEditMenuLink(menuLink)}
                          disabled={updateMenuLinkMutation.isPending}
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
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 py-4">No menu links found.</p>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>logged in as: {user?.username} ({user?.role})</p>
          <Link href="/" className="text-gray-400 hover:text-white">
            back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
