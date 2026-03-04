import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ApiUser } from "@/lib/api/types";
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister, updatePassword as apiUpdatePassword, updateProfile as apiUpdateProfile } from "@/lib/api";
import { getAuthToken, setAuthToken } from "@/lib/api/client";

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: { name: string; email: string; password: string; mobile?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (payload: { name: string; email: string; mobile?: string | null }) => Promise<boolean>;
  updatePassword: (payload: { current_password: string; password: string; password_confirmation: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    if (!getAuthToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const profile = await getMe();
      setUser(profile);
    } catch {
      setUser(null);
      setAuthToken(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiLogin({ email, password });
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: { name: string; email: string; password: string; mobile?: string }) => {
    setIsLoading(true);
    try {
      const res = await apiRegister(payload);
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // ignore logout errors
    } finally {
      setAuthToken(null);
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (payload: { name: string; email: string; mobile?: string | null }) => {
    setIsLoading(true);
    try {
      const res = await apiUpdateProfile(payload);
      setUser(res.user);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (payload: { current_password: string; password: string; password_confirmation: string }) => {
    setIsLoading(true);
    try {
      await apiUpdatePassword(payload);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout, refresh, updateProfile, updatePassword }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
