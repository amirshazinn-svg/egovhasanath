import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  username: string;
  name: string;
  email: string;
  photo?: string;
  department: string;
  class: string;
  rollNumber: string;
  joinedAt: string;
}

interface StudentAuthContextType {
  student: Student | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulated login - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (username && password) {
      // Mock student data
      setStudent({
        id: 'std-1',
        username: username.toLowerCase().replace(/\s+/g, ''),
        name: 'Rahul Sharma',
        email: `${username}@school.edu`,
        department: 'Science',
        class: '12th Grade',
        rollNumber: '2024-SC-042',
        joinedAt: '2023-04-01'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setStudent(null);
  };

  return (
    <StudentAuthContext.Provider value={{
      student,
      isAuthenticated: !!student,
      login,
      logout
    }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (context === undefined) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
}
