import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MenuLink, insertMenuLinkSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Plus, 
  Link as LinkIcon, 
  Edit, 
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminMenuLinks() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<MenuLink | null>(null);

  const { data: menuLinks, isLoading, error } = useQuery<MenuLink[]>({
    queryKey: ["/api/menu-links"],
  });

  const form = useForm({
    resolver: zodResolver(insertMenuLinkSchema),
    defaultValues: {
      label: "",
      url: "",
      description: "",
      active: true,
    },
  });

  const createMenuLinkMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/menu-links", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-links"] });
      toast({
        title: "Menu link created",
        description: "The new menu link has been added successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating menu link",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateMenuLinkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PATCH", `/api/menu-links/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-links"] });
      toast({
        title: "Menu link updated",
        description: "The menu link has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingLink(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating menu link",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const toggleApprovalMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      await apiRequest("PATCH", `/api/menu-links/${id}/approval`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-links"] });
      toast({
        title: "Approval status updated",
        description: "The menu link approval status has been changed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating approval",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteMenuLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/menu-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-links"] });
      toast({
        title: "Menu link deleted",
        description: "The menu link has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting menu link",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    if (editingLink) {
      updateMenuLinkMutation.mutate({ id: editingLink.id, data });
    } else {
      createMenuLinkMutation.mutate(data);
    }
  };

  const openEditDialog = (link: MenuLink) => {
    setEditingLink(link);
    form.reset({
      label: link.label,
      url: link.url,
      description: link.description || "",
      active: link.active,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingLink(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold mb-2">Error loading menu links</h2>
        <p className="text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  const activeLinks = menuLinks?.filter(link => link.active) || [];
  const inactiveLinks = menuLinks?.filter(link => !link.active) || [];
  const approvedLinks = menuLinks?.filter(link => link.approved) || [];
  const pendingLinks = menuLinks?.filter(link => !link.approved) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-summer accent-summer">Menu Links Management</h1>
          <p className="text-muted-foreground">Manage site navigation and menu links</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-summer-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLink ? "Edit Menu Link" : "Create New Menu Link"}
              </DialogTitle>
              <DialogDescription>
                {editingLink ? "Update the menu link details" : "Add a new link to the site navigation"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter link label" {...field} />
                      </FormControl>
                      <FormDescription>
                        The text that will appear in the navigation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter URL or path" {...field} />
                      </FormControl>
                      <FormDescription>
                        The destination URL (e.g., /about, https://example.com)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormDescription>
                        A brief description of the link's purpose
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Should this link be visible in the navigation?
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
                <DialogFooter>
                  <Button type="submit" disabled={createMenuLinkMutation.isPending || updateMenuLinkMutation.isPending}>
                    {editingLink ? "Update Link" : "Create Link"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-spring">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-spring">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuLinks?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="card-summer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-summer">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLinks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="card-winter">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-winter">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLinks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-winter-gradient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLinks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Links List */}
      <div className="space-y-4">
        {!menuLinks || menuLinks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <LinkIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No menu links found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first menu link to get started
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Link
              </Button>
            </CardContent>
          </Card>
        ) : (
          menuLinks.map((link, index) => {
            const seasonClass = index % 3 === 0 ? 'card-spring' : index % 3 === 1 ? 'card-summer' : 'card-winter';
            const textClass = index % 3 === 0 ? 'text-spring' : index % 3 === 1 ? 'text-summer' : 'text-winter';
            
            return (
              <Card key={link.id} className={seasonClass}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className={`text-lg ${textClass}`}>
                          {link.label}
                        </CardTitle>
                        <div className="flex gap-1">
                          {link.active ? (
                            <Badge variant="default" className="bg-green-500">
                              <Eye className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                          {link.approved ? (
                            <Badge variant="default" className="bg-blue-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                              <XCircle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        {link.url}
                      </CardDescription>
                      {link.description && (
                        <CardDescription>{link.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApprovalMutation.mutate({ 
                          id: link.id, 
                          approved: !link.approved 
                        })}
                      >
                        {link.approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(link)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Menu Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{link.label}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMenuLinkMutation.mutate(link.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}