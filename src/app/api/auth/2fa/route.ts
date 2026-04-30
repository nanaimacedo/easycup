import { NextResponse } from 'next/server';
import { generateSecret, generateOtpAuthUrl } from '@/lib/totp';

// GET: gerar novo secret e QR code URL para setup
export async function GET() {
  const secret = generateSecret();
  const otpAuthUrl = generateOtpAuthUrl(secret, 'admin');

  return NextResponse.json({
    secret,
    otpAuthUrl,
    instructions: 'Adicione ADMIN_TOTP_SECRET ao .env.local com o valor do secret para ativar 2FA.',
  });
}
