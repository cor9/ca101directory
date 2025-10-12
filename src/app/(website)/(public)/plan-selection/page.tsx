"use client";

import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useState } from "react";

export default function PlanSelectionPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");

  if (!listingId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground">No listing ID provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Select the perfect plan to activate your listing.
        </p>
        <p className="text-sm text-muted-foreground">
          For listing ID: <strong>{listingId}</strong>
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Script
          src="https://js.stripe.com/v3/pricing-table.js"
          strategy="afterInteractive"
        />

        {/* Free Plan - No Payment Required */}
        <div className="border-2 border-gray-300 rounded-lg p-8 bg-white shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Free Listing</h3>
          <p className="text-lg mb-2 font-semibold text-green-600">$0 / forever</p>
          <p className="text-sm text-gray-600 mb-6">
            Get started with a basic listing - no credit card required!
          </p>
          <ul className="text-left mb-6 space-y-2 text-sm text-gray-700">
            <li>✓ Basic listing information</li>
            <li>✓ Contact details displayed</li>
            <li>✓ Searchable in directory</li>
            <li>✓ Quality review process</li>
          </ul>
          <a
            href={`/submit?plan=Free&listingId=${listingId}`}
            className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Continue with Free Plan →
          </a>
        </div>

        {/* Paid Plans */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Paid Plans</h3>
          <stripe-pricing-table
            pricing-table-id="prctbl_1SCpyNBqTvwy9ZuSNiSGY03P"
            publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
            client-reference-id={listingId}
            metadata-listing-id={listingId}
          />
        </div>
      </div>
    </div>
  );
}
