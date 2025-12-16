import type { Listing } from "@/data/listings";

interface ListingDetailsProps {
  listing: Listing;
  category: string;
  location: string;
  ageRanges: string[];
  services: string[];
  regions: string[];
  hasVirtualOption: boolean;
}

export function ListingDetails({
  listing,
  category,
  location,
  ageRanges,
  services,
  regions,
  hasVirtualOption,
}: ListingDetailsProps) {
  return (
    <section className="bg-bg-panel/60 backdrop-blur-sm border border-white/5 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-3 text-text-primary">Details</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div>
          <dt className="font-semibold text-text-primary">Category</dt>
          <dd className="text-text-secondary">{category}</dd>
        </div>

        <div>
          <dt className="font-semibold text-text-primary">Location</dt>
          <dd className="text-text-secondary">{location || "—"}</dd>
        </div>

        {regions.length > 0 && (
          <div>
            <dt className="font-semibold text-text-primary">Regions</dt>
            <dd className="text-text-secondary">{regions.join(", ")}</dd>
          </div>
        )}

        <div>
          <dt className="font-semibold text-text-primary">Format</dt>
          <dd className="text-text-secondary">
            {hasVirtualOption ? "Virtual / Online" : "In-Person"}
          </dd>
        </div>

        <div>
          <dt className="font-semibold text-text-primary">Ages Served</dt>
          <dd className="flex flex-wrap gap-2">
            {ageRanges.length > 0 ? (
              ageRanges.map((age) => (
                <span
                  key={age}
                  className="px-2 py-0.5 rounded-full bg-white/5 text-text-secondary border border-white/10"
                >
                  {age}
                </span>
              ))
            ) : (
              <span className="text-text-secondary">—</span>
            )}
          </dd>
        </div>

        <div>
          <dt className="font-semibold text-text-primary">Services</dt>
          <dd className="text-text-secondary">
            {services.length > 0 ? services.join(", ") : "—"}
          </dd>
        </div>
      </dl>
    </section>
  );
}

