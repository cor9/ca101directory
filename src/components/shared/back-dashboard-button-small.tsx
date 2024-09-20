"use client";

import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function BackDashboardButtonSmall() {
    const router = useRouter();

    return (
        <Button
            size="sm"
            variant="outline"
            className="size-8 px-0"
            asChild
        >
            <Link href="/dashboard">
                <ChevronLeftIcon className="size-5" />
            </Link>
        </Button>
    );
}