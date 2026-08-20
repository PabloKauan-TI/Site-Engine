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
              className="rounded-xl border border-border bg-card p-8 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <line.icon size={22} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-primary">
                    {line.title}
                  </h2>
                  <p className="mt-1 text-sm text-accent">{line.short}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {line.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {line.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
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
