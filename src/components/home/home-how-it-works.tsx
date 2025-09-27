import Container from "@/components/container";
import { homeConfig } from "@/config/home";

export default function HomeHowItWorks() {
  return (
    <section className="py-16">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm uppercase tracking-wider text-[#FF6B35]">
            How it works
          </p>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            A simple path from search to signed booking
          </h2>
          <p className="text-muted-foreground">
            The directory is designed to guide families through every step of
            the process, whether you are exploring acting for the first time or
            scaling an established career.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {homeConfig.howItWorks.map((step, index) => (
            <article
              key={step.title}
              className="relative h-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <span className="absolute -top-4 left-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F7931E] text-lg font-semibold text-white shadow-lg shadow-[#F7931E]/30">
                {index + 1}
              </span>
              <h3 className="mb-3 text-xl font-semibold text-[#0f172a]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
