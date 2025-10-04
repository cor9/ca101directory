export default function VendorFAQ() {
  const faqs = [
    {
      question: "What's the difference between Free and Pro?",
      answer:
        "Free listings include basic information and standard visibility. Pro listings get featured placement, gallery images, advanced analytics, SEO boost, and premium support.",
    },
    {
      question: "How do I edit my listing?",
      answer:
        "Once you're logged in, you can edit your listing anytime from your vendor dashboard. Changes are reviewed and published within 24 hours.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your paid subscription anytime. Your listing will remain active until the end of your billing period, then revert to free status.",
    },
    {
      question: "How long does it take to get approved?",
      answer:
        "Most listings are approved within 24-48 hours. We review each submission to ensure quality and authenticity for our families.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Yes, you can change your plan anytime from your dashboard. Upgrades take effect immediately, downgrades take effect at your next billing cycle.",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-paper">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-paper/90">
            Everything you need to know about listing your business
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={`faq-${faq.question}`}
              className="surface border border-surface/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-3" style={{ color: "#1F2327" }}>
                {faq.question}
              </h3>
              <p style={{ color: "#333" }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
