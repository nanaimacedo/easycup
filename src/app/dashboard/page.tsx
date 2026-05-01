'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, clearSession } from '@/lib/auth';
import {
  Users, UserPlus, Trophy, ClipboardList, TrendingUp,
  Calendar, Search, Filter, Download, Trash2, CheckCircle, XCircle, Clock,
  BarChart3, PieChart, Pencil, LogOut, Upload,
} from 'lucide-react';
import Link from 'next/link';
import { getInscricoes, atualizarStatus, excluirInscricao, syncFromServer } from '@/lib/store';
import { InscricaoRegistro } from '@/types';

interface DashboardStats {
  totalInscricoes: number;
  totalAtletas: number;
  totalEquipes: number;
  receitaEstimada: number;
  porModalidade: { simples: number; duplas: number; equipes: number };
  porSexo: { masculino: number; feminino: number; misto: number };
  porCategoria: Record<string, number>;
  porStatus: { pendente: number; confirmada: number; cancelada: number };
  faixaEtária: Record<string, number>;
  porClube: Record<string, number>;
}

function calcStats(inscricoes: InscricaoRegistro[]): DashboardStats {
  const stats: DashboardStats = {
    totalInscricoes: inscricoes.length,
    totalAtletas: 0,
    totalEquipes: 0,
    receitaEstimada: 0,
    porModalidade: { simples: 0, duplas: 0, equipes: 0 },
    porSexo: { masculino: 0, feminino: 0, misto: 0 },
    porCategoria: {},
    porStatus: { pendente: 0, confirmada: 0, cancelada: 0 },
    faixaEtária: {},
    porClube: {},
  };

  const currentYear = new Date().getFullYear();

  inscricoes.forEach((reg) => {
    const { inscricao } = reg;
    stats.porModalidade[inscricao.modalidade]++;
    stats.porStatus[reg.status]++;
    stats.receitaEstimada += reg.valorFinal;

    if (inscricao.modalidade === 'simples') {
      stats.totalAtletas++;
      stats.porSexo[inscricao.sexo]++;
      const catKey = `Simples ${inscricao.sexo === 'masculino' ? 'Masc' : 'Fem'} ${inscricao.categoria.toUpperCase()}`;
      stats.porCategoria[catKey] = (stats.porCategoria[catKey] || 0) + 1;

      if (inscricao.dataNascimento) {
        const birthYear = new Date(inscricao.dataNascimento).getFullYear();
        const age = currentYear - birthYear;
        const faixa = getFaixaEtária(age);
        stats.faixaEtária[faixa] = (stats.faixaEtária[faixa] || 0) + 1;
      }

      if (inscricao.clube) {
        stats.porClube[inscricao.clube] = (stats.porClube[inscricao.clube] || 0) + 1;
      }
    } else if (inscricao.modalidade === 'duplas') {
      stats.totalAtletas += 2;
      stats.porSexo[inscricao.sexo] += 2;
      const catKey = `Duplas ${inscricao.sexo === 'masculino' ? 'Masc' : 'Fem'} ${inscricao.categoria.toUpperCase()}`;
      stats.porCategoria[catKey] = (stats.porCategoria[catKey] || 0) + 1;

      [inscricao.jogador1, inscricao.jogador2].forEach((j) => {
        if (j.dataNascimento) {
          const birthYear = new Date(j.dataNascimento).getFullYear();
          const age = currentYear - birthYear;
          const faixa = getFaixaEtária(age);
          stats.faixaEtária[faixa] = (stats.faixaEtária[faixa] || 0) + 1;
        }
        if (j.clube) {
          stats.porClube[j.clube] = (stats.porClube[j.clube] || 0) + 1;
        }
      });
    } else if (inscricao.modalidade === 'equipes') {
      stats.totalEquipes++;
      stats.totalAtletas += inscricao.membros.length;
      const catKey = `Equipes ${inscricao.categoria}`;
      stats.porCategoria[catKey] = (stats.porCategoria[catKey] || 0) + 1;

      const isMista = inscricao.categoria.includes('mista');
      if (isMista) {
        stats.porSexo.misto += inscricao.membros.length;
      }

      inscricao.membros.forEach((m) => {
        if (m.dataNascimento) {
          const birthYear = new Date(m.dataNascimento).getFullYear();
          const age = currentYear - birthYear;
          const faixa = getFaixaEtária(age);
          stats.faixaEtária[faixa] = (stats.faixaEtária[faixa] || 0) + 1;
        }
        if (m.clube) {
          stats.porClube[m.clube] = (stats.porClube[m.clube] || 0) + 1;
        }
      });
    }
  });

  return stats;
}

