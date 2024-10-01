import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Logo } from "../logo";
import { Icons } from "../shared/icons";

export function FooterInfo() {

  return (
    <>
      <div className="space-y-4">

        <div className="items-center space-x-2 flex">
          <Logo />

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
              <Icons.twitter className="size-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="size-8 px-0">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.github className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

    </>
  );
}
