export const TORNEIO = {
  nome: '78º Campeonato Intercolonial de Tênis',
  clube: 'Coopercotia Atlético Clube',
  endereco: 'Avenida Guilherme Fongaro, 351 Parque Ipê',
  cep: '05571-015',
  cidade: 'São Paulo - SP',
  telefone: '11-3782-0727',
  whatsapp: '11-99967-7021',
  email1: 'coopertenis@uol.com.br',
  email2: 'teniscooper@gmail.com',
  prazoInscricao: '2026-06-12',
  dataInicio1: '04 e 05 de julho de 2026',
  dataInicio2: '10, 11 e 12 de julho de 2026',
  ano: 2026,
};

export const CATEGORIAS_SIMPLES = {
  masculino: [
    { value: 'especial', label: 'Especial (Premiada)', desc: 'Professores, Profissionais, Ex-Profissionais e 1ª Classes' },
    { value: 'a', label: 'Categoria A', desc: '1ª e 2ª Classes' },
    { value: 'b', label: 'Categoria B', desc: '3ª e 4ª Classes' },
    { value: 'c', label: 'Categoria C', desc: '5ª Classe e Principiantes/Estreantes' },
    { value: 'mirim', label: 'Mirim', desc: 'Até 12 anos (com Repescagem)', idadeMax: 12 },
    { value: 'infantil', label: 'Infantil', desc: 'Até 15 anos (com Repescagem)', idadeMax: 15 },
    { value: 'juvenil', label: 'Juvenil', desc: 'Até 18 anos (com Repescagem)', idadeMax: 18 },
  ],
  feminino: [
    { value: 'especial', label: 'Especial (Premiada)', desc: 'Professoras, Profissionais, Ex-Profissionais e 1ª Classes' },
    { value: 'a', label: 'Categoria A', desc: '1ª e 2ª Classes' },
    { value: 'b', label: 'Categoria B', desc: '3ª e 4ª Classes' },
    { value: 'c', label: 'Categoria C', desc: 'Principiantes/Estreantes' },
    { value: 'mirim', label: 'Mirim', desc: 'Até 12 anos (com Repescagem)', idadeMax: 12 },
    { value: 'infantil', label: 'Infantil', desc: 'Até 15 anos (com Repescagem)', idadeMax: 15 },
    { value: 'juvenil', label: 'Juvenil', desc: 'Até 18 anos (com Repescagem)', idadeMax: 18 },
  ],
};

export const CATEGORIAS_DUPLAS = {
  masculino: [
    { value: 'a', label: 'Categoria A', desc: '1ª e 2ª Classes (com Repescagem)' },
    { value: 'b', label: 'Categoria B', desc: '3ª e 4ª Classes (com Repescagem)' },
    { value: 'c', label: 'Categoria C', desc: '5ª Classe Principiantes/Estreantes (com Repescagem)' },
  ],
  feminino: [
    { value: 'a', label: 'Categoria A', desc: '1ª e 2ª Classes (com Repescagem)' },
    { value: 'b', label: 'Categoria B', desc: '3ª e 4ª Classes (com Repescagem)' },
    { value: 'c', label: 'Categoria C', desc: 'Principiantes/Estreantes (com Repescagem)' },
  ],
};

export const CATEGORIAS_EQUIPES = [
  { group: 'Eq. Dupla Masculino', items: [
    { value: 'eq_dupla_masc_especial', label: 'Masculino Especial' },
    { value: 'eq_dupla_masc_a', label: 'Masculino A' },
    { value: 'eq_dupla_masc_b', label: 'Masculino B' },
    { value: 'eq_dupla_masc_c', label: 'Masculino C' },
  ]},
  { group: 'Eq. Dupla Feminino', items: [
    { value: 'eq_dupla_fem_a', label: 'Feminino A' },
    { value: 'eq_dupla_fem_b', label: 'Feminino B' },
    { value: 'eq_dupla_fem_c', label: 'Feminino C' },
  ]},
  { group: 'Eq. Dupla Mista Super', items: [
    { value: 'eq_mista_super_60_50', label: 'Masc 60 / Fem 50' },
    { value: 'eq_mista_super_65_55', label: 'Masc 65 / Fem 55' },
    { value: 'eq_mista_super_70_60', label: 'Masc 70 / Fem 60' },
    { value: 'eq_mista_super_75_65', label: 'Masc 75 / Fem 65' },
  ]},
  { group: 'Eq. Mista Livre', items: [
    { value: 'eq_mista_livre_a', label: 'Mista A' },
    { value: 'eq_mista_livre_b', label: 'Mista B' },
    { value: 'eq_mista_livre_c', label: 'Mista C' },
  ]},
];

export const PRECOS = {
  simples: 320,
  simples_mirim: 290,
  simples_infantil: 290,
  simples_juvenil: 290,
  duplas: 640,
  equipes: 360,
};

export const DESCONTO_INDIVIDUAL = 50;

export const DESCONTO_FAMILIA: Record<number, number> = {
  2: 50,
  3: 100,
  4: 150,
  5: 200,
  6: 250,
  7: 300,
};

export const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export const PREMIACAO_ESPECIAL = {
  campeao: 2000,
  vice: 1000,
  semifinalistas: 500,
};
