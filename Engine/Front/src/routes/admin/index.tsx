import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  FolderKanban,
  Newspaper,
  BookOpen,
  UserCheck,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { fetchDashboardStats, type DashboardStats } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Painel Administrativo — EngineLab" },
      { name: "description", content: "Visão geral e administração do EngineLab." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    membersCount: 0,
    projectsCount: 0,
    newsCount: 0,
    publicationsCount: 0,
    usersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (e) {
      console.error("Erro ao carregar estatísticas:", e);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      title: "Membros",
      count: stats.membersCount,
      icon: Users,
      link: "/admin/membros",
      actionText: "Gerenciar membros",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Projetos",
      count: stats.projectsCount,
      icon: FolderKanban,
      link: "/admin/projetos",
      actionText: "Gerenciar projetos",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Notícias",
      count: stats.newsCount,
      icon: Newspaper,
      link: "/admin/noticias",
      actionText: "Gerenciar notícias",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Publicações",
      count: stats.publicationsCount,
      icon: BookOpen,
      link: "/admin/publicacoes",
      actionText: "Gerenciar publicações",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Usuários Admin",
      count: stats.usersCount,
      icon: UserCheck,
      link: "/admin/usuarios",
      actionText: "Gerenciar contas",
      color: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
  ];

  return (
    <AdminLayout
      title="Visão Geral do Laboratório"
      description="Gerencie todo o conteúdo exibido no portal público do EngineLab."
    >
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {card.title}
                    </span>
                    <div className={`grid h-9 w-9 place-items-center rounded-lg ${card.color}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <div className="mt-4 font-display text-3xl font-bold text-foreground">
                    {loading ? "..." : card.count}
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-3">
                  <Link
                    to={card.link}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions & Short Instructions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2">
              <PlusCircle className="text-primary" size={20} />
              <h2 className="font-display text-xl font-semibold text-foreground">Ações Rápidas</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Cadastre novos itens diretamente nas seções do laboratório:
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                to="/admin/membros"
                className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all hover:border-primary hover:bg-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500/10 text-blue-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Cadastrar Membro</h3>
                    <p className="text-xs text-muted-foreground">Com envio de foto e dados</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </Link>

              <Link
                to="/admin/projetos"
                className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all hover:border-primary hover:bg-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <FolderKanban size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Novo Projeto</h3>
                    <p className="text-xs text-muted-foreground">P&D, objetivos e tecnologias</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </Link>

              <Link
                to="/admin/noticias"
                className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all hover:border-primary hover:bg-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
                    <Newspaper size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Publicar Notícia</h3>
                    <p className="text-xs text-muted-foreground">Prêmios, eventos e artigos</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </Link>

              <Link
                to="/admin/publicacoes"
                className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all hover:border-primary hover:bg-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-purple-500/10 text-purple-600">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Nova Publicação</h3>
                    <p className="text-xs text-muted-foreground">Artigo científico com DOI</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-accent" size={20} />
              <h2 className="font-display text-xl font-semibold text-foreground">Portal Público</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Todas as alterações realizadas no painel administrativo são refletidas imediatamente nas páginas públicas do EngineLab.
            </p>
            <div className="mt-6 rounded-2xl border border-border/80 bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground">
              <strong className="block font-semibold text-foreground">Dica para Fotos de Membros:</strong>
              Envie fotos nos formatos JPG ou PNG com até 5MB. As imagens são processadas e salvas diretamente no servidor de mídia do laboratório.
            </div>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Acessar Início do Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
