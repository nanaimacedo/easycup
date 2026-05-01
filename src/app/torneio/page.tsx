'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Users, UserPlus, Calendar, MapPin, Phone, Mail, Award, Clock, Shield } from 'lucide-react';
import LgpdModal from '@/components/LgpdModal';
import { TORNEIO, PREMIACAO_ESPECIAL } from '@/lib/constants';

export default function Home() {
  const [showLgpd, setShowLgpd] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

  const handleInscricaoClick = () => {
    if (!lgpdAccepted) {
      setShowLgpd(true);
    }
  };

  return (
    <>
      {showLgpd && (
        <LgpdModal
          onAccept={() => {
            setLgpdAccepted(true);
            setShowLgpd(false);
          }}
          onDecline={() => setShowLgpd(false)}
        />
      )}

      {/* Hero com Banner */}
      <section className="relative text-white overflow-hidden bg-[#1a3a5c]">
        <div className="w-full">
          <Image
            src="/banner-intercolonial.jpeg"
            alt="78º Intercolonial de Tênis 2026"
            width={1919}
            height={489}
            className="w-full h-auto"
            priority
          />
        </div>
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center">
              <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-6">
                {TORNEIO.clube} - O maior torneio de tênis da comunidade nikkei
              </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {lgpdAccepted ? (
                <Link
                  href="/inscricao"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--color-primary-dark)] font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  Fazer Inscrição
                </Link>
              ) : (
                <button
                  onClick={handleInscricaoClick}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--color-primary-dark)] font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  Fazer Inscrição
                </button>
              )}
              <Link
                href="/regulamento"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/30 hover:bg-white/30 transition-all text-lg"
              >
                <Users className="w-5 h-5" />
                Ver Regulamento
              </Link>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard icon={<Calendar className="w-5 h-5" />} title="Datas do Torneio" color="blue">
            <p className="text-xs">{TORNEIO.dataInicio1}</p>
            <p className="text-xs">{TORNEIO.dataInicio2}</p>
          </InfoCard>
          <InfoCard icon={<Clock className="w-5 h-5" />} title="Prazo de Inscrição" color="red">
            <p className="text-sm font-bold text-red-600">12 de Junho de 2026</p>
          </InfoCard>
          <InfoCard icon={<MapPin className="w-5 h-5" />} title="Local" color="green">
            <p className="text-xs">{TORNEIO.endereco}</p>
            <p className="text-xs">{TORNEIO.cidade}</p>
          </InfoCard>
          <InfoCard icon={<Award className="w-5 h-5" />} title="Premiação Especial" color="amber">
            <p className="text-xs">Campeão: R$ {PREMIACAO_ESPECIAL.campeao}</p>
            <p className="text-xs">Vice: R$ {PREMIACAO_ESPECIAL.vice}</p>
          </InfoCard>
        </div>
      </section>

      {/* Modalidades */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-8">Modalidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModalidadeCard
            title="Simples"
            desc="Individual masculino e feminino. Categorias Especial, A, B, C, Mirim, Infantil e Juvenil."
            preco="A partir de R$ 290"
            href={lgpdAccepted ? '/inscricao/simples' : '#'}
            onClick={!lgpdAccepted ? handleInscricaoClick : undefined}
            icon={<UserPlus className="w-8 h-8" />}
            color="blue"
          />
          <ModalidadeCard
            title="Duplas"
            desc="Duplas masculinas e femininas. Categorias A, B e C com repescagem."
            preco="R$ 640 (a dupla)"
            href={lgpdAccepted ? '/inscricao/duplas' : '#'}
            onClick={!lgpdAccepted ? handleInscricaoClick : undefined}
            icon={<Users className="w-8 h-8" />}
            color="emerald"
          />
          <ModalidadeCard
            title="Equipes"
            desc="Equipes masculinas, femininas, mista super e mista livre. 4 a 8 jogadores."
            preco="R$ 360 por participante"
            href={lgpdAccepted ? '/inscricao/equipes' : '#'}
            onClick={!lgpdAccepted ? handleInscricaoClick : undefined}
            icon={<Trophy className="w-8 h-8" />}
            color="purple"
          />
        </div>
      </section>

      {/* Contato e LGPD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
            <h3 className="font-bold text-lg text-[var(--color-text)] mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                (11) 3782-0727
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <Phone className="w-4 h-4 text-green-500" />
                WhatsApp: (11) 99967-7021
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                coopertenis@uol.com.br
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                teniscooper@gmail.com
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-[var(--color-primary)]" />
              <h3 className="font-bold text-lg text-[var(--color-text)]">LGPD</h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Este sistema está em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
              Seus dados pessoais são tratados com segurança e utilizados exclusivamente para a organização
              do campeonato.
            </p>
            <button
              onClick={() => setShowLgpd(true)}
              className="mt-3 text-sm text-[var(--color-primary)] font-medium hover:underline"
            >
              Ver Política de Privacidade completa
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({ icon, title, children, color }: { icon: React.ReactNode; title: string; children: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-[var(--color-text)] mb-1">{title}</h3>
      <div className="text-[var(--color-text-secondary)]">{children}</div>
    </div>
  );
}

function ModalidadeCard({
  title, desc, preco, href, onClick, icon, color,
}: {
  title: string; desc: string; preco: string; href: string;
  onClick?: () => void; icon: React.ReactNode; color: string;
}) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'from-blue-500 to-blue-700', text: 'text-blue-600', border: 'border-blue-100' },
    emerald: { bg: 'from-emerald-500 to-emerald-700', text: 'text-emerald-600', border: 'border-emerald-100' },
    purple: { bg: 'from-purple-500 to-purple-700', text: 'text-purple-600', border: 'border-purple-100' },
  };
  const c = colors[color];

  const content = (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border ${c.border} hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group`}>
      <div className={`w-16 h-16 bg-gradient-to-br ${c.bg} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">{desc}</p>
      <p className={`text-sm font-bold ${c.text}`}>{preco}</p>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="text-left">{content}</button>;
  }

  return <Link href={href}>{content}</Link>;
}
