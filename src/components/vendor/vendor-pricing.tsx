import Script from "next/script";

export default function VendorPricing() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="bauhaus-heading text-3xl mb-4 text-bauhaus-charcoal">
          Pricing Plans
        </h2>
        <p className="bauhaus-body text-lg text-bauhaus-charcoal/90 max-w-2xl mx-auto">
          Choose the plan that works best for your business
        </p>
      </div>

      {/* Load Stripe Pricing Table Script */}
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />

      {/* Free Plan */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="bauhaus-heading text-2xl text-bauhaus-charcoal mb-2">
            Free Plan
          </h3>
          <p className="bauhaus-body text-bauhaus-charcoal/90">
            Get started with our basic listing
          </p>
        </div>
        <stripe-pricing-table
          pricing-table-id="prctbl_1SDbLwBqTvwy9ZuSXKTXVb7E"
          publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
        />
      </div>

      {/* Paid Plans */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="bauhaus-heading text-2xl text-bauhaus-charcoal mb-2">
            Paid Plans
          </h3>
          <p className="bauhaus-body text-bauhaus-charcoal/90">
            Upgrade for enhanced visibility and features
          </p>
        </div>
        <stripe-pricing-table
          pricing-table-id="prctbl_1SCpyNBqTvwy9ZuSNiSGY03P"
          publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
        />
      </div>

      {/* Founding Vendor Deals */}
      <div className="text-center">
        <h3 className="bauhaus-heading text-2xl text-paper mb-2">
          Founding Vendor Deals
        </h3>
        <p className="bauhaus-body text-paper/90 mb-8">
          Limited time offers for early adopters
        </p>
        <stripe-pricing-table
          pricing-table-id="prctbl_1SCpyNBqTvwy9ZuSNiSGY03P"
          publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
        />
      </div>
    </div>
  );
}
