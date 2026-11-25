"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  status?: string;
  district?: string;
  tehsil?: string;
  block?: string;
  village?: string;
  post_office?: string;
  pincode?: string;
  created_at?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = "/api/v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("uks_token");
    localStorage.removeItem("uks_user");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    try {
      fetch(`${API_BASE}/auth/logout`, { method: "POST" });
    } catch (e) {
      // ignore
    }
  }, []);

  const login = useCallback((jwtToken: string, userData: User) => {
    localStorage.setItem("uks_token", jwtToken);
    localStorage.setItem("uks_user", JSON.stringify(userData));
    localStorage.setItem("admin_token", jwtToken);
    localStorage.setItem("admin_user", JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  }, []);

  const refreshUser = useCallback(async () => {
    const savedToken =
      localStorage.getItem("uks_token") ||
      localStorage.getItem("admin_token") ||
      localStorage.getItem("auth_token");
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("uks_user", JSON.stringify(data));
      } else if (res.status === 401) {
        // Fallback to local user if present, otherwise logout
        const savedUser = localStorage.getItem("uks_user") || localStorage.getItem("admin_user");
        if (!savedUser) {
          logout();
        }
      }
    } catch (err) {
      // If backend is momentarily unreachable, retain saved cached user
      const savedUser = localStorage.getItem("uks_user") || localStorage.getItem("admin_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          // ignore
        }
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const savedToken =
      localStorage.getItem("uks_token") ||
      localStorage.getItem("admin_token") ||
      localStorage.getItem("auth_token");
    const savedUser =
      localStorage.getItem("uks_user") ||
      localStorage.getItem("admin_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
