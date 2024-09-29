"use client";

import { defaultSort, SortFilterItem } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { ListChecksIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import MobileFilterItem from "./mobile-filter-item";

export type SortListMobileProps = {
  sortList: SortFilterItem[];
};

export function SortListMobile({ sortList }: SortListMobileProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState('');

  useEffect(() => {
    const activeItem = sortList.find((item) => searchParams.get('sort') === item.slug);
    if (activeItem) {
      setActive(activeItem.slug);
    }
  }, [pathname, sortList, searchParams]);

  const closeDrawer = () => setOpen(false);

  const generateUrl = (slug: string) => {
    const q = searchParams.get('q');
    return createUrl(
      pathname,
      new URLSearchParams({
        ...(q && { q }),
        ...(slug && { sort: slug }),
      })
    );
  };

  return (
    <>
      {/* Mobile View */}
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="w-full flex items-center p-3 gap-x-2 border-y text-foreground/90"
        >
          <ListChecksIcon className="size-5" />
          <p className="text-sm font-medium">
            {sortList.find((item) => item.slug === active)?.title || defaultSort.title}
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
            <ul role="list" className="w-full mb-14 p-3 text-muted-foreground">
              {sortList.map((item) => (
                <MobileFilterItem
                  key={item.slug}
                  title={item.title}
                  href={generateUrl(item.slug)}
                  active={active === item.slug}
                  clickAction={closeDrawer}
                />
              ))}
            </ul>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}