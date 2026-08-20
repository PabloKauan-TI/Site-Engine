import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, GraduationCap, Sparkles, Paperclip } from "lucide-react";
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
  const memberPublications = publications.filter((p) => p.authors.includes(lastName) || p.authors.includes(member.name));

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
      <section className="border-b border-border/60 bg-secondary/40">
        <div className="container-lab py-14">
          <Link to="/membros" className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent">
            <ArrowLeft size={14} /> Todos os membros
          </Link>
          <div className="mt-8 flex flex-col items-start gap-6 md:flex-row md:items-center">
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="h-28 w-28 shrink-0 rounded-full object-cover ring-4 ring-accent/20 shadow-md"
              />
            ) : (
              <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-primary font-display text-4xl font-semibold text-primary-foreground ring-4 ring-accent/20">
                {member.initials}
              </div>
            )}
            <div>
              <p className="eyebrow">{member.role}</p>
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-primary md:text-5xl">
                {member.name}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">{member.area}</p>
              <a
                href={`mailto:${member.email}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent"
              >
                <Mail size={14} /> {member.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-lab py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <p className="eyebrow">Biografia</p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{member.bio || "Biografia em breve."}</p>
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
                <p className="eyebrow">Publicações selecionadas</p>
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
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="eyebrow flex items-center gap-2"><Sparkles size={14} /> Interesses</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {member.interests.length > 0 ? (
                  member.interests.map((i: string) => (
                    <span key={i} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      {i}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Nenhum interesse cadastrado ainda.</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <p className="eyebrow flex items-center gap-2"><GraduationCap size={14} /> Formação</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {member.education.length > 0 ? (
                  member.education.map((e: string) => (
                    <li key={e} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{e}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">Formação não informada.</li>
                )}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <p className="eyebrow flex items-center gap-2"><Paperclip size={14} /> Currículos</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {member.linkedin ? (
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <a
                      href={member.linkedin.startsWith("http") ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-accent hover:underline"
                    >
                      LinkedIn
                    </a>
                  </li>
                ) : null}
                {member.lattes ? (
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <a
                      href={member.lattes.startsWith("http") ? member.lattes : `http://lattes.cnpq.br/${member.lattes}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-accent hover:underline"
                    >
                      Currículo Lattes
                    </a>
                  </li>
                ) : null}
                {!member.linkedin && !member.lattes && (
                  <li className="text-sm text-muted-foreground">Nenhum currículo cadastrado.</li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
