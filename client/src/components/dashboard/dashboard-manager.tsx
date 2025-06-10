import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { DashboardWidget } from "@shared/schema";
import { Loader2 } from "lucide-react";
import DashboardLayout from "./dashboard-layout";
import { SortableDashboardWidget } from "./dashboard-layout";
import WidgetFactory from "./widgets/widget-factory";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DashboardManagerProps {
  role?: string;
  canReorder?: boolean;
}

export default function DashboardManager({ 
  role: initialRole,
  canReorder = true 
}: DashboardManagerProps) {
  const { toast } = useToast();
  const [role, setRole] = useState<string>(initialRole || "");
  
  // Fetch user's role if not provided
  const { data: userData } = useQuery<{ role: string }>({
    queryKey: ["/api/user"],
    enabled: !initialRole,
  });
  
  // Set role from user data if not provided
  useEffect(() => {
    if (!initialRole && userData?.role) {
      setRole(userData.role);
    }
  }, [initialRole, userData]);

  // Fetch widgets data
  const { 
    data: widgets,
    error: widgetsError, 
    isLoading: widgetsLoading
  } = useQuery<DashboardWidget[]>({
    queryKey: ["/api/widgets", role],
    enabled: !!role,
  });

  // Fetch layout data
  const { 
    data: layoutData
  } = useQuery<{ layout?: string[] }>({
    queryKey: ["/api/layouts", role],
    enabled: !!role,
  });

  // Use the layout from the server or create a default layout
  const [widgetIds, setWidgetIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (widgets && widgets.length > 0) {
      // If we have layoutData, use it
      if (layoutData?.layout) {
        // Filter out any widget IDs that don't exist in our current widgets
        const validWidgetIds = layoutData.layout.filter((id: string) => 
          widgets.some(widget => widget.id.toString() === id)
        );
        
        // Add any widgets not in the layout
        const widgetsNotInLayout = widgets
          .filter(widget => !layoutData.layout?.includes(widget.id.toString()))
          .map(widget => widget.id.toString());
        
        setWidgetIds([...validWidgetIds, ...widgetsNotInLayout]);
      } else {
        // No layout data, use widgets in their default order
        setWidgetIds(widgets.map(widget => widget.id.toString()));
      }
    }
  }, [widgets, layoutData]);

  // Save layout mutation
  const saveLayoutMutation = useMutation({
    mutationFn: async (layout: string[]) => {
      await apiRequest("POST", "/api/layouts", {
        role,
        layout
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/layouts", role] });
      toast({
        title: "Dashboard Updated",
        description: "Your dashboard layout has been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Dashboard",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle reordering of widgets
  const handleOrderChange = (newOrder: string[]) => {
    setWidgetIds(newOrder);
    if (canReorder) {
      saveLayoutMutation.mutate(newOrder);
    }
  };

  // Show loading state
  if (!role || widgetsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show error state
  if (widgetsError) {
    return (
      <div className="text-red-500 p-4 text-center">
        <p className="font-semibold mb-2">Error loading dashboard</p>
        <p className="text-sm text-red-400">{(widgetsError as Error).message}</p>
      </div>
    );
  }

  // No widgets available
  if (!widgets || widgets.length === 0) {
    return (
      <div className="text-center py-12 bg-black border border-gray-800 rounded-lg">
        <p className="text-gray-400">No dashboard widgets available</p>
      </div>
    );
  }

  return (
    <DashboardLayout 
      widgetIds={widgetIds}
      onOrderChange={handleOrderChange}
      canReorder={canReorder}
    >
      {widgets.map(widget => {
        // Only render widget if it's in our widgetIds array
        if (!widgetIds.includes(widget.id.toString())) {
          return null;
        }
        
        return (
          <SortableDashboardWidget key={widget.id} id={widget.id.toString()}>
            <WidgetFactory widget={widget} />
          </SortableDashboardWidget>
        );
      })}
    </DashboardLayout>
  );
}