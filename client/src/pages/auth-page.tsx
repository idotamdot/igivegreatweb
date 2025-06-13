import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema, User } from "@shared/schema";
import { Redirect } from "wouter";
import { useState, useEffect } from "react";

import { GlowButton } from "@/components/ui/glow-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";

const loginSchema = z.object({
  username: z.string().min(2, {
    message: "username must be at least 2 characters.",
  }),
  password: z.string().min(1, {
    message: "password is required.",
  }),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, {
    message: "please confirm your password.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Get the role from URL query parameter if present
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role');
  const initialRole = ['admin', 'staff', 'client'].includes(roleParam || '') 
    ? roleParam as string 
    : 'staff';
  
  const [activeTab, setActiveTab] = useState<string>(`${initialRole}-login`);
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: selectedRole, // Use the selected role
    },
  });

  // Update the role in the form when it changes
  useEffect(() => {
    registerForm.setValue("role", selectedRole);
  }, [selectedRole, registerForm]);

  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  function onRegisterSubmit(values: RegisterFormValues) {
    const { confirmPassword, ...registrationData } = values;
    registerMutation.mutate(registrationData as any);
  }
  
  // Helper function to determine which role is being used for login
  function getCurrentLoginRole() {
    switch(activeTab) {
      case 'admin-login': return 'Admin';
      case 'staff-login': return 'Staff';
      case 'client-login': return 'Client';
      default: return 'Staff';
    }
  }

  // Redirect if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-0">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-center">
        <Card className="w-full bg-black border border-white">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">{getCurrentLoginRole()} Login</CardTitle>
            <CardDescription>
              {activeTab.includes('login') ? 'sign in to access your account' : 'create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="operator-login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="operator-login">AI Operator</TabsTrigger>
                <TabsTrigger value="client-login">Client</TabsTrigger>
              </TabsList>
              
              <div className="mb-6">
                {activeTab.includes('login') ? (
                  <TabsList className="grid w-full grid-cols-2 mt-2">
                    <TabsTrigger value={`${selectedRole}-login`} onClick={() => setActiveTab(`${selectedRole}-login`)}>login</TabsTrigger>
                    <TabsTrigger value="register" onClick={() => {
                      // Extract role from current tab
                      const roleMatch = activeTab.match(/^(admin|staff|client)-login$/);
                      const role = roleMatch ? roleMatch[1] : 'staff';
                      setSelectedRole(role);
                      setActiveTab('register');
                    }}>register</TabsTrigger>
                  </TabsList>
                ) : (
                  <TabsList className="grid w-full grid-cols-1 mt-2">
                    <TabsTrigger value={`${selectedRole}-login`} onClick={() => setActiveTab(`${selectedRole}-login`)}>back to login</TabsTrigger>
                  </TabsList>
                )}
              </div>
              
              {/* AI Operator Login Tab */}
              <TabsContent value="operator-login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <div className="bg-gray-900 rounded-md p-4 mb-4">
                      <p className="text-cyber-green mb-2">AI Operator Access</p>
                      <p className="text-gray-400 text-sm">
                        Quantum neural network operators with full access to autonomous business systems, revenue optimization, and neural command center.
                      </p>
                    </div>
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="enter your username" 
                              className="bg-gray-900 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="enter your password" 
                              className="bg-gray-900 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <GlowButton 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "accessing neural networks..." : "access operator portal"}
                    </GlowButton>
                  </form>
                </Form>
              </TabsContent>
              

              
              {/* Client Login Tab */}
              <TabsContent value="client-login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <div className="bg-gray-900 rounded-md p-4 mb-4">
                      <p className="text-blue-400 mb-2">Client Portal</p>
                      <p className="text-gray-400 text-sm">
                        Access your autonomous projects, track quantum revenue optimization, and monitor AI operator progress in real-time.
                      </p>
                    </div>
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="enter your username" 
                              className="bg-gray-900 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="enter your password" 
                              className="bg-gray-900 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <GlowButton 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "logging in..." : "login to client area"}
                    </GlowButton>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Registration Tab */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="bg-gray-900 rounded-md p-4 mb-4">
                      <p className="text-purple-400 mb-2">register a new {selectedRole} account</p>
                      <p className="text-gray-400 text-sm">
                        Creating a new account will give you access based on your role.
                        {selectedRole === 'admin' && ' Admin accounts require approval from the owner.'}
                      </p>
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="choose a username" 
                              className="bg-gray-900 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="choose a password" 
                              className="bg-gray-900 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>confirm password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="confirm your password" 
                              className="bg-gray-900 text-white border-gray-700" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <GlowButton 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "registering..." : `register as ${selectedRole}`}
                    </GlowButton>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            <p>
              need help? <a href="mailto:support@igivegreatweb.com" className="text-white underline">contact support</a>
            </p>
          </CardFooter>
        </Card>
        
        <div className="hidden md:flex flex-col space-y-6 p-6">
          <h1 className="text-4xl font-light">welcome to igivegreatweb.com</h1>
          <p className="text-lg text-gray-300">
            choose your role to access the appropriate dashboard.
          </p>
          <ul className="space-y-4 text-gray-400">
            <li>
              <span className="text-amber-400 font-medium">admin:</span> full access to all features and settings
            </li>
            <li>
              <span className="text-blue-400 font-medium">staff:</span> create and manage content with approval workflows
            </li>
            <li>
              <span className="text-green-400 font-medium">client:</span> access to projects, files, and communications
            </li>
          </ul>
          <p className="text-gray-500 mt-8">
            by logging in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
