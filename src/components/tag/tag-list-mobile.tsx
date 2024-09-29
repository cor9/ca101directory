"use client";

import { TagListQueryResult } from '@/sanity.types';
import { LayoutListIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Drawer } from "vaul";
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
    <>
      {/* Mobile View */}
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="w-full flex items-center p-3 gap-x-2 border-y text-foreground/90"
        >
          <LayoutListIcon className="size-5" />
          <p className="text-sm font-medium">
            {tag?.name ? `Tags (${tag?.name})` : 'All Tags'}
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
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
