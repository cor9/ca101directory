"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function BackButton() {
    const router = useRouter();

    return (
        <Button
            size="lg"
            variant="outline"
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