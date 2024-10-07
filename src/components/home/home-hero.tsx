import { Icons } from "@/components/icons/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import HomeSearchBox from "./home-search-box";

export default function HomeHero() {

  return (
    <div className="max-w-5xl flex flex-col items-center text-center gap-8">
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

      <h1 className="max-w-4xl font-sourceSans text-balance text-4xl font-bold sm:text-5xl md:text-6xl">
        Explore the Best {" "}
        <span className="text-gradient_indigo-purple font-extrabold">
          AI Websites & Tools
        </span>
      </h1>

      <p
        className="max-w-3xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
        style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
      >
        This is a demo site for Mkdirs template, so data is not real.
        But what you see is what you get, you can build unlimited directories with Mkdirs.
      </p>

      <div className="w-full">
        <HomeSearchBox />
      </div>
    </div>
  );
}
