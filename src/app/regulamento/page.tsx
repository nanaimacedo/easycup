'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Trophy, Users, Shield, Clock, Award, AlertTriangle, DollarSign, Percent, UserCheck, Swords, Medal } from 'lucide-react';

export default function RegulamentoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/torneio" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Torneio
      </Link>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-blue-950 rounded-2xl p-8 sm:p-10 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">Regulamento Oficial</h1>
            <p className="text-blue-200 mt-1">78º Campeonato Intercolonial de Tênis - 2026</p>
            <p className="text-blue-300 text-xs mt-1">Coopercotia Atlético Clube - Departamento de Tênis</p>
          </div>
        </div>
      </div>

      {/* Info Geral - Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <InfoCard icon={<Clock className="w-5 h-5" />} label="1ª Fase" value="04 e 05/07/2026" sublabel="Capital e raio de 150 km" color="blue" />
        <InfoCard icon={<Clock className="w-5 h-5" />} label="2ª Fase" value="10, 11 e 12/07/2026" sublabel="Todos os participantes" color="blue" />
        <InfoCard icon={<AlertTriangle className="w-5 h-5" />} label="Prazo de Inscrição" value="12/06/2026" sublabel="Improrrogável" color="red" />
      </div>

      <div className="space-y-6">
        {/* Regras Gerais */}
        <Card color="blue" icon={<Shield className="w-5 h-5" />} title="1. Regras Gerais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <Rule n="1.1">Prazo de inscrição: <strong>12 de junho de 2026</strong>.</Rule>
            <Rule n="1.2">Máximo <strong>2 categorias</strong> por atleta (não 2 por equipe).</Rule>
            <Rule n="1.3">Apenas 1 restrição de horário (Simples e Duplas).</Rule>
            <Rule n="1.4">Equipes: informar jogadores até <strong>12/06/2026</strong>.</Rule>
            <Rule n="1.5">Comissão Técnica pode transferir atletas/equipes por nível técnico.</Rule>
            <Rule n="1.6">Repescagem: Set Profissional (8 games) com NO-AD.</Rule>
            <Rule n="1.7">Equipes: permitido 1 atleta <strong>não Nikkei</strong> por equipe.</Rule>
            <Rule n="1.8">Duplas: cônjuge de descendente japonês não conta como não Nikkei.</Rule>
            <Rule n="1.9">Regras oficiais do Tênis (ITF/CBT/FPT).</Rule>
            <Rule n="1.10">Atitudes antidesportivas: suspensão até 2 anos. Reincidência: banimento.</Rule>
          </div>
        </Card>

        {/* Categorias */}
        <Card color="purple" icon={<Trophy className="w-5 h-5" />} title="2. Categorias">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoriaCard title="Simples Masculino" color="blue" items={[
              { cat: 'Especial', desc: 'Professores, Profissionais, Ex-Profissionais e 1ª Classes', badge: 'Premiada' },
              { cat: 'A', desc: '1ª e 2ª Classes' },
              { cat: 'B', desc: '3ª e 4ª Classes' },
              { cat: 'C', desc: '5ª Classe e Principiantes/Estreantes' },
              { cat: 'Mirim', desc: 'Até 12 anos', badge: 'Repescagem' },
              { cat: 'Infantil', desc: 'Até 15 anos', badge: 'Repescagem' },
              { cat: 'Juvenil', desc: 'Até 18 anos', badge: 'Repescagem' },
            ]} />
            <CategoriaCard title="Simples Feminino" color="pink" items={[
              { cat: 'Especial', desc: 'Professoras, Profissionais, Ex-Profissionais e 1ª Classes', badge: 'Premiada' },
              { cat: 'A', desc: '1ª e 2ª Classes' },
              { cat: 'B', desc: '3ª e 4ª Classes' },
              { cat: 'C', desc: 'Principiantes/Estreantes' },
              { cat: 'Mirim', desc: 'Até 12 anos', badge: 'Repescagem' },
              { cat: 'Infantil', desc: 'Até 15 anos', badge: 'Repescagem' },
              { cat: 'Juvenil', desc: 'Até 18 anos', badge: 'Repescagem' },
            ]} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <CategoriaCard title="Duplas Masculino / Feminino" color="emerald" items={[
              { cat: 'A', desc: '1ª e 2ª Classes', badge: 'Repescagem' },
              { cat: 'B', desc: '3ª e 4ª Classes', badge: 'Repescagem' },
              { cat: 'C', desc: 'Principiantes/Estreantes', badge: 'Repescagem' },
            ]} />
            <div className="space-y-4">
              <CategoriaCard title="Equipe Dupla Masculino" color="amber" items={[
                { cat: 'Especial / A / B / C', desc: '' },
              ]} />
              <CategoriaCard title="Equipe Dupla Feminino" color="amber" items={[
                { cat: 'A / B / C', desc: '' },
              ]} />
              <CategoriaCard title="Equipe Dupla Mista Super" color="amber" items={[
                { cat: 'M60/F50 | M65/F55 | M70/F60 | M75/F65', desc: '' },
              ]} />
              <CategoriaCard title="Equipe Mista Livre" color="amber" items={[
                { cat: 'A / B / C', desc: '' },
              ]} />
            </div>
          </div>
        </Card>

        {/* Formato dos Jogos */}
        <Card color="emerald" icon={<Swords className="w-5 h-5" />} title="3. Formato dos Jogos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormatoCard
              title="Simples e Duplas (Especial, A, B, C)"
              items={[
                'Melhor de 3 sets com NO-AD',
                'Empate 6×6: tie-break normal (até 7)',
                '3º set: super tie-break (até 10)',
              ]}
            />
            <FormatoCard
              title="Mirim, Infantil, Juvenil"
              items={[
                'Mesmo formato dos adultos',
                'Repescagem: Set Profissional (8 games) NO-AD',
                'Empate 7×7: tie-break normal',
              ]}
            />
            <FormatoCard
              title="Equipes"
              items={[
                '3 jogos de duplas por confronto',
                'Súmula 30 min antes (inalterável)',
                'Duplas não podem repetir no campeonato',
                'Nenhum jogador joga 2× no mesmo confronto',
              ]}
            />
            <FormatoCard
              title="Dupla Mista (NO-AD)"
              items={[
                'Sacador e recebedor do mesmo sexo',
                'WO: contagem de 6×0 6×0 ou 8×0',
              ]}
            />
          </div>
        </Card>

        {/* Composição Equipes */}
        <Card color="amber" icon={<UserCheck className="w-5 h-5" />} title="4. Composição das Equipes">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <EquipeRule label="Tamanho" value="Mínimo 4, máximo 8 jogadores" />
            <EquipeRule label="Não Nikkei" value="Máximo 1 por equipe" />
            <EquipeRule label="Cônjuge" value="Não conta como não Nikkei" />
            <EquipeRule label="Cat. C e B" value="Sem professor/profissional" alert />
            <EquipeRule label="Cat. A" value="Até 1 professor/profissional" />
            <EquipeRule label="Cat. Especial" value="Até 2 professores (Masc)" />
          </div>
        </Card>

        {/* Premiação */}
        <Card color="yellow" icon={<Medal className="w-5 h-5" />} title="5. Premiação">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 text-center">
              <Medal className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-xs text-amber-600 uppercase font-semibold tracking-wider">Todas as Categorias</p>
              <p className="text-sm text-[var(--color-text)] mt-1">Medalhas para campeões, vice-campeões e campeões da repescagem</p>
            </div>
            <div className="flex-1 bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-xl p-5 text-center shadow-md">
              <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-xs text-amber-700 uppercase font-bold tracking-wider">Premiação Especial</p>
              <p className="text-[10px] text-amber-600 mb-3">Simples Masculino e Feminino Especial</p>
              <div className="space-y-2">
                <div className="bg-white rounded-lg px-3 py-2">
                  <p className="text-xs text-[var(--color-text-muted)]">Campeão(ã)</p>
                  <p className="text-xl font-extrabold text-amber-700">R$ 2.000</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white rounded-lg px-2 py-1.5">
                    <p className="text-[10px] text-[var(--color-text-muted)]">Vice</p>
                    <p className="text-sm font-bold text-amber-600">R$ 1.000</p>
                  </div>
                  <div className="flex-1 bg-white rounded-lg px-2 py-1.5">
                    <p className="text-[10px] text-[var(--color-text-muted)]">Semi</p>
                    <p className="text-sm font-bold text-amber-600">R$ 500</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Taxas */}
        <Card color="green" icon={<DollarSign className="w-5 h-5" />} title="6. Taxas de Inscrição">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <PriceCard label="Simples" value="R$ 320" sublabel="Masculino e Feminino" />
            <PriceCard label="Duplas" value="R$ 640" sublabel="A dupla" />
            <PriceCard label="Juvenis" value="R$ 290" sublabel="Mirim / Infantil / Juvenil" />
            <PriceCard label="Equipes" value="R$ 360" sublabel="Por participante" />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-sm text-green-800">Descontos</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-green-700">
              <p><strong>Individual:</strong> R$ 50 para 2 categorias</p>
              <p><strong>Família 2 inscrições:</strong> R$ 50</p>
              <p><strong>Família 3 inscrições:</strong> R$ 100</p>
              <p><strong>Família 4 inscrições:</strong> R$ 150</p>
              <p><strong>Família 5 inscrições:</strong> R$ 200</p>
              <p><strong>Família 6 inscrições:</strong> R$ 250</p>
              <p><strong>Família 7 inscrições:</strong> R$ 300</p>
              <p className="text-xs text-green-600 italic col-span-full mt-1">Família: pai, mãe e filhos em um núcleo familiar.</p>
            </div>
          </div>
        </Card>

        {/* Termo */}
        <Card color="red" icon={<AlertTriangle className="w-5 h-5" />} title="7. Termo de Responsabilidade">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3 text-sm text-red-800">
            <p>Os atletas participantes, ao se inscreverem no Campeonato, <strong>DECLARAM</strong> que estão cientes de todas as cláusulas e condições estipuladas no Regulamento.</p>
            <p>Exoneram o Coopercotia Atlético Clube, seus organizadores, colaboradores e patrocinadores de <strong>TODA E QUALQUER RESPONSABILIDADE</strong> por quaisquer problemas de danos materiais, morais, físicos ou de saúde.</p>
            <p>Autorizam o uso de sua imagem para fins de divulgação do evento por fotos, vídeos e entrevistas em qualquer meio de comunicação.</p>
            <p>Os casos omissos neste regulamento serão resolvidos pela <strong>Comissão Técnica</strong>.</p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
        <Trophy className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
        <p className="font-bold text-[var(--color-text)]">Coopercotia Atlético Clube</p>
        <p className="text-sm text-[var(--color-text-secondary)]">Departamento de Tênis - Comissão Técnica</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Publicado em 27 de abril de 2026</p>
        <Link href="/inscricao" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors">
          Fazer Inscrição
        </Link>
      </div>
    </div>
  );
}

