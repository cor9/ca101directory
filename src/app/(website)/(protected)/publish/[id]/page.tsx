import { PublishButton } from "@/components/forms/publish-button";
import { SubmitStepper } from "@/components/submit/submit-stepper";
import { Button } from "@/components/ui/button";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import { ItemFullInfo } from "@/types";
import { CalendarDaysIcon, GlobeIcon, HeartIcon, RocketIcon } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlForImageWithSize } from "@/lib/utils";
import Link from "next/link";

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
    <>
      {/* <DashboardHeader
        title="Publish"
        subtitle="Select a price plan."
      /> */}

      <SubmitStepper initialStep={3} />

      <div className="flex flex-col mt-8 px-6 gap-8">
        {/* Content section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left column */}
          <div className="lg:col-span-1 flex flex-col">
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
          <div className="lg:col-span-1 flex items-center">
            <div className="flex flex-col w-full space-y-8">
              {/* name and description */}
              <h1 className="text-4xl font-bold text-center">
                {item.name}
              </h1>
              <p className="text-muted-foreground">
                {item.description}
              </p>

              {/* action buttons */}
              <div className="flex flex-row gap-4">
                <Button size="lg" variant="default" asChild className="group flex-1">
                  <Link href={item.link} className="flex items-center justify-center space-x-2">
                    <RocketIcon className="w-4 h-4
                        transition-all duration-300 ease-in-out 
                        group-hover:scale-125 " />
                    <span>Publish Now</span>
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild className="group flex-1">
                  <Link href={item.link} className="flex items-center justify-center space-x-2">
                    <CalendarDaysIcon className="w-4 h-4
                        transition-transform duration-300 ease-in-out 
                        group-hover:scale-125 " />
                    <span className="">Publish Later</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
