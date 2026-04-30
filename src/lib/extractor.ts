// Extrai dados de inscrição a partir de texto (PDF ou OCR)
export interface DadosExtraidos {
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
  sexo: 'masculino' | 'feminino' | '';
  categoria: string;
  modalidade: 'simples' | 'duplas' | '';
  confianca: number; // 0-100 - grau de confiança da extração
  textoOriginal: string;
}

export function extrairDados(texto: string): DadosExtraidos {
  const t = texto.replace(/\r/g, '');
  let confianca = 0;
  let campos = 0;

  const nome = extrairCampo(t, /Nome[:\s]*([^\n]{3,60})/i);
  if (nome) campos++;

  const dataNasc = extrairData(t);
  if (dataNasc) campos++;

  const endereco = extrairCampo(t, /Endere[çc]o[:\s]*([^\n]{3,80})/i);
  if (endereco) campos++;

  const bairro = extrairCampo(t, /Bairro[:\s]*([^\n]{2,40})/i);
  if (bairro) campos++;

  const cidade = extrairCampo(t, /Cidade[:\s]*([^\n]{2,40})/i);
  if (cidade) campos++;

  const estado = extrairEstado(t);
  if (estado) campos++;

  const cep = extrairCampo(t, /Cep[:\s]*(\d{5}[-\s]?\d{3})/i) || extrairCampo(t, /(\d{5}[-]\d{3})/);
  if (cep) campos++;

  const telefone = extrairTelefone(t);
  if (telefone) campos++;

  const email = extrairCampo(t, /e-?mail[:\s]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
    || extrairCampo(t, /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (email) campos++;

  const clube = extrairCampo(t, /Clube[:\s]*([^\n]{2,40})/i);
  if (clube) campos++;

  const sexo = detectarSexo(t);
  if (sexo) campos++;

  const categoria = detectarCategoria(t);
  if (categoria) campos++;

  const modalidade = detectarModalidade(t);
  if (modalidade) campos++;

  // Confiança baseada em quantos campos foram extraídos
  confianca = Math.round((campos / 13) * 100);

  return {
    nome: nome || '',
    dataNascimento: dataNasc || '',
    endereco: endereco || '',
    bairro: bairro || '',
    cidade: cidade || '',
    estado: estado || '',
    cep: cep || '',
    telefone: telefone || '',
    email: email || '',
    clube: clube || '',
    sexo: sexo as DadosExtraidos['sexo'],
    categoria: categoria || '',
    modalidade: modalidade as DadosExtraidos['modalidade'],
    confianca,
    textoOriginal: texto.substring(0, 2000),
  };
}

function extrairCampo(texto: string, regex: RegExp): string {
  const match = texto.match(regex);
  return match ? match[1].trim().replace(/\.{2,}/g, '').replace(/_{2,}/g, '').trim() : '';
}

function extrairData(texto: string): string {
  // DD/MM/AAAA
  const match = texto.match(/Data\s*(?:Nasc|de nascimento)[.:\s]*(\d{2}[/.-]\d{2}[/.-]\d{4})/i)
    || texto.match(/(\d{2}[/.-]\d{2}[/.-]\d{4})/);
  if (match) {
    const parts = match[1].split(/[/.-]/);
    if (parts.length === 3 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // ISO format
    }
  }
  return '';
}

function extrairTelefone(texto: string): string {
  const match = texto.match(/Telefone[:\s]*([(\d\s)+-]{10,20})/i)
    || texto.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/);
  return match ? match[1].trim() : '';
}

function extrairEstado(texto: string): string {
  const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
  const match = texto.match(/Estado[:\s]*([A-Z]{2})/i);
  if (match && estados.includes(match[1].toUpperCase())) return match[1].toUpperCase();
  // Buscar UF isolada
  for (const uf of estados) {
    if (texto.includes(` ${uf} `) || texto.includes(`\n${uf}\n`) || texto.includes(`\t${uf}`)) return uf;
  }
  return '';
}

function detectarSexo(texto: string): string {
  const upper = texto.toUpperCase();
  if (upper.includes('MASCULINO') && !upper.includes('FEMININO')) return 'masculino';
  if (upper.includes('FEMININO') && !upper.includes('MASCULINO')) return 'feminino';
  // Verificar checkboxes marcados
  if (/\[X\]\s*MASCULINO/i.test(texto) || /MASCULINO\s*\[X\]/i.test(texto)) return 'masculino';
  if (/\[X\]\s*FEMININO/i.test(texto) || /FEMININO\s*\[X\]/i.test(texto)) return 'feminino';
  return '';
}

function detectarCategoria(texto: string): string {
  const upper = texto.toUpperCase();
  if (/ESPECIAL/i.test(upper) && (/\[X\]|PREMIADA/i.test(upper))) return 'especial';
  if (/MIRIM/i.test(upper)) return 'mirim';
  if (/INFANTIL/i.test(upper)) return 'infantil';
  if (/JUVENIL/i.test(upper)) return 'juvenil';
  // Categorias A, B, C - procurar marcação
  if (/\[X\]\s*"?A"?\s*[-–]/i.test(texto) || /"A"\s*.*\[X\]/i.test(texto)) return 'a';
  if (/\[X\]\s*"?B"?\s*[-–]/i.test(texto) || /"B"\s*.*\[X\]/i.test(texto)) return 'b';
  if (/\[X\]\s*"?C"?\s*[-–]/i.test(texto) || /"C"\s*.*\[X\]/i.test(texto)) return 'c';
  return '';
}

function detectarModalidade(texto: string): string {
  const upper = texto.toUpperCase();
  if (upper.includes('FICHA DE INSCRIÇÃO - SIMPLES') || upper.includes('FICHA DE INSCRICAO - SIMPLES') || upper.includes('MODALIDADE SIMPLES')) return 'simples';
  if (upper.includes('FICHA DE INSCRIÇÃO - DUPLAS') || upper.includes('FICHA DE INSCRICAO - DUPLAS') || upper.includes('MODALIDADE DUPLAS')) return 'duplas';
  if (upper.includes('SIMPLES') && !upper.includes('DUPLAS')) return 'simples';
  if (upper.includes('DUPLAS') && !upper.includes('SIMPLES')) return 'duplas';
  return '';
}
