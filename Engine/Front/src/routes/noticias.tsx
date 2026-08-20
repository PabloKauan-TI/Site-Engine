import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { fetchNews } from "@/lib/engine-api";

export const Route = createFileRoute("/noticias")({
  loader: async () => {
    try {
      return { news: await fetchNews() };
    } catch (err) {
      console.error("fetchNews loader error:", err);
      return { news: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Notícias — EngineLab" },
      { name: "description", content: "Novidades, prêmios, eventos e parcerias do laboratório EngineLab." },
      { property: "og:title", content: "Notícias — EngineLab" },
      { property: "og:description", content: "Últimas novidades do EngineLab." },
    ],
  }),
  component: Noticias,
});

function Noticias() {
  const { news } = Route.useLoaderData();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isListRoute = pathname === "/noticias" || pathname === "/noticias/";

  if (!isListRoute) {
    return <Outlet />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Notícias"
        title="Novidades do laboratório"
        description="Prêmios, publicações, parcerias e eventos que marcam a trajetória do EngineLab."
      />
      <section className="container-lab py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {news.map((n, i) => (
            <Link
              key={n.slug}
              to="/noticias/$slug"
              params={{ slug: n.slug }}
              className={`block rounded-xl border border-border bg-card p-8 transition-shadow hover:shadow-md ${
                i === 0 ? "md:col-span-2 md:bg-primary md:text-primary-foreground" : ""
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`rounded-full px-2.5 py-1 font-medium ${
                    i === 0 ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {n.tag}
                </span>
                <span className={i === 0 ? "text-primary-foreground/70" : "text-muted-foreground"}>
                  {n.date}
                </span>
              </div>
              <h2
                className={`mt-4 font-display font-semibold ${
                  i === 0 ? "text-2xl md:text-3xl" : "text-lg text-primary"
                }`}
              >
                {n.title}
              </h2>
              <p
                className={`mt-3 text-sm ${
                  i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {n.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
