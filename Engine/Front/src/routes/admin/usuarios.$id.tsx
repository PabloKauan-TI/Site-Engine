import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { fetchUser, updateUser, deleteUser } from '@/lib/user-api';

export const Route = createFileRoute('/admin/usuarios/$id')({
  loader: async ({ params }) => {
    const user = await fetchUser(params.id);
    if (!user) {
      throw notFound();
    }

    return { user };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Editar ${loaderData?.user.name} — Admin | EngineLab` },
      { name: 'description', content: `Editar os dados do usuário ${loaderData?.user.name}.` },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: EditUsuario,
});

function EditUsuario() {
  const navigate = useNavigate();
  const { user } = Route.useLoaderData();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      await updateUser(String(user.id), { name, email, password: password || undefined });
      navigate({ to: '/admin/usuarios' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Deseja remover o usuário "${user.name}"?`)) {
      return;
    }

    try {
      await deleteUser(String(user.id));
      navigate({ to: '/admin/usuarios' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
    }
  }

  return (
    <AdminLayout
      title={`Editar Usuário: ${user.name}`}
      description="Atualize as credenciais ou remova o acesso do administrador."
    >
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
              Nome Completo *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
              E-mail *
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
              Nova Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Deixe em branco para manter a atual"
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Preencha apenas se desejar redefinir a senha de acesso deste usuário.
            </p>
          </div>

          {error && <p className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/usuarios' })}>
                Voltar
              </Button>
            </div>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Excluir Usuário
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
