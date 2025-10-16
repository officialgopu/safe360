import { Card, Text, Metric, BadgeDelta } from '@tremor/react';
import { 
  BellAlertIcon,
  ShieldExclamationIcon,
  BanknotesIcon,
  CloudIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const metrics = [
  {
    title: 'Total Alerts Today',
    metric: '127',
    icon: BellAlertIcon,
    change: '12%',
    changeType: 'increase',
    color: 'blue',
  },
  {
    title: 'Crime Alerts',
    metric: '45',
    icon: ShieldExclamationIcon,
    change: '8%',
    changeType: 'increase',
    color: 'red',
  },
  {
    title: 'Fraud Alerts',
    metric: '32',
    icon: BanknotesIcon,
    change: '5%',
    changeType: 'decrease',
    color: 'amber',
  },
  {
    title: 'Weather Alerts',
    metric: '50',
    icon: CloudIcon,
    change: '18%',
    changeType: 'increase',
    color: 'blue',
  },
  {
    title: 'Active Responders',
    metric: '89',
    icon: UserGroupIcon,
    change: '10',
    suffix: ' online',
    color: 'green',
  },
  {
    title: 'Avg Response Time',
    metric: '12.5',
    icon: ClockIcon,
    suffix: ' min',
    change: '2.3',
    changeType: 'decrease',
    color: 'green',
  },
];

const DashboardOverview = () => {
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