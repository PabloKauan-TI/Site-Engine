import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { researchLines } from "@/lib/lab-data";

export const Route = createFileRoute("/pesquisa")({
  head: () => ({
    meta: [
      { title: "Linhas de Pesquisa — EngineLab" },
      { name: "description", content: "Áreas de pesquisa do EngineLab em IoT, IA, software, sistemas inteligentes, dados e segurança." },
      { property: "og:title", content: "Linhas de Pesquisa — EngineLab" },
      { property: "og:description", content: "Nossas áreas de investigação em IoT, IA e software." },
    ],
  }),
  component: Pesquisa,
});

function Pesquisa() {
  return (
    <div>
      <PageHeader
        eyebrow="Pesquisa"
        title="Linhas de pesquisa"
        description="Investigamos, do hardware ao software, os pilares que dão forma aos sistemas conectados e inteligentes de nova geração."
      />
      <section className="container-lab py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {researchLines.map((line) => (
            <article
              key={line.slug}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10 flex items-start gap-5">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20">
                  <line.icon size={26} strokeWidth={1.5} />
                </div>
                <div className="pt-1.5">
                  <h2 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {line.title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{line.short}</p>
                </div>
              </div>
              
              <div className="relative z-10 mt-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {line.description}
                </p>
              </div>
              
              <div className="relative z-10 mt-8 flex flex-wrap gap-2">
                {line.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border/50 transition-colors group-hover:bg-primary/5 group-hover:text-primary group-hover:ring-primary/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
