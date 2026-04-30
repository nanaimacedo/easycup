'use client';

import { InscricaoRegistro } from '@/types';
import { isAuthenticated } from './auth';

const CACHE_KEY = 'easycup_inscricoes';

// --- Cache local (fallback + performance) ---
function getCache(): InscricaoRegistro[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(CACHE_KEY);
  return data ? JSON.parse(data) : [];
}

function setCache(inscricoes: InscricaoRegistro[]): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(inscricoes));
}

function addToCache(inscricao: InscricaoRegistro): void {
  const list = getCache();
  list.unshift(inscricao);
  setCache(list);
}

// --- API Client ---
async function api(path: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };
  if (isAuthenticated()) {
    headers['x-admin-session'] = 'authenticated';
  }
  return fetch(path, { ...options, headers });
}

// --- Operações públicas ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function salvarInscricaoAsync(dados: { inscricao: any; valor: number; desconto: number; valorFinal: number }): Promise<InscricaoRegistro> {
  const res = await api('/api/inscricoes', {
    method: 'POST',
    body: JSON.stringify({
      modalidade: dados.inscricao.modalidade,
      dados: dados.inscricao,
      valor: dados.valor,
      desconto: dados.desconto,
      valorFinal: dados.valorFinal,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao salvar inscrição');

  const registro: InscricaoRegistro = json.data;
  addToCache(registro);
  return registro;
}

// Versão síncrona (salva no cache e envia pro server em background)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function salvarInscricao(dados: { inscricao: any; valor: number; desconto: number; valorFinal: number }): InscricaoRegistro {
  const id = `IC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const registro: InscricaoRegistro = {
    ...dados,
    id,
    dataInscricao: new Date().toISOString(),
    status: 'pendente',
  };

  addToCache(registro);

  // Fire-and-forget para o server
  api('/api/inscricoes', {
    method: 'POST',
    body: JSON.stringify({
      modalidade: dados.inscricao.modalidade,
      dados: dados.inscricao,
      valor: dados.valor,
      desconto: dados.desconto,
      valorFinal: dados.valorFinal,
    }),
  }).catch(() => {});

  return registro;
}

// --- Operações admin (requerem autenticação) ---

export async function getInscricoesFromServer(): Promise<InscricaoRegistro[]> {
  const res = await api('/api/inscricoes');
  const json = await res.json();
  if (res.ok && json.data && json.data.length > 0) {
    setCache(json.data);
    return json.data;
  }
  return getCache();
}

// Leitura síncrona do cache local
export function getInscricoes(): InscricaoRegistro[] {
  return getCache();
}

export async function atualizarStatusAsync(id: string, status: InscricaoRegistro['status']): Promise<void> {
  // Atualizar cache local imediatamente
  const list = getCache();
  const idx = list.findIndex(i => i.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    setCache(list);
  }
  // Enviar para server
  await api(`/api/inscricoes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function atualizarStatus(id: string, status: InscricaoRegistro['status']): void {
  const list = getCache();
  const idx = list.findIndex(i => i.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    setCache(list);
  }
  api(`/api/inscricoes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }).catch(() => {});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function editarInscricao(id: string, inscricaoAtualizada: any): InscricaoRegistro | null {
  const list = getCache();
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return null;
  list[idx].inscricao = inscricaoAtualizada;
  setCache(list);
  api(`/api/inscricoes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ dados: inscricaoAtualizada }),
  }).catch(() => {});
  return list[idx];
}

export function excluirInscricao(id: string): void {
  setCache(getCache().filter(i => i.id !== id));
  api(`/api/inscricoes/${id}`, { method: 'DELETE' }).catch(() => {});
}

export function buscarInscricao(id: string): InscricaoRegistro | undefined {
  return getCache().find(i => i.id === id);
}

export function podeEditar(): boolean {
  return new Date() < new Date('2026-07-04T00:00:00');
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

// Sincronizar do server para o cache local (usado no dashboard)
export async function syncFromServer(): Promise<InscricaoRegistro[]> {
  return getInscricoesFromServer();
}
