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
import { Loader2, Trash2, UserPlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@shared/schema";

const staffSchema = z.object({
  username: z.string().min(2, {
    message: "username must be at least 2 characters.",
  }),
  password: z.string().min(4, {
    message: "password must be at least 4 characters.",
  }),
});

type StaffFormValues = z.infer<typeof staffSchema>;

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"connections" | "staff">("connections");
  
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
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      username: "",
      password: "",
    },
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
