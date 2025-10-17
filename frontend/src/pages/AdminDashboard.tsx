import AdminLayout from '../components/admin/AdminLayout';
import DashboardOverview from '../components/admin/DashboardOverview';
import { Card, Title } from '@tremor/react';
import AdminMap from "../components/admin/AdminMap";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time situational awareness and analytics
          </p>
        </div>

        {/* Overview Cards */}
        <DashboardOverview />

        {/* Map Section Placeholder */}
        <Card className="h-96">
          <Title>Real-Time Threat Map</Title>
          <div className="h-full flex items-center justify-center text-gray-500">
            <AdminMap />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights Placeholder */}
          <Card>
            <Title>AI Insights</Title>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Charts will be implemented here
            </div>
          </Card>

          {/* Data Streams Monitor Placeholder */}
          <Card>
            <Title>Data Streams Monitor</Title>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Status monitoring will be implemented here
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;