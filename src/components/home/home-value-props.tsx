import Container from "@/components/container";
import { Icons } from "@/components/icons/icons";
import { homeConfig } from "@/config/home";

const accentStyles = [
  "bg-[#FF6B35]/10 text-[#FF6B35]",
  "bg-[#F7931E]/10 text-[#F7931E]",
  "bg-[#FFFFFF]/10 text-white",
];

export default function HomeValueProps() {
  return (
    <section className="bg-[#004E89] py-16 text-white">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm uppercase tracking-wider text-[#F7931E]">
            Why families choose us
          </p>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Built for the unique needs of young performers
          </h2>
          <p className="text-base text-white/80">
            We do the legwork so you can focus on supporting your child. Explore
            verified listings with transparency into quality, safety, and fit.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {homeConfig.valueProps.map((value, index) => {
            const Icon = Icons[value.icon];
            const accent = accentStyles[index % accentStyles.length];

            return (
              <article
                key={value.title}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-[#002e52]/40"
              >
                <span
                  className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full ${accent}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/80">
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
