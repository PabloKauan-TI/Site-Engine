import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { researchLines } from "@/lib/lab-data";
import { fetchNews, fetchProjects, fetchPublications, fetchMembers } from "@/lib/engine-api";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const news = await fetchNews();
      const projects = await fetchProjects();
      const publications = await fetchPublications();
      const members = await fetchMembers();
      return { news, projects, publications, members };
    } catch (err) {
      console.error("home loader error:", err);
      return { news: [], projects: [], publications: [], members: [] };
    }
  },
  component: Home,
});

function Home() {
  const { news, projects, publications, members } = Route.useLoaderData();

  const dynamicStats = [
    { value: String(researchLines.length), label: "Linhas de pesquisa" },
    { value: String(projects.length), label: "Projetos ativos" },
    { value: String(publications.length), label: "Publicações" },
    { value: String(members.length), label: "Pesquisadores" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background text-foreground">
        <div className="container-lab relative pt-12 pb-20 md:pt-16 md:pb-28 flex justify-center">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 w-full max-w-6xl">
            <div className="flex-1 max-w-2xl">
              <p className="eyebrow text-primary">Laboratório de Pesquisa & Desenvolvimento</p>
              <h1 className="mt-4 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                Onde <span className="text-primary">IoT</span>, <span className="text-secondary">IA</span> e <br className="hidden md:block" /><span className="text-destructive">Software</span> se encontram.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                O EngineLab é um laboratório de pesquisa e desenvolvimento
                da Universidade Federal do Ceará - Campus Crateús. 
                Nosso foco é conectar teoria e prática criando soluções reais em engenharia 
                de software, sistemas e tecnologias embarcadas.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/pesquisa"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Explorar pesquisa <ArrowRight size={16} />
                </Link>
                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Sobre o laboratório
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block shrink-0">
              <img 
                src="/enginelab-v.png" 
                alt="Símbolo EngineLab" 
                className="w-72 lg:w-80 object-contain opacity-90 transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="relative border-t border-border bg-muted/30">
          <div className="container-lab grid grid-cols-2 gap-6 py-10 md:grid-cols-4 text-center sm:text-left">
            {dynamicStats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl font-bold text-primary md:text-5xl">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research lines grid */}
      <section className="container-lab py-20">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-destructive">Linhas de pesquisa</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-foreground md:text-4xl">
              Áreas onde geramos conhecimento e tecnologia.
            </h2>
          </div>
          <Link
            to="/pesquisa"
            className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-destructive hover:text-destructive/80"
          >
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {researchLines
            .filter((line) => ["iot", "pln", "visao-computacional"].includes(line.slug))
            .map((line) => (
            <div
              key={line.slug}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-destructive hover:shadow-lg"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-destructive text-destructive-foreground">
                <line.icon size={20} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-destructive">
                {line.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{line.short}</p>
              <div className="mt-5 h-px bg-border" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {line.topics.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
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
      {/* Featured projects + news split */}
      <section className="relative overflow-hidden bg-secondary dark:bg-zinc-950 py-24 text-white dark:text-zinc-50">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 mix-blend-overlay dark:hidden"></div>
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-secondary/10 via-zinc-950/50 to-zinc-950"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/20 dark:bg-secondary/10 blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-black/20 dark:bg-secondary/5 blur-[100px]"></div>

        <div className="container-lab relative z-10 grid gap-16 lg:grid-cols-5">
          {/* Projetos */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="inline-block rounded-full bg-white/20 dark:bg-secondary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white dark:text-secondary backdrop-blur-sm shadow-sm border border-white/30 dark:border-secondary/20">
                Projetos em destaque
              </span>
            </div>
            <h2 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white dark:text-zinc-50 sm:text-5xl drop-shadow-sm dark:drop-shadow-none">
              O que estamos construindo agora
            </h2>
            <div className="mt-12 space-y-5">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.title}
                  className="group relative flex flex-col justify-between gap-5 overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-7 shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-secondary/5 dark:hover:ring-secondary/30 sm:flex-row sm:items-start"
                >
                  <div className="relative z-10 flex-1">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-secondary">
                      <span className="rounded-md bg-secondary/10 dark:bg-secondary/20 px-2.5 py-1 uppercase tracking-wide">
                        {p.area}
                      </span>
                      <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 font-medium">
                        <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                        {p.year}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-secondary dark:group-hover:text-secondary">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {p.summary}
                    </p>
                  </div>
                  <div className="relative z-10 mt-4 sm:mt-0">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                        p.status === "Em andamento"
                          ? "bg-secondary text-white shadow-secondary/30 ring-1 ring-secondary/50 dark:bg-secondary/20 dark:text-secondary dark:ring-secondary/30"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 ring-1 ring-zinc-200 dark:ring-zinc-700"
                      }`}
                    >
                      {p.status === "Em andamento" && <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-white dark:bg-secondary"></span>}
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/projetos"
              className="group mt-12 inline-flex items-center gap-2 rounded-full bg-white dark:bg-zinc-900 px-7 py-3.5 text-sm font-bold text-secondary dark:text-zinc-200 shadow-lg shadow-black/10 dark:shadow-black/20 ring-1 ring-transparent dark:ring-white/10 transition-all hover:-translate-y-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:shadow-xl hover:shadow-black/20 dark:hover:ring-secondary/30"
            >
              Explorar todos os projetos <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Notícias */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="inline-block rounded-full bg-white/20 dark:bg-secondary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white dark:text-secondary backdrop-blur-sm shadow-sm border border-white/30 dark:border-secondary/20">
                Últimas notícias
              </span>
            </div>
            <h2 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white dark:text-zinc-50 sm:text-5xl drop-shadow-sm dark:drop-shadow-none">
              Novidades
            </h2>
            <div className="mt-12 space-y-6">
              {[...news].sort((a, b) => {
                if (!a.isoDate) return 1;
                if (!b.isoDate) return -1;
                return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
              }).slice(0, 3).map((n) => {
                const formattedDate = new Date(n.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                return (
                  <article key={n.title} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-7 shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-secondary/5 dark:hover:ring-secondary/30">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-secondary">
                        <span className="uppercase tracking-wide">{n.tag}</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                        <span className="text-zinc-400 dark:text-zinc-500 font-medium">{formattedDate !== 'Invalid Date' ? formattedDate : n.date}</span>
                      </div>
                      <h3 className="mt-3.5 font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-secondary dark:group-hover:text-secondary leading-snug">
                        {n.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {n.excerpt}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
            <Link
              to="/noticias"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white dark:bg-zinc-900 px-7 py-3.5 text-sm font-bold text-secondary dark:text-zinc-200 shadow-lg shadow-black/10 dark:shadow-black/20 ring-1 ring-transparent dark:ring-white/10 transition-all hover:-translate-y-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:shadow-xl hover:shadow-black/20 dark:hover:ring-secondary/30"
            >
              Ler todas as notícias <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-lab py-20">
        <div className="rounded-2xl border border-border bg-deep p-10 text-primary-foreground md:p-16">
          <div className="max-w-2xl">
            <p className="eyebrow text-red-400">Colabore conosco</p>
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

function AnimatedCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const match = value.match(/^(\d+)(.*)$/);
  const endValue = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (endValue === 0) return;
    let start = 0;
    const duration = 2000; // 2 seconds animation
    const increment = endValue / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [endValue]);

  if (!match) return <span>{value}</span>;

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}
