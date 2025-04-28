import { ReactNode, useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DashboardLayoutProps {
  children: ReactNode;
  onOrderChange?: (newOrder: string[]) => void;
  widgetIds: string[];
  canReorder?: boolean;
}

export default function DashboardLayout({ 
  children, 
  onOrderChange,
  widgetIds,
  canReorder = true
}: DashboardLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>(widgetIds);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);
      
      if (onOrderChange) {
        onOrderChange(newOrder);
      }
    }
  }

  if (!canReorder) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    );
  }

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="flex flex-wrap gap-4">
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
}

interface SortableDashboardWidgetProps {
  id: string;
  children: ReactNode;
}

export function SortableDashboardWidget({ id, children }: SortableDashboardWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}