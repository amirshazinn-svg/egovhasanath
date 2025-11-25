import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'teacher' | 'principal' | 'manager' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  selectRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulated login - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email && password) {
      setUser({
        id: '1',
        name: 'John Smith',
        email: email,
        role: null,
        department: 'Science'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const selectRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      selectRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
