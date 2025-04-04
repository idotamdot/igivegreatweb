import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlowButton } from "@/components/ui/glow-button";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "please enter a valid email address.",
  }),
  message: z.string().min(5, {
    message: "message must be at least 5 characters.",
  }).max(500, {
    message: "message cannot exceed 500 characters."
  }),
});

type ConnectionFormValues = z.infer<typeof formSchema>;

interface ConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConnectDialog({ open, onOpenChange }: ConnectDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (values: ConnectionFormValues) => {
      const res = await apiRequest("POST", "/api/connections", values);
      return await res.json();
    },
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
      toast({
        title: "Thank you for connecting!",
        description: "We'll be in touch soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: ConnectionFormValues) {
    submitMutation.mutate(values);
  }

  // Close dialog with Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    
    if (open) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open, onOpenChange]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        
        <DialogPrimitive.Content 
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg border border-white bg-black p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
        >
          <div className="absolute inset-0 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.3),0_0_30px_rgba(255,255,255,0.15)] animate-[smooth-glow_6s_infinite_cubic-bezier(0.4,0,0.2,1)]"></div>
          
          <div className="relative z-10">
            <div className="flex flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white title-glow">let's connect</h2>
              <DialogPrimitive.Close 
                className="text-white hover:text-primary transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </DialogPrimitive.Close>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your name" 
                          className="bg-gray-900 text-white border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your email" 
                          className="bg-gray-900 text-white border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="tell us about your project" 
                          className="bg-gray-900 text-white border-gray-700 min-h-[120px] focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <GlowButton 
                  type="submit" 
                  className="w-full pulse-glow"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "connecting..." : "push to get connected"}
                </GlowButton>
              </form>
            </Form>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
