import { Shield, Target, Users, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const missionValues = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To create safer communities through proactive threat detection, enabling early intervention and coordinated response between citizens, law enforcement, and relief organizations.",
    },
    {
      icon: Globe,
      title: "Our Vision",
      description:
        "A world where technology empowers communities to predict, prevent, and protect against threats before they escalate, creating a network of resilient, informed, and connected neighborhoods.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "We believe safety is a collective responsibility. PreAct facilitates seamless collaboration between all stakeholders - from everyday citizens to emergency responders.",
    },
    {
      icon: Shield,
      title: "Security & Trust",
      description:
        "Maintaining transparency, privacy, and ethical standards in all alert and monitoring systems.",
    },
  ];

  const teamMembers = [
    {
      name: "Development Team",
      role: "Full-Stack Engineering",
      description: "Building scalable, secure systems for real-time threat monitoring",
    },
    {
      name: "Analysis Team",
      role: "Data Analysis",
      description: "Developing analytical models for threat assessment",
    },
    {
      name: "Community Relations",
      role: "Stakeholder Engagement",
      description: "Coordinating with police, NGOs, and community leaders",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Shield className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Alert System
            </h1>
            <p className="text-xl font-semibold text-primary mb-4">
              Professional Emergency Management System
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A comprehensive alert system connecting emergency services and organizations
              for efficient incident response and management.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {missionValues.map((item, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:border-primary/50 transition-all"
              >
                <CardHeader>
                  <item.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-2xl text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Collaboration Section */}
          <div className="bg-secondary/50 rounded-2xl p-8 md:p-12 mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              Collaboration at Our Core
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-center">
              Our platform bridges the gap between public awareness, law enforcement response, and NGO
              relief efforts. We ensure that when threats emerge, every stakeholder has
              the information they need to act swiftly and effectively.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Citizens",
                  description:
                    "Receive real-time alerts, safety tips, and situational awareness for their neighborhoods",
                },
                {
                  title: "Police",
                  description:
                    "Access threat intelligence, high-risk zone mapping, and coordinate rapid response",
                },
                {
                  title: "NGOs",
                  description:
                    "Get disaster alerts, coordinate relief efforts, and track community needs",
                },
              ].map((role, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-all"
                >
                  <h3 className="text-xl font-bold text-foreground mb-3">{role.title}</h3>
                  <p className="text-muted-foreground">{role.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="bg-card border-border hover:border-primary/50 transition-all text-center"
                >
                  <CardHeader>
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{member.name}</CardTitle>
                    <p className="text-sm text-primary">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-8 italic">
              Professional Emergency Alert Management System
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
