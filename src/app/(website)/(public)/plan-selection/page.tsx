"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic listing with essential information",
    features: [
      "Business name and description",
      "Contact information",
      "Basic category listing",
      "Standard search visibility",
    ],
    limitations: [
      "No featured placement",
      "Limited customization",
      "No analytics",
    ],
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: "$25",
    period: "month",
    description: "Enhanced listing with priority features",
    features: [
      "Everything in Free",
      "Featured placement in search",
      "Custom logo upload",
      "Photo gallery (up to 10 images)",
      "Priority customer support",
      "Basic analytics",
    ],
    limitations: [],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$50",
    period: "month",
    description: "Premium listing with maximum visibility",
    features: [
      "Everything in Standard",
      "Top placement in search results",
      "Unlimited photo gallery",
      "Video testimonials",
      "Advanced analytics",
      "Priority customer support",
      "Social media integration",
    ],
    limitations: [],
    popular: false,
  },
];

export default function PlanSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = async (planId: string) => {
    if (!listingId) {
      console.error("No listing ID provided");
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);

    if (planId === "free") {
      // For free plan, redirect directly to payment success
      router.push("/payment-successful");
    } else {
      // For paid plans, redirect to Stripe checkout
      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingId,
            planId,
            billingCycle: "monthly",
            successUrl: `${window.location.origin}/payment-successful`,
            cancelUrl: `${window.location.origin}/plan-selection?listingId=${listingId}`,
          }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
          window.location.href = data.url;
        } else {
          console.error("Failed to create checkout session:", data.error);
          setIsProcessing(false);
          setSelectedPlan("");
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
        setIsProcessing(false);
        setSelectedPlan("");
      }
    }
  };

  if (!listingId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error: No Listing ID
          </h1>
          <p className="text-muted-foreground mb-8">
            This page requires a listing ID to continue.
          </p>
          <Button asChild>
            <Link href="/submit">Start Over</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the plan that best fits your business needs. You can always
          upgrade later.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? "border-brand-orange shadow-lg scale-105"
                  : "border-gray-200"
              } ${
                selectedPlan === plan.id ? "ring-2 ring-brand-blue" : ""
              } transition-all duration-200`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-orange text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">
                    /{plan.period === "forever" ? "forever" : plan.period}
                  </span>
                </div>
                <CardDescription className="mt-4">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-900">
                    What's included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-900">
                      Limitations:
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start gap-2">
                          <XIcon className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={isProcessing}
                  className={`w-full ${
                    plan.popular
                      ? "bg-brand-orange hover:bg-brand-orange/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {isProcessing && selectedPlan === plan.id
                    ? "Processing..."
                    : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Need help choosing?{" "}
            <Link href="/contact" className="text-brand-blue hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
