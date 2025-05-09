import { useQuery } from "@tanstack/react-query";
import DashboardWidget from "../dashboard-widget";
import { Artwork } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

interface GalleryStatsWidgetProps {
  widgetId: string;
  title?: string;
  config?: {
    showTotalArtworks?: boolean;
    showTotalSales?: boolean;
    showTopCategories?: boolean;
  };
}

export default function GalleryStatsWidget({ 
  widgetId, 
  title = "Gallery Statistics", 
  config = { showTotalArtworks: true, showTotalSales: true, showTopCategories: true } 
}: GalleryStatsWidgetProps) {
  const { data: artworks, error, isLoading } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks"],
  });

  const showTotalArtworks = config.showTotalArtworks !== undefined ? config.showTotalArtworks : true;
  const showTotalSales = config.showTotalSales !== undefined ? config.showTotalSales : true;
  const showTopCategories = config.showTopCategories !== undefined ? config.showTopCategories : true;

  // Calculate stats
  const totalArtworks = artworks?.length || 0;
  const featuredArtworks = artworks?.filter(a => a.featured).length || 0;
  const visibleArtworks = artworks?.filter(a => a.visible).length || 0;
  
  // Get category stats
  const categories = artworks?.reduce((acc, artwork) => {
    const category = artwork.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>) || {};

  const categoryData = Object.entries(categories).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  // Colors for the chart
  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#48BFE3', '#6A0572'];

  return (
    <DashboardWidget
      title={title}
      isLoading={isLoading}
      error={error as Error | null}
    >
      <div className="p-4">
        {!totalArtworks && !isLoading ? (
          <p className="text-gray-400 text-center py-8">No artwork data available</p>
        ) : (
          <div className="space-y-4">
            {/* Overview stats */}
            {showTotalArtworks && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-900 p-3 rounded-md text-center">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-lg font-semibold text-white">{totalArtworks}</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-md text-center">
                  <p className="text-xs text-gray-400">Featured</p>
                  <p className="text-lg font-semibold text-purple-400">{featuredArtworks}</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-md text-center">
                  <p className="text-xs text-gray-400">Visible</p>
                  <p className="text-lg font-semibold text-green-400">{visibleArtworks}</p>
                </div>
              </div>
            )}

            {/* Category chart */}
            {showTopCategories && categoryData.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-400 mb-3 text-center">Categories</h3>
                <div className="h-[110px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        <Label 
                          value={totalArtworks} 
                          position="center" 
                          className="text-lg font-semibold" 
                          fill="#ffffff" 
                        />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Category legend */}
                <div className="mt-2 grid grid-cols-2 text-xs gap-y-1 gap-x-2">
                  {categoryData.slice(0, 4).map((category, index) => (
                    <div key={category.name} className="flex items-center">
                      <span 
                        className="w-2 h-2 rounded-full mr-1" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate">{category.name}</span>
                      <span className="ml-1 text-gray-500">({category.value})</span>
                    </div>
                  ))}
                  {categoryData.length > 4 && (
                    <div className="col-span-2 text-center text-gray-500 text-xs">
                      +{categoryData.length - 4} more categories
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
}