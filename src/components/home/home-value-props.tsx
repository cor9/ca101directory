import Container from "@/components/container";
import { Icons } from "@/components/icons/icons";
import { homeConfig } from "@/config/home";

const accentStyles = [
  "bg-retro-blue/10 text-retro-blue",
  "bg-tomato-red/10 text-tomato-red",
  "bg-mustard-gold/10 text-mustard-gold",
  "bg-muted-teal/10 text-muted-teal",
];

export default function HomeValueProps() {
  return (
    <section className="py-16 bg-gradient-to-br from-retro-blue/90 to-retro-blue">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm uppercase tracking-wider text-cream/90">
            Why families choose us
          </p>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-cream">
            Built for the unique needs of young performers
          </h2>
          <p className="text-base text-cream/90">
            We do the legwork so you can focus on supporting your child. Explore
            verified listings with transparency into quality, safety, and fit.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {homeConfig.valueProps.map((value, index) => {
            const Icon = Icons[value.icon];
            const accent = accentStyles[index % accentStyles.length];

            return (
              <article
                key={value.title}
                className="flex h-full flex-col rounded-2xl border border-cream/20 bg-cream/10 backdrop-blur-sm p-8 shadow-lg shadow-black/20 hover:bg-cream/15 transition-all duration-300"
              >
                <span
                  className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full ${accent}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mb-3 text-xl font-semibold text-cream">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream/90">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
