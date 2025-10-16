import { Search, AlertTriangle, Radio } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Detect",
      description:
        "AI algorithms continuously monitor data streams, social signals, and environmental factors to identify potential threats.",
      step: "01",
    },
    {
      icon: AlertTriangle,
      title: "Alert",
      description:
        "Instant notifications are dispatched to relevant stakeholders - citizens, police, and NGOs - with threat details and severity levels.",
      step: "02",
    },
    {
      icon: Radio,
      title: "Respond",
      description:
        "Coordinated response teams take action while citizens receive safety guidance, creating a unified community defense system.",
      step: "03",
    },
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to community-wide protection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all hover:shadow-glow-primary">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-glow-primary">
                  {step.step}
                </div>

                <step.icon className="h-16 w-16 text-primary mb-6 group-hover:scale-110 transition-transform" />

                <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
