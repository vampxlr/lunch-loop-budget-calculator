import { getAppConfig } from "./config";

export interface AuthSession {
  authenticated: boolean;
  username?: string;
}

export function checkAuth(username: string, password: string): boolean {
  const config = getAppConfig();
  
  if (!config.admin.authEnabled) {
    return true; // Auth disabled, always allow
  }

  return (
    username === config.admin.username &&
    password === config.admin.password
  );
}

export function isAuthRequired(): boolean {
  const config = getAppConfig();
  return config.admin.authEnabled;
}

export function setAuthSession(authenticated: boolean, username?: string): void {
  if (typeof window !== "undefined") {
    const session: AuthSession = { authenticated, username };
    sessionStorage.setItem("admin_auth", JSON.stringify(session));
  }
}

export function getAuthSession(): AuthSession {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("admin_auth");
    if (stored) {
      try {
        return JSON.parse(stored) as AuthSession;
      } catch (error) {
        console.error("Failed to parse auth session:", error);
      }
    }
  }
  return { authenticated: false };
}

export function clearAuthSession(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("admin_auth");
  }
}

export function requireAuth(): boolean {
  if (!isAuthRequired()) {
    return true; // Auth not required
  }
  
  const session = getAuthSession();
  return session.authenticated;
}
