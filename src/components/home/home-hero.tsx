import { Icons } from "@/components/icons/icons";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { FaBrandsGithub } from "../icons/github";
import Container from "../container";

export default async function HomeHero() {

  return (
    // sm:py-20 lg:py-20
    <div className="space-y-6 py-8">
      <Container className="max-w-5xl flex flex-col items-center gap-4 text-center">
        <Link
          href="https://www.producthunt.com/"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "px-4 rounded-full",
          )}
          target="_blank"
        >
          <span className="mr-3">🎉</span>
          <span className="hidden md:flex">Launching&nbsp;</span> Mkdirs on
          <Icons.productHunt className="ml-3 size-5" />
        </Link>

        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          Make any web directory{" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            in Minutes
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Start your next directory with Listing, Submission, Newsletter, Auth, Payment and more.
          No database, no storage, no hassle!
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 rounded-full",
            )}
          >
            <span>Go Pricing</span>
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "px-5 rounded-full",
            )}
          >
            <FaBrandsGithub className="mr-2 size-4" />
            <p>
              <span className="hidden sm:inline-block">Star on</span> GitHub{" "}
              {/* <span className="font-semibold">{nFormatter(stars)}</span> */}
            </p>
          </Link>
        </div>
      </Container>
    </div>
  );
}
