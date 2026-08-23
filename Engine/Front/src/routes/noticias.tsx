import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { fetchNews } from "@/lib/engine-api";

export const Route = createFileRoute("/noticias")({
  loader: async () => {
    try {
      return { news: await fetchNews() };
    } catch (err) {
      console.error("fetchNews loader error:", err);
      return { news: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Notícias — EngineLab" },
      { name: "description", content: "Novidades, prêmios, eventos e parcerias do laboratório EngineLab." },
      { property: "og:title", content: "Notícias — EngineLab" },
      { property: "og:description", content: "Últimas novidades do EngineLab." },
    ],
  }),
  component: Noticias,
});

function Noticias() {
  const { news } = Route.useLoaderData();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isListRoute = pathname === "/noticias" || pathname === "/noticias/";

  // Sort by date (newest to oldest)
  const sortedNews = [...news].sort((a, b) => {
    if (!a.isoDate) return 1;
    if (!b.isoDate) return -1;
    return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
  });

  // Hardcoded categories as requested by user
  const categories = ["Todas", "Notícia", "Prêmio", "Evento", "Parceria", "Publicação", "Atualização"];
  const [filter, setFilter] = useState("Todas");

  const filteredNews = filter === "Todas" 
    ? sortedNews 
    : sortedNews.filter((n) => (n.tag || n.category || "Notícia") === filter);

  if (!isListRoute) {
    return <Outlet />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Notícias"
        title="Novidades do laboratório"
        description="Prêmios, publicações, parcerias e eventos que marcam a trajetória do EngineLab."
      />
      <section className="container-lab py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNews.length === 0 ? (
            <p className="col-span-full py-12 text-center text-muted-foreground">
              Nenhuma notícia encontrada nesta categoria.
            </p>
          ) : (
            filteredNews.map((n) => (
            <Link
              key={n.slug}
              to="/noticias/$slug"
              params={{ slug: n.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:border-primary/20"
            >
              {/* Image Section */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/50">
                {n.imageUrl ? (
                  <img
                    src={n.imageUrl}
                    alt={n.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
                    {n.tag}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col p-6">
                <time className="text-xs font-medium text-muted-foreground">
                  {n.date}
                </time>
                <h2 className="mt-3 font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                  {n.title}
                </h2>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {n.excerpt}
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                  Ler matéria completa <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          )))}
        </div>
      </section>
    </div>
  );
}
