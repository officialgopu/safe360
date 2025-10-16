import { Brain, Bell, Users, Map, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Bell,
      title: "Alert Management",
      description:
        "Centralized alert system for efficient monitoring and management of emergency notifications.",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Team Coordination",
      description:
        "Integrated platform for seamless communication between emergency response teams.",
      color: "text-accent",
    },
    {
      icon: Map,
      title: "Location Tracking",
      description:
        "Real-time geographic monitoring system with precise location mapping capabilities.",
      color: "text-primary",
    },
    {
      icon: Shield,
      title: "Security Protocol",
      description:
        "Advanced security measures ensuring reliable and secure alert distribution.",
      color: "text-destructive",
    },
    {
      icon: Zap,
      title: "Quick Response",
      description:
        "Optimized system for rapid alert deployment and emergency response coordination.",
      color: "text-success",
    },
    {
      icon: Brain,
      title: "Smart Analysis",
      description:
        "Intelligent monitoring system for effective threat assessment and response planning.",
      color: "text-warning",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            System Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional emergency alert management system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <CardHeader>
                <feature.icon
                  className={`h-12 w-12 mb-4 ${feature.color} group-hover:scale-110 transition-transform`}
                />
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
