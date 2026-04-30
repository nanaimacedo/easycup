import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/inscricoes/:id - buscar inscrição por ID (público para consulta de recibo)
export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: null, source: 'no-db' });
  }

  const db = getServerSupabase();
  const { data, error } = await db
    .from('inscricoes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: data.id,
      inscricao: data.dados,
      valor: Number(data.valor),
      desconto: Number(data.desconto),
      valorFinal: Number(data.valor_final),
      dataInscricao: data.created_at,
      status: data.status,
    },
  });
}

// PATCH /api/inscricoes/:id - atualizar status ou dados (requer auth admin)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const authHeader = request.headers.get('x-admin-session');
  if (authHeader !== 'authenticated') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'OK (sem banco configurado)' });
  }

  const db = getServerSupabase();

  // Atualizar status
  if (body.status) {
    const validStatuses = ['pendente', 'confirmada', 'cancelada'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }
    const { error } = await db.from('inscricoes').update({ status: body.status }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Atualizar dados (edição de membros de equipe)
  if (body.dados) {
    const { error } = await db.from('inscricoes').update({ dados: body.dados }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await db.from('audit_logs').insert({
    action: body.status ? 'STATUS_ATUALIZADO' : 'DADOS_EDITADOS',
    entity: 'inscricoes',
    entity_id: id,
    ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
    details: body,
  });

  return NextResponse.json({ message: 'Atualizado com sucesso' });
}

// DELETE /api/inscricoes/:id - excluir inscrição (requer auth admin)
export async function DELETE(request: NextRequest, context: RouteContext) {
  const authHeader = request.headers.get('x-admin-session');
  if (authHeader !== 'authenticated') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await context.params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'OK (sem banco configurado)' });
  }

  const db = getServerSupabase();
  const { error } = await db.from('inscricoes').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from('audit_logs').insert({
    action: 'INSCRICAO_EXCLUIDA',
    entity: 'inscricoes',
    entity_id: id,
    ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
  });

  return NextResponse.json({ message: 'Excluído com sucesso' });
}
