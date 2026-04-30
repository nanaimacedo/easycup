const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const BLOCK_MS = 30 * 60 * 1000; // 30 minutos de bloqueio

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterMs = entry.resetAt - now;
    return { allowed: false, retryAfterMs };
  }

  entry.count++;
  return { allowed: true };
}

export function blockIp(ip: string): void {
  attempts.set(ip, { count: MAX_ATTEMPTS, resetAt: Date.now() + BLOCK_MS });
}

export function resetRateLimit(ip: string): void {
  attempts.delete(ip);
}
