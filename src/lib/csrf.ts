import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'easycup-csrf-secret-change-in-prod';

export function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now().toString(36);
  const signature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(`${token}:${timestamp}`)
    .digest('hex')
    .slice(0, 16);
  return `${token}:${timestamp}:${signature}`;
}

export function validateCsrfToken(csrfToken: string): boolean {
  const parts = csrfToken.split(':');
  if (parts.length !== 3) return false;

  const [token, timestamp, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(`${token}:${timestamp}`)
    .digest('hex')
    .slice(0, 16);

  if (signature !== expectedSignature) return false;

  // Token válido por 1 hora
  const age = Date.now() - parseInt(timestamp, 36);
  return age < 3600000;
}
