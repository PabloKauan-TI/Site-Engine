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
        title="Trabalhos de pesquisa"
        description="Nossa produção científica em periódicos e conferências de alto impacto."
      />
      <section className="container-lab py-16">
        {years.map((year) => (
          <div key={year} className="mb-14 last:mb-0">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-display text-4xl font-semibold text-primary">{year}</h2>
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
                    className="flex gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground">
                          {pub.type}
                        </span>
                        <span className="text-muted-foreground">{pub.venue}</span>
                      </div>
                      <h3 className="mt-2 font-display text-base font-semibold text-primary">
                        {pub.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{pub.authors}</p>
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
