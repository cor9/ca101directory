"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortFilterItem } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBox from "./search-box";

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
  selectedTag?: string;
  selectedCategory?: string;
  selectedSort?: string;
}

interface TagFilterItem {
  slug: string;
  name: string;
}

interface CategoryFilterItem {
  slug: string;
  name: string;
}

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
}

export function SearchFilterClient({
  tagList,
  categoryList,
  sortList,
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedTag = searchParams.get("tag");
  const selectedSort = searchParams.get("sort");

  const handleFilterChange = (type: string, value: string) => {
    console.log(`Filter changed: ${type} -> ${value}`);
    const newParams = new URLSearchParams(window.location.search);
    if (value === null) {
      newParams.delete(type);
    } else {
      newParams.set(type, value);
    }
    router.push(`/search?${newParams.toString()}`);
  };

  const handleResetFilters = () => {
    router.push("/search");
  };

  return (
    <div className="grid md:grid-cols-[1fr_1fr_1fr_1fr_0.5fr] gap-2 z-10 items-center">
      <SearchBox />

      <Select
        value={selectedCategory || null}
        onValueChange={(value) => handleFilterChange("category", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>All</SelectItem>
          {categoryList.map((item) => (
            <SelectItem key={item.slug} value={item.slug}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedTag || null}
        onValueChange={(value) => handleFilterChange("tag", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>All</SelectItem>
          {tagList.map((item) => (
            <SelectItem key={item.slug} value={item.slug}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedSort || null}
        onValueChange={(value) => handleFilterChange("sort", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort by Time" />
        </SelectTrigger>
        <SelectContent>
          {sortList.map((item) => (
            <SelectItem key={item.slug} value={item.slug}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleResetFilters}>
        Reset
      </Button>
    </div>
  );
}
