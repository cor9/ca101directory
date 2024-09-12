"use client";

import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BackButton() {
    const router = useRouter();
    const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

    useEffect(() => {
        const handleRouteChange = () => {
            const currentFullPath = window.location.pathname + window.location.hash;
            setNavigationHistory(prev => {
                if (prev[prev.length - 1] !== currentFullPath) {
                    return [...prev, currentFullPath];
                }
                return prev;
            });
        };

        // Initial setup
        handleRouteChange();

        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    const handleBack = () => {
        if (navigationHistory.length > 1) {
            const prevPath = navigationHistory[navigationHistory.length - 2].split('#')[0];
            router.push(prevPath);
            setNavigationHistory(prev => prev.slice(0, -1));
        } else {
            router.back();
        }
    };

    return (
        <div className="flex justify-center items-center">
            <Link
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    handleBack();
                }}
                className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "inline-flex items-center gap-2 group"
                )}
            >
                <ArrowLeftIcon className="w-5 h-5 
                transition-transform duration-200 group-hover:-translate-x-1" />
                Back
            </Link>
        </div>
    );
}