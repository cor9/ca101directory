"use client";

import React from 'react';
import { Command } from 'cmdk';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export default function CommandMenu() {
    const [open, setOpen] = React.useState(false);

    // Toggle the menu when ⌘K is pressed
    React.useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

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

            <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
                <Command.Input />
                <Command.List>
                    <Command.Empty>No results found.</Command.Empty>

                    <Command.Group heading="Letters">
                        <Command.Item>a</Command.Item>
                        <Command.Item>b</Command.Item>
                        <Command.Separator />
                        <Command.Item>c</Command.Item>
                    </Command.Group>

                    <Command.Item>Apple</Command.Item>
                </Command.List>
            </Command.Dialog>
        </>
    )
}