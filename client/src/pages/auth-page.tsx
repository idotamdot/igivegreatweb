import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema, User } from "@shared/schema";
import { Redirect } from "wouter";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState<string>("login");

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
      role: "staff",
    },
  });

  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  function onRegisterSubmit(values: RegisterFormValues) {
    const { confirmPassword, ...registrationData } = values;
    registerMutation.mutate(registrationData as any);
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
            <CardTitle className="text-xl md:text-2xl">staff login</CardTitle>
            <CardDescription>
              login or register for staff access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">login</TabsTrigger>
                <TabsTrigger value="register">register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
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
                      {loginMutation.isPending ? "logging in..." : "login"}
                    </GlowButton>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
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
                      {registerMutation.isPending ? "registering..." : "register"}
                    </GlowButton>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            {activeTab === "login" ? (
              <p>Don't have an account? <button onClick={() => setActiveTab("register")} className="text-white underline">Register</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setActiveTab("login")} className="text-white underline">Login</button></p>
            )}
          </CardFooter>
        </Card>
        
        <div className="hidden md:flex flex-col space-y-6 p-6">
          <h1 className="text-4xl font-light">welcome to igivegreatweb.com</h1>
          <p className="text-lg text-gray-300">
            login to access staff features and manage your content.
          </p>
          <p className="text-gray-500">
            if you're the owner, use your provided credentials to access the admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
