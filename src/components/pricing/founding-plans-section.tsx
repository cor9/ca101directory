import { StripeDirectButton } from "@/components/payment/stripe-direct-button";
import { priceConfig } from "@/config/price";
import { cn } from "@/lib/utils";
import { CheckIcon, SparklesIcon, XIcon } from "lucide-react";

export function FoundingPlansSection() {
  const foundingPlans = priceConfig.foundingPlans || [];

  if (foundingPlans.length === 0) return null;

  return (
    <section id="founding-plans" className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue/10 to-purple-600/10 px-4 py-2 text-sm font-semibold text-brand-blue">
            <SparklesIcon className="h-4 w-4" />
            <span>LIMITED TIME FOUNDING MEMBER OFFERS</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-ink">
            Lock In Your Lifetime Rate
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Be a founding member and secure these exclusive rates forever.
            Once we reach our member cap, prices return to standard rates.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {foundingPlans.map((plan, index) => (
            <FoundingPlanCard
              key={plan.title}
              plan={plan}
              featured={index === 1} // Middle card featured
            />
          ))}
        </div>

        {/* Urgency Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            ⏰ <strong>Hurry!</strong> Founding member spots are filling fast.
            Lock in your rate today before they're gone.
          </p>
        </div>
      </div>
    </section>
  );
}

interface FoundingPlanCardProps {
  plan: any; // PricePlan type
  featured?: boolean;
}

function FoundingPlanCard({ plan, featured = false }: FoundingPlanCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 p-8 shadow-lg transition-all hover:shadow-2xl",
        featured
          ? "border-brand-blue bg-gradient-to-b from-brand-blue/5 to-purple-600/5 scale-105"
          : "border-border bg-card",
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div
            className={cn(
              "rounded-full px-4 py-1 text-xs font-bold uppercase shadow-lg",
              featured
                ? "bg-gradient-to-r from-brand-blue to-purple-600 text-white"
                : "bg-brand-yellow text-ink",
            )}
          >
            {plan.badge}
          </div>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-2xl font-bold text-ink">{plan.title}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-8 text-center">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-bold text-ink">${plan.price}</span>
          <span className="text-muted-foreground">{plan.priceSuffix}</span>
        </div>
        {plan.priceSuffix.includes("forever") && (
          <div className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-600">
            🔒 <span>Lifetime Rate Guaranteed</span>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="mb-8 space-y-3">
        {plan.benefits.map((benefit: string) => (
          <div key={benefit} className="flex items-start gap-3">
            <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <span className="text-sm text-ink">{benefit}</span>
          </div>
        ))}
        {plan.limitations.map((limitation: string) => (
          <div key={limitation} className="flex items-start gap-3 opacity-60">
            <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{limitation}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <StripeDirectButton
        pricePlan={plan}
        className={cn(
          "w-full font-bold",
          featured
            ? "bg-gradient-to-r from-brand-blue to-purple-600 text-white hover:opacity-90"
            : "bg-brand-blue text-white hover:bg-brand-blue/90",
        )}
        flowOverride="founding"
      />

      {/* Trust badge */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        ✨ Includes Founding Member Badge
      </p>
    </div>
  );
}

