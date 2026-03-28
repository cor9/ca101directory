"use client";

import { adminGetClaimLinks } from "@/actions/admin-get-claim-links";
import { updateCrmStatus } from "@/actions/crm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Heart,
  Loader2,
  Mail,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState, useTransition } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type OutreachStatus =
  | "not_contacted"
  | "emailed"
  | "in_progress"
  | "upgraded"
  | "not_interested";

type CrmListing = {
  id: string;
  slug: string;
  listing_name: string;
  email: string | null;
  views_count: number | null;
  favorites_count: number | null;
  plan: string;
  is_claimed: boolean;
  vendor_outreach:
    | {
        status: OutreachStatus;
        notes: string | null;
        last_contacted_at: string | null;
      }[]
    | null;
};

type SortKey = "listing_name" | "views_count" | "favorites_count" | "outreach_status";

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OutreachStatus,
  { label: string; color: string }
> = {
  not_contacted: { label: "Not Contacted", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  emailed:       { label: "Emailed",        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  in_progress:   { label: "In Progress",    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  upgraded:      { label: "Upgraded ✓",     color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  not_interested:{ label: "Not Interested", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OutreachStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

// ── Notes/Status Edit Dialog ────────────────────────────────────────────────

function EditDialog({
  listing,
  open,
  onClose,
}: {
  listing: CrmListing;
  open: boolean;
  onClose: () => void;
}) {
  const outreach = listing.vendor_outreach?.[0];
  const [status, setStatus] = useState<OutreachStatus>(
    (outreach?.status as OutreachStatus) ?? "not_contacted"
  );
  const [notes, setNotes] = useState(outreach?.notes ?? "");
  const [isPending, startTransition] = useTransition();

  // Claim links
  const [links, setLinks] = useState<{
    claimUrl: string;
    upgradeUrl: string;
  } | null>(null);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    if (links || loadingLinks) return;
    setLoadingLinks(true);
    const result = await adminGetClaimLinks(listing.id);
    setLoadingLinks(false);
    if (result.success && result.links) {
      setLinks({ claimUrl: result.links.claimUrl, upgradeUrl: result.links.upgradeUrl });
    }
  }, [listing.id, links, loadingLinks]);

  const copyLink = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateCrmStatus(listing.id, status, notes);
      onClose();
    });
  };

  const mailtoHref = `mailto:${listing.email}?subject=${encodeURIComponent(
    `Your ${listing.listing_name} listing — upgrade opportunity`
  )}&body=${encodeURIComponent(
    `Hi,\n\nI noticed your listing "${listing.listing_name}" has been getting great traffic on the Child Actor 101 Directory.\n\nParents are finding you, but you\u2019re missing out on premium features that could help you stand out even more.\n\nWould you be open to a quick chat about upgrading?\n\n- Corey\nChild Actor 101 Directory`
  )}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{listing.listing_name}</DialogTitle>
          <p className="text-sm text-muted-foreground">{listing.email ?? "No email on file"}</p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Stats strip */}
          <div className="flex gap-4 text-sm bg-muted/40 rounded-lg p-3">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              {listing.views_count ?? 0} views
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-3.5 w-3.5" />
              {listing.favorites_count ?? 0} favs
            </span>
            <span className={`flex items-center gap-1 text-xs ${listing.is_claimed ? "text-green-600" : "text-amber-600"}`}>
              {listing.is_claimed ? "Claimed" : "Unclaimed"}
            </span>
          </div>

          {/* Status select */}
          <div className="space-y-1.5">
            <label htmlFor={`select-status-${listing.id}`} className="text-sm font-medium">Outreach Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as OutreachStatus)}>
              <SelectTrigger id={`select-status-${listing.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(STATUS_CONFIG) as [OutreachStatus, { label: string }][]).map(
                  ([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor={`notes-${listing.id}`} className="text-sm font-medium">Notes</label>
            <textarea
              id={`notes-${listing.id}`}
              className="w-full min-h-[100px] text-sm rounded-md border border-input bg-background px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Add notes about this vendor, conversation history, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

        {/* Claim / upgrade links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Outreach Links</span>
              {!links && (
                <button
                  type="button"
                  onClick={fetchLinks}
                  disabled={loadingLinks}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {loadingLinks ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  {loadingLinks ? "Loading…" : "Generate links"}
                </button>
              )}
            </div>
            {links ? (
              <div className="space-y-2">
                {([
                  { label: "Claim URL", key: "claimUrl", url: links.claimUrl },
                  { label: "Upgrade URL", key: "upgradeUrl", url: links.upgradeUrl },
                ] as const).map(({ label, key, url }) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      readOnly
                      value={url}
                      className="flex-1 min-w-0 text-xs font-mono rounded-md border border-input bg-muted px-2 py-1.5 truncate"
                    />
                    <button
                      type="button"
                      onClick={() => copyLink(url, key)}
                      className="shrink-0 p-1.5 rounded-md border border-input hover:bg-accent"
                      aria-label={`Copy ${label}`}
                    >
                      {copiedField === key ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Click &ldquo;Generate links&rdquo; to get the claim and upgrade URLs for this vendor.
              </p>
            )}
          </div>

          {/* Quick email link */}
          {listing.email && (
            <a
              href={mailtoHref}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              Open draft email in mail app
            </a>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Table ────────────────────────────────────────────────────────────────

export function CrmTable({ initialListings }: { initialListings: CrmListing[] }) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterClaimed, setFilterClaimed] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("views_count");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [editingListing, setEditingListing] = useState<CrmListing | null>(null);

  // Derive outreach status for each listing
  const listings = useMemo(
    () =>
      initialListings.map((l) => ({
        ...l,
        outreach_status:
          (l.vendor_outreach?.[0]?.status as OutreachStatus) ?? "not_contacted",
      })),
    [initialListings]
  );

  const filtered = useMemo(() => {
    let result = [...listings];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.listing_name.toLowerCase().includes(q) ||
          (l.email ?? "").toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((l) => l.outreach_status === filterStatus);
    }

    if (filterClaimed === "claimed") result = result.filter((l) => l.is_claimed);
    if (filterClaimed === "unclaimed") result = result.filter((l) => !l.is_claimed);

    result.sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      if (sortKey === "listing_name") {
        av = a.listing_name ?? "";
        bv = b.listing_name ?? "";
      } else if (sortKey === "views_count") {
        av = a.views_count ?? 0;
        bv = b.views_count ?? 0;
      } else if (sortKey === "favorites_count") {
        av = a.favorites_count ?? 0;
        bv = b.favorites_count ?? 0;
      } else if (sortKey === "outreach_status") {
        av = a.outreach_status;
        bv = b.outreach_status;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [listings, search, filterStatus, filterClaimed, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey !== k ? (
      <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    ) : sortDir === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    );

  // Summary counts
  const counts = useMemo(() => {
    const total = listings.length;
    const notContacted = listings.filter((l) => l.outreach_status === "not_contacted").length;
    const upgraded = listings.filter((l) => l.outreach_status === "upgraded").length;
    const inFlight = listings.filter(
      (l) => l.outreach_status === "emailed" || l.outreach_status === "in_progress"
    ).length;
    return { total, notContacted, upgraded, inFlight };
  }, [listings]);

  return (
    <div className="space-y-6 p-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Free Vendors", value: counts.total, icon: TrendingUp, color: "text-foreground" },
          { label: "Not Contacted", value: counts.notContacted, icon: MessageSquare, color: "text-amber-500" },
          { label: "In Flight", value: counts.inFlight, icon: Mail, color: "text-blue-500" },
          { label: "Upgraded", value: counts.upgraded, icon: TrendingUp, color: "text-green-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex flex-col gap-1 bg-muted/40 rounded-lg px-4 py-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          id="crm-search"
        />

        <select
          id="crm-filter-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Statuses</option>
          {(Object.entries(STATUS_CONFIG) as [OutreachStatus, { label: string }][]).map(
            ([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            )
          )}
        </select>

        <select
          id="crm-filter-claimed"
          value={filterClaimed}
          onChange={(e) => setFilterClaimed(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Claimed + Unclaimed</option>
          <option value="claimed">Claimed</option>
          <option value="unclaimed">Unclaimed</option>
        </select>

        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} vendors
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  type="button"
                  onClick={() => handleSort("listing_name")}
                  className="flex items-center font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Vendor <SortIcon k="listing_name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  type="button"
                  onClick={() => handleSort("views_count")}
                  className="flex items-center font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Views <SortIcon k="views_count" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  type="button"
                  onClick={() => handleSort("favorites_count")}
                  className="flex items-center font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Favs <SortIcon k="favorites_count" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider text-muted-foreground">
                Claimed
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  type="button"
                  onClick={() => handleSort("outreach_status")}
                  className="flex items-center font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Status <SortIcon k="outreach_status" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider text-muted-foreground">
                Last Contacted
              </th>
              <th className="px-4 py-3 text-right font-medium text-xs uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No vendors match your current filters.
                </td>
              </tr>
            ) : (
              filtered.map((listing) => {
                const outreach = listing.vendor_outreach?.[0];
                return (
                  <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground truncate max-w-[200px]">
                        {listing.listing_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {listing.email ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground font-mono">
                      {listing.views_count ?? 0}
                    </td>
                    <td className="px-4 py-3 text-foreground font-mono">
                      {listing.favorites_count ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      {listing.is_claimed ? (
                        <Badge variant="outline" className="text-green-600 border-green-500">Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">No</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={listing.outreach_status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {outreach?.last_contacted_at
                        ? new Date(outreach.last_contacted_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingListing(listing)}
                          id={`crm-edit-${listing.id}`}
                        >
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          Log
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <Link
                            href={`/listing/${listing.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${listing.listing_name} listing`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Notes indicator legend */}
      <p className="text-xs text-muted-foreground">
        Click <strong>Log</strong> on any vendor to update their outreach status, add notes, or open a draft email.
      </p>

      {/* Edit dialog */}
      {editingListing && (
        <EditDialog
          listing={editingListing}
          open={!!editingListing}
          onClose={() => setEditingListing(null)}
        />
      )}
    </div>
  );
}
