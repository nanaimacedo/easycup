import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { z } from 'zod';

// Validação server-side do payload de inscrição
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

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: [], source: 'no-db' });
  }

  const db = getServerSupabase();
  const { data, error } = await db
    .from('inscricoes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const inscricoes = (data || []).map(mapFromDb);
  return NextResponse.json({ data: inscricoes, source: 'supabase' });
}

// POST /api/inscricoes - criar nova inscrição (público)
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validação server-side
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

  // Persistir no Supabase se configurado
  if (isSupabaseConfigured()) {
    const db = getServerSupabase();
    const { error } = await db.from('inscricoes').insert({
      id,
      modalidade,
      dados,
      valor,
      desconto,
      valor_final: valorFinal,
      status: 'pendente',
    });

    if (error) {
      return NextResponse.json({ error: 'Erro ao salvar inscrição', details: error.message }, { status: 500 });
    }

    // Audit log
    await db.from('audit_logs').insert({
      action: 'INSCRICAO_CRIADA',
      entity: 'inscricoes',
      entity_id: id,
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
      user_agent: request.headers.get('user-agent') || null,
      details: { modalidade, valorFinal },
    });
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
    persisted: isSupabaseConfigured(),
  }, { status: 201 });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFromDb(row: any) {
  return {
    id: row.id,
    inscricao: row.dados,
    valor: Number(row.valor),
    desconto: Number(row.desconto),
    valorFinal: Number(row.valor_final),
    dataInscricao: row.created_at,
    status: row.status,
  };
}
