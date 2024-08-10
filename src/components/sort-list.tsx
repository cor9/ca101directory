"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortFilterItem } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { Check, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";

export type SortListProps = {
  sortList: SortFilterItem[];
};

export function SortList({ sortList }: SortListProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const onSelectChange = (value: string) => {
    setActive(value);
    const href = generateUrl(value);
    router.push(href);
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block w-full py-4">
        <Select onValueChange={onSelectChange} value={active}>
          <SelectTrigger className="w-[150px] h-8 text-sm">
            <SelectValue placeholder="Sort by Time" />
          </SelectTrigger>
          <SelectContent className="text-sm">
            {sortList.map((item) => (
              <SelectItem key={item.slug} value={item.slug}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile View */}
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="md:hidden flex w-full p-3 items-center border-y text-foreground/90"
        >
          <ListChecks className="size-[18px]" />
          <p className="ml-2.5 text-sm font-medium">
            {sortList.find((item) => item.slug === active)?.title || 'Sort by Time'}
          </p>
        </Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
        <Drawer.Portal>
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>
            <ul role="list" className="w-full mb-14 p-3 text-muted-foreground">
              {sortList.map((item) => (
                <Link key={item.slug} href={generateUrl(item.slug)} onClick={closeDrawer}>
                  <li className="rounded-lg text-foreground hover:bg-muted">
                    <div className="flex items-center justify-between px-3 py-2 text-sm">
                      <span>{item.title}</span>
                      {active === item.slug && <Check className="size-4" />}
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}