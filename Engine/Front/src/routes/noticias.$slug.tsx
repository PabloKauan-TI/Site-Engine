import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { fetchNewsBySlug, type NewsItem } from "@/lib/engine-api";

export const Route = createFileRoute("/noticias/$slug")({
  loader: async ({ params }) => {
    const item = await fetchNewsBySlug(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.title} — EngineLab` },
          { name: "description", content: loaderData.item.excerpt },
          { property: "og:title", content: loaderData.item.title },
          { property: "og:description", content: loaderData.item.excerpt },
          { property: "article:published_time", content: loaderData.item.date },
        ]
      : [{ title: "Notícia não encontrada — EngineLab" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="container-lab py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-primary">Notícia não encontrada</h1>
      <Link to="/noticias" className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent">
        <ArrowLeft size={16} /> Voltar às notícias
      </Link>
    </div>
  ),
  component: NoticiaDetalhe,
});

function NoticiaDetalhe() {
  const { item } = Route.useLoaderData();
  const related: NewsItem[] = [];

  return (
    <div>
      <PageHeader eyebrow={`${item.tag} · ${item.date}`} title={item.title} description={item.excerpt} />
      <section className="container-lab py-12">
        <Link to="/noticias" className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent">
          <ArrowLeft size={14} /> Todas as notícias
        </Link>

        <article className="mx-auto mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-foreground">
          {item.body.map((p: string, i: number) => (
            <p key={i} className={i === 0 ? "text-lg text-foreground" : "text-muted-foreground"}>
              {p}
            </p>
          ))}
        </article>

        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-3xl border-t border-border pt-10">
            <p className="eyebrow">Continue lendo</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/noticias/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
                      {r.tag}
                    </span>
                    <span className="text-muted-foreground">{r.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-primary">{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
