"use client";

import { Drawer, DrawerContent, DrawerOverlay, DrawerPortal, DrawerTrigger } from '@/components/ui/drawer';
import { TagListQueryResult } from '@/sanity.types';
import { LayoutListIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import MobileFilterItem from "../mobile-filter-item";

export type TagListMobileProps = {
  tagList: TagListQueryResult;
};

export function TagListMobile({ tagList }: TagListMobileProps) {
  const [open, setOpen] = useState(false);
  const { slug } = useParams() as { slug?: string };
  const tag = tagList.find((tag) => tag.slug.current === slug);

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open} onClose={closeDrawer}>
      <DrawerTrigger
        onClick={() => setOpen(true)}
        className="flex items-center w-full p-3 gap-x-2 border-y text-foreground/90"
      >
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-2">
            <LayoutListIcon className="size-5" />
            <span className="text-sm">
              Tag
            </span>
          </div>
          <span className="text-sm">
            {tag?.name ? `${tag?.name}` : 'All'}
          </span>
        </div>
      </DrawerTrigger>
      <DrawerOverlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={closeDrawer}
      />
      <DrawerPortal>
        <DrawerContent className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background">
          <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
            <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
          </div>
          <ul role="list" className="mb-14 w-full p-3 text-muted-foreground">
            <MobileFilterItem
              title="All"
              href="/tag"
              active={!slug}
              clickAction={closeDrawer}
            />

            {tagList.map((item) => (
              <MobileFilterItem
                key={item.slug.current}
                title={item.name}
                href={`/tag/${item.slug.current}`}
                active={item.slug.current === slug}
                clickAction={closeDrawer}
              />
            ))}
          </ul>
        </DrawerContent>
        <DrawerOverlay />
      </DrawerPortal>
    </Drawer>
  );
}
