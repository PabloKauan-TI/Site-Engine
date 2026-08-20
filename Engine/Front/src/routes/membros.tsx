import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { fetchMembers } from "@/lib/engine-api";

export const Route = createFileRoute("/membros")({
  loader: async () => {
    try {
      return { members: await fetchMembers() };
    } catch (err) {
      console.error("fetchMembers loader error:", err);
      return { members: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Membros — EngineLab" },
      { name: "description", content: "Pesquisadores, docentes e estudantes que integram o laboratório EngineLab." },
      { property: "og:title", content: "Membros — EngineLab" },
      { property: "og:description", content: "Conheça a equipe do EngineLab." },
    ],
  }),
  component: Membros,
});

function Membros() {
  const { members } = Route.useLoaderData();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isListRoute = pathname === "/membros" || pathname === "/membros/";

  if (!isListRoute) {
    return <Outlet />;
  }

  const groups = {
    "Docentes e pesquisadores": members.filter((m) =>
      /Coordenadora|sênior|Pesquisador|Professor|Docente/i.test(m.role),
    ),
    "Pós-graduação": members.filter((m) => /Doutoranda|Doutorando|Mestranda|Mestrando|Pós/i.test(m.role)),
    "Iniciação científica": members.filter((m) => /Iniciação|Estudante|Bolsista/i.test(m.role)),
  };

  const listGroups = Object.entries(groups).map(([groupName, list]) => ({
    groupName,
    list: list.length > 0 ? list : members.filter((m) => m.role !== ""),
  }));


  return (
    <div>
      <PageHeader
        eyebrow="Equipe"
        title="Membros do laboratório"
        description="Pesquisadores, docentes e estudantes que compõem o EngineLab."
      />
      <section className="container-lab space-y-14 py-16">
        {listGroups.map(({ groupName, list }) => (
          <div key={groupName}>
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-display text-2xl font-semibold text-primary">{groupName}</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((m) => (
                <Link
                  key={m.slug}
                  to="/membros/$slug"
                  params={{ slug: m.slug }}
                  className="block rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md hover:border-accent"
                >
                  {m.photoUrl ? (
                    <img
                      src={m.photoUrl}
                      alt={m.name}
                      className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-accent/20 shadow-sm"
                    />
                  ) : (
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary font-display text-2xl font-semibold text-primary-foreground ring-4 ring-accent/20">
                      {m.initials}
                    </div>
                  )}
                  <h3 className="mt-4 font-display text-base font-semibold text-primary">
                    {m.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-accent">
                    {m.role}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{m.area}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
