'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Send, Info, User } from 'lucide-react';
import Link from 'next/link';
import FormField, { Input, Select, Checkbox } from '@/components/FormField';
import { duplasSchema, DuplasFormData } from '@/lib/validators';
import { CATEGORIAS_DUPLAS, ESTADOS_BR } from '@/lib/constants';
import { salvarInscricao } from '@/lib/store';

function AtletaFields({ prefix, register, errors }: { prefix: 'jogador1' | 'jogador2'; register: ReturnType<typeof useForm<DuplasFormData>>['register']; errors: Record<string, Record<string, { message?: string }>> }) {
  const e = (errors[prefix] || {}) as Record<string, { message?: string }>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nome completo" error={e.nome as never} required>
          <Input {...register(`${prefix}.nome`)} placeholder="Nome completo" hasError={!!e.nome} />
        </FormField>
        <FormField label="Data de nascimento" error={e.dataNascimento as never} required>
          <Input type="date" {...register(`${prefix}.dataNascimento`)} hasError={!!e.dataNascimento} />
        </FormField>
      </div>
      <FormField label="Endereço" error={e.endereco as never} required>
        <Input {...register(`${prefix}.endereco`)} placeholder="Rua, número, complemento" hasError={!!e.endereco} />
      </FormField>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FormField label="Bairro" error={e.bairro as never} required>
          <Input {...register(`${prefix}.bairro`)} placeholder="Bairro" hasError={!!e.bairro} />
        </FormField>
        <FormField label="Cidade" error={e.cidade as never} required>
          <Input {...register(`${prefix}.cidade`)} placeholder="Cidade" hasError={!!e.cidade} />
        </FormField>
        <FormField label="Estado" error={e.estado as never} required>
          <Select {...register(`${prefix}.estado`)} hasError={!!e.estado}>
            <option value="">UF</option>
            {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </Select>
        </FormField>
        <FormField label="CEP" error={e.cep as never} required>
          <Input {...register(`${prefix}.cep`)} placeholder="00000-000" hasError={!!e.cep} />
        </FormField>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Telefone" error={e.telefone as never} required>
          <Input {...register(`${prefix}.telefone`)} placeholder="(11) 99999-9999" hasError={!!e.telefone} />
        </FormField>
        <FormField label="E-mail" error={e.email as never} required>
          <Input type="email" {...register(`${prefix}.email`)} placeholder="seu@email.com" hasError={!!e.email} />
        </FormField>
        <FormField label="Clube" error={e.clube as never} required>
          <Input {...register(`${prefix}.clube`)} placeholder="Nome do clube" hasError={!!e.clube} />
        </FormField>
      </div>
    </div>
  );
}

export default function DuplasPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DuplasFormData>({
    resolver: zodResolver(duplasSchema),
    defaultValues: {
      problemaData: false,
      lgpdConsentimento: false as unknown as true,
      lgpdImagemConsentimento: false,
    },
  });

  const sexo = watch('sexo');
  const problemaData = watch('problemaData');
  const categorias = sexo ? CATEGORIAS_DUPLAS[sexo] : [];

  const onSubmit = (data: DuplasFormData) => {
    setSubmitting(true);
    const registro = salvarInscricao({
      inscricao: { ...data, modalidade: 'duplas' },
      valor: 640,
      desconto: 0,
      valorFinal: 640,
    });
    router.push(`/inscricao/confirmacao?id=${registro.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/inscricao" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-6">
          <h1 className="text-2xl font-bold text-white">Inscrição - Duplas</h1>
          <p className="text-emerald-100 text-sm mt-1">Duplas masculinas e femininas com repescagem</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Categoria */}
          <div className="bg-emerald-50 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" /> Categoria
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
            <div className="bg-white rounded-lg p-3 border border-emerald-200">
              <p className="text-sm font-semibold text-emerald-600">
                Valor da Inscrição: R$ 640,00 (a dupla)
              </p>
            </div>
          </div>

          {/* Jogador 1 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--color-primary)]" /> Jogador(a) 1
            </h3>
            <AtletaFields prefix="jogador1" register={register} errors={errors as never} />
          </div>

          <hr className="border-[var(--color-border)]" />

          {/* Jogador 2 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" /> Jogador(a) 2
            </h3>
            <AtletaFields prefix="jogador2" register={register} errors={errors as never} />
          </div>

          {/* Restrição de Data */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--color-text)]">Restrição de Data</h3>
            <Checkbox label="Temos problema com alguma data dos jogos" {...register('problemaData')} />
            {problemaData && (
              <FormField label="Especifique a restrição" error={errors.problemaDataDetalhe}>
                <Input {...register('problemaDataDetalhe')} placeholder="Ex: Não podemos dia 05/07" />
              </FormField>
            )}
          </div>

          {/* LGPD */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-[var(--color-text)]">Termos e Consentimento (LGPD)</h3>
            <Checkbox
              label="Ambos os jogadores leram e concordam com a Política de Privacidade e Termos de Responsabilidade do 78º Campeonato Intercolonial de Tênis."
              {...register('lgpdConsentimento')}
              error={errors.lgpdConsentimento}
            />
            <Checkbox
              label="Autorizamos o uso de nossas imagens para divulgação do evento (opcional)"
              {...register('lgpdImagemConsentimento')}
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/inscricao" className="flex-1 px-6 py-3 rounded-xl border border-[var(--color-border)] text-center text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
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
