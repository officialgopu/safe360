import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, Title, AreaChart, BarChart, DonutChart, Metric, Text } from '@tremor/react';
import { LightBulbIcon, MapPinIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const AIInsights = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/insights`);
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            AI Insights & Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            AI-powered predictions and trend analysis
          </p>
        </div>

        {/* Prediction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card decoration="top" decorationColor="blue">
            <div className="flex items-center space-x-2">
              <LightBulbIcon className="h-6 w-6 text-blue-500" />
              <Text>Next Week Prediction</Text>
            </div>
            <Metric className="mt-2">
              {insights?.predictions?.nextWeekAlerts || 0} Alerts
            </Metric>
            <Text className="mt-1 text-sm text-gray-500">
              Confidence: {((insights?.predictions?.confidence || 0) * 100).toFixed(0)}%
            </Text>
          </Card>

          <Card decoration="top" decorationColor="red">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-6 w-6 text-red-500" />
              <Text>High Risk Areas</Text>
            </div>
            <Metric className="mt-2">
              {insights?.predictions?.highRiskAreas || 0} Zones
            </Metric>
            <Text className="mt-1 text-sm text-gray-500">
              Requires attention
            </Text>
          </Card>

          <Card decoration="top" decorationColor="green">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-6 w-6 text-green-500" />
              <Text>Model Accuracy</Text>
            </div>
            <Metric className="mt-2">
              {((insights?.predictions?.confidence || 0) * 100).toFixed(1)}%
            </Metric>
            <Text className="mt-1 text-sm text-gray-500">
              Based on historical data
            </Text>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <Title>Alert Trends (Last 7 Days)</Title>
          {insights?.trends && insights.trends.length > 0 ? (
            <AreaChart
              className="mt-4 h-72"
              data={insights.trends}
              index="date"
              categories={["count"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} alerts`}
            />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              No trend data available
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crime Hotspots */}
          <Card>
            <Title>Crime Hotspots</Title>
            {insights?.hotspots && insights.hotspots.length > 0 ? (
              <BarChart
                className="mt-4 h-72"
                data={insights.hotspots}
                index="location"
                categories={["incidents"]}
                colors={["red"]}
                valueFormatter={(value) => `${value} incidents`}
              />
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                No hotspot data available
              </div>
            )}
          </Card>

          {/* Severity Distribution */}
          <Card>
            <Title>Severity Distribution</Title>
            {insights?.severityDistribution && insights.severityDistribution.length > 0 ? (
              <DonutChart
                className="mt-4 h-72"
                data={insights.severityDistribution}
                category="count"
                index="severity"
                colors={["green", "yellow", "orange", "red"]}
                valueFormatter={(value) => `${value} alerts`}
              />
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                No severity data available
              </div>
            )}
          </Card>
        </div>

        {/* AI Model Info */}
        <Card>
          <Title>About the AI Model</Title>
          <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• Machine learning model trained on historical crime and alert data</p>
            <p>• Predicts future incidents based on patterns, location, and time</p>
            <p>• Identifies high-risk zones for proactive deployment</p>
            <p>• Updates predictions every 6 hours with new data</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AIInsights;