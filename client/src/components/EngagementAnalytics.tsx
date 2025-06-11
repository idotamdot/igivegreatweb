import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Target,
  BarChart3,
  Activity,
  Globe
} from 'lucide-react';

interface EngagementMetrics {
  activeUsers: number;
  searchQueries: number;
  businessViews: number;
  averageSessionTime: string;
  topCategories: Array<{
    name: string;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  realtimeActivity: Array<{
    action: string;
    timestamp: Date;
    location?: string;
  }>;
}

export default function EngagementAnalytics() {
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    activeUsers: 0,
    searchQueries: 0,
    businessViews: 0,
    averageSessionTime: '0:00',
    topCategories: [],
    realtimeActivity: []
  });

  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    // Simulate real-time metrics updates
    const updateMetrics = () => {
      const now = new Date();
      setMetrics(prev => ({
        activeUsers: Math.floor(Math.random() * 50) + 25,
        searchQueries: prev.searchQueries + Math.floor(Math.random() * 3),
        businessViews: prev.businessViews + Math.floor(Math.random() * 5),
        averageSessionTime: `${Math.floor(Math.random() * 15) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        topCategories: [
          { name: 'Healing & Wellness', percentage: 28, trend: 'up' },
          { name: 'Sustainable Living', percentage: 24, trend: 'up' },
          { name: 'Food & Nutrition', percentage: 18, trend: 'stable' },
          { name: 'Arts & Crafts', percentage: 15, trend: 'down' },
          { name: 'Technology', percentage: 15, trend: 'up' }
        ],
        realtimeActivity: [
          {
            action: 'Business viewed: Green Earth Organics',
            timestamp: new Date(now.getTime() - Math.random() * 300000),
            location: 'Portland, OR'
          },
          {
            action: 'Search: "organic skincare"',
            timestamp: new Date(now.getTime() - Math.random() * 600000),
            location: 'Austin, TX'
          },
          {
            action: 'Filter applied: Fair Trade',
            timestamp: new Date(now.getTime() - Math.random() * 900000),
            location: 'Denver, CO'
          }
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    // Auto-show analytics after user interaction
    const timer = setTimeout(() => setShowAnalytics(true), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!showAnalytics) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-in-left">
      <Card className="glass-card border-spring-fresh-green shadow-lg hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-spring-fresh-green">
            <Activity className="w-4 h-4" />
            Live Analytics
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-winter-pine">
                <Users className="w-4 h-4" />
                {metrics.activeUsers}
              </div>
              <div className="text-xs text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-winter-pine">
                <Eye className="w-4 h-4" />
                {metrics.businessViews}
              </div>
              <div className="text-xs text-gray-600">Business Views</div>
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3 h-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Trending Categories</span>
            </div>
            <div className="space-y-2">
              {metrics.topCategories.slice(0, 3).map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 truncate flex-1">
                    {category.name}
                  </span>
                  <div className="flex items-center gap-2 ml-2">
                    <Progress value={category.percentage} className="w-12 h-1" />
                    <TrendingUp 
                      className={`w-3 h-3 ${
                        category.trend === 'up' ? 'text-green-500' : 
                        category.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                      }`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3 h-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Recent Activity</span>
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {metrics.realtimeActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="text-xs text-gray-600">
                  <div className="truncate">{activity.action}</div>
                  {activity.location && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Globe className="w-2 h-2" />
                      {activity.location}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Score */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Engagement Score</span>
              <Badge className="bg-spring-gradient text-white text-xs">
                <Target className="w-3 h-3 mr-1" />
                High
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}