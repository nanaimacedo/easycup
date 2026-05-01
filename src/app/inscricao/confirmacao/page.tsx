'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, Home, ClipboardList, Users, UserPlus, Trophy, Pencil } from 'lucide-react';
import { getInscricoes, podeEditar } from '@/lib/store';
import { InscricaoRegistro } from '@/types';
import { TORNEIO } from '@/lib/constants';

function ConfirmacaoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [registro, setRegistro] = useState<InscricaoRegistro | null>(null);

  useEffect(() => {
    if (id) {
      const inscricoes = getInscricoes();
      const found = inscricoes.find(i => i.id === id);
      setRegistro(found || null);
    }
  }, [id]);

  if (!registro) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--color-text-secondary)]">Inscrição não encontrada.</p>
        <Link href="/inscricao" className="mt-4 inline-block text-[var(--color-primary)] font-medium hover:underline">
          Voltar para inscricoes
        </Link>
      </div>
    );
  }

  const { inscricao } = registro;
  const modalidadeLabels = { simples: 'Simples', duplas: 'Duplas', equipes: 'Equipes' };
  const modalidadeIcons = {
    simples: <UserPlus className="w-6 h-6" />,
    duplas: <Users className="w-6 h-6" />,
    equipes: <Trophy className="w-6 h-6" />,
  };

  const getNomeAtleta = () => {
    if (inscricao.modalidade === 'simples') return inscricao.nome;
    if (inscricao.modalidade === 'duplas') return `${inscricao.jogador1.nome} / ${inscricao.jogador2.nome}`;
    if (inscricao.modalidade === 'equipes') return inscricao.nomeEquipe;
    return '';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8 animate-slide-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Inscrição Realizada!</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">Sua inscrição foi registrada com sucesso.</p>
      </div>

      {/* Recibo */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden animate-slide-up" id="recibo">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-200">RECIBO DE INSCRIÇÃO</p>
              <p className="font-bold">{TORNEIO.nome}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-200">Código</p>
              <p className="font-mono font-bold text-lg">{registro.id}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[var(--color-primary)]">
              {modalidadeIcons[inscricao.modalidade]}
            </div>
            <div>
              <p className="font-bold text-[var(--color-text)]">{modalidadeLabels[inscricao.modalidade]}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {inscricao.modalidade !== 'equipes'
                  ? `${inscricao.sexo === 'masculino' ? 'Masculino' : 'Feminino'} - Categoria ${inscricao.categoria.toUpperCase()}`
                  : `Categoria: ${inscricao.categoria}`
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Inscrito(s)</p>
              <p className="text-sm font-medium text-[var(--color-text)]">{getNomeAtleta()}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Data da Inscrição</p>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {new Date(registro.dataInscricao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600">Valor da Inscrição</p>
                <p className="text-2xl font-bold text-green-700">R$ {registro.valorFinal.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600">Status</p>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  Pagamento na Presença
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] text-center">
            A taxa de inscrição será paga no ato da presença no {TORNEIO.clube}.
          </p>
        </div>
      </div>

      {/* Edit button for duplas/equipes */}
      {(inscricao.modalidade === 'equipes' || inscricao.modalidade === 'duplas') && podeEditar() && (
        <div className="mt-4">
          <Link
            href={`/inscricao/editar?id=${registro.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-100 transition-colors"
          >
            <Pencil className="w-4 h-4" /> Editar Jogadores
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={() => window.print()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <Download className="w-4 h-4" /> Imprimir Recibo
        </button>
        <Link
          href="/inscricao"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] hover:bg-blue-50 transition-colors"
        >
          <ClipboardList className="w-4 h-4" /> Nova Inscrição
        </Link>
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Home className="w-4 h-4" /> Início
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-12 text-center"><p>Carregando...</p></div>}>
      <ConfirmacaoContent />
    </Suspense>
  );
}
