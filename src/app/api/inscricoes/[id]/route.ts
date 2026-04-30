import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, isDbConfigured } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/inscricoes/:id - buscar por ID (público para recibo)
export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!isDbConfigured()) {
    return NextResponse.json({ data: null, source: 'no-db' });
  }

  const row = await queryOne('SELECT * FROM inscricoes WHERE id = $1', [id]);

  if (!row) {
    return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
  }

  return NextResponse.json({ data: mapFromDb(row) });
}

// PATCH /api/inscricoes/:id - atualizar (requer auth admin)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const authHeader = request.headers.get('x-admin-session');
  if (authHeader !== 'authenticated') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  if (!isDbConfigured()) {
    return NextResponse.json({ message: 'OK (sem banco configurado)' });
  }

  if (body.status) {
    const validStatuses = ['pendente', 'confirmada', 'cancelada'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }
    await execute('UPDATE inscricoes SET status = $1 WHERE id = $2', [body.status, id]);
  }

  if (body.dados) {
    await execute('UPDATE inscricoes SET dados = $1 WHERE id = $2', [JSON.stringify(body.dados), id]);
  }

  await execute(
    `INSERT INTO audit_logs (action, entity, entity_id, ip_address, details)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      body.status ? 'STATUS_ATUALIZADO' : 'DADOS_EDITADOS',
      'inscricoes', id,
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
      JSON.stringify(body),
    ]
  );

  return NextResponse.json({ message: 'Atualizado com sucesso' });
}

// DELETE /api/inscricoes/:id - excluir (requer auth admin)
export async function DELETE(request: NextRequest, context: RouteContext) {
  const authHeader = request.headers.get('x-admin-session');
  if (authHeader !== 'authenticated') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await context.params;

  if (!isDbConfigured()) {
    return NextResponse.json({ message: 'OK (sem banco configurado)' });
  }

  await execute('DELETE FROM inscricoes WHERE id = $1', [id]);

  await execute(
    `INSERT INTO audit_logs (action, entity, entity_id, ip_address) VALUES ($1, $2, $3, $4)`,
    ['INSCRICAO_EXCLUIDA', 'inscricoes', id,
     request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null]
  );

  return NextResponse.json({ message: 'Excluído com sucesso' });
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
