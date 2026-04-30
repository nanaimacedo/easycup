'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ClipboardList, Lock, Info, BookOpen } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo-intercolonial.jpeg"
              alt="78º Intercolonial"
              width={44}
              height={36}
              className="group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <p className="font-bold text-[var(--color-text)] text-sm leading-tight">78º Intercolonial</p>
              <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight">Coopercotia Atlético Clube</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/torneio" icon={<Info className="w-4 h-4" />}>Torneio</NavLink>
            <NavLink href="/regulamento" icon={<BookOpen className="w-4 h-4" />}>Regulamento</NavLink>
            <NavLink href="/inscricao" icon={<ClipboardList className="w-4 h-4" />}>Inscrição</NavLink>
            <NavLink href="/" icon={<Lock className="w-4 h-4" />}>Admin</NavLink>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white animate-slide-up">
          <nav className="px-4 py-3 space-y-1">
            <MobileNavLink href="/torneio" onClick={() => setMenuOpen(false)}>Torneio</MobileNavLink>
            <MobileNavLink href="/regulamento" onClick={() => setMenuOpen(false)}>Regulamento</MobileNavLink>
            <MobileNavLink href="/inscricao" onClick={() => setMenuOpen(false)}>Inscrição</MobileNavLink>
            <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>Admin</MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50 transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
    >
      {children}
    </Link>
  );
}
