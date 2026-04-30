'use client';

import { InscricaoRegistro } from '@/types';
import { supabase } from './supabase';

const STORAGE_KEY = 'easycup_inscricoes';
const useSupabase = typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL;

function generateId(): string {
  return `IC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// --- LocalStorage fallback ---
function getLocal(): InscricaoRegistro[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
function saveLocal(inscricoes: InscricaoRegistro[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inscricoes));
}

// --- Funções públicas (híbrido Supabase + localStorage) ---

export async function getInscricoesAsync(): Promise<InscricaoRegistro[]> {
  if (useSupabase) {
    const { data } = await supabase
      .from('inscricoes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data && data.length > 0) {
      return data.map(mapFromDb);
    }
  }
  return getLocal();
}

// Versão síncrona para compatibilidade (lê do localStorage)
export function getInscricoes(): InscricaoRegistro[] {
  return getLocal();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function salvarInscricaoAsync(registro: { inscricao: any; valor: number; desconto: number; valorFinal: number }): Promise<InscricaoRegistro> {
  const novaInscricao: InscricaoRegistro = {
    ...registro,
    id: generateId(),
    dataInscricao: new Date().toISOString(),
    status: 'pendente',
  };

  // Salvar no localStorage sempre (cache local)
  const inscricoes = getLocal();
  inscricoes.push(novaInscricao);
  saveLocal(inscricoes);

  // Salvar no Supabase se disponível
  if (useSupabase) {
    await supabase.from('inscricoes').insert({
      id: novaInscricao.id,
      modalidade: registro.inscricao.modalidade,
      dados: registro.inscricao,
      valor: registro.valor,
      desconto: registro.desconto,
      valor_final: registro.valorFinal,
      status: 'pendente',
    });
  }

  return novaInscricao;
}

// Versão síncrona para compatibilidade
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function salvarInscricao(registro: { inscricao: any; valor: number; desconto: number; valorFinal: number }): InscricaoRegistro {
  const novaInscricao: InscricaoRegistro = {
    ...registro,
    id: generateId(),
    dataInscricao: new Date().toISOString(),
    status: 'pendente',
  };

  const inscricoes = getLocal();
  inscricoes.push(novaInscricao);
  saveLocal(inscricoes);

  // Fire-and-forget para Supabase
  if (useSupabase) {
    supabase.from('inscricoes').insert({
      id: novaInscricao.id,
      modalidade: registro.inscricao.modalidade,
      dados: registro.inscricao,
      valor: registro.valor,
      desconto: registro.desconto,
      valor_final: registro.valorFinal,
      status: 'pendente',
    }).then(() => {});
  }

  return novaInscricao;
}

export function atualizarStatus(id: string, status: InscricaoRegistro['status']): void {
  const inscricoes = getLocal();
  const idx = inscricoes.findIndex(i => i.id === id);
  if (idx !== -1) {
    inscricoes[idx].status = status;
    saveLocal(inscricoes);
  }
  if (useSupabase) {
    supabase.from('inscricoes').update({ status }).eq('id', id).then(() => {});
  }
}

export function buscarInscricao(id: string): InscricaoRegistro | undefined {
  return getLocal().find(i => i.id === id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function editarInscricao(id: string, inscricaoAtualizada: any): InscricaoRegistro | null {
  const inscricoes = getLocal();
  const idx = inscricoes.findIndex(i => i.id === id);
  if (idx === -1) return null;
  inscricoes[idx].inscricao = inscricaoAtualizada;
  saveLocal(inscricoes);
  if (useSupabase) {
    supabase.from('inscricoes').update({ dados: inscricaoAtualizada }).eq('id', id).then(() => {});
  }
  return inscricoes[idx];
}

export function podeEditar(): boolean {
  const dataLimiteTorneio = new Date('2026-07-04T00:00:00');
  return new Date() < dataLimiteTorneio;
}

export function excluirInscricao(id: string): void {
  const inscricoes = getLocal().filter(i => i.id !== id);
  saveLocal(inscricoes);
  if (useSupabase) {
    supabase.from('inscricoes').delete().eq('id', id).then(() => {});
  }
}

export function calcularPreco(modalidade: string, categoria?: string): number {
  if (modalidade === 'simples') {
    if (['mirim', 'infantil', 'juvenil'].includes(categoria || '')) return 290;
    return 320;
  }
  if (modalidade === 'duplas') return 640;
  if (modalidade === 'equipes') return 360;
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFromDb(row: any): InscricaoRegistro {
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

// Sincronizar dados do Supabase para localStorage (para o dashboard)
export async function syncFromSupabase(): Promise<void> {
  if (!useSupabase) return;
  const { data } = await supabase
    .from('inscricoes')
    .select('*')
    .order('created_at', { ascending: false });
  if (data && data.length > 0) {
    saveLocal(data.map(mapFromDb));
  }
}
