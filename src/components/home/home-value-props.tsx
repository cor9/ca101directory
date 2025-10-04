import Container from "@/components/container";
import { Icons } from "@/components/icons/icons";
import { homeConfig } from "@/config/home";

const iconStyles = [
  { bg: "#F25C05", name: "relevant" } /* retro orange */,
  { bg: "#0C88F2", name: "transparent" } /* bold blue */,
  { bg: "#F2B705", name: "supportive" } /* mustard */,
  { bg: "#1F7A4D", name: "community" } /* olive green */,
];

export default function HomeValueProps() {
  return (
    <section
      className="section-why-families py-16"
      style={{ background: "#0C1A2B", color: "#FFFDD0" }}
    >
      <Container>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p
            className="text-sm uppercase tracking-wider"
            style={{ color: "#EAEAEA" }}
          >
            Why families choose us
          </p>
          <h2
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ color: "#FFFDD0", fontWeight: 700 }}
          >
            Built for the unique needs of young performers
          </h2>
          <p className="text-base" style={{ color: "#EAEAEA" }}>
            We do the legwork so you can focus on supporting your child. Explore
            verified listings with transparency into quality, safety, and fit.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {homeConfig.valueProps.map((value, index) => {
            const Icon = Icons[value.icon];
            const iconStyle = iconStyles[index % iconStyles.length];

            return (
              <article
                key={value.title}
                className="family-card flex h-full flex-col rounded-xl p-6 text-left transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: "#FFFDD0",
                  color: "#0C1A2B",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  className="icon mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: iconStyle.bg,
                    color: "#FFFDD0",
                    fontSize: "1.5rem",
                  }}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3
                  className="mb-3 text-xl font-bold"
                  style={{ color: "#0C1A2B", fontWeight: 700 }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#333", fontSize: "0.95rem" }}
                >
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
