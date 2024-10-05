import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="mt-8 pb-16">
      <div className="w-full flex flex-col gap-16">
        <section className="w-full flex flex-col gap-8 justify-center">
          {/* Header Section */}
          <HeaderSection
            labelAs="h1"
            label="Pricing"
            titleAs="h2"
            title="Choose a pricing plan"
          />

          {/* Pricing Plans */}
          <div className="w-full max-w-4xl mx-auto mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, index) => (
                <PricingPlanCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="w-full flex flex-col gap-8 justify-center">
          {/* FAQ Header */}
          <HeaderSection
            label="FAQ"
            titleAs="h2"
            title="Frequently Asked Questions"
          />

          {/* FAQ Items */}
          <div className="w-full max-w-4xl mx-auto">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="border-b py-4">
                <Skeleton className="h-6 w-1/2" />
                {/* <Skeleton className="h-4 w-full" /> */}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  )
}

function PricingPlanCardSkeleton() {
  return (
    <div className="relative flex flex-col p-6 rounded-lg justify-between border">
      <div>
        <div className="flex justify-between">
          <Skeleton className="h-12 w-24" /> {/* Plan name */}
          <Skeleton className="h-12 w-24" /> {/* Popular badge */}
        </div>
        {/* <div className="mt-4 flex items-baseline text-zinc-900 dark:text-zinc-50">
          <Skeleton className="h-10 w-20" /> 
          <Skeleton className="ml-1 h-6 w-16" /> 
        </div> */}
      </div>
      <ul className="mt-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <li key={i} className="flex">
            {/* <CheckIcon className="h-6 w-6 shrink-0" /> */}
            <Skeleton className="h-6 w-full" /> {/* Feature */}
          </li>
        ))}
      </ul>
      {/* <Button className="mt-8" size="lg" disabled>
        Get started
      </Button> */}
      <Skeleton className="mt-8 h-14 w-full" />
    </div>
  );
}