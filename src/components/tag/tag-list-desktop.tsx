"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TagListQueryResult } from '@/sanity.types';
import { useParams } from "next/navigation";
import DesktopFilterItem from "../desktop-filter-item";

export type TagListDesktopProps = {
  tagList: TagListQueryResult;
};

export function TagListDesktop({ tagList }: TagListDesktopProps) {
  const { slug } = useParams() as { slug?: string };

  return (
    <section>
      {/* Desktop View */}
      <ScrollArea className="hidden md:flex w-full pb-4">
        <ul role="list" className="w-full flex flex-1 gap-x-2" >
          <DesktopFilterItem
            title="All"
            href="/tag"
            active={!slug}
          />

          {tagList.map((item) => (
            <DesktopFilterItem
              key={item.slug.current}
              title={item.name}
              href={`/tag/${item.slug.current}`}
              active={item.slug.current === slug}
            />
          ))}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
