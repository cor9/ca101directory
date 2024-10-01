"use client";

import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface BackButtonSmallProps {
    className?: string;
}

export default function BackButtonSmall({ className }: BackButtonSmallProps) {
    const router = useRouter();

    return (
        <Button
            size="sm"
            variant="outline"
            className={cn("size-8 px-0", className)}
            asChild
        >
            <Link href="#" onClick={() => router.back()}>
                <ArrowRightIcon className="size-5" />
            </Link>
        </Button>
    );
}