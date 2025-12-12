import { HotLeadActions } from "@/components/admin/hot-lead-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getHotLeads } from "@/data/conversion-stats";
import { TrendingUp } from "lucide-react";

/**
 * Hot Leads Table
 * Shows free listings with high traffic that should be targeted for upgrade
 */

export async function HotLeadsTable() {
  const hotLeads = await getHotLeads(15); // Minimum 15 views in last 7 days

  if (hotLeads.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No hot leads at the moment.</p>
        <p className="text-sm mt-2">
          Free listings with high traffic will appear here for targeted
          outreach.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            🔥 Hot Leads ({hotLeads.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Free listings with high traffic - prime for personal outreach
          </p>
        </div>
        <Badge variant="default" className="bg-green-600">
          ${hotLeads.reduce((sum, l) => sum + l.potential_revenue, 0)}/mo
          potential
        </Badge>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead className="text-center">Views (7d)</TableHead>
              <TableHead className="text-center">Above Avg</TableHead>
              <TableHead className="text-center">Potential</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotLeads.map((lead) => (
              <TableRow key={lead.listing_id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{lead.listing_name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {lead.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="font-mono">
                    {lead.views_last_7_days}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {lead.is_above_average ? (
                    <Badge variant="default" className="bg-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Yes
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-green-600">
                    ${lead.potential_revenue}/mo
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <HotLeadActions
                    listingId={lead.listing_id}
                    listingName={lead.listing_name}
                    email={lead.email}
                    slug={lead.slug}
                    viewCount={lead.views_last_7_days}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground">
        💡 <strong>Tip:</strong> These vendors are getting traffic but missing
        out on inquiries. Personal outreach works best - mention their specific
        view count and show the value of upgrading.
      </div>
    </div>
  );
}
