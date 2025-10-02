import Container from "@/components/container";
import Script from "next/script";

export default function HomePricingPreview() {
  return (
    <section className="py-16">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits where you are today and upgrade as your
            performer grows.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Script
            src="https://js.stripe.com/v3/pricing-table.js"
            strategy="afterInteractive"
          />
          <stripe-pricing-table
            pricing-table-id="prctbl_1SDjLkBqTvwy9ZuSAAkAI8XS"
            publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
          />
        </div>
      </Container>
    </section>
  );
}
