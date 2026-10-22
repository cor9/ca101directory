"use client";

import {
  SECTIONS,
  normKey,
  removeStoredValue,
  sectionPrimaries,
  selectedPrimarySlugs,
  editableSpecialties,
  specialtyOptionsFor,
  togglePrimaryInNames,
  unmappedValues,
} from "@/lib/category-taxonomy";
import { submissionProfile } from "@/lib/submission-fields";
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
  /** Free plan: a single category (same rule the forms already enforced) */
  singleCategory?: boolean;
  disabled?: boolean;
  /** "dark" for the submit form, "light" for the dashboard edit form */
  tone?: "light" | "dark";
  /** Turn a stored value (maybe a UUID) into a readable name */
  resolveName?: (value: string) => string;
  invalid?: boolean;
}

/**
 * Primary category + specialty tags.
 *
 * Non-destructive by construction:
 *  - nothing is rewritten until the owner changes something;
 *  - a stored legacy name (e.g. "Audition Prep") counts as its primary
 *    (Acting Training) and is kept as-is while that primary stays selected;
 *  - retired / unmapped categories stay on the listing and are listed here
 *    with an explicit Remove button (the replacement path), never dropped;
 *  - every stored specialty remains visible and removable, even when it is not
 *    one of the current category's options.
 */
export function CategoryPicker({
  categories,
  specialties,
  onChange,
  singleCategory = false,
  disabled = false,
  tone = "light",
  resolveName = (v) => v,
  invalid = false,
}: CategoryPickerProps) {
  const uid = useId();
  const dark = tone === "dark";
  const text = dark ? "text-text-secondary" : "text-zinc-800";
  const muted = dark ? "text-text-muted" : "text-zinc-600";
  const box = `rounded-lg border p-3 ${
    invalid
      ? "border-2 border-red-500 bg-red-50 text-zinc-900"
      : dark
        ? "border-white/15"
        : "border-zinc-200"
  }`;

  const selected = selectedPrimarySlugs(categories);
  const leftovers = unmappedValues({ categories });
  const effective = editableSpecialties({ categories, specialties });
  const options = specialtyOptionsFor(selected);
  const optionKeys = new Set(options.map(normKey));
  const otherTags = effective.filter((s) => !optionKeys.has(normKey(s)));
  const effectiveKeys = new Set(effective.map(normKey));
  // Free plan counts every stored value so nothing is dropped silently on save
  const specialtyHeading = submissionProfile(categories).specialtyLabel;
  const atLimit = singleCategory && categories.length >= 1;

  const togglePrimary = (slug: string) => {
    const on = !selected.includes(slug);
    if (on && atLimit) return;
    onChange({
      categories: togglePrimaryInNames(categories, slug, on),
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

  return (
    <div className="space-y-5">
      <div className={box}>
        {SECTIONS.map((section) => (
          <fieldset key={section.id} className="mb-4 last:mb-0">
            <legend
              className={`mb-2 text-sm font-semibold ${dark ? "text-text-primary" : "text-zinc-900"}`}
            >
              {section.title}
            </legend>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {sectionPrimaries(section.id).map((p) => {
                const checked = selected.includes(p.slug);
                const blocked = !checked && atLimit;
                const id = `${uid}-cat-${p.slug}`;
                return (
                  <label
                    key={p.slug}
                    htmlFor={id}
                    className={`flex items-start gap-2 text-sm ${text} ${
                      blocked || disabled ? "opacity-50" : "cursor-pointer"
                    }`}
                  >
                    <input
                      id={id}
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-zinc-900"
                      checked={checked}
                      disabled={disabled || blocked}
                      onChange={() => togglePrimary(p.slug)}
                    />
                    <span>{p.name}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
        {singleCategory && (
          <p className={`mt-3 text-xs ${muted}`}>
            Free plan: one category. Uncheck the current one to choose another.
          </p>
        )}
      </div>

      {leftovers.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
          <p className="font-semibold">Older category on this listing</p>
          <p className="mt-1 text-xs">
            This category is no longer offered for new selection, but it stays
            on your listing until you remove it. Pick a replacement above, then
            remove the old one.
          </p>
          <ul className="mt-2 space-y-1">
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
                  className="rounded border border-amber-400 bg-white px-2 py-0.5 text-xs font-semibold text-amber-950 hover:bg-amber-100"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(options.length > 0 || otherTags.length > 0) && (
        <div className={box}>
          <p
            className={`mb-2 text-sm font-semibold ${dark ? "text-text-primary" : "text-zinc-900"}`}
          >
            {specialtyHeading}
          </p>
          <div className="flex flex-wrap gap-2">
            {[...options, ...otherTags].map((label) => {
              const id = `${uid}-spec-${normKey(label)}`;
              return (
                <label
                  key={label}
                  htmlFor={id}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                    dark
                      ? "border-white/20 text-text-secondary"
                      : "border-zinc-300 bg-zinc-50 text-zinc-800"
                  }`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    className="h-4 w-4 accent-zinc-900"
                    checked={effectiveKeys.has(normKey(label))}
                    disabled={disabled}
                    onChange={() => toggleSpecialty(label)}
                  />
                  {label}
                </label>
              );
            })}
          </div>
          <p className={`mt-2 text-xs ${muted}`}>
            Select all that apply, and only what you really offer. Tags you saved earlier stay listed
            here until you untick them.
          </p>
        </div>
      )}
    </div>
  );
}
