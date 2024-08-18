"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn, searchDocs } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { FileIcon } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useCommandDialog } from "@/hooks/command-dialog-context";

export function DocsSearchCommand() {
  // const { open, setOpen } = useCommandDialog();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery] = useDebounce(query, 300); // 300ms debounce
  const [results, setResults] = React.useState([]);
  const router = useRouter();
  const pathname = usePathname();

  const resetState = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  React.useEffect(() => {
    resetState();
  }, [pathname, resetState]);

  React.useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      return;
    }
    console.log("Searching docs for:", debouncedQuery);
    const searchResults = searchDocs(debouncedQuery);
    console.log("Search results:", searchResults);
    setResults(searchResults);
  }, [debouncedQuery]);

  React.useEffect(() => {
    console.log(`command dialog state update, open: ${open}`);
  }, [open]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        console.log(`command key pressed, key: ${e.key}, open: ${open}`);
        setOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [])

  const runCommand = React.useCallback((href: string) => {
    console.log("run command, href:", href);
    resetState();
    router.push(href);
  }, [router, pathname, resetState]);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-md bg-muted/50 text-xs font-normal text-muted-foreground shadow-none sm:pr-12 md:w-72",
        )}
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">
          Search docs...
        </span>
        <kbd className="hidden pointer-events-none absolute right-[0.3rem] top-[0.45rem] h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search docs..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {
            results.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )
          }
          {
            results.length > 0 && (
              <CommandGroup heading={`Results (${results.length})`}>
                {results.map((item, index) => (
                  <CommandItem
                    key={item.href || index}
                    onSelect={() => runCommand(item.href)}
                  >
                    <FileIcon className="mr-2 size-5" />
                    {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          }
        </CommandList>
      </CommandDialog>
    </>
  );
}