"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("user") : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    typeof window !== "undefined" ? !!localStorage.getItem("user") : false
  );

  const login = (username: string) => {
    setUser(username);
    setIsAuthenticated(true);
    localStorage.setItem("user", username);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
