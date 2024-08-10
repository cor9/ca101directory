"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CategoryListQueryResult } from '@/sanity.types';
import { Check, LayoutList } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Drawer } from "vaul";
import { Button } from "./ui/button";

export type CategoryListProps = {
  categoryList: CategoryListQueryResult;
};

export function CategoryList({ categoryList }: CategoryListProps) {
  const [open, setOpen] = useState(false);
  const { slug } = useParams() as { slug?: string };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      {/* show in desktop, wrapped in MaxWidthWrapper */}
      <ScrollArea className="hidden md:flex w-full py-4">
        <ul role="list" className="w-full flex flex-1 gap-x-2" >
          <CategoryLink
            title="All"
            href="/category"
            active={!slug}
          />

          {categoryList.map((category) => (
            <CategoryLink
              key={category.slug.current}
              title={category.name.find((kv) => kv._key === 'en')?.value || 'No Name'}
              href={`/category/${category.slug.current}`}
              active={category.slug.current === slug}
            />
          ))}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* show in mobile, no MaxWidthWrapper */}
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="md:hidden flex w-full p-3 items-center border-y text-foreground/90"
        >
          <LayoutList className="size-[18px]" />
          <p className="ml-2.5 text-sm font-medium">Categories</p>
        </Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={closeDrawer} />
        <Drawer.Portal>
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>
            <ul role="list" className="mb-14 w-full p-3 text-muted-foreground">
              <CategoryLink
                title="All"
                href="/category"
                active={!slug}
                clickAction={closeDrawer}
                mobile
              />

              {categoryList.map((category) => (
                <CategoryLink
                  key={category.slug.current}
                  title={category.name.find((kv) => kv._key === 'en')?.value || 'No Name'}
                  href={`/category/${category.slug.current}`}
                  active={category.slug.current === slug}
                  clickAction={closeDrawer}
                  mobile
                />
              ))}
            </ul>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

const CategoryLink = ({
  title,
  href,
  active,
  mobile = false,
  clickAction,
}: {
  title: string;
  href: string;
  active: boolean;
  mobile?: boolean;
  clickAction?: () => void;
}) => {
  return (
    <>
      {/* shwo in mobile, wrapped in Link and shwo in a Drawer */}
      {mobile && (
        <Link href={href} onClick={clickAction}>
          <li className="rounded-lg text-foreground hover:bg-muted">
            <div className="flex items-center justify-between px-3 py-2 text-sm">
              <span>{title}</span>
              {active && <Check className="size-4" />}
            </div>
          </li>
        </Link>
      )}

      {/* show in desktop, wrapped in Link and Button and show as Button */}
      {!mobile && (
        <Button asChild variant="outline" size="sm" className={cn(
          'px-3 py-3',
          active ? 'bg-accent font-medium text-foregroun' : 'text-muted-foreground border-transparent',
        )}>
          <Link href={href} onClick={clickAction}>
            <li>
              <div className="">{title}</div>
            </li>
          </Link>
        </Button>
      )}
    </>
  );
};
