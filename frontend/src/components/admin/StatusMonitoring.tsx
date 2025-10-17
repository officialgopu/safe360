import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface SystemStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  latency?: number;
  uptime?: number;
}

export default function StatusMonitoring() {
  const [systems, setSystems] = useState<SystemStatus[]>([
    {
      name: "Alert Submission Service",
      status: "operational",
      latency: 45,
      uptime: 99.9,
    },
    {
      name: "ML Processing Service",
      status: "operational",
      latency: 120,
      uptime: 99.8,
    },
    {
      name: "Real-time Notifications",
      status: "operational",
      latency: 65,
      uptime: 99.95,
    },
    {
      name: "Database Service",
      status: "operational",
      latency: 30,
      uptime: 99.99,
    }
  ]);

  // Replace with actual API call later
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulated status updates
      setSystems(prev => prev.map(system => ({
        ...system,
        latency: Math.floor(Math.random() * 200) + 20
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemStatus["status"]) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return "text-green-600";
    if (latency < 100) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Real-time monitoring of system components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {systems.map((system, index) => (
            <div
              key={system.name}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(system.status)}`} />
                <div>
                  <h3 className="font-medium">{system.name}</h3>
                  <p className="text-sm text-gray-500">
                    Uptime: {system.uptime}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`font-medium ${getLatencyColor(system.latency || 0)}`}>
                    {system.latency}ms
                  </div>
                  <div className="text-sm text-gray-500">Latency</div>
                </div>
                <Badge variant={system.status === "operational" ? "default" : "destructive"}>
                  {system.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}