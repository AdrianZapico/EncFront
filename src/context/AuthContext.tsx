// context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  login: (username: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  // Outros métodos e dados que você precisar
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = async (username: string) => {
    // Lógica de login (chamada ao servidor, etc.)
    setUser(username);
  };

  const register = async (username: string, password: string) => {
    // Lógica de registro (chamada ao servidor, etc.)
    setUser(username);
  };

  return (
    <AuthContext.Provider value={{ login, register }}>
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