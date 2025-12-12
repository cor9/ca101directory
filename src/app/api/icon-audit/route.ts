import { getCategories, getCategoryIconsMap } from "@/data/categories";
import { getCategoryIconUrl } from "@/lib/image-urls";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [categories, iconMap] = await Promise.all([
      getCategories(),
      getCategoryIconsMap(),
    ]);

    const categoryNames = (categories || []).map(
      (c: { category_name: string }) => c.category_name,
    );

    const unmapped: string[] = [];
    const mapped: { name: string; filename: string; url: string }[] = [];
    for (const name of categoryNames) {
      const filename = iconMap[name];
      if (!filename) {
        unmapped.push(name);
        continue;
      }
      const url = getCategoryIconUrl(filename);
      mapped.push({ name, filename, url });
    }

    // HEAD check each mapped URL to see if object exists
    const results = await Promise.all(
      mapped.map(async (m) => {
        try {
          const res = await fetch(m.url, { method: "HEAD" });
          return { ...m, ok: res.ok, status: res.status };
        } catch (e) {
          return { ...m, ok: false, status: 0 };
        }
      }),
    );

    const missing = results
      .filter((r) => !r.ok)
      .map((r) => ({
        category: r.name,
        filename: r.filename,
        url: r.url,
        status: r.status,
      }));

    // Orphaned rows that exist in iconMap but not in categories
    const orphaned = Object.keys(iconMap)
      .filter((name) => !categoryNames.includes(name))
      .map((name) => ({
        category: name,
        filename: iconMap[name],
        url: getCategoryIconUrl(iconMap[name]),
      }));

    return NextResponse.json({
      totals: {
        categories: categoryNames.length,
        mapped: mapped.length,
        unmapped: unmapped.length,
        missing: missing.length,
        orphaned: orphaned.length,
      },
      unmapped,
      missing,
      orphaned,
    });
  } catch (error) {
    return NextResponse.json(
      { error: true, message: (error as Error).message || "icon audit failed" },
      { status: 500 },
    );
  }
}
