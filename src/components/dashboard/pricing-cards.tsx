"use client";

import { LoginButton } from "@/components/auth/login-button";
import { Icons } from "@/components/shared/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { PRICE_PLANS } from "@/config/pricing";
import { cn } from "@/lib/utils";
import { ItemFullInfo, PricePlan, UserPricePlan } from "@/types/index";
import Link from "next/link";
import { PayButton } from "../forms/pay-button";
import { currentUser } from "@/lib/auth";
import { useCurrentUser } from "@/hooks/use-current-user";

interface PricingCardsProps {
  userId?: string;
  item: ItemFullInfo;
}

export function PricingCards({ item }: PricingCardsProps) {
  const user = useCurrentUser();
  if (!user || !user?.id) {
    return null;
  }
  const userId = user.id;

  return (
    <section className="flex flex-col items-center text-center">
      <div className="grid gap-8 py-4 lg:grid-cols-2">
        {
          PRICE_PLANS &&
          PRICE_PLANS.length > 0 &&
          PRICE_PLANS.map((pricePlan) => (
            <PricingCard key={pricePlan.title}
              userId={userId}
              item={item}
              pricePlan={pricePlan}
            />
          ))
        }
      </div>
    </section>
  );
}

interface PricingCardProps {
  userId?: string;
  item: ItemFullInfo;
  pricePlan?: PricePlan;
}

const PricingCard = ({ userId, item, pricePlan }: PricingCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm",
        pricePlan.title.toLocaleLowerCase() === "pro"
          ? "-m-0.5 border-2 border-purple-400"
          : "",
      )}
      key={pricePlan.title}
    >

      {/* price plan title and price */}
      <div className="min-h-[120px] items-start space-y-4 bg-muted/50 p-6 border-b">
        <span className="flex text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {pricePlan.title}
        </span>

        <div className="flex items-center">
          <div className="flex text-3xl font-semibold text-purple-500">
            <span>${' '}{pricePlan.price}</span>
          </div>
        </div>
      </div>

      {/* price plan features and limitations */}
      <div className="flex flex-col h-full justify-between gap-16 p-6">
        <ul className="space-y-2 text-left text-sm font-medium leading-normal">
          {
            pricePlan.benefits.length > 0 &&
            pricePlan.benefits.map((feature) => (
              <li key={feature} className="flex items-start gap-x-4">
                <Icons.check className="size-5 shrink-0 text-purple-500" />
                <p>{feature}</p>
              </li>
            ))
          }

          {
            pricePlan.limitations.length > 0 &&
            pricePlan.limitations.map((feature) => (
              <li key={feature}
                className="flex items-start gap-x-4 text-muted-foreground">
                <Icons.close className="size-5 shrink-0" />
                <p>{feature}</p>
              </li>
            ))
          }
        </ul>

        {/* action buttons */}
        {userId && pricePlan ? (
          pricePlan.title === "Free" ? (
            <Link
              href="/submit"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full rounded-full",
              )}
            >
              Submit to waiting queue
            </Link>
          ) : (
            <>
              <PayButton
                item={item}
                pricePlan={pricePlan}
              />
            </>
          )
        ) : (
          <LoginButton mode="modal" asChild>
            <Button
              variant={
                pricePlan.title.toLocaleLowerCase() === "pro"
                  ? "default"
                  : "outline"
              }
              className="rounded-full"
            >
              Sign in
            </Button>
          </LoginButton>
        )}
      </div>
    </div>
  );
};
