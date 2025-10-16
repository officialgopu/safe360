import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Clock, Shield, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const Alerts = () => {
  const [loading, setLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      // Simulate random risk level
      const levels: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
      setRiskLevel(levels[Math.floor(Math.random() * levels.length)]);
    }, 1500);

    // Simulate push notification
    setTimeout(() => {
      alert("New Alert: Weather advisory in your area\nHeavy rain expected. Stay indoors if possible.");
    }, 3000);
  }, []);

  const alerts = [
    {
      id: 1,
      type: "Weather Alert",
      severity: "medium",
      location: "Downtown District",
      time: "2 minutes ago",
      description: "Heavy rainfall expected in the next 2 hours. Flood risk elevated.",
    },
    {
      id: 2,
      type: "Security Alert",
      severity: "high",
      location: "Market Square",
      time: "15 minutes ago",
      description: "Suspicious activity reported. Police units dispatched to location.",
    },
    {
      id: 3,
      type: "Traffic Alert",
      severity: "low",
      location: "Highway 101",
      time: "1 hour ago",
      description: "Minor accident causing delays. Use alternative routes.",
    },
    {
      id: 4,
      type: "Community Alert",
      severity: "medium",
      location: "Central Park",
      time: "3 hours ago",
      description: "Large gathering detected. Increased patrol presence recommended.",
    },
  ];

  const safetyTips = [
    "Keep emergency contacts readily available",
    "Stay informed about local alerts and weather conditions",
    "Have a family emergency plan in place",
    "Keep essential supplies stocked (water, food, first-aid)",
    "Know your evacuation routes",
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getRiskLevelColor = () => {
    switch (riskLevel) {
      case "high":
        return "bg-destructive/20 border-destructive text-destructive shadow-glow-danger";
      case "medium":
        return "bg-warning/20 border-warning text-warning";
      case "low":
        return "bg-success/20 border-success text-success shadow-glow-success";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Alert Dashboard</h1>
            <p className="text-muted-foreground">Real-time threat monitoring and safety updates</p>
          </div>

          {/* Current Location Risk */}
          <Card
            className={`mb-8 animate-fade-in ${getRiskLevelColor()} border-2 transition-all`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="h-6 w-6" />
                Current Location Risk Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Analyzing your area...</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold uppercase">{riskLevel}</div>
                  <div className="flex-1">
                    <p className="text-sm opacity-80">
                      Based on current threats and environmental factors in your area
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Alerts List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-primary" />
                Nearby Alerts
              </h2>
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="bg-card border-border hover:border-primary/50 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-foreground">{alert.type}</CardTitle>
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {alert.time}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Safety Tips Sidebar */}
            <div>
              <Card className="bg-gradient-card border-border sticky top-24 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    Safety Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {safetyTips.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Alerts;
