import { Badge } from "@/components/ui/badge";

const statusClassNames: Record<string, string> = {
  draft: "bg-slate-100 text-slate-800 border-slate-200",
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  approved: "bg-emerald-100 text-emerald-900 border-emerald-200",
  rejected: "bg-rose-100 text-rose-900 border-rose-200",
  expired: "bg-zinc-100 text-zinc-700 border-zinc-200",
  cancelled: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export function EventStatusBadge({ status }: { status?: string | null }) {
  const normalized = String(status || "pending").toLowerCase();
  return (
    <Badge
      variant="outline"
      className={statusClassNames[normalized] || statusClassNames.pending}
    >
      {normalized}
    </Badge>
  );
}
