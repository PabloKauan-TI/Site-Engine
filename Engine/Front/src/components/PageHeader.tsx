export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-12 md:pt-24 md:pb-16 border-b border-border/50">
      {/* Soft gradient background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/50 to-background"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/10 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-72 w-72 rounded-full bg-secondary/10 blur-[100px]"></div>

      <div className="container-lab relative z-10">
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm ring-1 ring-primary/20">
            {eyebrow}
          </span>
        </div>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