function getFaixaEtária(age: number): string {
  if (age <= 12) return 'Até 12 anos';
  if (age <= 15) return '13-15 anos';
  if (age <= 18) return '16-18 anos';
  if (age <= 30) return '19-30 anos';
  if (age <= 45) return '31-45 anos';
  if (age <= 60) return '46-60 anos';
  return '60+ anos';
}

export default function DashboardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [inscricoes, setInscricoes] = useState<InscricaoRegistro[]>([]);
  const [filtro, setFiltro] = useState('');
  const [filtroModalidade, setFiltroModalidade] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [tab, setTab] = useState<'overview' | 'inscricoes' | 'analytics'>('overview');

  const reload = useCallback(() => setInscricoes(getInscricoes()), []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setAuthed(true);
    // Sincronizar do server (Supabase) e carregar no cache local
    syncFromServer().then((data) => setInscricoes(data)).catch(() => reload());
  }, [router, reload]);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-text-muted)]">Verificando autenticação...</p>
      </div>
    );
  }

  const stats = calcStats(inscricoes);

  const inscricoesFiltradas = inscricoes.filter((reg) => {
    const { inscricao } = reg;
    let nome = '';
    if (inscricao.modalidade === 'simples') nome = inscricao.nome;
    else if (inscricao.modalidade === 'duplas') nome = `${inscricao.jogador1.nome} ${inscricao.jogador2.nome}`;
    else if (inscricao.modalidade === 'equipes') nome = inscricao.nomeEquipe;

    const matchSearch = !filtro || nome.toLowerCase().includes(filtro.toLowerCase()) || reg.id.toLowerCase().includes(filtro.toLowerCase());
    const matchModalidade = !filtroModalidade || inscricao.modalidade === filtroModalidade;
    const matchStatus = !filtroStatus || reg.status === filtroStatus;
    return matchSearch && matchModalidade && matchStatus;
  });

  const handleStatusChange = (id: string, status: InscricaoRegistro['status']) => {
    atualizarStatus(id, status);
    reload();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta inscrição?')) {
      excluirInscricao(id);
      reload();
    }
  };

  const exportCSV = () => {
    const safe = (v: unknown) => {
      if (v === undefined || v === null) return '';
      return String(v).replace(/;/g, ',').replace(/\n/g, ' ');
    };

    // Usa os dados FILTRADOS (pelo filtro de modalidade/status/busca)
    const dados = inscricoesFiltradas;
    const modalidadeFiltro = filtroModalidade || 'todos';

    let headers: string[];
    const rows: string[][] = [];
    let nomeArquivo: string;

    if (modalidadeFiltro === 'equipes') {
      // Formato agrupado para equipes (como na foto)
      headers = ['Categoria', 'Status', 'NOME DA EQUIPE', 'Capitão', 'Nº', 'Nome do Jogador', 'Data Nasc.', 'Telefone', 'E-mail', 'Clube', 'Nikkei', 'Professor', 'Valor (R$)', 'Data Inscrição', 'Código'];
      nomeArquivo = 'equipes';

      dados.forEach((reg) => {
        const i = reg.inscricao;
        if (i.modalidade !== 'equipes') return;
        const membrosArr = i.membros || [];
        membrosArr.forEach((m: { nome: string; dataNascimento: string; telefone: string; email: string; clube: string; isNikkey?: boolean; isProfessor?: boolean }, j: number) => {
          rows.push([
            j === 0 ? safe(i.categoria) : '',
            j === 0 ? reg.status : '',
            j === 0 ? safe(i.nomeEquipe) : '',
            j === 0 ? safe(i.capitao) : '',
            String(j + 1).padStart(2, '0'),
            safe(m.nome),
            safe(m.dataNascimento),
            safe(m.telefone),
            safe(m.email),
            safe(m.clube),
            m.isNikkey ? 'Sim' : 'Não',
            m.isProfessor ? 'Sim' : 'Não',
            j === 0 ? reg.valorFinal.toFixed(2) : '',
            j === 0 ? new Date(reg.dataInscricao).toLocaleDateString('pt-BR') : '',
            j === 0 ? reg.id : '',
          ]);
        });
        // Linha vazia para separar equipes
        rows.push(Array(headers.length).fill(''));
      });

    } else if (modalidadeFiltro === 'duplas') {
      // Formato agrupado para duplas
      headers = ['Sexo', 'Categoria', 'Status', 'Nº', 'Nome do Jogador', 'Data Nasc.', 'Telefone', 'E-mail', 'Clube', 'Valor (R$)', 'Data Inscrição', 'Código'];
      nomeArquivo = 'duplas';

      dados.forEach((reg) => {
        const i = reg.inscricao;
        if (i.modalidade !== 'duplas') return;
        rows.push([safe(i.sexo), safe(i.categoria), reg.status, '01', safe(i.jogador1.nome), safe(i.jogador1.dataNascimento), safe(i.jogador1.telefone), safe(i.jogador1.email), safe(i.jogador1.clube), reg.valorFinal.toFixed(2), new Date(reg.dataInscricao).toLocaleDateString('pt-BR'), reg.id]);
        rows.push(['', '', '', '02', safe(i.jogador2.nome), safe(i.jogador2.dataNascimento), safe(i.jogador2.telefone), safe(i.jogador2.email), safe(i.jogador2.clube), '', '', '']);
        rows.push(Array(headers.length).fill(''));
      });

    } else if (modalidadeFiltro === 'simples') {
      headers = ['Sexo', 'Categoria', 'Status', 'Nome', 'Data Nasc.', 'Telefone', 'E-mail', 'Clube', 'Valor (R$)', 'Data Inscrição', 'Código'];
      nomeArquivo = 'simples';

      dados.forEach((reg) => {
        const i = reg.inscricao;
        if (i.modalidade !== 'simples') return;
        rows.push([safe(i.sexo), safe(i.categoria), reg.status, safe(i.nome), safe(i.dataNascimento), safe(i.telefone), safe(i.email), safe(i.clube), reg.valorFinal.toFixed(2), new Date(reg.dataInscricao).toLocaleDateString('pt-BR'), reg.id]);
      });

    } else {
      // Todos - formato unificado
      headers = ['Modalidade', 'Sexo / Equipe', 'Categoria', 'Status', 'Nº', 'Nome do Jogador', 'Data Nasc.', 'Telefone', 'E-mail', 'Clube', 'Nikkei', 'Professor', 'Valor (R$)', 'Data Inscrição', 'Código'];
      nomeArquivo = 'todos';

      dados.forEach((reg) => {
        const i = reg.inscricao;
        if (i.modalidade === 'simples') {
          rows.push(['Simples', safe(i.sexo), safe(i.categoria), reg.status, '01', safe(i.nome), safe(i.dataNascimento), safe(i.telefone), safe(i.email), safe(i.clube), '', '', reg.valorFinal.toFixed(2), new Date(reg.dataInscricao).toLocaleDateString('pt-BR'), reg.id]);
        } else if (i.modalidade === 'duplas') {
          rows.push(['Duplas', safe(i.sexo), safe(i.categoria), reg.status, '01', safe(i.jogador1.nome), safe(i.jogador1.dataNascimento), safe(i.jogador1.telefone), safe(i.jogador1.email), safe(i.jogador1.clube), '', '', reg.valorFinal.toFixed(2), new Date(reg.dataInscricao).toLocaleDateString('pt-BR'), reg.id]);
          rows.push(['', '', '', '', '02', safe(i.jogador2.nome), safe(i.jogador2.dataNascimento), safe(i.jogador2.telefone), safe(i.jogador2.email), safe(i.jogador2.clube), '', '', '', '', '']);
        } else if (i.modalidade === 'equipes') {
          const membrosArr = i.membros || [];
          membrosArr.forEach((m: { nome: string; dataNascimento: string; telefone: string; email: string; clube: string; isNikkey?: boolean; isProfessor?: boolean }, j: number) => {
            rows.push([
              j === 0 ? 'Equipes' : '', j === 0 ? safe(i.nomeEquipe) : '', j === 0 ? safe(i.categoria) : '', j === 0 ? reg.status : '',
              String(j + 1).padStart(2, '0'),
              safe(m.nome), safe(m.dataNascimento), safe(m.telefone), safe(m.email), safe(m.clube),
              m.isNikkey ? 'Sim' : 'Não', m.isProfessor ? 'Sim' : 'Não',
              j === 0 ? reg.valorFinal.toFixed(2) : '', j === 0 ? new Date(reg.dataInscricao).toLocaleDateString('pt-BR') : '', j === 0 ? reg.id : '',
            ]);
          });
        }
        rows.push(Array(headers.length).fill(''));
      });
    }

    const bom = '\uFEFF';
    const csv = bom + [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intercolonial78_${nomeArquivo}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Painel de gestão de inscrições do 78º Intercolonial</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/dashboard/importar"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Upload className="w-4 h-4" /> Importar PDF
          </Link>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 max-w-md">
        {(['overview', 'inscricoes', 'analytics'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-[var(--color-text)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            {t === 'overview' ? 'Visão Geral' : t === 'inscricoes' ? 'Inscrições' : 'Analíticos'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={<ClipboardList className="w-5 h-5" />} label="Inscrições" value={stats.totalInscricoes} color="blue" />
            <KpiCard icon={<Users className="w-5 h-5" />} label="Atletas" value={stats.totalAtletas} color="emerald" />
            <KpiCard icon={<Trophy className="w-5 h-5" />} label="Equipes" value={stats.totalEquipes} color="purple" />
            <KpiCard icon={<TrendingUp className="w-5 h-5" />} label="Receita Est." value={`R$ ${stats.receitaEstimada.toFixed(0)}`} color="amber" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Por Modalidade */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-text)] flex items-center gap-2 mb-4">
                <PieChart className="w-4 h-4 text-[var(--color-primary)]" /> Por Modalidade
              </h3>
              <div className="space-y-3">
                <BarRow label="Simples" value={stats.porModalidade.simples} total={stats.totalInscricoes} color="bg-blue-500" />
                <BarRow label="Duplas" value={stats.porModalidade.duplas} total={stats.totalInscricoes} color="bg-emerald-500" />
                <BarRow label="Equipes" value={stats.porModalidade.equipes} total={stats.totalInscricoes} color="bg-purple-500" />
              </div>
            </div>

            {/* Por Status */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-text)] flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" /> Por Status
              </h3>
              <div className="space-y-3">
                <BarRow label="Pendente" value={stats.porStatus.pendente} total={stats.totalInscricoes} color="bg-amber-500" />
                <BarRow label="Confirmada" value={stats.porStatus.confirmada} total={stats.totalInscricoes} color="bg-green-500" />
                <BarRow label="Cancelada" value={stats.porStatus.cancelada} total={stats.totalInscricoes} color="bg-red-500" />
              </div>
            </div>

            {/* Por Sexo */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-text)] flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-[var(--color-primary)]" /> Atletas por Gênero
              </h3>
              <div className="space-y-3">
                <BarRow label="Masculino" value={stats.porSexo.masculino} total={stats.totalAtletas} color="bg-blue-500" />
                <BarRow label="Feminino" value={stats.porSexo.feminino} total={stats.totalAtletas} color="bg-pink-500" />
                {stats.porSexo.misto > 0 && (
                  <BarRow label="Misto" value={stats.porSexo.misto} total={stats.totalAtletas} color="bg-purple-500" />
                )}
              </div>
            </div>
          </div>

          {/* Faixa Etária e Categorias */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-text)] flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-[var(--color-primary)]" /> Faixa Etária dos Atletas
              </h3>
              {Object.keys(stats.faixaEtária).length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-4">Nenhum dado disponível</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats.faixaEtária)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([faixa, count]) => (
                      <BarRow key={faixa} label={faixa} value={count} total={stats.totalAtletas} color="bg-indigo-500" />
                    ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-text)] flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-[var(--color-primary)]" /> Inscrições por Categoria
              </h3>
              {Object.keys(stats.porCategoria).length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-4">Nenhum dado disponível</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(stats.porCategoria)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, count]) => (
                      <BarRow key={cat} label={cat} value={count} total={stats.totalInscricoes} color="bg-teal-500" />
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Clubes */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-border)]">
            <h3 className="font-semibold text-sm text-[var(--color-text)] flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-[var(--color-primary)]" /> Atletas por Clube (Top 10)
            </h3>
            {Object.keys(stats.porClube).length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-4">Nenhum dado disponível</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(stats.porClube)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([clube, count]) => (
                    <BarRow key={clube} label={clube} value={count} total={stats.totalAtletas} color="bg-cyan-500" />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'inscricoes' && (
        <div className="space-y-4 animate-fade-in">
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[var(--color-border)] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Buscar por nome ou código..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]/20 focus:border-[var(--color-border-focus)]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filtroModalidade}
                onChange={(e) => setFiltroModalidade(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm bg-white"
              >
                <option value="">Todas Modalidades</option>
                <option value="simples">Simples</option>
                <option value="duplas">Duplas</option>
                <option value="equipes">Equipes</option>
              </select>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm bg-white"
              >
                <option value="">Todos Status</option>
                <option value="pendente">Pendente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-[var(--color-text-muted)]">{inscricoesFiltradas.length} inscricoes encontradas</p>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Código</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Modalidade</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Nome</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Categoria</th>
                    <th className="px-4 py-3 text-right font-medium text-[var(--color-text-secondary)]">Valor</th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--color-text-secondary)]">Status</th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--color-text-secondary)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {inscricoesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-[var(--color-text-muted)]">
                        Nenhuma inscrição encontrada
                      </td>
                    </tr>
                  ) : (
                    inscricoesFiltradas.map((reg) => {
                      const { inscricao } = reg;
                      let nome = '';
                      let categoria = '';
                      if (inscricao.modalidade === 'simples') {
                        nome = inscricao.nome;
                        categoria = `${inscricao.sexo === 'masculino' ? 'M' : 'F'} ${inscricao.categoria.toUpperCase()}`;
                      } else if (inscricao.modalidade === 'duplas') {
                        nome = `${inscricao.jogador1.nome} / ${inscricao.jogador2.nome}`;
                        categoria = `${inscricao.sexo === 'masculino' ? 'M' : 'F'} ${inscricao.categoria.toUpperCase()}`;
                      } else {
                        nome = inscricao.nomeEquipe;
                        categoria = inscricao.categoria;
                      }

                      return (
                        <tr key={reg.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-[var(--color-primary)]">{reg.id}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${
                              inscricao.modalidade === 'simples' ? 'bg-blue-100 text-blue-700' :
                              inscricao.modalidade === 'duplas' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {inscricao.modalidade}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-[var(--color-text)] max-w-[200px] truncate">{nome}</td>
                          <td className="px-4 py-3 text-[var(--color-text-secondary)]">{categoria}</td>
                          <td className="px-4 py-3 text-right font-medium">R$ {reg.valorFinal.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            <StatusBadge status={reg.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              {(inscricao.modalidade === 'equipes' || inscricao.modalidade === 'duplas') && (
                                <Link
                                  href={`/inscricao/editar?id=${reg.id}`}
                                  title="Editar Jogadores"
                                  className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Link>
                              )}
                              <button
                                onClick={() => handleStatusChange(reg.id, 'confirmada')}
                                title="Confirmar"
                                className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(reg.id, 'cancelada')}
                                title="Cancelar"
                                className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(reg.id)}
                                title="Excluir"
                                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Faixa Etária detalhada */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
              <h3 className="font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                Distribuição por Faixa Etária
              </h3>
              {Object.keys(stats.faixaEtária).length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-3">
                  {['Até 12 anos', '13-15 anos', '16-18 anos', '19-30 anos', '31-45 anos', '46-60 anos', '60+ anos'].map((faixa) => {
                    const count = stats.faixaEtária[faixa] || 0;
                    if (count === 0 && stats.totalAtletas === 0) return null;
                    return (
                      <BarRow key={faixa} label={faixa} value={count} total={stats.totalAtletas} color="bg-gradient-to-r from-blue-400 to-blue-600" />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Categorias detalhadas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
              <h3 className="font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--color-primary)]" />
                Detalhamento por Categoria
              </h3>
              {Object.keys(stats.porCategoria).length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(stats.porCategoria)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, count]) => (
                      <div key={cat} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                        <span className="text-sm text-[var(--color-text)]">{cat}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[var(--color-text)]">{count}</span>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            ({stats.totalInscricoes > 0 ? ((count / stats.totalInscricoes) * 100).toFixed(0) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Clubes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
            <h3 className="font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--color-primary)]" />
              Representação por Clube
            </h3>
            {Object.keys(stats.porClube).length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(stats.porClube)
                  .sort(([, a], [, b]) => b - a)
                  .map(([clube, count], idx) => (
                    <div key={clube} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                        idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-700' : 'bg-gray-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text)] truncate">{clube}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{count} atleta{count > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[var(--color-border)]">
      <div className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">{label}</p>
    </div>
  );
}

function BarRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--color-text)]">{label}</span>
        <span className="font-medium text-[var(--color-text)]">{value} <span className="text-[var(--color-text-muted)]">({pct.toFixed(0)}%)</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pendente: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Clock className="w-3 h-3" /> },
    confirmada: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
    cancelada: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-3 h-3" /> },
  };
  const c = config[status] || config.pendente;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${c.bg} ${c.text} text-xs font-medium rounded-full`}>
      {c.icon} {status}
    </span>
  );
}

function EmptyState() {
  return <p className="text-sm text-[var(--color-text-muted)] text-center py-8">Nenhuma inscrição registrada ainda. Faça a primeira inscrição para ver os dados.</p>;
}
