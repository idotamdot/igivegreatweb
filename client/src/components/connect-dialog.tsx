import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      
      <div 
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-black border-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg glow-dialog"
      >
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-white text-left title-glow">let's connect</DialogTitle>
          <button 
            className="text-white hover:text-primary transition-colors" 
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </DialogHeader>
        
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
              {submitMutation.isPending ? "submitting..." : "push to upgrade my life"}
            </GlowButton>
          </form>
        </Form>
      </div>
    </Dialog>
  );
}
