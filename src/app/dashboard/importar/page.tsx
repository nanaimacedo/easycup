'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Image, CheckCircle, AlertTriangle, ArrowLeft, Send, Loader2, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import { salvarInscricao, calcularPreco } from '@/lib/store';
import FormField, { Input, Select } from '@/components/FormField';
import { CATEGORIAS_SIMPLES, ESTADOS_BR } from '@/lib/constants';

interface DadosExtraidos {
  nome: string;
  dataNascimento: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  clube: string;
  sexo: string;
  categoria: string;
  modalidade: string;
  confianca: number;
  textoOriginal: string;
}

export default function ImportarPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [dados, setDados] = useState<DadosExtraidos | null>(null);
  const [showTexto, setShowTexto] = useState(false);
  const [sucesso, setSucesso] = useState('');

  // Campos editáveis
  const [nome, setNome] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [clube, setClube] = useState('');
  const [sexo, setSexo] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/'); return; }
    setAuthed(true);
  }, [router]);

  const preencherCampos = useCallback((d: DadosExtraidos) => {
    setNome(d.nome);
    setDataNasc(d.dataNascimento);
    setEndereco(d.endereco);
    setBairro(d.bairro);
    setCidade(d.cidade);
    setEstado(d.estado);
    setCep(d.cep);
    setTelefone(d.telefone);
    setEmail(d.email);
    setClube(d.clube);
    setSexo(d.sexo);
    setCategoria(d.categoria);
  }, []);

  const handleUpload = async (f: File) => {
    setFile(f);
    setErro('');
    setSucesso('');
    setDados(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', f);

    try {
      const res = await fetch('/api/importar', {
        method: 'POST',
        headers: { 'x-admin-session': 'authenticated' },
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        setErro(json.error || 'Erro ao processar arquivo');
        setLoading(false);
        return;
      }

      setDados(json.data);
      preencherCampos(json.data);
    } catch {
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) handleUpload(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleUpload(f);
  };

  const handleSalvar = () => {
    if (!nome || nome.length < 3) { setErro('Nome é obrigatório'); return; }
    if (!sexo) { setErro('Selecione o sexo'); return; }
    if (!categoria) { setErro('Selecione a categoria'); return; }

    const preco = calcularPreco('simples', categoria);
    const registro = salvarInscricao({
      inscricao: {
        modalidade: 'simples',
        nome, dataNascimento: dataNasc, endereco, bairro, cidade, estado, cep,
        telefone, email, clube, sexo, categoria,
        problemaData: false, lgpdConsentimento: true, lgpdImagemConsentimento: true,
      },
      valor: preco,
      desconto: 0,
      valorFinal: preco,
    });

    setSucesso(`Inscrição ${registro.id} salva com sucesso!`);
    setDados(null);
    setFile(null);
    setNome(''); setDataNasc(''); setEndereco(''); setBairro(''); setCidade('');
    setEstado(''); setCep(''); setTelefone(''); setEmail(''); setClube('');
    setSexo(''); setCategoria('');
  };

  const limpar = () => {
    setFile(null); setDados(null); setErro(''); setSucesso('');
    setNome(''); setDataNasc(''); setEndereco(''); setBairro(''); setCidade('');
    setEstado(''); setCep(''); setTelefone(''); setEmail(''); setClube('');
    setSexo(''); setCategoria('');
  };

  const categorias = sexo ? CATEGORIAS_SIMPLES[sexo as 'masculino' | 'feminino'] || [] : [];

  if (!authed) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-[var(--color-text-muted)]">Verificando autenticação...</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-6">
          <h1 className="text-2xl font-bold text-white">Importar Inscrição</h1>
          <p className="text-indigo-100 text-sm mt-1">Upload de PDF ou foto da ficha de inscrição para extração automática</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Mensagens */}
          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}
          {sucesso && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">{sucesso}</p>
            </div>
          )}

          {/* Upload Zone */}
          {!dados && !loading && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-[var(--color-border)] hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-indigo-500' : 'text-[var(--color-text-muted)]'}`} />
              <p className="text-lg font-semibold text-[var(--color-text)]">
                Arraste o arquivo aqui ou clique para selecionar
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Suporta PDF, PNG e JPEG (máximo 10MB)
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                  <FileText className="w-3.5 h-3.5" /> PDF
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                  <Image className="w-3.5 h-3.5" /> PNG / JPEG
                </span>
              </div>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-12 animate-fade-in">
              <Loader2 className="w-10 h-10 text-indigo-500 mx-auto mb-4 animate-spin" />
              <p className="text-sm font-medium text-[var(--color-text)]">Extraindo dados do arquivo...</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {file?.type === 'application/pdf' ? 'Analisando texto do PDF' : 'Processando OCR na imagem (pode levar alguns segundos)'}
              </p>
            </div>
          )}

          {/* Resultado da extração */}
          {dados && !loading && (
            <>
              {/* Confiança */}
              <div className={`rounded-xl p-4 flex items-center justify-between ${
                dados.confianca >= 70 ? 'bg-green-50 border border-green-200' :
                dados.confianca >= 40 ? 'bg-amber-50 border border-amber-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {dados.confianca >= 70 ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                  <div>
                    <p className="text-sm font-semibold">{dados.confianca >= 70 ? 'Extração bem-sucedida' : 'Extração parcial - revise os dados'}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Arquivo: {file?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{dados.confianca}%</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">confiança</p>
                </div>
              </div>

              {/* Ver texto original */}
              <button onClick={() => setShowTexto(!showTexto)} className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800">
                <Eye className="w-3.5 h-3.5" /> {showTexto ? 'Ocultar' : 'Ver'} texto extraído
              </button>
              {showTexto && (
                <pre className="bg-gray-50 border border-[var(--color-border)] rounded-xl p-4 text-xs text-[var(--color-text-secondary)] max-h-48 overflow-y-auto whitespace-pre-wrap font-mono">
                  {dados.textoOriginal}
                </pre>
              )}

              {/* Formulário editável */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--color-text)]">Dados Extraídos (revise e corrija se necessário)</h3>

                <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Sexo" required>
                      <Select value={sexo} onChange={e => { setSexo(e.target.value); setCategoria(''); }}>
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                      </Select>
                    </FormField>
                    <FormField label="Categoria" required>
                      <Select value={categoria} onChange={e => setCategoria(e.target.value)} disabled={!sexo}>
                        <option value="">Selecione</option>
                        {categorias.map(c => <option key={c.value} value={c.value}>{c.label} - {c.desc}</option>)}
                      </Select>
                    </FormField>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Nome completo" required>
                    <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" />
                  </FormField>
                  <FormField label="Data de nascimento">
                    <Input type="date" value={dataNasc} onChange={e => setDataNasc(e.target.value)} />
                  </FormField>
                </div>

                <FormField label="Endereço">
                  <Input value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Endereço" />
                </FormField>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <FormField label="Bairro">
                    <Input value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Bairro" />
                  </FormField>
                  <FormField label="Cidade">
                    <Input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade" />
                  </FormField>
                  <FormField label="Estado">
                    <Select value={estado} onChange={e => setEstado(e.target.value)}>
                      <option value="">UF</option>
                      {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </Select>
                  </FormField>
                  <FormField label="CEP">
                    <Input value={cep} onChange={e => setCep(e.target.value)} placeholder="CEP" />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField label="Telefone">
                    <Input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="Telefone" />
                  </FormField>
                  <FormField label="E-mail">
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" />
                  </FormField>
                  <FormField label="Clube">
                    <Input value={clube} onChange={e => setClube(e.target.value)} placeholder="Clube" />
                  </FormField>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button onClick={limpar} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">
                  <Trash2 className="w-4 h-4" /> Limpar e Enviar Outro
                </button>
                <button onClick={handleSalvar} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                  <Send className="w-4 h-4" /> Confirmar Inscrição
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
