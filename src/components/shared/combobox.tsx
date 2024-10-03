"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer } from "vaul";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterItem = {
    value: string | null;
    label: string;
}

export type ResponsiveComboBoxProps = {
    filterItemList: FilterItem[];
    placeholder: string;
    selectedValue: string | null;
    onValueChange: (value: string | null) => void;
}

export function ResponsiveComboBox({ filterItemList, placeholder, selectedValue, onValueChange }: ResponsiveComboBoxProps) {
    const { isDesktop } = useMediaQuery();
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<FilterItem | null>(
        filterItemList.find((item) => item.value === selectedValue) || null
    );

    React.useEffect(() => {
        setSelected(filterItemList.find((item) => item.value === selectedValue) || null);
    }, [selectedValue, filterItemList]);

    const handleSelect = (item: FilterItem | null) => {
        setSelected(item);
        setOpen(false);
        if (item) {
            onValueChange(item.value);
        }
    };

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between"
                    >
                        {selected ? (
                            <div>{selected.label}</div>
                        ) : (
                            <div>{placeholder}</div>
                        )}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                    <FilterList
                        filterItemList={filterItemList}
                        selectedValue={selectedValue}
                        setOpen={setOpen}
                        onSelect={handleSelect}
                    />
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <Button variant="outline" className="justify-start">
                    {selected ? (
                        <div>{selected.label}</div>
                    ) : (
                        <div>{placeholder}</div>
                    )}
                </Button>
            </Drawer.Trigger>
            <Drawer.Content>
                <div className="mt-4 border-t">
                    <FilterList
                        filterItemList={filterItemList}
                        selectedValue={selectedValue}
                        setOpen={setOpen}
                        onSelect={handleSelect}
                    />
                </div>
            </Drawer.Content>
        </Drawer.Root>
    )
}

function FilterList({
    filterItemList,
    selectedValue,
    setOpen,
    onSelect,
}: {
    filterItemList: FilterItem[];
    selectedValue: string;
    setOpen: (open: boolean) => void
    onSelect: (item: FilterItem | null) => void
}) {
    return (
        <Command>
            <CommandInput placeholder="Filter..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {filterItemList.map((item) => (
                        <CommandItem
                            key={item.value}
                            value={item.value}
                            onSelect={() => {
                                onSelect(item);
                                setOpen(false);
                            }}
                        >
                            <CheckIcon
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    item.value === selectedValue ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {item.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
