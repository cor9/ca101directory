import { Icons } from "@/components/icons/icons";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { FaBrandsGithub } from "../icons/github";
import Container from "../container";

export default function HomeHero() {

  return (
    <div className="space-y-6 py-8">
      <Container className="max-w-5xl flex flex-col items-center gap-4 text-center">
        <Link
          href="https://x.com/MkdirsHQ"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "px-4 rounded-full",
          )}
          target="_blank"
        >
          <span className="mr-2">🎉</span>
          <span className="">Introducing&nbsp;</span> Mkdirs on
          <Icons.twitter className="ml-2 size-4" />
        </Link>

        <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Discover The Best {" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            AI Websites & Tools
          </span>
        </h1>

        <p
          className="max-w-3xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Thousands of AI websites and tools in the best AI tools directory. AI tools list & GPTs store are updated daily by ChatGPT.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/submit"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 rounded-full",
            )}
          >
            <span>Go Submit</span>
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
