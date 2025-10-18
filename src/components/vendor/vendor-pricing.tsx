import Script from "next/script";

export default function VendorPricing() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="bauhaus-heading text-3xl mb-4 text-paper">
          Pricing Plans
        </h2>
        <p
          className="bauhaus-body text-lg max-w-2xl mx-auto text-paper"
        >
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
          <h3 className="bauhaus-heading text-2xl text-paper mb-2">
            Free Plan
          </h3>
          <p className="bauhaus-body text-paper">
            Get started with our basic listing
          </p>
        </div>

        {/* Custom Free Plan Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white border-2 border-gray-800 rounded-lg p-8 text-center shadow-lg">
            <h4 className="text-2xl font-bold text-black mb-2">Free Plan</h4>
            <div className="mb-4">
              <span className="text-4xl font-bold text-black">$0</span>
              <span className="text-black">/forever</span>
            </div>
            <p className="text-sm text-black mb-6">
              Get started with a basic listing - no credit card required!
            </p>
            <ul className="text-left mb-6 space-y-2 text-sm text-black">
              <li>✓ Basic listing information</li>
              <li>✓ Contact details displayed</li>
              <li>✓ Searchable in directory</li>
              <li>✓ Quality review process</li>
              <li>✗ No images</li>
            </ul>
            <a
              href="/submit"
              className="inline-block w-full bg-gray-800 hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start Free Listing →
            </a>
          </div>
        </div>
      </div>

      {/* Paid Plans */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="bauhaus-heading text-2xl text-paper mb-2">
            Paid Plans
          </h3>
          <p className="bauhaus-body text-paper">
            Upgrade for enhanced visibility and features
          </p>
        </div>
        <stripe-pricing-table
          pricing-table-id="prctbl_1SCpyNBqTvwy9ZuSNiSGY03P"
          publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
        />
      </div>
    </div>
  );
}
