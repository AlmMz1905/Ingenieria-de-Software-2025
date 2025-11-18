import React, { createContext, useContext, useState, useEffect } from 'react';
import * as API from '../lib/api';

interface User {
  id: number;
  email: string;
  user_type: 'cliente' | 'farmacia';
  name?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userType: 'cliente' | 'farmacia') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      API.users.getProfile()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { access_token, user: userData } = await API.auth.login(email, password);
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser(userData);
    setIsLoading(false);
  };

  const register = async (email: string, password: string, userType: 'cliente' | 'farmacia') => {
    setIsLoading(true);
    const { access_token, user: userData } = await API.auth.register(email, password, userType);
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
