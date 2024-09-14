"use client";

import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "../ui/button";

export default function BackButton() {
    const router = useRouter();

    return (
        <Link
            href="#"
            onClick={() => {
                router.back();
            }}
            className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "inline-flex items-center gap-2 group"
            )}
        >
            <ArrowLeftIcon className="w-5 h-5 
                transition-transform duration-200 group-hover:-translate-x-1" />
            Back
        </Link>
    );
}