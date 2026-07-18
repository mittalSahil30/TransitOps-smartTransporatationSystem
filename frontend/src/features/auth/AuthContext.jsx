import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/lib/config";

const AuthContext = createContext(undefined);

function readStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isBootstrapping, setBootstrapping] = useState(true);
  const qc = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    const u = readStoredUser();
    if (t) setToken(t);
    if (u) setUser(u);
    setBootstrapping(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    qc.clear();
  }, [qc]);

  const refresh = useCallback(async () => {
    const profile = await authApi.profile();
    const nextUser = {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      role: profile.role?.name ?? "",
    };
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const value = useMemo(() => ({
    user, token,
    isAuthenticated: Boolean(token && user),
    isBootstrapping, login, logout, refresh,
  }), [user, token, isBootstrapping, login, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
