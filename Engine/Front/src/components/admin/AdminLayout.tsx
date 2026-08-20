import React, { useEffect } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Newspaper,
  BookOpen,
  UserCheck,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const ADMIN_NAV = [
  { to: "/admin", label: "Visão Geral", icon: LayoutDashboard, exact: true },
  { to: "/admin/membros", label: "Membros", icon: Users, exact: false },
  { to: "/admin/projetos", label: "Projetos", icon: FolderKanban, exact: false },
  { to: "/admin/noticias", label: "Notícias", icon: Newspaper, exact: false },
  { to: "/admin/publicacoes", label: "Publicações", icon: BookOpen, exact: false },
  { to: "/admin/usuarios", label: "Usuários", icon: UserCheck, exact: false },
];

export function AdminLayout({ children, title, description, action }: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container-lab flex min-h-[60vh] items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container-lab py-20 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-destructive/20 bg-destructive/5 p-8">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">Acesso Restrito</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Você precisa estar autenticado para acessar a área administrativa.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate({ to: "/login" })} className="w-full">
              Ir para o Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-background">
      {/* Top Admin Sub-bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="container-lab flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-7 items-center rounded-full bg-primary/10 px-3 text-xs font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/20">
              Painel Admin
            </span>
            <span className="text-sm text-muted-foreground">
              Conectado como <strong className="font-medium text-foreground">{user?.name || user?.email}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ExternalLink size={13} /> Ver Site
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout();
                navigate({ to: "/login" });
              }}
              className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut size={13} /> Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-border bg-card">
        <div className="container-lab">
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none" aria-label="Navegação do Painel">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.to || pathname === `${item.to}/`
                : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Header (if title is provided) */}
      {title && (
        <div className="border-b border-border/50 bg-secondary/20">
          <div className="container-lab flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Gerenciamento</p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-primary">{title}</h1>
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      )}

      {/* Content Area */}
      <main className="container-lab py-8">{children}</main>
    </div>
  );
}
