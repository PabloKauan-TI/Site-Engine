import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginUser } from '@/lib/user-api';
import { useAuth } from '@/lib/auth-context';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Login — EngineLab' },
      { name: 'description', content: 'Acesse o painel de controle do EngineLab.' },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      if (response.user) {
        login(response.user);
      }
      navigate({ to: '/admin' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl sm:max-w-lg">
        {/* Header Gradient Area */}
        <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-8 py-10 sm:px-12">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="relative z-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Lock size={24} strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Acesso Restrito
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre com suas credenciais para gerenciar a plataforma.
            </p>
          </div>
        </div>

        {/* Form Area */}
        <div className="px-8 pb-10 pt-6 sm:px-12 sm:pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  E-mail institucional
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail size={16} className="text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@enginelab.org"
                    required
                    className="pl-11 h-12 rounded-xl border-border/80 bg-background/50 text-base transition-colors hover:border-primary/30 focus:border-primary focus:bg-background"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Senha
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock size={16} className="text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-11 h-12 rounded-xl border-border/80 bg-background/50 text-base transition-colors hover:border-primary/30 focus:border-primary focus:bg-background"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full h-12 overflow-hidden rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    Entrar no painel
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

