import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export interface DashboardWidgetProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
  onSettingsClick?: () => void;
  children: ReactNode;
  minHeight?: string; // Allows setting minimum height for consistent layouts
  width?: "full" | "half" | "third";
}

export default function DashboardWidget({
  title,
  description,
  isLoading = false,
  error = null,
  className = "",
  onSettingsClick,
  children,
  minHeight = "min-h-[200px]",
  width = "full"
}: DashboardWidgetProps) {
  // Calculate width class based on the width prop
  const widthClass = {
    full: "w-full",
    half: "w-full md:w-[calc(50%-0.5rem)]",
    third: "w-full md:w-[calc(33.333%-0.66rem)]"
  }[width];

  return (
    <Card className={`overflow-hidden ${widthClass} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-md font-semibold text-foreground">{title}</CardTitle>
            {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
          </div>
          {onSettingsClick && (
            <button 
              onClick={onSettingsClick}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Widget settings"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className={`p-0 ${minHeight}`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center p-6 text-center">
            <div className="text-destructive">
              <p className="font-medium mb-1">Error loading widget</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}