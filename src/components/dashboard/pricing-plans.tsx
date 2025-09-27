"use client";

import { FreePlanButton } from "@/components/payment/free-plan-button";
import { StripeDirectButton } from "@/components/payment/stripe-direct-button";
import { Skeleton } from "@/components/ui/skeleton";
import { priceConfig } from "@/config/price";
import { PricePlans } from "@/lib/submission";
import { cn } from "@/lib/utils";
import type { ItemInfo, PricePlan } from "@/types/index";
import { CheckIcon, XIcon } from "lucide-react";

interface PricingPlansProps {
  item?: ItemInfo;
}

export function PricingPlans({ item }: PricingPlansProps) {
  // console.log('PricingPlans, item:', item);
  return (
    <section className="flex flex-col items-center text-center w-full mx-auto">
      <div className="grid gap-8 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start max-w-7xl">
        {priceConfig.plans.map((pricePlan) => (
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

interface PricingPlanCardProps {
  item?: ItemInfo;
  pricePlan: PricePlan;
}

const PricingPlanCard = ({ item, pricePlan }: PricingPlanCardProps) => {
  return (
    <div className="relative">
      {isProPlan(pricePlan) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-brand-orange text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </div>
        </div>
      )}
      <div
        className={cn(
          "relative overflow-hidden flex flex-col rounded-xl shadow-sm bg-white",
          isProPlan(pricePlan)
            ? "border-2 border-brand-orange shadow-lg"
            : "border border-gray-200",
        )}
      >
        {/* price plan title and price */}
        <div className="p-6 text-center border-b border-gray-100">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            {pricePlan.title}
          </h3>
          <div className="flex items-baseline justify-center gap-1">
            <div className="text-3xl font-bold text-gray-900">
              ${pricePlan.price}
            </div>
            <div className="text-sm text-gray-500">{pricePlan.priceSuffix}</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{pricePlan.description}</p>
        </div>

        {/* price plan features and limitations */}
        <div className="flex flex-col flex-grow px-6 py-6">
          <div className="flex-grow space-y-3">
            <div className="grid grid-cols-1 gap-3 text-left text-sm">
              {pricePlan.benefits.map((feature) => (
                <div key={feature} className="flex items-start gap-x-3">
                  <CheckIcon className="text-green-600 size-4 shrink-0 mt-0.5" />
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}

              {pricePlan.limitations.map((feature) => (
                <div key={feature} className="flex items-start gap-x-3">
                  <XIcon className="size-4 shrink-0 mt-0.5 text-gray-400" />
                  <p className="text-gray-500">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* action buttons */}
          <div className="mt-8">
            {pricePlan.title === PricePlans.FREE ? (
              <FreePlanButton item={item} className="w-full" />
            ) : pricePlan.title === PricePlans.BASIC ? (
              <StripeDirectButton pricePlan={pricePlan} className="w-full" />
            ) : pricePlan.title === PricePlans.PRO ? (
              <StripeDirectButton pricePlan={pricePlan} className="w-full" />
            ) : pricePlan.title === PricePlans.PREMIUM ? (
              <StripeDirectButton pricePlan={pricePlan} className="w-full" />
            ) : (
              <StripeDirectButton pricePlan={pricePlan} className="w-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function isProPlan(pricePlan: PricePlan) {
  return pricePlan.title === PricePlans.PRO;
}

export function PricingPlansSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[...Array(2)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <PricingPlanCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PricingPlanCardSkeleton() {
  return (
    <div className="relative flex flex-col p-6 rounded-lg justify-between border">
      <div>
        <div className="flex justify-between">
          <Skeleton className="h-12 w-24" /> {/* Plan name */}
          <Skeleton className="h-12 w-24" /> {/* Popular badge */}
        </div>
        {/* <div className="mt-4 flex items-baseline text-zinc-900 dark:text-zinc-50">
          <Skeleton className="h-12 w-20" /> 
          <Skeleton className="ml-1 h-6 w-16" /> 
        </div> */}
      </div>
      <ul className="mt-6 space-y-4">
        {[...Array(6)].map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <li key={index} className="flex">
            {/* <CheckIcon className="h-6 w-6 shrink-0" /> */}
            <Skeleton className="h-8 w-full" /> {/* Feature */}
          </li>
        ))}
      </ul>
      <Skeleton className="mt-8 h-14 w-full" />
    </div>
  );
}
