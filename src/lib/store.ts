'use client';

import { InscricaoRegistro } from '@/types';

const STORAGE_KEY = 'easycup_inscricoes';

function generateId(): string {
  return `IC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function getInscricoes(): InscricaoRegistro[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function salvarInscricao(registro: { inscricao: any; valor: number; desconto: number; valorFinal: number }): InscricaoRegistro {
  const inscricoes = getInscricoes();
  const novaInscricao: InscricaoRegistro = {
    ...registro,
    id: generateId(),
    dataInscricao: new Date().toISOString(),
    status: 'pendente',
  };
  inscricoes.push(novaInscricao);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inscricoes));
  return novaInscricao;
}

export function atualizarStatus(id: string, status: InscricaoRegistro['status']): void {
  const inscricoes = getInscricoes();
  const idx = inscricoes.findIndex(i => i.id === id);
  if (idx !== -1) {
    inscricoes[idx].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inscricoes));
  }
}

export function buscarInscricao(id: string): InscricaoRegistro | undefined {
  return getInscricoes().find(i => i.id === id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function editarInscricao(id: string, inscricaoAtualizada: any): InscricaoRegistro | null {
  const inscricoes = getInscricoes();
  const idx = inscricoes.findIndex(i => i.id === id);
  if (idx === -1) return null;
  inscricoes[idx].inscricao = inscricaoAtualizada;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inscricoes));
  return inscricoes[idx];
}

export function podeEditar(): boolean {
  const dataLimiteTorneio = new Date('2026-07-04T00:00:00');
  return new Date() < dataLimiteTorneio;
}

export function excluirInscricao(id: string): void {
  const inscricoes = getInscricoes().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inscricoes));
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
