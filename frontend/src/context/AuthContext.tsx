import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing auth token and role
    const token = localStorage.getItem('auth_token');
    const userRole = localStorage.getItem('user_role');
    
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === 'admin');
      
      // Set user data
      setUser({
        role: userRole,
        token: token
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Call your login API here
      // const response = await api.login(email, password);
      // localStorage.setItem('auth_token', response.token);
      setIsAuthenticated(true);
      setIsAdmin(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;