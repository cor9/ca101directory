export default function HomeHero() {
  return (
    <section className="bg-bg-dark pt-16 pb-14">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-text-primary leading-tight">
          Find trusted professionals for young actors
        </h1>

        <p className="mt-3 text-base text-text-secondary">
          A trusted directory built by working industry professionals — not advertisers.
        </p>

        <p className="mt-4 max-w-xl text-lg text-text-secondary">
          Acting coaches, headshot photographers, agents, and industry pros — vetted for families.
        </p>

        <div className="mt-6 flex items-center">
          <a
            href="#categories"
            className="bg-accent-teal text-bg-dark px-6 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition"
          >
            Browse the Directory
          </a>

          <a
            href="/suggest-vendor"
            className="ml-4 text-text-secondary hover:text-text-primary transition-colors"
          >
            Suggest a Vendor →
          </a>
        </div>
      </div>
    </section>
  );
}
