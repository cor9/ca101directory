"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlanSelectionPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const repCode = searchParams.get("rep") || undefined;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgradeToPro = async () => {
    if (!listingId) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&flow=plan_selection&lid=${encodeURIComponent(listingId)}`,
          cancelUrl: window.location.href,
          flow: "plan_selection",
          repCode,
        }),
      });
      const json = await response.json();
      if (response.ok && json?.url) {
        window.location.href = json.url as string;
      } else {
        throw new Error(json?.error || "No checkout URL received");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start checkout");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Log for debugging
    console.log("[Plan Selection] Listing ID:", listingId);
    console.log(
      "[Plan Selection] All search params:",
      Object.fromEntries(searchParams),
    );

    // Check if there's an error parameter
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      console.error("[Plan Selection] Error from URL:", errorParam);
    }
  }, [listingId, searchParams]);

  if (!listingId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ⚠️ Missing Listing ID
          </h1>
          <p className="text-red-800 mb-4">
            No listing ID was provided. Please try again or contact support.
          </p>
          <a
            href="/submit"
            className="inline-block bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            ← Back to Submit Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Error Banner */}
      {error && (
        <div className="max-w-4xl mx-auto mb-8 bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-2">
                Payment Error
              </h3>
              <p className="text-red-800 mb-4">{error}</p>
              <p className="text-sm text-red-700">
                If this issue persists, please contact support at{" "}
                <a
                  href="mailto:support@childactor101.com"
                  className="underline font-semibold"
                >
                  support@childactor101.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-paper mb-8">
          Select the perfect plan to activate your listing.
        </p>
        <p className="text-sm text-paper">
          For listing ID: <strong>{listingId}</strong>
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Free Plan - No Payment Required */}
        <div className="border-2 border-gray-300 rounded-lg p-8 bg-white shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-paper">Free Listing</h3>
          <p className="text-lg mb-2 font-semibold text-green-600">
            $0 / forever
          </p>
          <p className="text-sm text-paper mb-6">
            Get started with a basic listing - no credit card required!
          </p>
          <ul className="text-left mb-6 space-y-2 text-sm text-paper">
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

        {/* Pro Plan */}
        <div className="border-2 border-primary rounded-lg p-8 bg-white shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-4 text-paper">Pro Listing</h3>
          <p className="text-lg mb-2 font-semibold">$399 / year</p>
          <p className="text-sm text-paper mb-6">
            Featured placement, priority support, advanced analytics, and
            unlimited active event postings.
          </p>
          <button
            type="button"
            onClick={handleUpgradeToPro}
            disabled={isLoading}
            className="inline-block w-full bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? "Redirecting to checkout..." : "Upgrade to Pro →"}
          </button>
        </div>
      </div>
    </div>
  );
}
