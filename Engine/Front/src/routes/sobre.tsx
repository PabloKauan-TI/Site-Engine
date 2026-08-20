import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Target, Sparkles, Handshake } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — EngineLab" },
      { name: "description", content: "Sobre o EngineLab: missão, história e infraestrutura de pesquisa em IoT, IA e software." },
      { property: "og:title", content: "Sobre — EngineLab" },
      { property: "og:description", content: "Conheça a missão e história do EngineLab." },
    ],
  }),
  component: Sobre,
});

const pillars = [
  {
    icon: Target,
    title: "Missão",
    text: "Produzir conhecimento científico e tecnológico de alto impacto em IoT, IA e software, formando pesquisadores e engenheiros de excelência.",
  },
  {
    icon: Sparkles,
    title: "Visão",
    text: "Ser referência nacional em pesquisa aplicada, integrando universidade, indústria e sociedade em soluções inteligentes e conectadas.",
  },
  {
    icon: Handshake,
    title: "Valores",
    text: "Rigor científico, colaboração aberta, ética em pesquisa, inovação responsável e compromisso com formação humana.",
  },
];

function Sobre() {
  return (
    <div>
      <PageHeader
        eyebrow="Sobre"
        title="Sobre o EngineLab"
        description="Um laboratório dedicado à pesquisa aplicada em Internet das Coisas, Inteligência Artificial e Desenvolvimento de Software."
      />

      <section className="container-lab py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="eyebrow">Nossa história</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-primary">
              Um laboratório na fronteira entre bits, sensores e algoritmos.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                O EngineLab foi criado com o propósito de integrar pesquisa
                fundamental e aplicada nos domínios de Internet das Coisas,
                Inteligência Artificial e Engenharia de Software. Nossa atuação
                combina rigor científico com forte colaboração com a indústria.
              </p>
              <p>
                Trabalhamos em problemas reais — desde firmware em dispositivos
                embarcados até sistemas de decisão baseados em aprendizado de
                máquina — sempre priorizando confiabilidade, escalabilidade e
                sustentabilidade das soluções.
              </p>
              <p>
                Formamos alunos de graduação, mestrado e doutorado, publicamos
                em periódicos e conferências internacionais, e mantemos parcerias
                estratégicas com empresas, órgãos públicos e outros centros de
                pesquisa.
              </p>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-primary p-8 text-primary-foreground">
            <p className="eyebrow text-accent">Contato</p>
            <h3 className="mt-3 font-display text-2xl font-semibold">Fale conosco</h3>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>contato@enginelab.org</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>Departamento de Engenharia — Bloco C, sala 214</span>
              </div>
            </div>
            <a
              href="mailto:contato@enginelab.org"
              className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
            >
              Enviar mensagem
            </a>
          </aside>
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="container-lab">
          <p className="eyebrow">Princípios</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary">
            Missão, visão e valores
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-border bg-card p-8 transition-shadow hover:shadow-md"
              >
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <p.icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
