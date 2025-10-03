"use client";

import Script from "next/script";
import { useSearchParams } from "next/navigation";
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

        {/* Free Plan */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Free Plan</h3>
          <stripe-pricing-table
            pricing-table-id="prctbl_1SDbLwBqTvwy9ZuSXKTXVb7E"
            publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
            client-reference-id={listingId}
            metadata-listing-id={listingId}
          />
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