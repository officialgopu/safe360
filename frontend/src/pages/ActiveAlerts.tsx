import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button } from '@tremor/react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Alert {
  id: number;
  type: string;
  title: string;
  location: string;
  severity: string;
  status: string;
  reportedOn: string;
}

const ActiveAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchAlerts();
  }, [filterType, filterSeverity]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType) params.append('alert_type', filterType);
      if (filterSeverity) params.append('severity', filterSeverity);

      const response = await axios.get(`${API_BASE_URL}/admin/alerts/all?${params.toString()}`);
      setAlerts(response.data.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'red';
      case 'resolved':
        return 'green';
      case 'archived':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Active Alerts
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor and manage all system alerts
            </p>
          </div>
          <Button size="sm" variant="primary">
            Create Alert
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="crime">Crime</option>
              <option value="fraud">Fraud</option>
              <option value="weather">Weather</option>
              <option value="fire">Fire</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </Card>

        {/* Alerts Table */}
        <Card>
          <Title>Alert List ({alerts.length})</Title>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Table className="mt-4">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Location</TableHeaderCell>
                  <TableHeaderCell>Severity</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Reported On</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.id}</TableCell>
                    <TableCell>
                      <Badge color="blue" size="sm">{alert.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{alert.title}</TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>
                      <Badge color={getSeverityColor(alert.severity)} size="sm">
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color={getStatusColor(alert.status)} size="sm">
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(alert.reportedOn)}</TableCell>
                    <TableCell>
                      <Button size="xs" variant="secondary">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ActiveAlerts;