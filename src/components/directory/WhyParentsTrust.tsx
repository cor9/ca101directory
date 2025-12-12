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
          The Child Actor 101 Directory connects families with industry
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
              className="bauhaus-card bg-[#FFFBEA] p-6 text-center rounded-xl"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-[#FF6B35]" />
              <div className="bauhaus-heading text-3xl text-[#0C1A2B]">
                {stat.value}
              </div>
              <div className="bauhaus-body text-sm text-slate-600 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Vetted Professionals",
              description:
                "Every listing is reviewed by our team to ensure quality and legitimacy.",
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
              <CheckCircle2 className="w-6 h-6 text-[#7AB8CC] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                <p className="text-sm text-white/70">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
