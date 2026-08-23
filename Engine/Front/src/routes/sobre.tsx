import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Instagram, Target, Sparkles, Handshake, Camera } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const carouselImages = import.meta.glob("@/assets/sobre/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const imageUrls = Object.values(carouselImages);

function Sobre() {
  return (
    <div>
      <PageHeader
        eyebrow="Sobre"
        title="Sobre o EngineLab"
        description="Um laboratório dedicado à pesquisa aplicada em Internet das Coisas, Inteligência Artificial e Desenvolvimento de Software."
      />

      <section className="container-lab py-16">
        {/* Carrossel de Fotos da Equipe */}
        <div className="mb-16 w-full px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {imageUrls.length > 0 ? (
                imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="group flex aspect-[4/3] md:aspect-[21/9] w-full items-center justify-center overflow-hidden rounded-3xl bg-muted/50">
                      <img
                        src={url}
                        alt={`Foto da equipe ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="flex aspect-[4/3] md:aspect-[21/9] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-primary/30 bg-muted/50 p-6 text-center transition-colors hover:bg-muted/80">
                    <Camera className="mb-4 h-12 w-12 text-primary/40" />
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Nenhuma foto encontrada
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                      Adicione imagens na pasta <strong>src/assets/sobre</strong> para que elas apareçam aqui automaticamente.<br className="hidden sm:block" />
                    </p>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="eyebrow">Nossa história</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
              Formando talentos, fomentando a pesquisa e exigindo excelência.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                O EngineLab é um laboratório de pesquisa e desenvolvimento da Universidade Federal do Ceará - Campus de Crateús, criado em meio à pandemia. Inicialmente focado em engenharia de software e sistemas, o laboratório evoluiu ao longo do tempo, passando a atuar em áreas de alta inovação tecnológica, como Processamento de Linguagem Natural (PLN), Internet das Coisas (IoT) e Visão Computacional.
              </p>
              <p>
                Nosso trabalho é voltado para o desenvolvimento de soluções tecnológicas que impactem positivamente a sociedade, com foco em áreas como automação, análise e ciência de dados e inteligência artificial. O EngineLab promove a inovação científica por meio de pesquisas aplicadas, sempre com a colaboração entre acadêmicos, estudantes, profissionais da área e instituições parceiras no exterior, visando criar tecnologias que atendam às demandas contemporâneas e tragam avanços concretos para a sociedade.
              </p>
            </div>
          </div>

          <aside className="self-start rounded-2xl border border-border bg-card p-8 text-foreground shadow-sm">
            <p className="eyebrow text-destructive">Contato</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">Fale conosco</h3>
            <div className="mt-6 space-y-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-destructive" />
                <span>enginelab@crateus.ufc.br</span>
              </div>
              <div className="flex items-center gap-3">
                <Instagram size={18} className="shrink-0 text-destructive" />
                <a href="https://www.instagram.com/enginelab.ufc/" target="_blank" rel="noreferrer" className="hover:text-destructive transition-colors">@enginelab.ufc</a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-destructive" />
                <span className="leading-relaxed">
                  Campus da UFC Crateús<br />
                  Av. Profª. Machadinha Lima, S/N<br />
                  Príncipe Imperial, Crateús - CE
                </span>
              </div>
            </div>
            <a
              href="mailto:enginelab@crateus.ufc.br"
              className="mt-8 flex w-full items-center justify-center rounded-md bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              Enviar mensagem
            </a>
          </aside>
        </div>
      </section>

      <section className="bg-muted py-16">
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
