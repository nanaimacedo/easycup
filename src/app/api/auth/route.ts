import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkRateLimit, blockIp, resetRateLimit } from '@/lib/rate-limit';
import { generateCsrfToken, validateCsrfToken } from '@/lib/csrf';
import { getAdminTotpSecret, verifyToken } from '@/lib/totp';

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || '127.0.0.1';
}

// GET: gerar CSRF token
export async function GET() {
  const token = generateCsrfToken();
  return NextResponse.json({ csrfToken: token });
}

// POST: login com rate limiting + CSRF + 2FA
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limiting
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterMs || 0) / 60000);
    return NextResponse.json(
      { error: `Muitas tentativas. Tente novamente em ${minutes} minuto(s).` },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { username, password, csrfToken, totpCode } = body;

  // CSRF validation
  if (csrfToken && !validateCsrfToken(csrfToken)) {
    return NextResponse.json({ error: 'Token de segurança inválido. Recarregue a página.' }, { status: 403 });
  }

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';

  if (username !== adminUsername) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  // Password check
  let isValid = false;
  if (adminPasswordHash) {
    isValid = await bcrypt.compare(password, adminPasswordHash);
  } else {
    isValid = password === 'admin123';
  }

  if (!isValid) {
    blockIp(ip);
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  // 2FA check
  const totpSecret = getAdminTotpSecret();
  if (totpSecret) {
    if (!totpCode) {
      return NextResponse.json({ requires2FA: true }, { status: 200 });
    }
    if (!verifyToken(totpCode, totpSecret)) {
      return NextResponse.json({ error: 'Código 2FA inválido' }, { status: 401 });
    }
  }

  resetRateLimit(ip);
  return NextResponse.json({ success: true });
}
