'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Eye, EyeOff, AlertTriangle, Shield, KeyRound } from 'lucide-react';
import { setSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/csrf').then(r => r.json()).then(d => setCsrfToken(d.token)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, csrfToken, totpCode: show2FA ? totpCode : undefined }),
      });

      const data = await res.json();

      if (data.requires2FA) {
        setShow2FA(true);
        setLoading(false);
        return;
      }

      if (data.success) {
        setSession();
        router.push('/dashboard');
      } else {
        setErro(data.error || 'Credenciais inválidas');
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/logo-intercolonial.png"
            alt="78º Intercolonial de Tênis 2026"
            width={400}
            height={320}
            className="mx-auto mb-4 w-[280px] sm:w-[180px] h-auto"
            priority
          />
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Acesso Administrativo</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Área restrita - Dashboard do 78º Intercolonial
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}

            {!show2FA ? (
              <>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[var(--color-text)]">Usuário</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Usuário"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]/20 focus:border-[var(--color-border-focus)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[var(--color-text)]">Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]/20 focus:border-[var(--color-border-focus)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <p className="text-sm text-blue-700">Autenticação em duas etapas</p>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[var(--color-text)]">Código 2FA</label>
                  <input
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                    maxLength={6}
                    autoFocus
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]/20 focus:border-[var(--color-border-focus)]"
                  />
                  <p className="text-xs text-[var(--color-text-muted)] text-center">
                    Digite o código do seu aplicativo autenticador
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Autenticando...' : show2FA ? 'Verificar Código' : 'Entrar'}
            </button>

            {show2FA && (
              <button
                type="button"
                onClick={() => { setShow2FA(false); setTotpCode(''); setErro(''); }}
                className="w-full text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                Voltar ao login
              </button>
            )}
          </form>
        </div>

        <div className="text-center mt-4 space-y-1">
          <p className="text-xs text-[var(--color-text-muted)]">
            Acesso restrito à Comissão Técnica do Coopercotia Atlético Clube
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Protegido por Rate Limiting, CSRF e 2FA
          </p>
        </div>
      </div>
    </div>
  );
}
