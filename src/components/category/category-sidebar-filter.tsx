"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// Category groups mapping
const categoryGroups = {
  "Acting Classes & Coaches": [
    "Acting Classes & Coaches",
    "Acting Schools",
    "Acting Camps",
    "Vocal Coaches",
    "Branding Coaches",
    "Theatre Training",
    "Casting Workshops",
    "College Prep Coaches",
  ],
  "Headshot Photographers": ["Headshot Photographers", "Photobooths"],
  "Reel Creators": ["Demo Reel Creators", "Reels Editors"],
  "Self Tape Studios": ["Self-Tape Studios"],
  Publicists: ["Publicists", "Social Media Consultants"],
};

interface CategorySidebarFilterProps {
  className?: string;
}

export function CategorySidebarFilter({
  className,
}: CategorySidebarFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Acting Classes & Coaches": true,
    "Headshot Photographers": false,
    "Reel Creators": false,
    "Self Tape Studios": false,
    Publicists: false,
  });

  const handleCategorySelect = (category: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (category === "All Categories") {
      newParams.delete("category");
    } else {
      newParams.set("category", category.toLowerCase().replace(/\s+/g, "-"));
    }
    newParams.delete("page");
    router.push(`/category?${newParams.toString()}`);
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const isCategoryActive = (category: string) => {
    if (category === "All Categories") return !currentCategory;
    return currentCategory === category.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className={cn("hidden md:block w-[250px] flex-shrink-0", className)}>
      <div className="sticky top-24">
        <div className="hidden md:flex border rounded-lg p-4">
          <ul className="flex flex-col gap-y-2 w-full">
            {/* All Categories */}
            <div className="w-full space-y-2">
              <Button
                variant={
                  isCategoryActive("All Categories") ? "default" : "ghost"
                }
                className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md w-full px-3 py-3 justify-between"
                onClick={() => handleCategorySelect("All Categories")}
              >
                <span>All Categories</span>
              </Button>
            </div>

            {/* Category Groups */}
            {Object.entries(categoryGroups).map(([groupName, categories]) => (
              <Collapsible
                key={groupName}
                open={openGroups[groupName]}
                onOpenChange={() => toggleGroup(groupName)}
                className="w-full space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md w-full px-3 py-3 justify-between"
                  >
                    <span>{groupName}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openGroups[groupName] && "rotate-180",
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={isCategoryActive(category) ? "default" : "ghost"}
                      className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-8 rounded-md w-full px-3 py-2 justify-start ml-4"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <span>{category}</span>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
