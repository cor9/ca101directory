"use client";

import { BlogCategoryListQueryResult } from '@/sanity.types';
import { Check, LayoutList } from "lucide-react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { useState } from "react";
import { Drawer } from "vaul";

export type BlogCategoryListMobileProps = {
  categoryList: BlogCategoryListQueryResult;
};

export function BlogCategoryListMobile({ categoryList }: BlogCategoryListMobileProps) {
  const [open, setOpen] = useState(false);
  const { slug } = useParams() as { slug?: string };
  const selectedCategory = categoryList.find((category) => category.slug.current === slug);

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Mobile View */}
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="md:hidden flex w-full p-4 items-center border-y text-foreground/90"
        >
          <div className="flex items-center gap-4 justify-between w-full">
            <div className="flex items-center gap-2">
              <LayoutList className="size-4" />
              <span className="text-sm font-medium">
                Category
              </span>
            </div>
            <span className="text-sm font-semibold">
              {selectedCategory?.name ? `${selectedCategory?.name}` : 'All'}
            </span>
          </div>
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
                href="/blog"
                active={!slug}
                clickAction={closeDrawer}
              />

              {categoryList.map((item) => (
                <MobileLink
                  key={item.slug.current}
                  title={item.name}
                  href={`/blog/category/${item.slug.current}`}
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
