import { CheckCircle2, Shield, Star, Users } from "lucide-react";

interface WhyParentsTrustProps {
  totalListings: number;
  categoriesCount: number;
  regionsCount: number;
}

export default function WhyParentsTrust({
  totalListings,
  categoriesCount,
  regionsCount,
}: WhyParentsTrustProps) {
  return (
    <section className="bg-[#0C1A2B] py-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="bauhaus-heading text-3xl md:text-4xl text-center text-white mb-4">
          Why Parents Trust Us
        </h2>
        <p className="bauhaus-body text-center text-white/70 max-w-2xl mx-auto mb-12">
          The Child Actor 101 Vendor Directory connects families with industry
          professionals who work with young performers. From classes to career
          support, find trusted services all in one place.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Professionals",
              value: totalListings?.toLocaleString() || "—",
              icon: Users,
            },
            {
              label: "Categories",
              value: categoriesCount ?? "—",
              icon: Star,
            },
            {
              label: "Regions",
              value: regionsCount ?? "—",
              icon: Shield,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm"
            >
              <stat.icon className="mx-auto mb-3 h-8 w-8 text-zinc-700" />
              <div className="text-3xl font-bold text-zinc-900">
                {stat.value}
              </div>
              <div className="text-sm font-medium uppercase tracking-wide text-zinc-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Clear Trust Signals",
              description:
                "Verified Business means the owner completed ownership verification. Featured means paid placement. Neither is an endorsement.",
            },
            {
              title: "Parent-First Approach",
              description:
                "Built by parents, for parents navigating the child acting industry.",
            },
            {
              title: "Transparent Reviews",
              description:
                "Real feedback from families who have used these services.",
            },
            {
              title: "Industry Expertise",
              description:
                "Backed by Child Actor 101's 10+ years of industry experience.",
            },
          ].map((point) => (
            <div
              key={point.title}
              className="flex items-start gap-4 bg-white/5 rounded-xl p-5"
            >
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-white/80" />
              <div>
                <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                <p className="text-sm text-white/80">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
