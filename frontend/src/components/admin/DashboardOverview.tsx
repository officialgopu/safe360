import { useEffect, useState } from 'react';
import { Card, Text, Metric, BadgeDelta } from '@tremor/react';
import { 
  BellAlertIcon,
  ShieldExclamationIcon,
  BanknotesIcon,
  CloudIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import adminApi, { OverviewStats } from '../../services/adminApi';

const DashboardOverview = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getOverviewStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const metrics = [
    {
      title: 'Total Alerts Today',
      metric: stats.totalAlertsToday.toString(),
      icon: BellAlertIcon,
      change: '12%',
      changeType: 'increase',
      color: 'blue',
    },
    {
      title: 'Crime Alerts',
      metric: stats.crimeAlerts.toString(),
      icon: ShieldExclamationIcon,
      change: '8%',
      changeType: 'increase',
      color: 'red',
    },
    {
      title: 'Fraud Alerts',
      metric: stats.fraudAlerts.toString(),
      icon: BanknotesIcon,
      change: '5%',
      changeType: 'decrease',
      color: 'amber',
    },
    {
      title: 'Weather Alerts',
      metric: stats.weatherAlerts.toString(),
      icon: CloudIcon,
      change: '18%',
      changeType: 'increase',
      color: 'blue',
    },
    {
      title: 'Active Responders',
      metric: stats.activeResponders.toString(),
      icon: UserGroupIcon,
      suffix: ' online',
      color: 'green',
    },
    {
      title: 'Avg Response Time',
      metric: stats.avgResponseTime.toString(),
      icon: ClockIcon,
      suffix: ' min',
      change: '2.3',
      changeType: 'decrease',
      color: 'green',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((item) => (
        <Card
          key={item.title}
          decoration="top"
          decorationColor={item.color}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <item.icon className={`h-6 w-6 text-${item.color}-500`} />
            <Text>{item.title}</Text>
          </div>
          <div className="space-y-1">
            <Metric>
              {item.metric}
              {item.suffix}
            </Metric>
            {item.change && (
              <BadgeDelta
                deltaType={item.changeType === 'increase' ? 'increase' : 'decrease'}
                size="sm"
              >
                {item.change}
              </BadgeDelta>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardOverview;