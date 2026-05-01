import { z } from 'zod';

const atletaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  telefone: z.string().min(10, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido'),
  clube: z.string().min(2, 'Clube é obrigatório'),
});

export const simplesSchema = atletaSchema.extend({
  sexo: z.enum(['masculino', 'feminino'], { message: 'Selecione o sexo' }),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  problemaData: z.boolean(),
  problemaDataDetalhe: z.string().optional(),
  lgpdConsentimento: z.literal(true, 'Você deve aceitar os termos da LGPD'),
  lgpdImagemConsentimento: z.boolean(),
});

export const duplasSchema = z.object({
  sexo: z.enum(['masculino', 'feminino'], { message: 'Selecione o sexo' }),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  jogador1: atletaSchema,
  jogador2: atletaSchema,
  problemaData: z.boolean(),
  problemaDataDetalhe: z.string().optional(),
  lgpdConsentimento: z.literal(true, 'Você deve aceitar os termos da LGPD'),
  lgpdImagemConsentimento: z.boolean(),
});

const membroEquipeSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  telefone: z.string().min(10, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido'),
  clube: z.string().min(2, 'Clube é obrigatório'),
  isNikkey: z.boolean(),
  isProfessor: z.boolean(),
});

export const equipesSchema = z.object({
  nomeEquipe: z.string().min(3, 'Nome da equipe é obrigatório'),
  capitao: z.string().min(3, 'Nome do capitão é obrigatório'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  membros: z.array(membroEquipeSchema).min(4, 'Equipe deve ter no mínimo 4 membros').max(8, 'Equipe pode ter no máximo 8 membros'),
  problemaData: z.boolean(),
  problemaDataDetalhe: z.string().optional(),
  lgpdConsentimento: z.literal(true, 'Você deve aceitar os termos da LGPD'),
  lgpdImagemConsentimento: z.boolean(),
});

export type SimplesFormData = z.infer<typeof simplesSchema>;
export type DuplasFormData = z.infer<typeof duplasSchema>;
export type EquipesFormData = z.infer<typeof equipesSchema>;
