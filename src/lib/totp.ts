import { generateSecret as genSecret, generateURI, TOTP } from 'otplib';

export function generateSecret(): string {
  return genSecret();
}

export function generateOtpAuthUrl(secret: string, account: string): string {
  return generateURI({ issuer: '78-Intercolonial-Admin', label: account, secret });
}

export function verifyToken(token: string, secret: string): boolean {
  const totp = new TOTP({ secret });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (totp as any).verify(token);
  return result === true || (result && typeof result === 'object' && result.valid === true);
}

export function getAdminTotpSecret(): string | null {
  return process.env.ADMIN_TOTP_SECRET || null;
}
