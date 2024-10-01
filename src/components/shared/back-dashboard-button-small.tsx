"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function BackDashboardButtonSmall() {
    return (
        <Button
            size="sm"
            variant="outline"
            className="size-8 px-0"
            asChild
        >
            <Link href="/dashboard">
                <ArrowRightIcon className="size-5" />
            </Link>
        </Button>
    );
}