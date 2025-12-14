export default function HomeHero() {
  return (
    <section className="bg-bg-dark pt-16 pb-14">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-text-primary leading-tight">
          The #1 Directory for{" "}
          <span className="text-accent-yellow">Child Actor Vendors</span>{" "}
          &{" "}
          <span className="text-accent-blue">Industry Professionals</span>
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
            className="bg-accent-orange text-black px-6 py-3 rounded-lg font-semibold hover:bg-accent-orange/90 transition"
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
