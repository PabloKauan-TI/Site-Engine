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
      <section className="container-lab py-16">
        <Link
          to="/projetos"
          className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm font-medium text-muted-foreground ring-1 ring-border/50 transition-all hover:bg-primary/5 hover:text-primary hover:ring-primary/20"
        >
          <ArrowLeft size={16} strokeWidth={2} /> Voltar aos projetos
        </Link>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20">
                  Sobre o projeto
                </span>
              </div>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-md bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary ring-1 ring-secondary/20">
                  <Target size={14} /> Objetivos
                </span>
              </div>
              <ul className="mt-5 space-y-3">
                {project.objectives.map((o: string) => (
                  <li key={o} className="group flex gap-4 rounded-xl border border-transparent bg-muted/30 p-4 transition-colors hover:border-border/50 hover:bg-muted/50">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-base text-muted-foreground transition-colors group-hover:text-foreground">{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20">
                  <Cpu size={14} /> Tecnologias
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {project.technologies.map((t: string) => (
                  <span key={t} className="rounded-lg bg-background px-3.5 py-1.5 text-sm font-medium text-foreground ring-1 ring-border/60 transition-colors hover:bg-muted hover:ring-border">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background p-7 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <div className="relative z-10">
                <p className="font-display text-lg font-bold text-foreground">Ficha Técnica</p>
                <div className="mt-6 space-y-5 text-sm">
                  <div>
                    <dt className="mb-1 font-medium text-muted-foreground">Status</dt>
                    <dd className="flex items-center gap-2 font-semibold text-foreground">
                      {project.status === "Em andamento" && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span></span>}
                      {project.status !== "Em andamento" && <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />}
                      {project.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-medium text-muted-foreground">Área</dt>
                    <dd className="font-semibold text-foreground">{project.area}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-medium text-muted-foreground">Início</dt>
                    <dd className="font-semibold text-foreground">{project.year}</dd>
                  </div>
                  {project.funding && (
                    <div>
                      <dt className="mb-1 flex items-center gap-1.5 font-medium text-muted-foreground"><Banknote size={16} className="text-primary/70" /> Financiamento</dt>
                      <dd className="font-semibold leading-snug text-foreground">{project.funding}</dd>
                    </div>
                  )}

                  {teamMembers.length > 0 && (
                    <div className="pt-4 mt-2 border-t border-border/50">
                      <dt className="mb-3 flex items-center gap-1.5 font-medium text-muted-foreground"><Users size={16} className="text-secondary/80" /> Equipe do Projeto</dt>
                      <dd className="flex -space-x-3">
                        {teamMembers.map((m: typeof members[number]) => (
                          <Link
                            key={m.slug}
                            to="/membros/$slug"
                            params={{ slug: m.slug }}
                            title={`${m.name} — ${m.role}`}
                            className="relative z-0 transition-transform hover:z-10 hover:scale-110 focus:z-10"
                          >
                            {m.photoUrl ? (
                              <img
                                src={m.photoUrl}
                                alt={m.name}
                                className="h-11 w-11 shrink-0 rounded-full object-cover ring-[3px] ring-background"
                              />
                            ) : (
                              <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground ring-[3px] ring-background shadow-sm">
                                {m.initials}
                              </span>
                            )}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
