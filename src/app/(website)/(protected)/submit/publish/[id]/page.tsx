import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
import { PublishNowButton } from "@/components/forms/publish-now-button";
import { SubmitStepper } from "@/components/submit/submit-stepper";
import { Button } from "@/components/ui/button";
import { urlForImageWithSize } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { CalendarDaysIcon, RocketIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PublishPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log('PublishPage, itemId:', id);
  const item = await sanityFetch<ItemFullInfo>({
    query: itemByIdQuery,
    params: { id: id }
  });

  if (!item) {
    console.error("PublishPage, item not found");
    return notFound();
  }
  // console.log('PublishPage, item:', item);

  return (
    <div className="flex flex-col min-h-[calc(100vh-32rem)] justify-center">
      {/* <SubmitStepper initialStep={3} /> */}

      <DashboardSubmitHeader
        title="Submit"
        subtitle="Submit your product to get listed."
      >
        <SubmitStepper initialStep={3} />
      </DashboardSubmitHeader>

      <div className="mt-8 flex-grow flex items-center">
        {/* max-w-6xl mx-auto */}
        <div className="w-full">
          {/* Content section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left column */}
            <div className="md:col-span-1 flex flex-col">
              {/* image */}
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  width={360}
                  height={240}
                  alt={`${item.name}`}
                  title={`${item.name}`}
                  className="rounded-lg border w-full shadow-lg
                        transition-transform duration-300 group-hover:scale-105"
                  src={urlForImageWithSize(item.image, 960, 540)}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="md:col-span-1 flex items-center">
              <div className="flex flex-col w-full space-y-8">
                {/* name and description */}
                <h1 className="text-4xl font-bold text-start">
                  {item.name}
                </h1>
                <p className="text-muted-foreground">
                  {item.description}
                </p>

                {/* action buttons */}
                <div className="flex flex-row gap-4">
                  <div className="group flex-1">
                    <PublishNowButton item={item} />
                  </div>

                  <div className="group flex-1">
                    <Button size="lg" variant="outline" asChild
                      className="group flex-1 w-full rounded-full">
                      <Link href='/dashboard' className="flex items-center justify-center space-x-2">
                        <CalendarDaysIcon className="w-4 h-4
                          transition-transform duration-300 ease-in-out group-hover:scale-125" />
                        <span className="">Publish Later</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
