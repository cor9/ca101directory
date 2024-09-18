"use client";

import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";

export default function BackButton() {
    const router = useRouter();

    return (
        <Button
            variant="default"
            size="lg"
            className="inline-flex items-center gap-2 group"
            asChild
        >
            <Link href="#" onClick={() => router.back()}>
                <ArrowLeftIcon className="w-5 h-5 
                    transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back</span>
            </Link>
        </Button>
    );
}