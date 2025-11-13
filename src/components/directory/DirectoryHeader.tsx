export default function DirectoryHeader({
  total,
  categoriesCount,
  regionsCount,
}: {
  total: number;
  categoriesCount?: number;
  regionsCount?: number;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
      <h1 className="bauhaus-heading text-4xl md:text-5xl tracking-tight text-[color:var(--ink)]">
        Find Trusted Professionals
      </h1>
      <p className="bauhaus-body mt-4 text-[color:var(--muted)] max-w-2xl">
        The Child Actor 101 Directory connects families with industry
        professionals who work with young performers. From classes to career
        support, find trusted services all in one place.
      </p>
      <div className="mt-4">
        <a
          href="/suggest-vendor"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[color:var(--card-border)] bg-[color:rgb (63, 174, 214)] text-gray-900 hover:bg-[color:var(--cream)]/90 transition-colors"
        >
          Know someone great? Suggest a vendor →
        </a>
      </div>

      <div className="mt-8 bauhaus-grid bauhaus-grid-3">
        {[
          { label: "Professionals", value: total?.toLocaleString() },
          { label: "Categories", value: categoriesCount ?? "—" },
          { label: "Regions", value: regionsCount ?? "—" },
        ].map((s) => (
          <div
            key={s.label}
            className="bauhaus-card p-6 text-center"
          >
            <div className="bauhaus-heading text-3xl text-bauhaus-orange">{s.value}</div>
            <div className="bauhaus-body text-sm opacity-80 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
