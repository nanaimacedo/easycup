'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Trophy, Users, Shield, Clock, Award, AlertTriangle } from 'lucide-react';

export default function RegulamentoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/torneio" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Regulamento</h1>
              <p className="text-blue-100 text-sm">78º Campeonato Intercolonial de Tênis - 2026</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Informações Gerais */}
          <Section icon={<Trophy className="w-5 h-5" />} title="Informações Gerais">
            <p>O Campeonato Intercolonial de Tênis é um torneio destinado predominantemente aos tenistas descendentes da Colônia Japonesa. O torneio tem como sede o Coopercotia Atlético Clube.</p>
            <ul className="space-y-2 mt-3">
              <li><strong>Início:</strong> 04 e 05 de julho de 2026 (Capital e cidades num raio de até 150 km)</li>
              <li><strong>Continuidade:</strong> 10, 11 e 12 de julho de 2026 (todos os participantes)</li>
              <li><strong>Prazo de inscrição:</strong> 12 de junho de 2026</li>
            </ul>
          </Section>

          {/* Regras Gerais */}
          <Section icon={<Shield className="w-5 h-5" />} title="1. Regras Gerais">
            <ul className="space-y-2">
              <li>1.1 - O prazo de inscrição se encerra no dia <strong>12 de junho de 2026</strong>.</li>
              <li>1.2 - Cada tenista poderá se inscrever em no máximo <strong>2 categorias</strong>, desde que não seja em duas categorias por equipe.</li>
              <li>1.3 - Será permitida apenas uma única restrição de horário, apenas nas categorias Simples e Duplas.</li>
              <li>1.4 - As equipes inscritas deverão informar os nomes dos jogadores até 12/06/2026.</li>
              <li>1.5 - A Comissão Técnica reserva-se no direito de transferir jogadores e/ou equipes para outras categorias de acordo com o nível técnico.</li>
              <li>1.6 - Todos os jogos de <strong>Repescagem</strong> serão disputados em um Set Profissional (até 8 games) com NO-AD.</li>
              <li>1.7 - Nas categorias por Equipe, será permitida a participação de 1 atleta não Nikkei por equipe.</li>
              <li>1.8 - Nas categorias Duplas, será permitida a participação de 1 atleta não Nikkei/não descendente cônjuge de pessoa de ascendência japonesa.</li>
              <li>1.9 - As partidas serão regidas segundo as regras do Desporto Tênis, supervisionadas por árbitros credenciados pela ITF/CBT/FPT.</li>
              <li>1.10 - Atitudes antidesportivas podem resultar em suspensão de até 2 anos. Havendo reincidência, banimento do torneio.</li>
            </ul>
          </Section>

          {/* Premiação */}
          <Section icon={<Award className="w-5 h-5" />} title="Premiação">
            <ul className="space-y-2">
              <li>Medalhas aos campeões, vice-campeões e campeões da repescagem de cada categoria.</li>
              <li className="font-semibold">Premiação Especial (Simples Masculino e Feminino Especial):</li>
              <li className="ml-4">Campeão(ã): <strong>R$ 2.000,00</strong></li>
              <li className="ml-4">Vice: <strong>R$ 1.000,00</strong></li>
              <li className="ml-4">Semifinalistas: <strong>R$ 500,00</strong></li>
            </ul>
          </Section>

          {/* Categorias Simples */}
          <Section icon={<Users className="w-5 h-5" />} title="2. Categorias">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[var(--color-text)] mb-2">Simples Masculino</h4>
                <ul className="space-y-1 text-sm">
                  <li>Especial - Professores, Profissionais, Ex-Profissionais e 1ª Classes</li>
                  <li>A - 1ª e 2ª Classes</li>
                  <li>B - 3ª e 4ª Classes</li>
                  <li>C - 5ª Classe e Principiantes/Estreantes</li>
                  <li>Mirim - até 12 anos (com Repescagem)</li>
                  <li>Infantil - até 15 anos (com Repescagem)</li>
                  <li>Juvenil - até 18 anos (com Repescagem)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-text)] mb-2">Simples Feminino</h4>
                <ul className="space-y-1 text-sm">
                  <li>Especial - Professoras, Profissionais, Ex-Profissionais e 1ª Classes</li>
                  <li>A - 1ª e 2ª Classes</li>
                  <li>B - 3ª e 4ª Classes</li>
                  <li>C - Principiantes/Estreantes</li>
                  <li>Mirim - até 12 anos (com Repescagem)</li>
                  <li>Infantil - até 15 anos (com Repescagem)</li>
                  <li>Juvenil - até 18 anos (com Repescagem)</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold text-[var(--color-text)] mb-2">Duplas Masculino / Feminino</h4>
                <ul className="space-y-1 text-sm">
                  <li>A, B e C (com Repescagem)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-text)] mb-2">Equipes</h4>
                <ul className="space-y-1 text-sm">
                  <li>Dupla Masculino: Especial, A, B, C</li>
                  <li>Dupla Feminino: A, B, C</li>
                  <li>Dupla Mista Super: M60/F50, M65/F55, M70/F60, M75/F65</li>
                  <li>Mista Livre: A, B, C</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Jogos */}
          <Section icon={<Clock className="w-5 h-5" />} title="3. Formato dos Jogos">
            <ul className="space-y-2">
              <li><strong>Simples e Duplas (Especial, A, B, C):</strong> Melhor de 3 sets, sistema NO-AD. Empate 6×6: tie-break normal. Empate em sets: super tie-break (até 10).</li>
              <li><strong>Mirim, Infantil, Juvenil:</strong> Mesmo formato. Repescagem em Set Profissional (até 8 games) NO-AD.</li>
              <li><strong>Equipes:</strong> 3 jogos de duplas por confronto. Súmula apresentada 30 min antes. A súmula não pode ser alterada.</li>
              <li><strong>Dupla Mista (NO-AD):</strong> Sacador e recebedor devem ser do mesmo sexo.</li>
            </ul>
          </Section>

          {/* Equipes - Composição */}
          <Section icon={<Users className="w-5 h-5" />} title="4. Composição das Equipes">
            <ul className="space-y-2">
              <li>Mínimo 4, máximo 8 jogadores por equipe.</li>
              <li>Máximo 1 integrante não Nikkei por equipe.</li>
              <li><strong>Cat. C e B:</strong> Não é permitido professor/profissional de tênis.</li>
              <li><strong>Cat. A:</strong> Até 1 professor/profissional por equipe.</li>
              <li><strong>Cat. Especial (Masc):</strong> Até 2 professores/profissionais por equipe.</li>
              <li>As duplas não poderão ser repetidas durante todo o campeonato.</li>
              <li>Nenhum jogador poderá atuar 2 vezes no mesmo confronto.</li>
            </ul>
          </Section>

          {/* Taxas */}
          <Section icon={<Award className="w-5 h-5" />} title="5. Taxas de Inscrição">
            <div className="bg-gray-50 rounded-xl p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-2 font-semibold">Categoria</th>
                    <th className="text-right py-2 font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border)]"><td className="py-2">Simples Masculino e Feminino</td><td className="text-right py-2">R$ 320,00</td></tr>
                  <tr className="border-b border-[var(--color-border)]"><td className="py-2">Dupla Masculino e Feminino</td><td className="text-right py-2">R$ 640,00 (a dupla)</td></tr>
                  <tr className="border-b border-[var(--color-border)]"><td className="py-2">Mirim / Infantil / Juvenil</td><td className="text-right py-2">R$ 290,00</td></tr>
                  <tr><td className="py-2">Categoria por Equipes</td><td className="text-right py-2">R$ 360,00 (por participante)</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">Descontos:</h4>
              <ul className="space-y-1 text-sm">
                <li>Individual: R$ 50,00 para atletas inscritos em 2 categorias</li>
                <li>Família (2 inscrições): R$ 50,00</li>
                <li>Família (3 inscrições): R$ 100,00</li>
                <li>Família (4 inscrições): R$ 150,00</li>
                <li>Família (5 inscrições): R$ 200,00</li>
                <li>Família (6 inscrições): R$ 250,00</li>
                <li>Família (7 inscrições): R$ 300,00</li>
              </ul>
              <p className="text-xs text-[var(--color-text-muted)] mt-2">Família: pai, mãe e filhos em um núcleo familiar.</p>
            </div>
          </Section>

          {/* Termo de Responsabilidade */}
          <Section icon={<AlertTriangle className="w-5 h-5" />} title="6. Termo de Responsabilidade">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm space-y-2">
              <p>Os atletas participantes, ao se inscreverem, declaram estar cientes de todas as cláusulas e condições do regulamento.</p>
              <p>Exoneram o Coopercotia Atlético Clube de toda e qualquer responsabilidade por problemas de danos materiais, morais, físicos ou de saúde.</p>
              <p>Autorizam o uso de imagem para fins de divulgação do evento.</p>
              <p>Os casos omissos serão resolvidos pela Comissão Técnica.</p>
            </div>
          </Section>

          <div className="text-center pt-4 border-t border-[var(--color-border)]">
            <p className="text-sm font-semibold text-[var(--color-text)]">Coopercotia Atlético Clube</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Departamento de Tênis - Comissão Técnica</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">27 de abril de 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-bold text-[var(--color-text)] mb-3">
        <span className="text-[var(--color-primary)]">{icon}</span>
        {title}
      </h3>
      <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
