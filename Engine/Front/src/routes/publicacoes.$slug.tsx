import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { fetchPublicationBySlug } from "@/lib/engine-api";

export const Route = createFileRoute("/publicacoes/$slug")({
  loader: async ({ params }) => {
    const publication = await fetchPublicationBySlug(params.slug);
    if (!publication) throw notFound();
    return { publication };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.publication.title} — EngineLab` },
          { name: "description", content: loaderData.publication.abstract.slice(0, 160) },
          { property: "og:title", content: loaderData.publication.title },
          { property: "og:description", content: loaderData.publication.abstract.slice(0, 160) },
        ]
      : [{ title: "Publicação não encontrada — EngineLab" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="container-lab py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-primary">Publicação não encontrada</h1>
      <Link to="/publicacoes" className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent">
        <ArrowLeft size={16} /> Voltar às publicações
      </Link>
    </div>
  ),
  component: PublicacaoDetalhe,
});

function PublicacaoDetalhe() {
  const { publication } = Route.useLoaderData();

  return (
    <div>
      <PageHeader eyebrow={`${publication.type} · ${publication.year}`} title={publication.title} />
      <section className="container-lab py-12">
        <Link to="/publicacoes" className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent">
          <ArrowLeft size={14} /> Todas as publicações
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="eyebrow">Autores</p>
              <p className="mt-2 text-base text-foreground">{publication.authors}</p>
            </div>
            <div>
              <p className="eyebrow">Resumo</p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {publication.abstract}
              </p>
            </div>
            <div>
              <p className="eyebrow">Palavras-chave</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {publication.keywords.map((k: string) => (
                  <span key={k} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground">
                <FileText size={22} />
              </div>
              <p className="eyebrow mt-5">Publicado em</p>
              <p className="mt-2 font-display text-lg font-semibold text-primary">{publication.venue}</p>
              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Tipo</dt>
                  <dd className="mt-0.5 font-medium text-primary">{publication.type}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Ano</dt>
                  <dd className="mt-0.5 font-medium text-primary">{publication.year}</dd>
                </div>
                {publication.doi && (
                  <div>
                    <dt className="text-muted-foreground">DOI</dt>
                    <dd className="mt-0.5 break-all font-mono text-xs text-primary">{publication.doi}</dd>
                  </div>
                )}
              </dl>
              {publication.doi && (
                <a
                  href={`https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                >
                  Acessar publicação <ExternalLink size={14} />
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
