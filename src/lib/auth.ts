import { isRemoteApi } from "@/lib/env";
import * as remote from "@/lib/salon-remote";

const TOKEN_KEY = "salon_admin_token";
const USER_KEY = "salon_admin_user";
const DEMO_AUTH_KEY = "salon_demo_auth";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

const DEMO_EMAIL = "admin@sheezasalon.com";
const DEMO_PASSWORD = "Sheeza@2026";

function loadUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  return loadUser();
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  if (isRemoteApi()) return !!getAuthToken();
  return localStorage.getItem(DEMO_AUTH_KEY) === "1";
}

export function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function saveSession(token: string, user: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function saveDemoSession(user: AdminUser) {
  localStorage.setItem(DEMO_AUTH_KEY, "1");
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(DEMO_AUTH_KEY);
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const pass = password;

  if (isRemoteApi()) {
    const result = await remote.remoteLogin(normalizedEmail, pass);
    saveSession(result.token, result.user);
    return result.user;
  }

  if (normalizedEmail !== DEMO_EMAIL || pass !== DEMO_PASSWORD) {
    throw new Error("Invalid email or password");
  }

  const user: AdminUser = {
    id: "demo",
    email: DEMO_EMAIL,
    fullName: "Sheeza Admin",
    role: "admin",
  };
  saveDemoSession(user);
  return user;
}

export async function logout(): Promise<void> {
  if (isRemoteApi() && getAuthToken()) {
    try {
      await remote.remoteLogout();
    } catch {
      // Clear local session even if API logout fails
    }
  }
  clearAuthSession();
}

export async function verifySession(): Promise<boolean> {
  if (!isAuthenticated()) return false;

  if (!isRemoteApi()) return true;

  try {
    const user = await remote.remoteAuthMe();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return true;
  } catch {
    clearAuthSession();
    return false;
  }
}
