import { useQuery } from "@tanstack/react-query";
import DashboardWidget from "../dashboard-widget";
import { formatDistanceToNow } from "date-fns";
import { Connection } from "@shared/schema";

interface RecentConnectionsWidgetProps {
  widgetId: string;
  title?: string;
  config?: {
    limit?: number;
    showDate?: boolean;
    showEmail?: boolean;
  };
}

export default function RecentConnectionsWidget({ 
  widgetId, 
  title = "Recent Connections", 
  config = { limit: 5, showDate: true, showEmail: true } 
}: RecentConnectionsWidgetProps) {
  const { data: connections, error, isLoading } = useQuery<Connection[]>({
    queryKey: ["/api/connections"],
  });

  const limit = config.limit || 5;
  const showDate = config.showDate !== undefined ? config.showDate : true;
  const showEmail = config.showEmail !== undefined ? config.showEmail : true;

  const recentConnections = connections 
    ? [...connections].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
    : [];

  return (
    <DashboardWidget
      title={title}
      isLoading={isLoading}
      error={error as Error | null}
    >
      <div className="p-4">
        {recentConnections.length === 0 && !isLoading ? (
          <p className="text-gray-400 text-center py-8">No connections yet</p>
        ) : (
          <ul className="space-y-3">
            {recentConnections.map((connection) => (
              <li key={connection.id} className="border-b border-gray-800 pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">{connection.name}</p>
                    {showEmail && <p className="text-sm text-gray-400">{connection.email}</p>}
                  </div>
                  {showDate && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(connection.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardWidget>
  );
}