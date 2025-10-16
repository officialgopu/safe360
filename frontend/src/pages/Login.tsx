import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || !userId || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (role === 'admin') {
        // For demo purposes, check if using default admin credentials
        if (userId === 'admin' && password === 'admin123') {
          // Store admin token
          localStorage.setItem('auth_token', 'admin-token');
          localStorage.setItem('user_role', 'admin');
          navigate("/admin");
          return;
        }
      }
      
      // For other roles, navigate to their respective dashboards
      switch (role) {
        case 'police':
          navigate("/police/dashboard");
          break;
        case 'ngo':
          navigate("/ngo/dashboard");
          break;
        default:
          navigate("/alerts");
      }
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 pt-20">
        <Card className="w-full max-w-md bg-gradient-card border-border shadow-glow-primary animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Community Alert Threat System</CardTitle>
            <CardDescription className="text-muted-foreground">
              Select your role and login to access the system
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-2">
              For demo: Admin access (ID: admin / Password: admin123)
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">
                  Select Role
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="bg-background border-border">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId" className="text-foreground">
                  User ID
                </Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter your user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <Button type="submit" className="w-full shadow-glow-primary text-lg">
                Login
                <Shield className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