function Card({ color, icon, title, children }: { color: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    blue: 'border-blue-200 bg-white', purple: 'border-purple-200 bg-white',
    emerald: 'border-emerald-200 bg-white', amber: 'border-amber-200 bg-white',
    yellow: 'border-yellow-200 bg-white', green: 'border-green-200 bg-white',
    red: 'border-red-200 bg-white',
  };
  const iconColors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600', purple: 'bg-purple-100 text-purple-600',
    emerald: 'bg-emerald-100 text-emerald-600', amber: 'bg-amber-100 text-amber-600',
    yellow: 'bg-amber-100 text-amber-600', green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };
  return (
    <div className={`rounded-2xl border ${colors[color]} shadow-sm overflow-hidden`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColors[color]}`}>{icon}</div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, sublabel, color }: { icon: React.ReactNode; label: string; value: string; sublabel: string; color: string }) {
  const bg = color === 'red' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200';
  const txt = color === 'red' ? 'text-red-700' : 'text-blue-700';
  return (
    <div className={`${bg} border rounded-xl p-4`}>
      <div className={`flex items-center gap-2 ${txt} mb-1`}>{icon}<span className="text-xs font-semibold uppercase tracking-wider">{label}</span></div>
      <p className={`text-lg font-extrabold ${txt}`}>{value}</p>
      <p className={`text-xs ${color === 'red' ? 'text-red-500' : 'text-blue-500'}`}>{sublabel}</p>
    </div>
  );
}

function Rule({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
      <span className="text-[var(--color-primary)] font-bold text-xs mt-0.5 shrink-0">{n}</span>
      <p>{children}</p>
    </div>
  );
}

function CategoriaCard({ title, color, items }: { title: string; color: string; items: { cat: string; desc: string; badge?: string }[] }) {
  const borderColors: Record<string, string> = { blue: 'border-blue-200', pink: 'border-pink-200', emerald: 'border-emerald-200', amber: 'border-amber-200' };
  const headerColors: Record<string, string> = { blue: 'bg-blue-50 text-blue-700', pink: 'bg-pink-50 text-pink-700', emerald: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700' };
  const badgeColors: Record<string, string> = { blue: 'bg-blue-100 text-blue-600', pink: 'bg-pink-100 text-pink-600', emerald: 'bg-emerald-100 text-emerald-600', amber: 'bg-amber-100 text-amber-600' };
  return (
    <div className={`border ${borderColors[color]} rounded-xl overflow-hidden`}>
      <div className={`px-4 py-2 ${headerColors[color]}`}>
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item, i) => (
          <div key={i} className="px-4 py-2 flex items-center justify-between gap-2">
            <div>
              <span className="text-sm font-medium text-[var(--color-text)]">{item.cat}</span>
              {item.desc && <span className="text-xs text-[var(--color-text-muted)] ml-1.5">- {item.desc}</span>}
            </div>
            {item.badge && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[color]}`}>{item.badge}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormatoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
      <h4 className="font-semibold text-sm text-emerald-800 mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-emerald-700">
            <span className="text-emerald-400 mt-0.5">-</span>{item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EquipeRule({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className={`rounded-xl p-3 border ${alert ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
      <p className={`text-[10px] font-semibold uppercase tracking-wider ${alert ? 'text-red-500' : 'text-amber-500'}`}>{label}</p>
      <p className={`text-sm font-medium mt-0.5 ${alert ? 'text-red-700' : 'text-amber-800'}`}>{value}</p>
    </div>
  );
}

function PriceCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div className="bg-white border border-green-200 rounded-xl p-4 text-center">
      <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-extrabold text-[var(--color-text)] mt-1">{value}</p>
      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{sublabel}</p>
    </div>
  );
}
