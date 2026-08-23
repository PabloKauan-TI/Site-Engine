import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, GraduationCap, Sparkles, Paperclip, Linkedin, Github, FileText, Link2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { fetchMemberBySlug, fetchProjects, fetchPublications } from "@/lib/engine-api";

export const Route = createFileRoute("/membros/$slug")({
  loader: async ({ params }) => {
    try {
      const member = await fetchMemberBySlug(params.slug);

      // Membro realmente não existe
      if (!member) {
        return {
          member: null,
          projects: [],
          publications: [],
          notFound: true,
        };
      }

      // Busca projetos e publicações sem derrubar a página
      const [projects, publications] = await Promise.all([
        fetchProjects().catch((err) => {
          console.error("fetchProjects error:", err);
          return [];
        }),
        fetchPublications().catch((err) => {
          console.error("fetchPublications error:", err);
          return [];
        }),
      ]);

      return {
        member,
        projects,
        publications,
        notFound: false,
      };
    } catch (err) {
      console.error("fetchMemberBySlug loader error:", err);

      return {
        member: null,
        projects: [],
        publications: [],
        notFound: true,
      };
    }
  },

  head: ({ loaderData }) => ({
    meta: loaderData?.member
      ? [
          {
            title: `${loaderData.member.name} — EngineLab`,
          },
          {
            name: "description",
            content: loaderData.member.bio || "Membro do EngineLab.",
          },
          {
            property: "og:title",
            content: `${loaderData.member.name} — EngineLab`,
          },
          {
            property: "og:description",
            content: loaderData.member.bio || "Membro do EngineLab.",
          },
        ]
      : [
          {
            title: "Membro não encontrado — EngineLab",
          },
          {
            name: "robots",
            content: "noindex",
          },
        ],
  }),

  notFoundComponent: () => (
    <div className="container-lab py-24 text-center">
      <p className="eyebrow">404</p>

      <h1 className="mt-3 font-display text-3xl font-semibold text-primary">
        Membro não encontrado
      </h1>

      <Link
        to="/membros"
        className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent"
      >
        <ArrowLeft size={16} />
        Voltar aos membros
      </Link>
    </div>
  ),

  component: MembroDetalhe,
});

function MembroDetalhe() {
  const { member, projects, publications } = Route.useLoaderData();
  const memberProjects = projects.filter((p) => p.team.includes(member.slug));
  const lastName = member.name.split(" ").pop() ?? "";
  const memberPublications = publications.filter((p) => p.team?.includes(member.slug) || p.authors.includes(lastName) || p.authors.includes(member.name));

  if ( !member) {
    return (
      <div className="container-lab py-24 text-center">
        <p className="eyebrow">404</p>

        <h1 className="mt-3 font-display text-3xl font-semibold text-primary">
          Membro não encontrado
        </h1>

        <Link
          to="/membros"
          className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent"
        >
          <ArrowLeft size={16} />
          Voltar aos membros
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background pt-8 pb-8 md:pt-12 md:pb-10">
        {/* Subtle Background Glows */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="container-lab relative z-10">
          <Link to="/membros" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft size={16} /> Voltar para Equipe
          </Link>
          
          <div className="flex flex-col items-center gap-5 md:flex-row md:items-end md:gap-8">
            {/* Avatar with glow effect */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-accent opacity-30 blur-md transition duration-500 group-hover:opacity-70" />
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="relative h-40 w-40 shrink-0 rounded-full object-cover border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="relative grid h-40 w-40 shrink-0 place-items-center rounded-full bg-primary border-4 border-background font-display text-5xl font-semibold text-primary-foreground shadow-2xl">
                  {member.initials}
                </div>
              )}
            </div>
            
            {/* Info Details */}
            <div className="flex-1 text-center md:text-left pb-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                {member.role}
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                {member.name}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl md:text-xl">
                {member.area}
              </p>
              
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Mail size={16} /> {member.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-lab py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Biografia</h2>
              <div className="mt-4 h-1 w-12 rounded-full bg-primary/20" />
              <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">{member.bio || "Biografia em breve."}</p>
            </div>

            {memberProjects.length > 0 && (
              <div>
                <p className="eyebrow">Projetos</p>
                <ul className="mt-4 space-y-3">
                  {memberProjects.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to="/projetos/$slug"
                        params={{ slug: p.slug }}
                        className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground">{p.area}</span>
                          <span className="text-muted-foreground">{p.status}</span>
                        </div>
                        <h3 className="mt-2 font-display text-base font-semibold text-primary">{p.title}</h3>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {memberPublications.length > 0 && (
              <div>
                <p className="eyebrow">Publicações</p>
                <ul className="mt-4 space-y-3">
                  {memberPublications.map((pub) => (
                    <li key={pub.slug}>
                      <Link
                        to="/publicacoes/$slug"
                        params={{ slug: pub.slug }}
                        className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
                      >
                        <div className="text-xs text-muted-foreground">
                          {pub.venue} · {pub.year}
                        </div>
                        <h3 className="mt-1 font-display text-base font-semibold text-primary">{pub.title}</h3>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <Sparkles size={18} className="text-accent" /> Áreas de Interesse
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {member.interests.length > 0 ? (
                  member.interests.map((i: string) => (
                    <span key={i} className="rounded-full bg-secondary/80 px-3.5 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary">
                      {i}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Nenhum interesse cadastrado ainda.</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <GraduationCap size={18} className="text-primary" /> Formação
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {member.education.length > 0 ? (
                  member.education.map((e: string) => (
                    <li key={e} className="flex gap-3">
                      <div className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-primary/30">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                      </div>
                      <span className="leading-relaxed">{e}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">Formação não informada.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <Paperclip size={18} className="text-muted-foreground" /> Links e Perfis
              </h3>
              <div className="mt-5 flex flex-col gap-3">
                {member.linkedin ? (
                  <a
                    href={member.linkedin.startsWith("http") ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 text-sm text-foreground transition-all hover:border-[#0077b5]/30 hover:bg-[#0077b5]/10 hover:text-[#0077b5]"
                  >
                    <Linkedin size={18} className="shrink-0" />
                    <span className="font-medium">LinkedIn</span>
                  </a>
                ) : null}

                {member.github ? (
                  <a
                    href={member.github.startsWith("http") ? member.github : `https://github.com/${member.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 text-sm text-foreground transition-all hover:border-foreground/30 hover:bg-foreground/10 hover:text-foreground"
                  >
                    <Github size={18} className="shrink-0" />
                    <span className="font-medium">GitHub</span>
                  </a>
                ) : null}

                {member.lattes ? (
                  <a
                    href={member.lattes.startsWith("http") ? member.lattes : `http://lattes.cnpq.br/${member.lattes}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 text-sm text-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                  >
                    <FileText size={18} className="shrink-0" />
                    <span className="font-medium">Currículo Lattes</span>
                  </a>
                ) : null}

                {member.orcid ? (
                  <a
                    href={member.orcid.startsWith("http") ? member.orcid : `https://orcid.org/${member.orcid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 text-sm text-foreground transition-all hover:border-[#A6CE39]/50 hover:bg-[#A6CE39]/10 hover:text-[#A6CE39]"
                  >
                    <Link2 size={18} className="shrink-0" />
                    <span className="font-medium">ORCID</span>
                  </a>
                ) : null}

                {!member.linkedin && !member.lattes && !member.github && !member.orcid && (
                  <p className="text-sm text-muted-foreground">Nenhum link cadastrado.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
