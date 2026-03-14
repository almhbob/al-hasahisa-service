import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl } from "@/lib/query-client";

export type AuthUser = {
  id: number;
  name: string;
  national_id_masked?: string | null;
  phone?: string | null;
  email?: string | null;
  role: "user" | "admin" | "moderator" | "guest";
  permissions?: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isGuest: boolean;
  canPost: boolean;
  login: (phoneOrEmail: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  register: (name: string, nationalId: string, phoneOrEmail: string, isEmail: boolean, password: string) => Promise<void>;
  registerAdmin: (name: string, email: string, password: string, adminCode: string) => Promise<void>;
  enterAsGuest: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "auth_session_token";
const USER_KEY = "auth_user_data";

function apiUrl(path: string): string {
  return new URL(path, getApiUrl()).toString();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch { }
      setIsLoading(false);
    })();
  }, []);

  const saveSession = async (u: AuthUser, t: string) => {
    setUser(u);
    setToken(t);
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, t),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(u)),
    ]);
  };

  const login = async (phoneOrEmail: string, password: string) => {
    const res = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_or_email: phoneOrEmail, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "فشل تسجيل الدخول");
    await saveSession(json.user, json.token);
  };

  const loginAdmin = async (email: string, password: string) => {
    const res = await fetch(apiUrl("/api/auth/admin-login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "فشل تسجيل الدخول");
    await saveSession(json.user, json.token);
  };

  const register = async (name: string, nationalId: string, phoneOrEmail: string, isEmail: boolean, password: string) => {
    const body: Record<string, string> = { name, national_id: nationalId, password };
    if (isEmail) body.email = phoneOrEmail;
    else body.phone = phoneOrEmail;
    const res = await fetch(apiUrl("/api/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "فشل التسجيل");
    await saveSession(json.user, json.token);
  };

  const registerAdmin = async (name: string, email: string, password: string, adminCode: string) => {
    const res = await fetch(apiUrl("/api/auth/register-admin"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, admin_code: adminCode }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "فشل تسجيل المشرف");
    await saveSession(json.user, json.token);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl("/api/auth/me"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setUser(json.user);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(json.user));
      }
    } catch { }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(apiUrl("/api/auth/logout"), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { }
    }
    setUser(null);
    setToken(null);
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, loginAdmin, register, registerAdmin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
