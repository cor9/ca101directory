import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EVENT_AUDIENCES,
  EVENT_CATEGORIES,
  PRICE_TYPES,
} from "@/lib/events/constants";
import type { DirectoryEvent, EventListingSummary } from "@/lib/events/types";

type EventFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  listings: EventListingSummary[];
  event?: Partial<DirectoryEvent> | null;
  submitLabel?: string;
  error?: string;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function EventForm({
  action,
  listings,
  event,
  submitLabel = "Submit Event",
  error,
}: EventFormProps) {
  return (
    <form action={action} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Event title">
          <Input
            name="title"
            required
            maxLength={120}
            defaultValue={event?.title || ""}
          />
        </Field>

        <Field label="Listing/vendor">
          <select
            name="listing_id"
            required
            defaultValue={event?.listing_id || listings[0]?.id || ""}
            className="h-10 w-full rounded-md border border-border-subtle bg-bg-dark-3 text-text-primary px-3 py-2 text-sm focus:outline-none focus:border-accent-blue"
          >
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.listing_name || listing.id}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Category">
          <select
            name="category"
            defaultValue={event?.category || ""}
            className="h-10 w-full rounded-md border border-border-subtle bg-bg-dark-3 text-text-primary px-3 py-2 text-sm focus:outline-none focus:border-accent-blue"
          >
            <option value="">Choose a category</option>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Event type">
          <Input name="event_type" defaultValue={event?.event_type || ""} />
        </Field>

        <Field label="Audience">
          <select
            name="audience"
            defaultValue={event?.audience || ""}
            className="h-10 w-full rounded-md border border-border-subtle bg-bg-dark-3 text-text-primary px-3 py-2 text-sm focus:outline-none focus:border-accent-blue"
          >
            <option value="">Choose an audience</option>
            {EVENT_AUDIENCES.map((audience) => (
              <option key={audience} value={audience}>
                {audience}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Price type">
          <select
            name="price_type"
            defaultValue={event?.price_type || "paid"}
            className="h-10 w-full rounded-md border border-border-subtle bg-bg-dark-3 text-text-primary px-3 py-2 text-sm focus:outline-none focus:border-accent-blue"
          >
            {PRICE_TYPES.map((priceType) => (
              <option key={priceType} value={priceType}>
                {priceType}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Age minimum">
          <Input
            name="age_min"
            type="number"
            min={0}
            max={21}
            defaultValue={event?.age_min ?? ""}
          />
        </Field>

        <Field label="Age maximum">
          <Input
            name="age_max"
            type="number"
            min={0}
            max={21}
            defaultValue={event?.age_max ?? ""}
          />
        </Field>

        <Field label="Price amount">
          <Input
            name="price_amount"
            type="number"
            min={0}
            step="0.01"
            defaultValue={event?.price_amount ?? ""}
          />
        </Field>

        <Field label="Price display">
          <Input
            name="price_display"
            placeholder="$75, Free, varies by package"
            defaultValue={event?.price_display || ""}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <Field label="Short description">
          <Textarea
            name="short_description"
            maxLength={240}
            defaultValue={event?.short_description || ""}
          />
        </Field>

        <Field label="Full description">
          <Textarea
            name="description"
            required
            className="min-h-40"
            defaultValue={event?.description || ""}
          />
        </Field>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Start date">
          <Input
            name="start_date"
            type="date"
            required
            defaultValue={event?.start_date || ""}
          />
        </Field>
        <Field label="End date">
          <Input
            name="end_date"
            type="date"
            defaultValue={event?.end_date || ""}
          />
        </Field>
        <Field label="Start time">
          <Input
            name="start_time"
            type="time"
            defaultValue={event?.start_time?.slice(0, 5) || ""}
          />
        </Field>
        <Field label="End time">
          <Input
            name="end_time"
            type="time"
            defaultValue={event?.end_time?.slice(0, 5) || ""}
          />
        </Field>
        <Field label="Time zone">
          <Input
            name="timezone"
            defaultValue={event?.timezone || "America/Los_Angeles"}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            name="is_online"
            defaultChecked={Boolean(event?.is_online)}
          />
          Online event
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Location name">
            <Input
              name="location_name"
              defaultValue={event?.location_name || ""}
            />
          </Field>
          <Field label="Address">
            <Input name="address" defaultValue={event?.address || ""} />
          </Field>
          <Field label="City">
            <Input name="city" defaultValue={event?.city || ""} />
          </Field>
          <Field label="State">
            <Input name="state" defaultValue={event?.state || ""} />
          </Field>
          <Field label="ZIP">
            <Input name="zip" defaultValue={event?.zip || ""} />
          </Field>
          <Field label="Country">
            <Input
              name="country"
              defaultValue={event?.country || "United States"}
            />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Registration URL">
          <Input
            name="registration_url"
            type="url"
            defaultValue={event?.registration_url || ""}
          />
        </Field>
        <Field label="Event URL">
          <Input
            name="event_url"
            type="url"
            defaultValue={event?.event_url || ""}
          />
        </Field>
        <Field label="Image URL">
          <Input
            name="image_url"
            type="url"
            defaultValue={event?.image_url || ""}
          />
        </Field>
      </section>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-950">
          Events may not promise bookings, guaranteed representation, guaranteed
          auditions, or guaranteed career outcomes. Events involving casting
          directors, agents, managers, or paid audition opportunities may
          require additional review.
        </p>
        <label className="mt-4 flex items-start gap-3 text-sm text-amber-950">
          <input
            type="checkbox"
            name="standards_acknowledged"
            defaultChecked={Boolean(event)}
          />
          <span>
            I understand that Child Actor 101 may review, edit, reject, or
            remove submitted events that do not meet directory standards.
          </span>
        </label>
      </div>

      <Button type="submit" className="bauhaus-btn-primary">
        {submitLabel}
      </Button>
    </form>
  );
}
