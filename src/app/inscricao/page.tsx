'use client';

import Link from 'next/link';
import { UserPlus, Users, Trophy, ArrowRight, Pencil } from 'lucide-react';

export default function InscriçãoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Inscrição</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">Selecione a modalidade para realizar sua inscrição</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModalCard
          href="/inscricao/simples"
          icon={<UserPlus className="w-10 h-10" />}
          title="Simples"
          desc="Inscrição individual. Categorias Especial, A, B, C e juvenis."
          color="blue"
        />
        <ModalCard
          href="/inscricao/duplas"
          icon={<Users className="w-10 h-10" />}
          title="Duplas"
          desc="Inscrição de dupla. Categorias A, B e C com repescagem."
          color="emerald"
        />
        <ModalCard
          href="/inscricao/equipes"
          icon={<Trophy className="w-10 h-10" />}
          title="Equipes"
          desc="Inscrição por equipe. Dupla masculina, feminina, mista super e mista livre."
          color="purple"
        />
      </div>

      {/* Editar equipe */}
      <div className="mt-6">
        <Link
          href="/inscricao/editar"
          className="block bg-white rounded-xl p-5 shadow-sm border border-amber-200 hover:shadow-md hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Pencil className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[var(--color-text)]">Editar Jogadores da Equipe</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Altere os membros da sua equipe até a data do torneio</p>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <p className="text-sm text-amber-800 font-medium">
          Atenção: Máximo de 2 (duas) categorias por atleta. A taxa de inscrição será paga no ato da presença.
        </p>
      </div>
    </div>
  );
}

function ModalCard({ href, icon, title, desc, color }: {
  href: string; icon: React.ReactNode; title: string; desc: string; color: string;
}) {
  const colors: Record<string, { gradient: string; hover: string }> = {
    blue: { gradient: 'from-blue-500 to-blue-700', hover: 'hover:border-blue-300' },
    emerald: { gradient: 'from-emerald-500 to-emerald-700', hover: 'hover:border-emerald-300' },
    purple: { gradient: 'from-purple-500 to-purple-700', hover: 'hover:border-purple-300' },
  };
  const c = colors[color];

  return (
    <Link
      href={href}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] ${c.hover} hover:shadow-lg transition-all group block`}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">{desc}</p>
      <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] group-hover:gap-2 transition-all">
        Inscrever‑se <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
