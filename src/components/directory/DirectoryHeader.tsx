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
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[color:var(--ink)]">
        Professional Directory
      </h1>
      <p className="mt-3 text-[color:var(--muted)] max-w-2xl">
        Browse {total?.toLocaleString()} vetted child-actor professionals. Listings shown as cream cards for readability.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Professionals", value: total?.toLocaleString() },
          { label: "Categories", value: categoriesCount ?? "—" },
          { label: "Regions", value: regionsCount ?? "—" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[color:var(--cream)] text-[color:var(--cream-ink)] rounded-2xl border border-[color:var(--card-border)] shadow-[var(--shadow-cream)] px-5 py-4"
          >
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


