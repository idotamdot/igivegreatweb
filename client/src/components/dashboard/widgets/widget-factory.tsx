import { DashboardWidget } from "@shared/schema";
import RecentConnectionsWidget from "./recent-connections-widget";
import MenuLinksWidget from "./menu-links-widget";
import GalleryStatsWidget from "./gallery-stats-widget";
import RecentOrdersWidget from "./recent-orders-widget";
import { useState } from "react";

interface WidgetFactoryProps {
  widget: DashboardWidget;
}

export default function WidgetFactory({ widget }: WidgetFactoryProps) {
  const [error, setError] = useState<Error | null>(null);

  // Parse config from JSON string if needed
  let parsedConfig = widget.config;
  if (typeof widget.config === "string") {
    try {
      parsedConfig = JSON.parse(widget.config);
    } catch (err) {
      setError(new Error("Failed to parse widget configuration"));
      parsedConfig = {};
    }
  }
  
  // Render different widgets based on the type
  switch (widget.type) {
    case "recent-connections":
      return (
        <RecentConnectionsWidget 
          widgetId={widget.id.toString()} 
          title={widget.name} 
          config={parsedConfig as any}
        />
      );
      
    case "menu-links-overview":
      return (
        <MenuLinksWidget 
          widgetId={widget.id.toString()} 
          title={widget.name} 
          config={parsedConfig as any}
        />
      );
      
    case "gallery-stats":
      return (
        <GalleryStatsWidget 
          widgetId={widget.id.toString()} 
          title={widget.name} 
          config={parsedConfig as any}
        />
      );
      
    case "recent-orders":
      return (
        <RecentOrdersWidget 
          widgetId={widget.id.toString()} 
          title={widget.name} 
          config={parsedConfig as any}
        />
      );
      
    case "activity-log":
      // This would be replaced with an actual activity log widget once implemented
      return (
        <PlaceholderWidget 
          title={widget.name}
          type={widget.type}
          description="Shows recent user activity across the platform"
        />
      );
      
    case "client-projects":
      // This would be replaced with an actual client projects widget once implemented
      return (
        <PlaceholderWidget 
          title={widget.name}
          type={widget.type}
          description="Displays client project status and deadlines"
        />
      );
      
    case "client-messages":
      // This would be replaced with an actual client messages widget once implemented  
      return (
        <PlaceholderWidget 
          title={widget.name}
          type={widget.type}
          description="Shows recent messages and notifications"
        />
      );
      
    case "client-files":
      // This would be replaced with an actual client files widget once implemented
      return (
        <PlaceholderWidget 
          title={widget.name}
          type={widget.type}
          description="Displays recent file uploads and downloads"
        />
      );
      
    default:
      return (
        <PlaceholderWidget 
          title={widget.name}
          type={widget.type}
          description={`Unknown widget type: ${widget.type}`}
          error={true}
        />
      );
  }
}

interface PlaceholderWidgetProps {
  title: string;
  type: string;
  description: string;
  error?: boolean;
}

function PlaceholderWidget({ title, type, description, error = false }: PlaceholderWidgetProps) {
  return (
    <div className={`bg-card border rounded-lg overflow-hidden ${error ? "border-destructive" : ""}`}>
      <div className="p-4 border-b bg-muted/50">
        <h3 className="text-md font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className={`text-sm ${error ? "text-destructive" : "text-muted-foreground"} mb-2 font-medium`}>
          {type}
        </div>
        <div className={`text-xs ${error ? "text-destructive/80" : "text-muted-foreground/80"}`}>
          {description}
        </div>
      </div>
    </div>
  );
}