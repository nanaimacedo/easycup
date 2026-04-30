const SESSION_KEY = 'easycup_admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 horas

export interface AdminSession {
  authenticated: boolean;
  expiresAt: number;
}

export function getSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;

  const session: AdminSession = JSON.parse(data);
  if (Date.now() > session.expiresAt) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return session;
}

export function setSession(): void {
  const session: AdminSession = {
    authenticated: true,
    expiresAt: Date.now() + SESSION_DURATION,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  const session = getSession();
  return session !== null && session.authenticated;
}
