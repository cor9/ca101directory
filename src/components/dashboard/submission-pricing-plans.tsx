"use client";

import { FreePlanButton } from "@/components/forms/free-plan-button";
import { ProPlanButton } from "@/components/forms/pro-plan-button";
import { Icons } from "@/components/shared/icons";
import { PRICE_PLANS } from "@/config/pricing-plan";
import { cn } from "@/lib/utils";
import { ItemFullInfo, ItemInfo, PricePlan } from "@/types/index";
import { CheckIcon, XIcon } from "lucide-react";

/**
 * PricingPlans
 */
interface PricingPlansProps {
  item: ItemInfo;
}

export function PricingPlans({ item }: PricingPlansProps) {

  return (
    <section className="flex flex-col items-center text-center w-full mx-auto">
      <div className="grid gap-8 py-4 w-full sm:grid-cols-1 md:grid-cols-2">
        {PRICE_PLANS.map((pricePlan) => (
          <PricingPlanCard
            item={item}
            key={pricePlan.title}
            pricePlan={pricePlan}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * PricingPlanCard
 */
interface PricingPlanCardProps {
  item: ItemInfo;
  pricePlan: PricePlan;
}

const PricingPlanCard = ({ item, pricePlan }: PricingPlanCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border shadow-sm",
        pricePlan.title === "Pro" ? "border-2 border-purple-500" : "border",
      )}
    >
      {/* price plan title and price */}
      <div className="bg-muted/50 p-6 border-b flex flex-row items-center justify-between gap-4">
        <span className="text-base font-bold uppercase tracking-wider text-muted-foreground">
          {pricePlan.title}
        </span>
        <div className="text-4xl font-semibold text-purple-500">
          ${pricePlan.price}
        </div>
      </div>

      {/* price plan features and limitations */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex-grow">
          <div className="grid grid-cols-1 gap-4 text-left text-sm leading-normal mb-4">
            {pricePlan.benefits.map((feature) => (
              <div key={feature} className="flex items-start gap-x-4">
                <CheckIcon className="size-4 shrink-0 text-purple-500 mt-0.5" />
                <p>{feature}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 text-left text-sm leading-normal text-muted-foreground">
            {pricePlan.limitations.map((feature) => (
              <div key={feature} className="flex items-start gap-x-4">
                <XIcon className="size-4 shrink-0 mt-0.5" />
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* action buttons */}
      <div className="mb-12 px-12">
        {pricePlan.title === "Free" ? (
          <FreePlanButton item={item} className="w-full" />
        ) : (
          <ProPlanButton item={item} pricePlan={pricePlan} className="w-full" />
        )}
      </div>

    </div>
  );
};
