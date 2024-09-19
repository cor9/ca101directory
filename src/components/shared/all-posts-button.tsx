"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AllPostsButton() {
    const router = useRouter();

    return (
        <Button
            size="lg"
            variant="default"
            className="inline-flex items-center gap-2 group rounded-full"
            asChild
        >
            <Link href="/blog" onClick={() => router.back()}>
                <ArrowLeftIcon className="w-5 h-5 
                    transition-transform duration-200 group-hover:-translate-x-1" />
                <span>All Posts</span>
            </Link>
        </Button>
    );
}