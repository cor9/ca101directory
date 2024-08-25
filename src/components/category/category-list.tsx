"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CategoryListQueryResult } from '@/sanity.types';
import { Check, LayoutList } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Drawer } from "vaul";
import { Button, buttonVariants } from "../ui/button";

export type CategoryListProps = {
  categoryList: CategoryListQueryResult;
};

export function CategoryList({ categoryList }: CategoryListProps) {
  const [open, setOpen] = useState(false);
  const { slug } = useParams() as { slug?: string };
  // get the category with the slug
  const category = categoryList.find((category) => category.slug.current === slug);

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Desktop View */}
      <ScrollArea className="hidden md:flex w-full py-4">
        <ul role="list" className="w-full flex flex-1 gap-x-2" >
          <DesktopLink
            title="All"
            href="/category"
            active={!slug}
          />

          {categoryList.map((item) => (
            <DesktopLink
              key={item.slug.current}
              title={item.name}
              href={`/category/${item.slug.current}`}
              active={item.slug.current === slug}
            />
          ))}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Mobile View */}
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="md:hidden flex w-full p-3 items-center border-y text-foreground/90"
        >
          <LayoutList className="size-[18px]" />
          <p className="ml-2.5 text-sm font-medium">
            Categories {`(${category?.name})`}
          </p>
        </Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={closeDrawer}
        />
        <Drawer.Portal>
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>
            <ul role="list" className="mb-14 w-full p-3 text-muted-foreground">
              <MobileLink
                title="All"
                href="/category"
                active={!slug}
                clickAction={closeDrawer}
              />

              {categoryList.map((item) => (
                <MobileLink
                  key={item.slug.current}
                  title={item.name}
                  href={`/category/${item.slug.current}`}
                  active={item.slug.current === slug}
                  clickAction={closeDrawer}
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

const DesktopLink = ({
  title,
  href,
  active,
  clickAction,
}: {
  title: string;
  href: string;
  active: boolean;
  clickAction?: () => void;
}) => {
  return (
    <>
      {/* show in desktop, wrapped in Link and Button and show as Button */}
      <Button asChild
        variant={active ? 'default' : 'outline'}
        size="sm"
        className='px-3 py-3'>
        <Link href={href}
          prefetch={false}
          onClick={clickAction}>
          <li>
            <div className="">
              <span>{title}</span>
            </div>
          </li>
        </Link>
      </Button>
    </>
  );
};

const MobileLink = ({
  title,
  href,
  active,
  clickAction,
}: {
  title: string;
  href: string;
  active: boolean;
  clickAction?: () => void;
}) => {
  return (
    <>
      {/* shwo in mobile, wrapped in Link and shwo in a Drawer */}
      <Link href={href}
        prefetch={false}
        onClick={clickAction}>
        <li className="rounded-lg text-foreground hover:bg-muted">
          <div className="flex items-center justify-between px-3 py-2 text-sm">
            <span>{title}</span>
            {active && <Check className="size-4" />}
          </div>
        </li>
      </Link>
    </>
  );
};
