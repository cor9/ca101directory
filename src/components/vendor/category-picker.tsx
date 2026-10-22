"use client";

import {
  SECTIONS,
  editableSpecialties,
  normKey,
  removeStoredValue,
  sectionPrimaries,
  selectedPrimarySlugs,
  specialtyOptionsFor,
  togglePrimaryInNames,
  getPrimaryBySlug,
  unmappedValues,
} from "@/lib/category-taxonomy";
import { submissionProfile } from "@/lib/submission-fields";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useId } from "react";

export interface CategoryPickerValue {
  categories: string[];
  specialties: string[];
}

interface CategoryPickerProps {
  /** Stored category values (names, or legacy UUIDs) */
  categories: string[];
  /** Stored specialty tags */
  specialties: string[];
  onChange: (next: CategoryPickerValue) => void;
  /**
   * Plans with one category (Free) use single selection: choosing another
   * category simply replaces the current one. Paid plans select several.
   */
  singleCategory?: boolean;
  disabled?: boolean;
  /** Turn a stored value (maybe a UUID) into a readable name */
  resolveName?: (value: string) => string;
  invalid?: boolean;
}

const focusRing =
  "peer-focus-visible:ring-2 peer-focus-visible:ring-brass-dark peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white";

/**
 * Primary category + specialty tags.
 *
 *  - Single selection (Free): radio group, one click switches category.
 *  - Multi selection (paid): checkboxes.
 *  - Specialties are pill toggles (the whole pill is the control) for the
 *    selected category's approved options. Anything the owner saved earlier
 *    stays visible and selectable, so switching category never drops a tag.
 *  - Retired / unmapped categories are kept until the owner replaces or
 *    removes them.
 */
export function CategoryPicker({
  categories,
  specialties,
  onChange,
  singleCategory = false,
  disabled = false,
  resolveName = (v) => v,
  invalid = false,
}: CategoryPickerProps) {
  const uid = useId();
  const selected = selectedPrimarySlugs(categories);
  const leftovers = unmappedValues({ categories });
  const effective = editableSpecialties({ categories, specialties });
  const options = specialtyOptionsFor(selected);
  const optionKeys = new Set(options.map(normKey));
  const otherTags = effective.filter((s) => !optionKeys.has(normKey(s)));
  const effectiveKeys = new Set(effective.map(normKey));
  const specialtyHeading = submissionProfile(categories).specialtyLabel;

  const choose = (slug: string) => {
    if (singleCategory) {
      // One category: the new choice replaces whatever was selected (including
      // an older, retired category). Saved specialties are kept.
      const name = getPrimaryBySlug(slug)?.name;
      if (name) onChange({ categories: [name], specialties });
      return;
    }
    onChange({
      categories: togglePrimaryInNames(categories, slug, !selected.includes(slug)),
      specialties,
    });
  };

  const toggleSpecialty = (label: string) => {
    const on = !effectiveKeys.has(normKey(label));
    onChange({
      categories,
      specialties: on
        ? [...effective, label]
        : effective.filter((s) => normKey(s) !== normKey(label)),
    });
  };

  const inputType = singleCategory ? "radio" : "checkbox";

  return (
    <div className="space-y-6">
      <div
        role={singleCategory ? "radiogroup" : "group"}
        aria-label="Category"
        className={cn(
          "space-y-5 rounded-xl",
          invalid && "ring-2 ring-red-500 ring-offset-4 ring-offset-white",
        )}
      >
        {SECTIONS.map((section) => (
          <fieldset key={section.id}>
            <legend className="eyebrow mb-3">{section.title}</legend>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {sectionPrimaries(section.id).map((p) => {
                const checked = singleCategory
                  ? selected[0] === p.slug
                  : selected.includes(p.slug);
                const id = `${uid}-cat-${p.slug}`;
                return (
                  <div key={p.slug} className="relative">
                    <input
                      id={id}
                      type={inputType}
                      name={singleCategory ? `${uid}-category` : undefined}
                      className="peer sr-only"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => choose(p.slug)}
                    />
                    <label
                      htmlFor={id}
                      className={cn(
                        "flex min-h-[3.25rem] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[15px] font-medium transition-colors",
                        focusRing,
                        checked
                          ? "border-ink bg-ink text-white shadow-sm"
                          : "border-canvas-line bg-white text-ink hover:border-brass-dark hover:bg-canvas",
                        disabled && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center border",
                          singleCategory ? "rounded-full" : "rounded-md",
                          checked
                            ? "border-brass bg-brass text-ink"
                            : "border-zinc-400 bg-white",
                        )}
                      >
                        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                      {p.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {leftovers.length > 0 && (
        <div className="rounded-xl border border-brass/60 bg-brass-tint p-4 text-sm text-ink">
          <p className="font-semibold">Older categories on this listing</p>
          <ul className="mt-2 space-y-1.5">
            {leftovers.map((v) => (
              <li key={v} className="flex items-center justify-between gap-3">
                <span>{resolveName(v)}</span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onChange({
                      categories: removeStoredValue(categories, v),
                      specialties,
                    })
                  }
                  className="rounded-full border border-ink/30 bg-white px-3 py-1 text-xs font-semibold text-ink hover:bg-canvas"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(options.length > 0 || otherTags.length > 0) && (
        <fieldset>
          <legend className="heading-display mb-1 text-xl text-ink">
            {specialtyHeading}
          </legend>
          <p className="mb-3 text-sm text-ink-soft">
            Select the specialties you offer. You can choose more than one.
          </p>
          <div className="flex flex-wrap gap-2">
            {[...options, ...otherTags].map((label) => {
              const id = `${uid}-spec-${normKey(label)}`;
              const checked = effectiveKeys.has(normKey(label));
              return (
                <div key={label} className="relative">
                  <input
                    id={id}
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleSpecialty(label)}
                  />
                  <label
                    htmlFor={id}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      focusRing,
                      checked
                        ? "border-brass-dark bg-brass-tint text-ink"
                        : "border-canvas-line bg-white text-ink-2 hover:border-brass-dark",
                    )}
                  >
                    {checked && (
                      <Check
                        aria-hidden="true"
                        className="h-3.5 w-3.5 text-brass-dark"
                        strokeWidth={3}
                      />
                    )}
                    {label}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
