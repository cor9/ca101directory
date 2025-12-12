"use client";

import { adminBulkCreateListings } from "@/actions/admin-create";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type CsvRow = Record<string, string>;

// Basic CSV parser that supports quoted fields and commas
function parseCsv(text: string): CsvRow[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const headerLine = lines.shift() ?? "";
  if (!headerLine.trim()) return [];

  const headers = splitCsvLine(headerLine).map((h) => h.trim().toLowerCase());

  const rows: CsvRow[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = splitCsvLine(line);
    const row: CsvRow = {};
    headers.forEach((h, i) => {
      row[h] = (fields[i] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function FreeListingCsvUploader() {
  const [fileName, setFileName] = useState<string>("");
  const [raw, setRaw] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const rows = useMemo(() => parseCsv(raw), [raw]);

  const preview = rows.slice(0, 5);

  const sample =
    `name,description,website,email,phone,city,state,zip,region\n` +
    `ACME Kids Coaching,Helpful coaching for young actors,https://acme.com,hello@acme.com,555-123-4567,Los Angeles,CA,90001,SoCal`;

  const onFileChange = async (file: File | null) => {
    if (!file) return;
    try {
      setFileName(file.name);
      const text = await file.text();
      setRaw(text);
      toast.success("CSV loaded. Review preview below.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to read CSV file.");
    }
  };

  const onSubmit = async () => {
    if (rows.length === 0) {
      toast.error("No rows to submit. Please upload a CSV.");
      return;
    }

    // Map CSV to AdminCreateFormData minimal fields; enforce Free/Pending on server
    const items = rows.map((r) => ({
      name: r["name"] || "",
      description: r["description"] || "",
      link: r["website"] || r["link"] || "",
      email: r["email"] || "",
      phone: r["phone"] || "",
      city: r["city"] || "",
      state: r["state"] || "",
      zip: r["zip"] || "",
      region: r["region"] || "",
      tags: (r["tags"] || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      categories: (r["categories"] || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      plan: "Free",
      performerPermit: false,
      bonded: false,
      active: true,
      comped: false,
      status: "Pending",
      featured: false,
      approved_101: false,
      claimed: false,
      verification_status: "unverified",
    }));

    // basic validation: require name or description
    const valid = items.filter((i) => i.name.trim().length > 0);
    if (valid.length === 0) {
      toast.error("CSV missing required 'name' field.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminBulkCreateListings(valid as any);
      if (!res.success) {
        toast.error(res.error || "Bulk create failed");
      } else {
        const payload =
          (res.data as undefined | { created?: any[]; report?: any[] }) ||
          undefined;
        const created = (payload?.created ?? []).length;
        const report = payload?.report ?? [];
        const skipped = report.filter(
          (r: any) => r.status !== "created",
        ).length;
        toast.success(`Created ${created} listing(s). ${skipped} skipped.`);
        // Keep raw so user can review report below
        setReport(report);
      }
    } catch (e) {
      console.error(e);
      toast.error("Unexpected error during bulk create");
    } finally {
      setSubmitting(false);
    }
  };

  const [report, setReport] = useState<any[] | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="block text-sm"
        />
        {fileName && <span className="text-sm text-paper">{fileName}</span>}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setFileName("sample.csv");
            setRaw(sample);
          }}
        >
          Load Sample
        </Button>
      </div>

      {rows.length > 0 && (
        <div className="text-sm text-paper/80">Parsed rows: {rows.length}</div>
      )}

      {preview.length > 0 && (
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {Object.keys(preview[0]).map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 font-medium text-ink border-b"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((r, i) => (
                <tr key={i} className="odd:bg-background">
                  {Object.values(r).map((v, j) => (
                    <td key={j} className="px-3 py-2 border-b align-top">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {report && report.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Upload Results</h3>
          <div className="overflow-x-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2 border-b">Row</th>
                  <th className="text-left px-3 py-2 border-b">Status</th>
                  <th className="text-left px-3 py-2 border-b">Reason</th>
                </tr>
              </thead>
              <tbody>
                {report.map((r, i) => (
                  <tr key={i} className="odd:bg-background">
                    <td className="px-3 py-2 border-b">{r.row}</td>
                    <td className="px-3 py-2 border-b">{r.status}</td>
                    <td className="px-3 py-2 border-b">{r.reason ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={submitting || rows.length === 0}>
          {submitting ? "Creating..." : "Create Free Listings"}
        </Button>
      </div>
    </div>
  );
}

export default FreeListingCsvUploader;
