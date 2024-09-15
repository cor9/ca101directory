"use client";

import { LoginButton } from "@/components/auth/login-button";
import { Icons } from "@/components/shared/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { pricingData } from "@/config/pricing";
import { cn } from "@/lib/utils";
import { PricePlan } from "@/types/index";
import Link from "next/link";

interface PricingCardsProps {
  userId?: string;
  pricePlan?: PricePlan;
}

export function PricingCards({ userId, pricePlan }: PricingCardsProps) {

  const PricingCard = ({ offer }: { offer: PricePlan }) => {
    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm",
          offer.title.toLocaleLowerCase() === "starter"
            ? "-m-0.5 border-2 border-purple-400"
            : "",
        )}
        key={offer.title}
      >

        {/* price plan title and price */}
        <div className="min-h-[120px] items-start space-y-4 bg-muted/50 p-6 border-b">
          <span className="flex text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {offer.title}
          </span>

          <div className="flex items-center">
            <div className="flex text-3xl font-semibold text-purple-500">
              <span>${' '}{offer.price}</span>
            </div>
          </div>
        </div>

        {/* price plan features and limitations */}
        <div className="flex flex-col h-full justify-between gap-16 p-6">
          <ul className="space-y-2 text-left text-sm font-medium leading-normal">
            {
              offer.benefits.length > 0 &&
              offer.benefits.map((feature) => (
                <li key={feature} className="flex items-start gap-x-4">
                  <Icons.check className="size-5 shrink-0 text-purple-500" />
                  <p>{feature}</p>
                </li>
              ))
            }

            {
              offer.limitations.length > 0 &&
              offer.limitations.map((feature) => (
                <li key={feature}
                  className="flex items-start gap-x-4 text-muted-foreground">
                  <Icons.close className="size-5 shrink-0" />
                  <p>{feature}</p>
                </li>
              ))
            }
          </ul>

          {userId && pricePlan ? (
            offer.title === "Free" ? (
              <Link
                href="/submit"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "w-full rounded-full",
                )}
              >
                Submit to the review queue
              </Link>
            ) : (
              // <BillingFormButton
              //   year={false}
              //   offer={offer}
              //   subscriptionPlan={subscriptionPlan}
              // />
              <>
                <Link
                  href="/submit"
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                    }),
                    "w-full rounded-full",
                  )}
                >
                  Go to Pay
                </Link>
              </>
            )
          ) : (
            <LoginButton mode="modal" asChild>
              <Button
                variant={
                  offer.title.toLocaleLowerCase() === "pro"
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

  return (
    <section className="flex flex-col items-center text-center">
      <div className="grid gap-8 py-4 lg:grid-cols-3">
        {pricingData.map((offer) => (
          <PricingCard offer={offer} key={offer.title} />
        ))}
      </div>
    </section>
  );
}
