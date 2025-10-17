import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Sample data - replace with actual API data later
const alertsByType = [
  { name: "Suspicious Activity", count: 40 },
  { name: "Violence", count: 25 },
  { name: "Theft", count: 30 },
  { name: "Harassment", count: 15 },
  { name: "Other", count: 10 },
];

const alertsTrend = [
  { date: "10/11", count: 12 },
  { date: "10/12", count: 19 },
  { date: "10/13", count: 15 },
  { date: "10/14", count: 25 },
  { date: "10/15", count: 22 },
  { date: "10/16", count: 30 },
  { date: "10/17", count: 28 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function DashboardCharts() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Alert Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Types Distribution</CardTitle>
          <CardDescription>Distribution of alerts by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertsByType}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {alertsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Alert Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Trends</CardTitle>
          <CardDescription>Daily alert submissions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Alerts"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}