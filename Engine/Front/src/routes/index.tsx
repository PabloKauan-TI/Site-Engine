import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { researchLines, stats } from "@/lib/lab-data";
import { fetchNews, fetchProjects } from "@/lib/engine-api";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const news = await fetchNews();
      const projects = await fetchProjects();
      return { news, projects };
    } catch (err) {
      console.error("home loader error:", err);
      return { news: [], projects: [] };
    }
  },
  component: Home,
});

function Home() {
  const { news, projects } = Route.useLoaderData();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.28 0.06 160 / 0.75), oklch(0.18 0.05 160 / 0.95))",
          }}
        />
        <div className="container-lab relative py-24 md:py-32">
          <p className="eyebrow">Laboratório de Pesquisa</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Onde <span className="text-accent">IoT</span>, <span className="text-accent">IA</span> e <span className="text-accent">Software</span> se encontram.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80">
            O EngineLab é um laboratório de pesquisa dedicado ao desenvolvimento
            de sistemas conectados, inteligentes e confiáveis — da borda ao
            software que os orquestra.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pesquisa"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Explorar pesquisa <ArrowRight size={16} />
            </Link>
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Sobre o laboratório
            </Link>
          </div>
        </div>
        {/* Stats bar */}
        <div className="relative border-t border-primary-foreground/10">
          <div className="container-lab grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-semibold text-accent md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research lines grid */}
      <section className="container-lab py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Linhas de pesquisa</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-primary md:text-4xl">
              Áreas onde geramos conhecimento e tecnologia.
            </h2>
          </div>
          <Link
            to="/pesquisa"
            className="hidden shrink-0 text-sm font-medium text-primary hover:text-accent md:inline-flex md:items-center md:gap-1"
          >
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {researchLines.map((line) => (
            <div
              key={line.slug}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                <line.icon size={20} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-primary">
                {line.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{line.short}</p>
              <div className="mt-5 h-px bg-border" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {line.topics.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects + news split */}
      <section className="bg-secondary/40 py-20">
        <div className="container-lab grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="eyebrow">Projetos em destaque</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-primary">
              O que estamos construindo agora
            </h2>
            <div className="mt-8 space-y-3">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.title}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground">
                        {p.area}
                      </span>
                      <span>{p.year}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold text-primary">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                      p.status === "Em andamento"
                        ? "bg-accent/20 text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/projetos"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent"
            >
              Ver todos os projetos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow">Últimas notícias</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-primary">
              Novidades
            </h2>
            <div className="mt-8 space-y-5">
              {news.slice(0, 3).map((n) => (
                <article key={n.title} className="border-b border-border pb-5 last:border-none">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-accent">{n.tag}</span>
                    <span>·</span>
                    <span>{n.date}</span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-semibold text-primary">
                    {n.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{n.excerpt}</p>
                </article>
              ))}
            </div>
            <Link
              to="/noticias"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent"
            >
              Todas as notícias <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-lab py-20">
        <div className="rounded-2xl border border-border bg-primary p-10 text-primary-foreground md:p-16">
          <div className="max-w-2xl">
            <p className="eyebrow">Colabore conosco</p>
            <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              Interessado em pesquisa aplicada em IoT, IA e software?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Estamos abertos a novas parcerias acadêmicas e industriais, além de
              oportunidades para mestrado, doutorado e iniciação científica.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90"
              >
                Fale conosco <ArrowRight size={16} />
              </Link>
              <Link
                to="/membros"
                className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-5 py-3 text-sm font-medium hover:bg-primary-foreground/10"
              >
                Conhecer a equipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
