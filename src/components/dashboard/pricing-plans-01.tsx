"use client";

import { ProPlanButton } from "@/components/forms/pro-plan-button";
import { Icons } from "@/components/shared/icons";
import { PRICE_PLANS } from "@/config/pricing-plan";
import { cn } from "@/lib/utils";
import { ItemFullInfo, PricePlan } from "@/types/index";
import { useState } from 'react';
import { FreePlanButton } from "@/components/forms/free-plan-button";

/**
 * PricingPlans
 */
interface PricingPlansProps {
  item: ItemFullInfo;
}

export function PricingPlans({ item }: PricingPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <section className="flex flex-col items-center text-center">
      <div className="grid gap-8 py-4 lg:grid-cols-2">
        {PRICE_PLANS && PRICE_PLANS.length > 0 &&
          PRICE_PLANS.map((pricePlan) => (
            <PricingPlanCard
              key={pricePlan.title}
              item={item}
              pricePlan={pricePlan}
              isSelected={selectedPlan === pricePlan.title}
              onSelect={() => setSelectedPlan(pricePlan.title)}
            />
          ))
        }
      </div>
    </section>
  );
}

/**
 * PricingPlanCard
 */
interface PricingPlanCardProps {
  item: ItemFullInfo;
  pricePlan: PricePlan;
  isSelected: boolean;
  onSelect: () => void;
}

const PricingPlanCard = ({ item, pricePlan, isSelected, onSelect }: PricingPlanCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm",
        // isSelected ? "border-2 border-purple-500" : "border-2",
        pricePlan.title === "Pro" ? "-m-0.5 border-2 border-purple-500" : "",
      )}
      // onClick={onSelect}
    >
      {/* price plan title and price */}
      <div className="min-h-[110px] items-start space-y-4 bg-muted/50 p-6 border-b">
        <span className="flex text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {pricePlan.title}
        </span>

        <div className="flex text-3xl font-semibold text-purple-500">
          <span>${' '}{pricePlan.price}</span>
        </div>
      </div>

      {/* price plan features and limitations */}
      <div className="flex flex-col h-full justify-between gap-16 p-6">
        <ul className="space-y-2 text-left text-sm font-medium leading-normal">
          {
            pricePlan.benefits.length > 0 &&
            pricePlan.benefits.map((feature) => (
              <li key={feature}
                className="flex items-start gap-x-4">
                <CheckIcon className="size-5 shrink-0 text-purple-500" />
                <p>{feature}</p>
              </li>
            ))
          }

          {
            pricePlan.limitations.length > 0 &&
            pricePlan.limitations.map((feature) => (
              <li key={feature}
                className="flex items-start gap-x-4 text-muted-foreground">
                <CloseIcon className="size-5 shrink-0" />
                <p>{feature}</p>
              </li>
            ))
          }
        </ul>

        {/* action buttons */}
        {
          pricePlan.title === "Free" ? (
            <FreePlanButton
              item={item}
            />
          ) : (
            <ProPlanButton
              item={item}
              pricePlan={pricePlan}
            />
          )
        }
      </div>
    </div>
  );
};
