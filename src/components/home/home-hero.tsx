import { Icons } from "@/components/icons/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import HomeSearchBox from "./home-search-box";

export default function HomeHero() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-5xl flex flex-col items-center text-center gap-8">
        <Link href="https://x.com/MkdirsHQ" target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "px-4 rounded-full",
          )}
        >
          <span className="mr-2">🎉</span>
          <span className="">Introducing&nbsp;</span> Mkdirs on
          <Icons.twitter className="ml-2 size-4" />
        </Link>

        {/* maybe font-sourceSans is better */}
        <h1 className="max-w-5xl font-bold text-balance text-3xl sm:text-4xl md:text-5xl">
          The Ultimate {" "}
          <span className="text-gradient_indigo-purple font-bold">
            Directory Website Template
          </span>
        </h1>

        <p className="max-w-4xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          This is a demo directory website built with <span className="font-bold">Mkdirs</span>, 
          you can make any trending and profitable directory website with <span className="font-bold">Mkdirs</span> in minutes.
        </p>

        <div className="w-full">
          <HomeSearchBox />
        </div>
      </div>
    </div>
  );
}
