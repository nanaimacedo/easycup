import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger API routes admin (GET em /api/inscricoes, PATCH, DELETE)
  if (pathname.startsWith('/api/inscricoes')) {
    const method = request.method;

    // POST é público (criar inscrição)
    if (method === 'POST') {
      return NextResponse.next();
    }

    // GET de um ID específico é público (consulta de recibo)
    if (method === 'GET' && pathname !== '/api/inscricoes') {
      return NextResponse.next();
    }

    // GET listagem, PATCH, DELETE requerem header de admin
    if (['GET', 'PATCH', 'DELETE'].includes(method)) {
      const adminSession = request.headers.get('x-admin-session');
      if (adminSession !== 'authenticated') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/inscricoes/:path*'],
};
