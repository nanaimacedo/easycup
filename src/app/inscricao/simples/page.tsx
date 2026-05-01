'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Send, Info } from 'lucide-react';
import Link from 'next/link';
import FormField, { Input, Select, Checkbox } from '@/components/FormField';
import { simplesSchema, SimplesFormData } from '@/lib/validators';
import { CATEGORIAS_SIMPLES } from '@/lib/constants';
import { salvarInscricao, calcularPreco } from '@/lib/store';

export default function SimplesPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SimplesFormData>({
    resolver: zodResolver(simplesSchema),
    defaultValues: {
      problemaData: false,
      lgpdConsentimento: false as unknown as true,
      lgpdImagemConsentimento: false,
    },
  });

  const sexo = watch('sexo');
  const categoria = watch('categoria');
  const problemaData = watch('problemaData');
  const categorias = sexo ? CATEGORIAS_SIMPLES[sexo] : [];
  const preco = calcularPreco('simples', categoria);

  const onSubmit = (data: SimplesFormData) => {
    setSubmitting(true);
    const registro = salvarInscricao({
      inscricao: { ...data, modalidade: 'simples' },
      valor: preco,
      desconto: 0,
      valorFinal: preco,
    });
    router.push(`/inscricao/confirmacao?id=${registro.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/inscricao" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6">
          <h1 className="text-2xl font-bold text-white">Inscrição - Simples</h1>
          <p className="text-blue-100 text-sm mt-1">Modalidade individual masculino e feminino</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Sexo e Categoria */}
          <div className="bg-blue-50 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
              <Info className="w-4 h-4 text-[var(--color-primary)]" />
              Categoria
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Sexo" error={errors.sexo} required>
                <Select {...register('sexo')} hasError={!!errors.sexo}>
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </Select>
              </FormField>
              <FormField label="Categoria" error={errors.categoria} required>
                <Select {...register('categoria')} hasError={!!errors.categoria} disabled={!sexo}>
                  <option value="">Selecione a categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label} - {cat.desc}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
            {categoria && (
              <div className="bg-white rounded-lg p-3 border border-blue-200 animate-fade-in">
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  Valor da Inscrição: R$ {preco.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--color-text)]">Dados Pessoais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Nome completo" error={errors.nome} required>
                <Input {...register('nome')} placeholder="Nome completo" hasError={!!errors.nome} />
              </FormField>
              <FormField label="Data de nascimento" error={errors.dataNascimento} required>
                <Input type="date" {...register('dataNascimento')} hasError={!!errors.dataNascimento} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Telefone" error={errors.telefone} required>
                <Input {...register('telefone')} placeholder="(11) 99999-9999" hasError={!!errors.telefone} />
              </FormField>
              <FormField label="E-mail" error={errors.email} required>
                <Input type="email" {...register('email')} placeholder="seu@email.com" hasError={!!errors.email} />
              </FormField>
              <FormField label="Clube" error={errors.clube} required>
                <Input {...register('clube')} placeholder="Nome do clube" hasError={!!errors.clube} />
              </FormField>
            </div>
          </div>

          {/* Restrição de Data */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--color-text)]">Restrição de Data</h3>
            <Checkbox
              label="Tenho problema com alguma data dos jogos"
              {...register('problemaData')}
            />
            {problemaData && (
              <FormField label="Especifique a restrição" error={errors.problemaDataDetalhe}>
                <Input {...register('problemaDataDetalhe')} placeholder="Ex: Não posso dia 05/07" />
              </FormField>
            )}
          </div>

          {/* LGPD */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-[var(--color-text)]">Termos e Consentimento (LGPD)</h3>
            <Checkbox
              label="Li e concordo com a Política de Privacidade e Termos de Responsabilidade do 78º Campeonato Intercolonial de Tênis. Declaro estar ciente de todas as cláusulas e condições do regulamento."
              {...register('lgpdConsentimento')}
              error={errors.lgpdConsentimento}
            />
            <Checkbox
              label="Autorizo o uso da minha imagem para fins de divulgação do evento (opcional)"
              {...register('lgpdImagemConsentimento')}
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href="/inscricao"
              className="flex-1 px-6 py-3 rounded-xl border border-[var(--color-border)] text-center text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Enviando...' : 'Confirmar Inscrição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
