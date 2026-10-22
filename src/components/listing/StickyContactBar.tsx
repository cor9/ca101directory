"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Keeps the booking/contact action in reach: appears once the profile header
 * has scrolled out of view. Bottom bar on mobile, slim bar under the navbar on
 * desktop. Renders nothing until then (and with no IntersectionObserver).
 */
export function StickyContactBar({
  name,
  targetId = "profile-header",
  children,
}: {
  name: string;
  targetId?: string;
  children: ReactNode;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) =>
        setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Contact and booking"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] backdrop-blur [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] lg:bottom-auto lg:top-16 lg:border-b lg:border-t-0 lg:shadow-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <p className="hidden min-w-0 truncate text-base font-bold text-zinc-900 sm:block">
          {name}
        </p>
        <div className="flex w-full justify-center sm:w-auto sm:justify-end">
          {children}
        </div>
      </div>
    </div>
  );
}
