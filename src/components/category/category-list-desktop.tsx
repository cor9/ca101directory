"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CategoryListQueryResult } from '@/sanity.types';
import { useParams } from "next/navigation";
import DesktopFilterItem from "../desktop-filter-item";

export type CategoryListDesktopProps = {
  categoryList: CategoryListQueryResult;
};

export function CategoryListDesktop({ categoryList }: CategoryListDesktopProps) {
  const { slug } = useParams() as { slug?: string };

  return (
    <>
      {/* Desktop View */}
      <ScrollArea className="hidden md:flex w-full">
        <ul role="list" className="flex gap-x-2" >
          <DesktopFilterItem
            title="All"
            href="/category"
            active={!slug}
          />

          {categoryList.map((item) => (
            <DesktopFilterItem
              key={item.slug.current}
              title={item.name}
              href={`/category/${item.slug.current}`}
              active={item.slug.current === slug}
            />
          ))}

        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
