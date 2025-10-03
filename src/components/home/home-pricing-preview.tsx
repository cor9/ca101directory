import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

        <div className="max-w-4xl mx-auto space-y-8">
          <Script
            src="https://js.stripe.com/v3/pricing-table.js"
            strategy="afterInteractive"
          />

          {/* Free Plan */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Free Plan</h3>
            <stripe-pricing-table
              pricing-table-id="prctbl_1SDbLwBqTvwy9ZuSXKTXVb7E"
              publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
            />
          </div>

          {/* Standard/Pro Plans */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Paid Plans</h3>
            <stripe-pricing-table
              pricing-table-id="prctbl_1SCpyNBqTvwy9ZuSNiSGY03P"
              publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
            />
          </div>

          {/* Link to full pricing page */}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/pricing">View All Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
