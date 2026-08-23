import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { fetchProjects } from "@/lib/engine-api";

export const Route = createFileRoute("/projetos")({
  loader: async () => {
    try {
      return { projects: await fetchProjects() };
    } catch (err) {
      console.error("fetchProjects loader error:", err);
      return { projects: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Projetos — EngineLab" },
      { name: "description", content: "Projetos de pesquisa e desenvolvimento em andamento e concluídos no EngineLab." },
      { property: "og:title", content: "Projetos — EngineLab" },
      { property: "og:description", content: "Nossos projetos em IoT, IA e software." },
    ],
  }),
  component: Projetos,
});

function Projetos() {
  const { projects } = Route.useLoaderData();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isListRoute = pathname === "/projetos" || pathname === "/projetos/";
  const areas = ["Todos", ...Array.from(new Set(projects.map((p) => p.area)))];
  const [filter, setFilter] = useState("Todos");
  const list = filter === "Todos" ? projects : projects.filter((p) => p.area === filter);

  if (!isListRoute) {
    return <Outlet />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Projetos"
        title="Projetos de pesquisa e desenvolvimento"
        description="Iniciativas acadêmicas e cooperações com a indústria — em diferentes estágios de execução."
      />
      <section className="container-lab py-12">
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                filter === a
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link
              key={p.slug}
              to="/projetos/$slug"
              params={{ slug: p.slug }}
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-primary px-2.5 py-1 text-primary-foreground">
                  {p.area}
                </span>
                <span className="text-muted-foreground">{p.year}</span>
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold text-primary">
                {p.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.summary}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span
                  className={`text-xs font-medium ${
                    p.status === "Em andamento" ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  ● {p.status}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-0.5">
                  Detalhes <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
