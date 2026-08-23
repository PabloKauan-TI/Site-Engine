import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { createUser, deleteUser, fetchUsers, type UserResponse } from '@/lib/user-api';
import { Check, AlertCircle, Trash2, Edit2, UserPlus } from 'lucide-react';

export const Route = createFileRoute('/admin/usuarios')({
  head: () => ({
    meta: [
      { title: 'Usuários — Admin | EngineLab' },
      { name: 'description', content: 'Gerencie os usuários do painel do EngineLab.' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: Usuarios,
});

function Usuarios() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      setUsers(await fetchUsers());
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao carregar usuários',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const created = await createUser({ name, email, password });
      setUsers((current) => [created, ...current]);
      setName('');
      setEmail('');
      setPassword('');
      setStatusMessage({ type: 'success', text: 'Novo usuário administrador criado!' });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao criar usuário',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, userName: string) {
    if (!confirm(`Deseja remover o usuário "${userName}"?`)) {
      return;
    }

    try {
      await deleteUser(String(id));
      setUsers((current) => current.filter((user) => user.id !== id));
      setStatusMessage({ type: 'success', text: `Usuário "${userName}" removido!` });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao excluir usuário',
      });
    }
  }

  return (
    <AdminLayout
      title="Gerenciamento de Usuários"
      description="Crie e gerencie contas de administradores com acesso ao painel de controle."
    >
      <div className="space-y-6">
        {statusMessage && (
          <div
            className={`flex items-center justify-between rounded-2xl border p-4 text-sm ${
              statusMessage.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-destructive/20 bg-destructive/10 text-destructive'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-xs font-semibold hover:opacity-70">
              Fechar
            </button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div>
                <p className="eyebrow">Acesso</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">Usuários Cadastrados</h2>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <th className="px-4 py-3">Nome</th>
                      <th className="px-4 py-3">E-mail</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-sm text-muted-foreground">
                          Carregando usuários...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-sm text-muted-foreground">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-t border-border transition-colors hover:bg-secondary/20">
                          <td className="px-4 py-4 font-medium text-foreground">{user.name}</td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">{user.email}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to="/admin/usuarios/$id"
                                params={{ id: String(user.id) }}
                                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                              >
                                <Edit2 size={12} /> Editar
                              </Link>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(user.id, user.name)}
                                className="h-8 gap-1.5 px-3 text-xs"
                              >
                                <Trash2 size={12} /> Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <UserPlus className="text-primary" size={18} />
                <h2 className="font-display text-lg font-semibold text-foreground">Novo Administrador</h2>
              </div>
              <form onSubmit={handleCreate} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Nome Completo *
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nome completo"
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label htmlFor="email-create" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    E-mail *
                  </label>
                  <Input
                    id="email-create"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="email@exemplo.com"
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label htmlFor="password-create" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Senha (mínimo 8 caracteres) *
                  </label>
                  <Input
                    id="password-create"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    required
                    minLength={8}
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Criar Administrador'}
                </Button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}
