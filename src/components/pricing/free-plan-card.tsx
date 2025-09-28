"use client";

import { FreePlanButton } from "@/components/payment/free-plan-button";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";

export function FreePlanCard() {
  const freePlan = {
    title: "Free",
    description: "Basic listing to get started",
    benefits: [
      "Public listing in our directory",
      "Searchable by parents",
      "Basic contact information",
      "Reviewed and approved within 72 hours",
      "Standard customer support",
    ],
    limitations: [
      "No featured placement",
      "No logo display",
      "Limited visibility",
    ],
    price: 0,
    priceSuffix: "/forever",
  };

  return (
    <div className="relative overflow-hidden flex flex-col rounded-xl shadow-sm bg-white border border-gray-200">
      {/* Plan header */}
      <div className="p-6 text-center border-b border-gray-100">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {freePlan.title}
        </h3>
        <div className="flex items-baseline justify-center gap-1">
          <div className="text-3xl font-bold text-gray-900">
            ${freePlan.price}
          </div>
          <div className="text-sm text-gray-500">{freePlan.priceSuffix}</div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{freePlan.description}</p>
      </div>

      {/* Features and limitations */}
      <div className="flex flex-col flex-grow px-6 py-6">
        <div className="flex-grow space-y-3">
          <div className="grid grid-cols-1 gap-3 text-left text-sm">
            {freePlan.benefits.map((feature) => (
              <div key={feature} className="flex items-start gap-x-3">
                <CheckIcon className="text-green-600 size-4 shrink-0 mt-0.5" />
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}

            {freePlan.limitations.map((feature) => (
              <div key={feature} className="flex items-start gap-x-3">
                <XIcon className="size-4 shrink-0 mt-0.5 text-gray-400" />
                <p className="text-gray-500">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="mt-8">
          <Button asChild className="w-full bg-brand-orange hover:bg-brand-orange-dark">
            <Link href="/submit">
              Get Started Free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
