export default function VendorPricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Basic listing",
        "Contact information",
        "Service description",
        "Standard visibility",
      ],
        cta: "Get Started Free",
        ctaLink: "/auth/register?role=vendor",
      popular: false,
    },
    {
      name: "Standard",
      price: "$25",
      period: "month",
      features: [
        "Everything in Free",
        "Logo display",
        "Enhanced visibility",
        "Priority placement",
        "Basic analytics",
      ],
        cta: "Choose Standard",
        ctaLink: "/auth/register?role=vendor",
      popular: true,
    },
    {
      name: "Pro",
      price: "$50",
      period: "month",
      features: [
        "Everything in Standard",
        "Featured placement",
        "Gallery images (5 total)",
        "Advanced analytics",
        "SEO boost",
        "Premium support",
      ],
        cta: "Choose Pro",
        ctaLink: "/auth/register?role=vendor",
      popular: false,
    },
  ];

  const foundingDeals = [
    {
      name: "Founding Standard",
      price: "$250",
      period: "6 months",
      originalPrice: "$150",
      savings: "Save $50",
      features: [
        "Everything in Standard",
        "6-month commitment",
        "Founding vendor badge",
        "Priority support",
      ],
        cta: "Limited Time Offer",
        ctaLink: "/auth/register?role=vendor",
      urgent: true,
    },
    {
      name: "Founding Pro",
      price: "$500",
      period: "6 months",
      originalPrice: "$300",
      savings: "Save $100",
      features: [
        "Everything in Pro",
        "6-month commitment",
        "Founding vendor badge",
        "Priority support",
        "Exclusive placement",
      ],
        cta: "Limited Time Offer",
        ctaLink: "/auth/register?role=vendor",
      urgent: true,
    },
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-charcoal">Pricing Plans</h2>
        <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
          Choose the plan that works best for your business
        </p>
      </div>

      {/* Regular Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-cream border border-cream rounded-xl p-8 relative ${
              plan.popular ? "ring-2 ring-retro-blue shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-retro-blue text-cream px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-charcoal mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-charcoal">
                  {plan.price}
                </span>
                <span className="text-charcoal/70">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li
                  key={`${plan.name}-feature-${index}`}
                  className="flex items-center text-charcoal/70"
                >
                  <svg
                    className="w-5 h-5 text-retro-blue mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={plan.ctaLink}
              className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-r from-retro-blue to-tomato-red text-cream hover:from-retro-blue/90 hover:to-tomato-red/90"
                  : "bg-charcoal/10 text-charcoal hover:bg-charcoal/20"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      {/* Founding Deals */}
      <div className="bg-gradient-to-r from-mustard-gold/10 to-tomato-red/10 rounded-xl p-8 mb-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-charcoal mb-2">
            Founding Vendor Deals
          </h3>
          <p className="text-charcoal/70">
            Limited time offers for early adopters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {foundingDeals.map((deal) => (
            <div
              key={deal.name}
              className="bg-cream border border-cream rounded-xl p-6 relative"
            >
              {deal.urgent && (
                <div className="absolute -top-3 left-4">
                  <span className="bg-tomato-red text-cream px-3 py-1 rounded-full text-sm font-semibold">
                    Limited Time
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-charcoal mb-2">
                  {deal.name}
                </h4>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-charcoal">
                    {deal.price}
                  </span>
                  <span className="text-charcoal/70">/{deal.period}</span>
                </div>
                <div className="text-sm text-charcoal/60 mb-2">
                  <span className="line-through">{deal.originalPrice}</span> •{" "}
                  {deal.savings}
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {deal.features.map((feature, index) => (
                  <li
                    key={`${deal.name}-feature-${index}`}
                    className="flex items-center text-sm text-charcoal/70"
                  >
                    <svg
                      className="w-4 h-4 text-mustard-gold mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={deal.ctaLink}
                className="w-full block text-center py-3 px-6 bg-gradient-to-r from-mustard-gold to-tomato-red text-cream rounded-lg font-semibold hover:from-mustard-gold/90 hover:to-tomato-red/90 transition-all duration-300"
              >
                {deal.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
