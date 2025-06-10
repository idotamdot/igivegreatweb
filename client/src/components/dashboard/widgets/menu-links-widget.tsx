import { useQuery } from "@tanstack/react-query";
import DashboardWidget from "../dashboard-widget";
import { MenuLink } from "@shared/schema";
import { Link } from "wouter";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface MenuLinksWidgetProps {
  widgetId: string;
  title?: string;
  config?: {
    showPending?: boolean;
    showActive?: boolean;
    showCount?: boolean;
  };
}

export default function MenuLinksWidget({ 
  widgetId, 
  title = "Menu Links Overview", 
  config = { showPending: true, showActive: true, showCount: true } 
}: MenuLinksWidgetProps) {
  const { data: menuLinks, error, isLoading } = useQuery<MenuLink[]>({
    queryKey: ["/api/menu-links"],
  });

  const showPending = config.showPending !== undefined ? config.showPending : true;
  const showActive = config.showActive !== undefined ? config.showActive : true;
  const showCount = config.showCount !== undefined ? config.showCount : true;

  // Calculate counts and filter links
  const allLinks = menuLinks || [];
  const activeLinks = allLinks.filter(link => link.active);
  const pendingLinks = allLinks.filter(link => !link.approved);
  const pendingCount = pendingLinks.length;
  const activeCount = activeLinks.length;
  const totalCount = allLinks.length;

  return (
    <DashboardWidget
      title={title}
      isLoading={isLoading}
      error={error as Error | null}
    >
      <div className="p-4">
        {allLinks.length === 0 && !isLoading ? (
          <p className="text-muted-foreground text-center py-8">No menu links available</p>
        ) : (
          <div className="space-y-4">
            {/* Counts section */}
            {showCount && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-muted p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold text-foreground">{totalCount}</p>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-lg font-semibold text-green-400">{activeCount}</p>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg font-semibold text-yellow-400">{pendingCount}</p>
                </div>
              </div>
            )}

            {/* Pending links section */}
            {showPending && pendingLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-yellow-400 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Pending Approval
                </h3>
                <ul className="space-y-1">
                  {pendingLinks.slice(0, 3).map(link => (
                    <li key={link.id} className="text-sm flex items-center justify-between bg-gray-900 p-2 rounded">
                      <span className="truncate max-w-[180px]">{link.label}</span>
                      {link.active ? (
                        <span className="text-xs bg-green-900 text-green-300 px-1.5 py-0.5 rounded">Active</span>
                      ) : (
                        <span className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">Inactive</span>
                      )}
                    </li>
                  ))}
                  {pendingLinks.length > 3 && (
                    <li className="text-xs text-gray-500 text-center">
                      +{pendingLinks.length - 3} more pending links
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Active links section */}
            {showActive && activeLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Active Links
                </h3>
                <ul className="space-y-1">
                  {activeLinks.slice(0, 5).map(link => (
                    <li key={link.id} className="text-sm flex items-center justify-between bg-gray-900 p-2 rounded">
                      <span className="truncate max-w-[180px]">{link.label}</span>
                      {link.approved ? (
                        <span className="text-xs bg-green-900 text-green-300 px-1.5 py-0.5 rounded">Approved</span>
                      ) : (
                        <span className="text-xs bg-yellow-900 text-yellow-300 px-1.5 py-0.5 rounded">Pending</span>
                      )}
                    </li>
                  ))}
                  {activeLinks.length > 5 && (
                    <li className="text-xs text-gray-500 text-center">
                      +{activeLinks.length - 5} more active links
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="pt-2 text-center">
              <Link to="/admin-menu-links" className="text-xs text-primary-500 hover:underline">
                Manage all menu links
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
}