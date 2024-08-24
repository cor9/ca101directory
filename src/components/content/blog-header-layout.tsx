"use client";

import { BLOG_CATEGORIES } from "@/config/blog";
import { Check, List } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Drawer } from "vaul";
import MaxWidthWrapper from "../shared/max-width-wrapper";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function BlogHeaderLayout() {
  const { slug } = useParams() as { slug?: string };
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleValueChange = (value: string) => {
    if (value === "all") {
      router.push("/blog");
    } else {
      router.push(`/blog/category/${value}`);
    }
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <MaxWidthWrapper className="hidden mt-8 md:flex md:pb-8">
        <ToggleGroup variant="outline" type="single"
          defaultValue={"all"} value={slug} onValueChange={handleValueChange}>
          {BLOG_CATEGORIES.map((category) => (
            <ToggleGroupItem key={category.slug} value={category.slug}
              aria-label={category.title}>
              <span>{category.title}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </MaxWidthWrapper>

      {/* show Drawer in mobile, no MaxWidthWrapper */}
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="my-8 flex w-screen items-center border-y p-3 text-foreground/90 md:hidden"
        >
          <List className="size-[18px]" />
          <p className="ml-2.5 text-sm font-medium">
            {slug ? BLOG_CATEGORIES.find((category) => category.slug === slug)?.title :
              BLOG_CATEGORIES.find((category) => category.slug === "all")?.title}
          </p>
        </Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={closeDrawer} />
        <Drawer.Portal>
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>
            <ul role="list" className="mb-14 w-full p-3 text-muted-foreground">
              {BLOG_CATEGORIES.map((category) => (
                <Link key={category.slug} onClick={closeDrawer}
                  href={category.slug === "all" ? "/blog" : `/blog/category/${category.slug}`}>
                  <li className="rounded-lg text-foreground hover:bg-muted">
                    <div className="flex items-center justify-between px-3 py-2 text-sm">
                      <span>{category.title}</span>
                      {(category.slug === slug || (slug === undefined && category.slug === "all")) && <Check className="size-4" />}
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
