import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, AlertTriangle, Users, X } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import AlertSubmissionForm from "./AlertSubmissionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Hero = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background"></div>
      </div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Advanced Community Safety
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Alert System
          </h1>
          
          <p className="text-xl md:text-2xl font-semibold text-primary mb-6">
           Emergency Management System
          </p>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive platform connecting emergency services, law enforcement, and community organizations
            for efficient threat detection and rapid response.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/login">
              <Button size="lg" className="shadow-glow-primary text-lg px-8">
                Open Console
                <Shield className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8"
              onClick={() => setShowForm(true)}
            >
              Submit Alert
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: AlertTriangle, label: "Instant Notifications", value: "24/7" },
              { icon: Shield, label: "Threat Detection", value: "Real-time" },
              { icon: Users, label: "Response Network", value: "Connected" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition-all hover:shadow-glow-primary"
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Submission Form */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Alert</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <AlertSubmissionForm onSubmitSuccess={() => setShowForm(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Hero;
