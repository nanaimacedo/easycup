import { NextRequest, NextResponse } from 'next/server';
import { query, execute, isDbConfigured } from '@/lib/db';
import { z } from 'zod';

const inscricaoPayloadSchema = z.object({
  modalidade: z.enum(['simples', 'duplas', 'equipes']),
  dados: z.record(z.string(), z.unknown()),
  valor: z.number().positive(),
  desconto: z.number().min(0),
  valorFinal: z.number().positive(),
});

function generateId(): string {
  return `IC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// GET /api/inscricoes - listar todas (requer auth admin)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('x-admin-session');
  if (authHeader !== 'authenticated') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ data: [], source: 'no-db' });
  }

  const rows = await query(
    'SELECT * FROM inscricoes ORDER BY created_at DESC'
  );

  return NextResponse.json({ data: rows.map(mapFromDb), source: 'postgres' });
}

// POST /api/inscricoes - criar nova inscrição (público)
export async function POST(request: NextRequest) {
  const body = await request.json();

  const parsed = inscricaoPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { modalidade, dados, valor, desconto, valorFinal } = parsed.data;
  const id = generateId();
  const now = new Date().toISOString();

  if (isDbConfigured()) {
    await execute(
      `INSERT INTO inscricoes (id, modalidade, dados, valor, desconto, valor_final, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pendente')`,
      [id, modalidade, JSON.stringify(dados), valor, desconto, valorFinal]
    );

    await execute(
      `INSERT INTO audit_logs (action, entity, entity_id, ip_address, user_agent, details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'INSCRICAO_CRIADA', 'inscricoes', id,
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
        request.headers.get('user-agent') || null,
        JSON.stringify({ modalidade, valorFinal }),
      ]
    );
  }

  return NextResponse.json({
    data: {
      id,
      inscricao: dados,
      valor,
      desconto,
      valorFinal,
      dataInscricao: now,
      status: 'pendente',
    },
    persisted: isDbConfigured(),
  }, { status: 201 });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFromDb(row: any) {
  return {
    id: row.id,
    inscricao: typeof row.dados === 'string' ? JSON.parse(row.dados) : row.dados,
    valor: Number(row.valor),
    desconto: Number(row.desconto),
    valorFinal: Number(row.valor_final),
    dataInscricao: row.created_at,
    status: row.status,
  };
}
