import Link from "next/link";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Sparkles } from "lucide-react";
import { Logo } from "../logo";

export function FooterInfo() {

  return (
    <section>
      <div className="space-y-4">

        <div className="items-center space-x-2 flex">
          <Logo />
          {/* <Sparkles /> */}

          <span className="text-xl font-bold">
            {siteConfig.name}
          </span>
        </div>

        <p className="text-muted-foreground text-base p4-4 md:pr-12">
          {siteConfig.slogan}
        </p>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="size-8 px-0">
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.twitter className="size-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="size-8 px-0">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.gitHub className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

    </section>
  );
}
