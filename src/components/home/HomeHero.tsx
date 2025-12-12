export default function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/10 via-transparent to-accent-purple/10" />

      <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-text-primary">
          Find Trusted Industry Pros for Young Actors
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-text-secondary">
          A curated directory of acting coaches, photographers, agents, and
          industry professionals—built for parents navigating the business.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="#categories"
            className="rounded-xl bg-accent-teal px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
          >
            Browse Categories
          </a>

          <a
            href="/submit"
            className="rounded-xl border border-border-subtle px-6 py-3 text-sm font-semibold text-text-primary hover:bg-card-surface transition"
          >
            Submit a Professional
          </a>
        </div>
      </div>
    </section>
  );
}
