"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortFilterItem } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, ListChecks } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Drawer } from "vaul";

export type SortListProps = {
  sortList: SortFilterItem[];
};

export function SortList({ sortList }: SortListProps) {
  const [open, setOpen] = useState(false);
  const { slug } = useParams() as { slug?: string };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      {/* show in desktop, wrapped in MaxWidthWrapper */}
      <div className="hidden md:block w-full py-4">
        <Select>
          <SelectTrigger className="w-[150px] h-8 text-sm">
            <SelectValue placeholder="Sort by Time" />
          </SelectTrigger>
          <SelectContent className="text-sm">
            {
              sortList.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.title}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      {/* show in mobile, no MaxWidthWrapper */}
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="md:hidden flex w-full p-3 items-center border-y text-foreground/90"
        >
          <ListChecks className="size-[18px]" />
          <p className="ml-2.5 text-sm font-medium">Sort</p>
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

              {/* {categoryList.map((category) => (
                <CategoryLink
                  key={category.slug.current}
                  title={category.name.find((kv) => kv._key === 'en')?.value || 'No Name'}
                  href={`/category/${category.slug.current}`}
                  active={category.slug.current === slug}
                  clickAction={closeDrawer}
                  mobile
                />
              ))} */}
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
    <Link href={href} onClick={clickAction}>
      {mobile ? (
        <li className="rounded-lg text-foreground hover:bg-muted">
          <div className="flex items-center justify-between px-3 py-2 text-sm">
            <span>{title}</span>
            {active && <Check className="size-4" />}
          </div>
        </li>
      ) : (
        <li
          className={cn(
            "-mb-px border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground",
            {
              "border-purple-600 text-foreground dark:border-purple-400/80": active,
            },
          )}
        >
          <div className="px-3 pb-3">{title}</div>
        </li>
      )}
    </Link>
  );
};
