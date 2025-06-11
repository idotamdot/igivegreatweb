import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  TrendingUp, 
  Star, 
  MapPin, 
  Clock,
  Gift,
  Users,
  Lightbulb,
  Heart
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'recommendation' | 'trending' | 'local' | 'values' | 'insight';
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  icon: any;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  category?: string;
}

export default function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [userPreferences, setUserPreferences] = useState({
    categories: [] as string[],
    values: [] as string[],
    location: '',
    engagementPattern: 'explorer' // explorer, focused, researcher
  });

  useEffect(() => {
    // Analyze user behavior and generate intelligent notifications
    const generateSmartNotifications = () => {
      const intelligentNotifications: Notification[] = [
        {
          id: '1',
          type: 'recommendation',
          title: 'Perfect Match Found',
          message: 'Green Earth Organics matches 95% of your preferences: Organic, Local Business, Fair Trade',
          actionText: 'View Business',
          actionUrl: '/business/green-earth-organics',
          icon: Heart,
          priority: 'high',
          timestamp: new Date(),
          category: 'Food & Nutrition'
        },
        {
          id: '2',
          type: 'trending',
          title: 'Trending in Your Area',
          message: 'Sustainable fashion is gaining 40% more interest in Portland. 3 new ethical brands joined this week.',
          actionText: 'Explore Trend',
          icon: TrendingUp,
          priority: 'medium',
          timestamp: new Date(Date.now() - 300000),
          category: 'Sustainable Living'
        },
        {
          id: '3',
          type: 'local',
          title: 'New Local Business',
          message: 'Mindful Wellness Studio just opened 2.1 miles from you. Woman-owned, community-focused.',
          actionText: 'Learn More',
          icon: MapPin,
          priority: 'medium',
          timestamp: new Date(Date.now() - 600000),
          category: 'Healing & Wellness'
        },
        {
          id: '4',
          type: 'values',
          title: 'Values Alignment',
          message: 'Found 12 businesses matching your Fair Trade preference. 3 are having special community events.',
          actionText: 'View All',
          icon: Star,
          priority: 'low',
          timestamp: new Date(Date.now() - 900000),
          category: 'Multiple'
        },
        {
          id: '5',
          type: 'insight',
          title: 'Personal Insight',
          message: 'You explore 3x more wellness businesses than average users. Here are curated recommendations.',
          actionText: 'See Recommendations',
          icon: Lightbulb,
          priority: 'low',
          timestamp: new Date(Date.now() - 1200000),
          category: 'Healing & Wellness'
        }
      ];

      setNotifications(intelligentNotifications);
      
      // Show high priority notifications first
      const highPriority = intelligentNotifications.find(n => n.priority === 'high');
      if (highPriority && !currentNotification) {
        setCurrentNotification(highPriority);
      }
    };

    // Simulate user behavior tracking
    const trackUserBehavior = () => {
      // Track which categories user clicks on
      const clickedCategories = ['Healing & Wellness', 'Sustainable Living', 'Food & Nutrition'];
      const selectedValues = ['Organic', 'Local Business', 'Fair Trade', 'Woman-Owned'];
      
      setUserPreferences(prev => ({
        ...prev,
        categories: clickedCategories,
        values: selectedValues,
        location: 'Portland, OR',
        engagementPattern: 'explorer'
      }));
    };

    generateSmartNotifications();
    trackUserBehavior();

    // Update notifications every 30 seconds with new insights
    const interval = setInterval(generateSmartNotifications, 30000);

    return () => clearInterval(interval);
  }, [currentNotification]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (currentNotification?.id === id) {
      setCurrentNotification(null);
      // Show next notification after a delay
      setTimeout(() => {
        const remaining = notifications.filter(n => n.id !== id);
        if (remaining.length > 0) {
          setCurrentNotification(remaining[0]);
        }
      }, 2000);
    }
  };

  const handleNotificationAction = (notification: Notification) => {
    // Track engagement
    console.log('Notification clicked:', notification.type, notification.category);
    dismissNotification(notification.id);
  };

  if (!currentNotification) {
    return null;
  }

  const Icon = currentNotification.icon;
  const priorityColor = {
    low: 'bg-gray-100 border-gray-300',
    medium: 'bg-blue-50 border-blue-300',
    high: 'bg-spring-fresh-green/10 border-spring-fresh-green'
  }[currentNotification.priority];

  const priorityBadge = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-spring-fresh-green text-white'
  }[currentNotification.priority];

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm animate-slide-in-left">
      <Card className={`${priorityColor} shadow-lg hover-lift border-2`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${priorityColor}`}>
                <Icon className="w-4 h-4 text-spring-fresh-green" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-winter-pine">
                  {currentNotification.title}
                </h4>
                <Badge className={`text-xs ${priorityBadge}`}>
                  {currentNotification.type}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissNotification(currentNotification.id)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            {currentNotification.message}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                {Math.floor((Date.now() - currentNotification.timestamp.getTime()) / 60000)}m ago
              </span>
            </div>

            {currentNotification.actionText && (
              <Button
                size="sm"
                onClick={() => handleNotificationAction(currentNotification)}
                className="bg-spring-gradient hover:bg-summer-gradient text-white px-3 py-1 text-xs"
              >
                {currentNotification.actionText}
              </Button>
            )}
          </div>

          {currentNotification.category && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <Badge variant="outline" className="text-xs">
                {currentNotification.category}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Queue Indicator */}
      {notifications.length > 1 && (
        <div className="mt-2 text-center">
          <Badge className="bg-gray-100 text-gray-600 text-xs">
            <Bell className="w-3 h-3 mr-1" />
            {notifications.length - 1} more
          </Badge>
        </div>
      )}
    </div>
  );
}