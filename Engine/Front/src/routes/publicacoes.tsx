import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { fetchPublications } from "@/lib/engine-api";

export const Route = createFileRoute("/publicacoes")({
  loader: async () => {
    try {
      return { publications: await fetchPublications() };
    } catch (err) {
      console.error("fetchPublications loader error:", err);
      return { publications: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Publicações — EngineLab" },
      { name: "description", content: "Artigos científicos e trabalhos publicados pelos pesquisadores do EngineLab." },
      { property: "og:title", content: "Publicações — EngineLab" },
      { property: "og:description", content: "Trabalhos de pesquisa publicados." },
    ],
  }),
  component: Publicacoes,
});

function Publicacoes() {
  const { publications } = Route.useLoaderData();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isListRoute = pathname === "/publicacoes" || pathname === "/publicacoes/";

  if (!isListRoute) {
    return <Outlet />;
  }

  const grouped = publications.reduce<Record<number, typeof publications>>((acc, p) => {
    (acc[p.year] ||= []).push(p);
    return acc;
  }, {});
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <div>
      <PageHeader
        eyebrow="Publicações"
        title="Produção Acadêmica"
        description="Compartilhando conhecimento através de artigos, dissertações e pesquisas do laboratório."
      />
      <section className="container-lab py-16">
        {years.map((year) => (
          <div key={year} className="mb-14 last:mb-0">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-display text-3xl font-bold text-foreground">{year}</h2>
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">
                {grouped[year].length} {grouped[year].length === 1 ? "publicação" : "publicações"}
              </span>
            </div>
            <ul className="space-y-4">
              {grouped[year].map((pub) => (
                <li key={pub.slug}>
                  <Link
                    to="/publicacoes/$slug"
                    params={{ slug: pub.slug }}
                    className="group flex gap-5 rounded-2xl border border-border/60 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-muted/50 text-muted-foreground ring-1 ring-border/50 transition-colors group-hover:bg-primary/10 group-hover:text-primary group-hover:ring-primary/20">
                      <FileText size={20} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium">
                        <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          {pub.type}
                        </span>
                        <span className="text-muted-foreground">{pub.venue}</span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                        {pub.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{pub.authors}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
