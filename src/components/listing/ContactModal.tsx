"use client";

import { displayUrl } from "@/lib/url";
import { CalendarCheck, Copy, Globe, Mail, Phone, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  imageUrl?: string;
  email?: string | null;
  phone?: string | null;
  /** Already-safe https URLs */
  website?: string | null;
  bookingUrl?: string | null;
  /** Called when the visitor uses a contact action (click tracking) */
  onAction?: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const rowClass =
  "flex w-full items-center gap-4 rounded-xl border border-zinc-300 bg-white px-4 py-3.5 text-left text-zinc-900 transition-colors hover:border-zinc-900 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2";

/**
 * Contact modal built only from real contact links (mailto:, tel:, website,
 * booking URL). It does not collect or send messages.
 */
export function ContactModal({
  open,
  onClose,
  name,
  imageUrl,
  email,
  phone,
  website,
  bookingUrl,
  onAction,
}: ContactModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [canCopy, setCanCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCanCopy(
      typeof navigator !== "undefined" &&
        Boolean(navigator.clipboard?.writeText),
    );
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      // Keep Tab / Shift+Tab inside the dialog
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (
        e.shiftKey &&
        (active === first || !dialogRef.current.contains(active))
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    returnFocusTo.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey, true);
    // Focus the first real action (primary action first in DOM order)
    const t = window.setTimeout(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(
        "[data-contact-action]",
      );
      (first || dialogRef.current)?.focus();
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", handleKey, true);
      document.body.style.overflow = prevOverflow;
      returnFocusTo.current?.focus?.();
    };
  }, [open, handleKey]);

  if (!open || !mounted) return null;

  const hasAny = Boolean(bookingUrl || email || phone || website);
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close contact dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        tabIndex={-1}
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 text-zinc-900 shadow-2xl focus:outline-none sm:max-w-md sm:rounded-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 pr-8">
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="h-16 w-16 shrink-0 rounded-full bg-zinc-100 object-cover object-top ring-2 ring-zinc-200"
            />
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B8431F]">
              Contact
            </p>
            <h2
              id="contact-modal-title"
              className="text-xl font-bold leading-tight text-zinc-900"
            >
              {name}
            </h2>
          </div>
        </div>

        {hasAny ? (
          <ul className="mt-6 space-y-3">
            {bookingUrl && (
              <li>
                <a
                  data-contact-action
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onAction}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C2441F] px-5 py-4 text-base font-bold !text-white transition-colors hover:bg-[#A93A19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                >
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  Book a Session
                </a>
              </li>
            )}
            {email && (
              <li className="flex items-stretch gap-2">
                <a
                  data-contact-action
                  href={`mailto:${email}`}
                  onClick={onAction}
                  className={rowClass}
                >
                  <Mail
                    className="h-5 w-5 shrink-0 text-[#B8431F]"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">Send Email</span>
                    <span className="block truncate text-sm text-zinc-700">
                      {email}
                    </span>
                  </span>
                </a>
                {canCopy && (
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={
                      copied ? "Email address copied" : "Copy email address"
                    }
                    className="flex w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 hover:border-zinc-900 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </li>
            )}
            {telHref && phone && (
              <li>
                <a
                  data-contact-action
                  href={telHref}
                  onClick={onAction}
                  className={rowClass}
                >
                  <Phone
                    className="h-5 w-5 shrink-0 text-[#B8431F]"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">Call</span>
                    <span className="block text-sm text-zinc-700">{phone}</span>
                  </span>
                </a>
              </li>
            )}
            {website && (
              <li>
                <a
                  data-contact-action
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onAction}
                  className={rowClass}
                >
                  <Globe
                    className="h-5 w-5 shrink-0 text-[#B8431F]"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">
                      Visit Website
                    </span>
                    <span className="block truncate text-sm text-zinc-700">
                      {displayUrl(website)}
                    </span>
                  </span>
                </a>
              </li>
            )}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-zinc-700">
            This provider hasn’t listed contact details yet.
          </p>
        )}

        <p className="mt-5 text-xs text-zinc-600">
          These open your email app, phone or the provider’s own site. Messages
          are not sent through Child Actor 101.
        </p>
      </div>
    </div>,
    document.body,
  );
}
