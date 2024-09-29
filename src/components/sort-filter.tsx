"use client";

import { SortFilterItem } from "@/lib/constants";
import { SortListDesktop } from "./sort-list-desktop";
import { SortListMobile } from "./sort-list-mobile";

export type SortFilterProps = {
  sortList: SortFilterItem[];
};

export function SortFilter({ sortList }: SortFilterProps) {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block md:w-[200px]">
        <SortListDesktop sortList={sortList} />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <SortListMobile sortList={sortList} />
      </div>
    </>
  );
}