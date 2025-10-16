import { Link } from "react-router-dom";
import { Shield, Mail, Phone, AlertTriangle } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "About",
      links: [
        { label: "Mission Statement", href: "/about" },
        { label: "Leadership", href: "/about" },
        { label: "Annual Reports", href: "/about" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Threat Detection", href: "/" },
        { label: "Emergency Alerts", href: "/" },
        { label: "Response Coordination", href: "/" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/about" },
        { label: "Training Materials", href: "/about" },
        { label: "API Access", href: "/contact" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Support Center", href: "/contact", icon: Mail },
        { label: "Emergency Hotline", href: "/contact", icon: Phone },
        { label: "Report an Issue", href: "/contact", icon: AlertTriangle },
      ],
    },
  ];

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground leading-tight">
                  Community Alert
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Threat System
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Emergency Management & Public Safety. Community protection through intelligent threat detection.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Community Alert Threat System. All rights reserved.{" "}
            <Link to="/about" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link to="/about" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
