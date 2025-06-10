import { useQuery } from "@tanstack/react-query";
import DashboardWidget from "../dashboard-widget";
import { PrintOrder, Artwork } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";

interface RecentOrdersWidgetProps {
  widgetId: string;
  title?: string;
  config?: {
    limit?: number;
    showStatus?: boolean;
    showDate?: boolean;
  };
}

export default function RecentOrdersWidget({ 
  widgetId, 
  title = "Recent Orders", 
  config = { limit: 5, showStatus: true, showDate: true } 
}: RecentOrdersWidgetProps) {
  const { user } = useAuth();
  
  const { data: orders, error, isLoading } = useQuery<PrintOrder[]>({
    queryKey: ["/api/print-orders"],
    enabled: !!user,
  });

  const { data: artworks } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks"],
    enabled: !!orders && orders.length > 0,
  });

  const limit = config.limit || 5;
  const showStatus = config.showStatus !== undefined ? config.showStatus : true;
  const showDate = config.showDate !== undefined ? config.showDate : true;

  const recentOrders = orders 
    ? [...orders].slice(0, limit)
    : [];

  const getArtwork = (artworkId: number) => {
    return artworks?.find(artwork => artwork.id === artworkId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "processing":
        return <Package className="w-4 h-4 text-blue-400" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-400" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "processing":
        return "text-blue-400";
      case "shipped":
        return "text-purple-400";
      case "delivered":
        return "text-green-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <DashboardWidget
      title={title}
      isLoading={isLoading}
      error={error as Error | null}
    >
      <div className="p-4">
        {recentOrders.length === 0 && !isLoading ? (
          <p className="text-muted-foreground text-center py-8">No orders yet</p>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((order) => {
              const artwork = getArtwork(order.artworkId);
              return (
                <li key={order.id} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {showStatus && getStatusIcon(order.status)}
                        <p className="font-medium text-foreground text-sm">
                          {artwork?.title || `Order #${order.id}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {order.isOriginal ? (
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                            Original
                          </span>
                        ) : (
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            Print
                          </span>
                        )}
                        {showStatus && (
                          <span className={`capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        ${parseFloat(order.price.toString()).toFixed(2)}
                      </p>
                      {showDate && order.orderDate && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(order.orderDate), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </DashboardWidget>
  );
}