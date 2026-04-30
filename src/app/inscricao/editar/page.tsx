'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search, Shield, UserPlus, Trash2, Save, AlertTriangle, CheckCircle, Lock, Calendar } from 'lucide-react';
import Link from 'next/link';
import FormField, { Input, Checkbox } from '@/components/FormField';
import { buscarInscricao, editarInscricao, podeEditar } from '@/lib/store';
import { InscricaoRegistro } from '@/types';

function EditarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get('id');

  const [codigoBusca, setCodigoBusca] = useState(idParam || '');
  const [registro, setRegistro] = useState<InscricaoRegistro | null>(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);
  const editavel = podeEditar();

  // Membros editaveis (copia local para editar)
  const [membros, setMembros] = useState<Array<{
    nome: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    clube: string;
    isNikkey: boolean;
    isProfessor: boolean;
  }>>([]);

  useEffect(() => {
    if (idParam) {
      buscar(idParam);
    }
  }, [idParam]);

  const buscar = (id: string) => {
    setErro('');
    setSucesso('');
    const found = buscarInscricao(id.trim());
    if (!found) {
      setErro('Inscrição não encontrada. Verifique o código e tente novamente.');
      setRegistro(null);
      return;
    }
    if (found.inscricao.modalidade !== 'equipes') {
      setErro('A edição de jogadores está disponível apenas para inscricoes por Equipes.');
      setRegistro(null);
      return;
    }
    setRegistro(found);
    setMembros(found.inscricao.membros.map((m: typeof membros[0]) => ({ ...m })));
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoBusca.trim()) return;
    buscar(codigoBusca);
  };

  const updateMembro = (index: number, field: string, value: string | boolean) => {
    setMembros(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMembro = () => {
    if (membros.length >= 8) return;
    setMembros(prev => [...prev, {
      nome: '', dataNascimento: '', telefone: '', email: '', clube: '',
      isNikkey: true, isProfessor: false,
    }]);
  };

  const removeMembro = (index: number) => {
    if (membros.length <= 4) return;
    setMembros(prev => prev.filter((_, i) => i !== index));
  };

  const handleSalvar = () => {
    if (!registro || !editavel) return;

    // Validacao basica
    for (let i = 0; i < membros.length; i++) {
      const m = membros[i];
      if (!m.nome || m.nome.length < 3) {
        setErro(`Membro ${i + 1}: Nome deve ter ao menos 3 caracteres.`);
        return;
      }
      if (!m.dataNascimento) {
        setErro(`Membro ${i + 1}: Data de nascimento obrigatória.`);
        return;
      }
      if (!m.telefone || m.telefone.length < 10) {
        setErro(`Membro ${i + 1}: Telefone obrigatório (mín. 10 dígitos).`);
        return;
      }
      if (!m.email || !m.email.includes('@')) {
        setErro(`Membro ${i + 1}: E-mail inválido.`);
        return;
      }
      if (!m.clube || m.clube.length < 2) {
        setErro(`Membro ${i + 1}: Clube obrigatório.`);
        return;
      }
    }

    setSalvando(true);
    setErro('');

    const inscricaoAtualizada = {
      ...registro.inscricao,
      membros,
    };

    const result = editarInscricao(registro.id, inscricaoAtualizada);
    if (result) {
      setRegistro(result);
      setSucesso('Jogadores atualizados com sucesso!');
      setTimeout(() => setSucesso(''), 4000);
    } else {
      setErro('Erro ao salvar. Tente novamente.');
    }
    setSalvando(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/inscricao" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
          <h1 className="text-2xl font-bold text-white">Editar Jogadores da Equipe</h1>
          <p className="text-amber-100 text-sm mt-1">
            Altere os membros da equipe até a data do torneio (04/07/2026)
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Aviso de prazo */}
          {!editavel && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Prazo encerrado</p>
                <p className="text-xs text-red-600 mt-0.5">
                  O prazo para edição de jogadores encerrou em 04/07/2026. Não é mais possível alterar os membros da equipe.
                </p>
              </div>
            </div>
          )}

          {editavel && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-700">Edição permitida</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Você pode editar os jogadores da equipe até 04/07/2026 (início do torneio).
                </p>
              </div>
            </div>
          )}

          {/* Busca */}
          <form onSubmit={handleBuscar} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                value={codigoBusca}
                onChange={(e) => setCodigoBusca(e.target.value)}
                placeholder="Digite o código da inscrição (ex: IC-XXXXX-XXXX)"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Buscar
            </button>
          </form>

          {/* Mensagens */}
          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}

          {sucesso && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">{sucesso}</p>
            </div>
          )}

          {/* Dados da equipe (somente leitura) */}
          {registro && registro.inscricao.modalidade === 'equipes' && (
            <>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Código</p>
                    <p className="text-sm font-mono font-bold text-[var(--color-primary)]">{registro.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Equipe</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{registro.inscricao.nomeEquipe}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Categoria</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">{registro.inscricao.categoria}</p>
                  </div>
                </div>
              </div>

              {/* Membros editaveis */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--color-text)]">
                    Jogadores ({membros.length}/8)
                  </h3>
                  {editavel && membros.length < 8 && (
                    <button
                      type="button"
                      onClick={addMembro}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Adicionar Jogador
                    </button>
                  )}
                </div>

                {membros.map((membro, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-3 animate-slide-up border border-[var(--color-border)]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        Jogador {index + 1}
                      </span>
                      {editavel && membros.length > 4 && (
                        <button
                          type="button"
                          onClick={() => removeMembro(index)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormField label="Nome" required>
                        <Input
                          value={membro.nome}
                          onChange={(e) => updateMembro(index, 'nome', e.target.value)}
                          placeholder="Nome completo"
                          disabled={!editavel}
                        />
                      </FormField>
                      <FormField label="Data nasc." required>
                        <Input
                          type="date"
                          value={membro.dataNascimento}
                          onChange={(e) => updateMembro(index, 'dataNascimento', e.target.value)}
                          disabled={!editavel}
                        />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <FormField label="Telefone" required>
                        <Input
                          value={membro.telefone}
                          onChange={(e) => updateMembro(index, 'telefone', e.target.value)}
                          placeholder="(11) 99999-9999"
                          disabled={!editavel}
                        />
                      </FormField>
                      <FormField label="E-mail" required>
                        <Input
                          type="email"
                          value={membro.email}
                          onChange={(e) => updateMembro(index, 'email', e.target.value)}
                          placeholder="email@email.com"
                          disabled={!editavel}
                        />
                      </FormField>
                      <FormField label="Clube" required>
                        <Input
                          value={membro.clube}
                          onChange={(e) => updateMembro(index, 'clube', e.target.value)}
                          placeholder="Clube"
                          disabled={!editavel}
                        />
                      </FormField>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Checkbox
                        label="Descendente Nikkei"
                        checked={membro.isNikkey}
                        onChange={(e) => updateMembro(index, 'isNikkey', e.target.checked)}
                        disabled={!editavel}
                      />
                      <Checkbox
                        label="Professor(a) / Profissional de tênis"
                        checked={membro.isProfessor}
                        onChange={(e) => updateMembro(index, 'isProfessor', e.target.checked)}
                        disabled={!editavel}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Regras */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-700 space-y-1">
                    <p className="font-semibold">Regras de composição (regulamento):</p>
                    <p>- Equipe: mínimo 4, máximo 8 jogadores</p>
                    <p>- Máximo 1 integrante não Nikkei por equipe</p>
                    <p>- Cat. B e C: não é permitido professor/profissional</p>
                    <p>- Cat. A: máximo 1 professor/profissional</p>
                    <p>- Cat. Especial (Masc): máximo 2 professores/profissionais</p>
                  </div>
                </div>
              </div>

              {/* Botoes */}
              {editavel && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link
                    href="/inscricao"
                    className="flex-1 px-6 py-3 rounded-xl border border-[var(--color-border)] text-center text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
                  >
                    Cancelar
                  </Link>
                  <button
                    onClick={handleSalvar}
                    disabled={salvando}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {salvando ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditarPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 text-center"><p>Carregando...</p></div>}>
      <EditarContent />
    </Suspense>
  );
}
