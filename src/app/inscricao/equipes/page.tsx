'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Send, Info, UserPlus, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import FormField, { Input, Select, Checkbox } from '@/components/FormField';
import { equipesSchema, EquipesFormData } from '@/lib/validators';
import { CATEGORIAS_EQUIPES } from '@/lib/constants';
import { salvarInscricao } from '@/lib/store';

const emptyMembro = {
  nome: '',
  dataNascimento: '',
  telefone: '',
  email: '',
  clube: '',
  isNikkey: true,
  isProfessor: false,
};

export default function EquipesPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<EquipesFormData>({
    resolver: zodResolver(equipesSchema),
    defaultValues: {
      membros: [{ ...emptyMembro }, { ...emptyMembro }, { ...emptyMembro }, { ...emptyMembro }],
      problemaData: false,
      lgpdConsentimento: false as unknown as true,
      lgpdImagemConsentimento: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'membros' });
  const problemaData = watch('problemaData');
  const membros = watch('membros');
  const totalMembros = membros?.length || 0;
  const valorTotal = totalMembros * 360;

  const onSubmit = (data: EquipesFormData) => {
    setSubmitting(true);
    const registro = salvarInscricao({
      inscricao: { ...data, modalidade: 'equipes' },
      valor: valorTotal,
      desconto: 0,
      valorFinal: valorTotal,
    });
    router.push(`/inscricao/confirmacao?id=${registro.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/inscricao" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6">
          <h1 className="text-2xl font-bold text-white">Inscrição - Equipes</h1>
          <p className="text-purple-100 text-sm mt-1">Equipes de 4 a 8 jogadores</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Dados da Equipe */}
          <div className="bg-purple-50 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-600" /> Dados da Equipe
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Nome da equipe" error={errors.nomeEquipe} required>
                <Input {...register('nomeEquipe')} placeholder="Nome da equipe" hasError={!!errors.nomeEquipe} />
              </FormField>
              <FormField label="Capitão" error={errors.capitao} required>
                <Input {...register('capitao')} placeholder="Nome do capitão" hasError={!!errors.capitao} />
              </FormField>
            </div>
            <FormField label="Categoria" error={errors.categoria} required>
              <Select {...register('categoria')} hasError={!!errors.categoria}>
                <option value="">Selecione a categoria</option>
                {CATEGORIAS_EQUIPES.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.items.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </FormField>
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <p className="text-sm font-semibold text-purple-600">
                Valor: R$ 360,00 x {totalMembros} membros = R$ {valorTotal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Membros */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" /> Membros da Equipe ({totalMembros}/8)
              </h3>
              {totalMembros < 8 && (
                <button
                  type="button"
                  onClick={() => append({ ...emptyMembro })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Adicionar
                </button>
              )}
            </div>

            {errors.membros && typeof errors.membros.message === 'string' && (
              <p className="text-xs text-[var(--color-error)]">{errors.membros.message}</p>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 rounded-xl p-4 space-y-3 animate-slide-up">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--color-text)]">Membro {index + 1}</span>
                  {totalMembros > 4 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Nome" error={errors.membros?.[index]?.nome} required>
                    <Input {...register(`membros.${index}.nome`)} placeholder="Nome completo" hasError={!!errors.membros?.[index]?.nome} />
                  </FormField>
                  <FormField label="Data nasc." error={errors.membros?.[index]?.dataNascimento} required>
                    <Input type="date" {...register(`membros.${index}.dataNascimento`)} hasError={!!errors.membros?.[index]?.dataNascimento} />
                  </FormField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField label="Telefone" error={errors.membros?.[index]?.telefone} required>
                    <Input {...register(`membros.${index}.telefone`)} placeholder="(11) 99999-9999" hasError={!!errors.membros?.[index]?.telefone} />
                  </FormField>
                  <FormField label="E-mail" error={errors.membros?.[index]?.email} required>
                    <Input type="email" {...register(`membros.${index}.email`)} placeholder="email@email.com" hasError={!!errors.membros?.[index]?.email} />
                  </FormField>
                  <FormField label="Clube" error={errors.membros?.[index]?.clube} required>
                    <Input {...register(`membros.${index}.clube`)} placeholder="Clube" hasError={!!errors.membros?.[index]?.clube} />
                  </FormField>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Checkbox label="Descendente Nikkei" {...register(`membros.${index}.isNikkey`)} />
                  <Checkbox label="Professor(a) / Profissional de tênis" {...register(`membros.${index}.isProfessor`)} />
                </div>
              </div>
            ))}
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
              label="Todos os membros da equipe leram e concordam com a Política de Privacidade e Termos de Responsabilidade do 78º Campeonato Intercolonial de Tênis."
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
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
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
