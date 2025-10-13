"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for getting started",
    features: [
      "Basic listing information",
      "Contact details displayed",
      "Searchable in directory",
      "Quality review process",
    ],
    limitations: [
      "No profile image",
      "No gallery images",
      "Lower search ranking",
    ],
    popular: false,
    cta: "Get Started Free",
  },
  {
    id: "standard",
    name: "Standard",
    monthlyPrice: 25,
    yearlyPrice: 250,
    description: "Great for small businesses",
    features: [
      "Everything in Free",
      "1 profile image",
      "Better search ranking",
      "Edit anytime",
      "Email support",
    ],
    popular: false,
    cta: "Choose Standard",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 50,
    yearlyPrice: 500,
    description: "Best for growing businesses",
    features: [
      "Everything in Standard",
      "4 gallery images",
      "Priority placement",
      "Social media links",
      "101 Approved Badge eligible",
      "Priority support",
    ],
    popular: true,
    cta: "Choose Pro",
  },
];

export function PlanSelectionCards() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") {
      // Free plan - go to submit form
      router.push("/submit");
    } else {
      // Paid plans - go to submit form (they'll pay after submission)
      router.push("/submit");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
              Save 2 months
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col ${
              plan.popular
                ? "border-4 border-brand-orange shadow-xl"
                : "border-2 border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-orange text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  MOST POPULAR
                </span>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="text-gray-600">
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
              {billingCycle === "yearly" && plan.id !== "free" && (
                <p className="text-xs text-green-600 font-semibold">
                  Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}
                </p>
              )}
              <p className="text-sm text-gray-600">{plan.description}</p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className={
                  plan.popular
                    ? "w-full bg-brand-orange hover:bg-brand-orange/90"
                    : "w-full"
                }
                variant={plan.id === "free" ? "outline" : "default"}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600">
          All plans include our quality review process and trusted directory listing.
          <br />
          Need help choosing?{" "}
          <a
            href="mailto:hello@childactor101.com"
            className="text-brand-blue hover:text-brand-blue/80 font-semibold"
          >
            Contact us
          </a>{" "}
          for personalized recommendations.
        </p>
      </div>
    </div>
  );
}

