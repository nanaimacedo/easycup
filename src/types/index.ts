export type Modalidade = 'simples' | 'duplas' | 'equipes';
export type Sexo = 'masculino' | 'feminino';

export type CategoriaSimples =
  | 'especial'
  | 'a'
  | 'b'
  | 'c'
  | 'mirim'
  | 'infantil'
  | 'juvenil';

export type CategoriaDuplas = 'a' | 'b' | 'c';

export type CategoriaEquipes =
  | 'eq_dupla_masc_especial'
  | 'eq_dupla_masc_a'
  | 'eq_dupla_masc_b'
  | 'eq_dupla_masc_c'
  | 'eq_dupla_fem_a'
  | 'eq_dupla_fem_b'
  | 'eq_dupla_fem_c'
  | 'eq_mista_super_60_50'
  | 'eq_mista_super_65_55'
  | 'eq_mista_super_70_60'
  | 'eq_mista_super_75_65'
  | 'eq_mista_livre_a'
  | 'eq_mista_livre_b'
  | 'eq_mista_livre_c';

export interface Atleta {
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
}

export interface InscricaoSimples extends Atleta {
  modalidade: 'simples';
  sexo: Sexo;
  categoria: string;
  problemaData: boolean;
  problemaDataDetalhe?: string;
  lgpdConsentimento: boolean;
  lgpdImagemConsentimento: boolean;
}

export interface InscricaoDuplas {
  modalidade: 'duplas';
  sexo: Sexo;
  categoria: string;
  jogador1: Atleta;
  jogador2: Atleta;
  problemaData: boolean;
  problemaDataDetalhe?: string;
  lgpdConsentimento: boolean;
  lgpdImagemConsentimento: boolean;
}

export interface MembroEquipe {
  nome: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  clube: string;
  isNikkey: boolean;
  isProfessor: boolean;
}

export interface InscricaoEquipes {
  modalidade: 'equipes';
  nomeEquipe: string;
  capitao: string;
  categoria: string;
  membros: MembroEquipe[];
  problemaData: boolean;
  problemaDataDetalhe?: string;
  lgpdConsentimento: boolean;
  lgpdImagemConsentimento: boolean;
}

export type Inscricao = InscricaoSimples | InscricaoDuplas | InscricaoEquipes;

export interface InscricaoRegistro {
  id: string;
  inscricao: Inscricao;
  valor: number;
  desconto: number;
  valorFinal: number;
  dataInscricao: string;
  status: 'pendente' | 'confirmada' | 'cancelada';
}
