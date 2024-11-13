import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthState } from "../types";
import { useNavigate } from "react-router-dom";

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const [authState, setAuthState] = useState<AuthState>({
    user: user,
    isAuthenticated: isAuthenticated,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/auth/me",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const user: User = await response.json();
          setAuthState({ user, isAuthenticated: true });
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isAuthenticated", "true");
          
        } else {
          setAuthState({ user: null, isAuthenticated: false });
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };
    initAuth();
  }, [navigate]);

  const login = (user: User) => {
    setAuthState({ user, isAuthenticated: true });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
