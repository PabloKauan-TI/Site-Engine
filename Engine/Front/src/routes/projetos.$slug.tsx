import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Users, Cpu, Target, Banknote } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { fetchProjectBySlug, fetchMembers } from "@/lib/engine-api";

export const Route = createFileRoute("/projetos/$slug")({
  loader: async ({ params }) => {
    const [project, members] = await Promise.all([
      fetchProjectBySlug(params.slug),
      fetchMembers(),
    ]);

    if (!project) throw notFound();
    return { project, members };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} — EngineLab` },
          { name: "description", content: loaderData.project.summary },
          { property: "og:title", content: `${loaderData.project.title} — EngineLab` },
          { property: "og:description", content: loaderData.project.summary },
        ]
      : [{ title: "Projeto não encontrado — EngineLab" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="container-lab py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-primary">
        Projeto não encontrado
      </h1>
      <Link to="/projetos" className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent">
        <ArrowLeft size={16} /> Voltar aos projetos
      </Link>
    </div>
  ),
  component: ProjetoDetalhe,
});

function ProjetoDetalhe() {
  const { project, members } = Route.useLoaderData();
  const teamMembers = project.team
    .map((slug: string) => members.find((m) => m.slug === slug))
    .filter(Boolean) as Array<typeof members[number]>;

  return (
    <div>
      <PageHeader
        eyebrow={`${project.area} · ${project.year}`}
        title={project.title}
        description={project.summary}
      />
      <section className="container-lab py-12">
        <Link
          to="/projetos"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent"
        >
          <ArrowLeft size={14} /> Todos os projetos
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <p className="eyebrow">Sobre o projeto</p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </div>

            <div>
              <p className="eyebrow flex items-center gap-2"><Target size={14} /> Objetivos</p>
              <ul className="mt-3 space-y-2">
                {project.objectives.map((o: string) => (
                  <li key={o} className="flex gap-3 rounded-lg border border-border bg-card p-4 text-sm text-foreground">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow flex items-center gap-2"><Cpu size={14} /> Tecnologias</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((t: string) => (
                  <span key={t} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="eyebrow">Ficha</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className={`mt-0.5 font-medium ${project.status === "Em andamento" ? "text-accent" : "text-primary"}`}>
                    ● {project.status}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Área</dt>
                  <dd className="mt-0.5 font-medium text-primary">{project.area}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Início</dt>
                  <dd className="mt-0.5 font-medium text-primary">{project.year}</dd>
                </div>
                {project.funding && (
                  <div>
                    <dt className="flex items-center gap-1 text-muted-foreground"><Banknote size={14} /> Financiamento</dt>
                    <dd className="mt-0.5 font-medium text-primary">{project.funding}</dd>
                  </div>
                )}
              </dl>
            </div>

            {teamMembers.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="eyebrow flex items-center gap-2"><Users size={14} /> Equipe</p>
                <ul className="mt-4 space-y-3">
                  {teamMembers.map((m: typeof members[number]) => (
                    <li key={m.slug}>
                      <Link
                        to="/membros/$slug"
                        params={{ slug: m.slug }}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary"
                      >
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-primary/20"
                          />
                        ) : (
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                            {m.initials}
                          </span>
                        )}
                        <span>
                          <span className="block text-sm font-medium text-primary">{m.name}</span>
                          <span className="block text-xs text-muted-foreground">{m.area}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
