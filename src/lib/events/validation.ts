import {
  EVENT_AUDIENCES,
  EVENT_CATEGORIES,
  PRICE_TYPES,
} from "@/lib/events/constants";
import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().optional(),
);

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z.string().url("Enter a valid URL").optional(),
);

const checkboxBoolean = z.preprocess((value) => {
  if (value === "on" || value === "true" || value === true) return true;
  return false;
}, z.boolean());

export const eventFormSchema = z
  .object({
    listing_id: z.string().uuid("Choose a listing"),
    title: z.string().trim().min(1, "Event title is required").max(120),
    category: z.enum(EVENT_CATEGORIES).or(z.literal("")).optional(),
    event_type: z.string().trim().max(80).optional(),
    short_description: z.string().trim().max(240).optional(),
    description: z.string().trim().min(1, "Description is required"),
    audience: z.enum(EVENT_AUDIENCES).or(z.literal("")).optional(),
    age_min: optionalNumber.refine(
      (value) => value === undefined || value >= 0,
      {
        message: "Minimum age must be 0 or greater",
      },
    ),
    age_max: optionalNumber.refine(
      (value) => value === undefined || value <= 21,
      { message: "Maximum age must be 21 or less" },
    ),
    price_type: z.enum(PRICE_TYPES).default("paid"),
    price_amount: optionalNumber.refine(
      (value) => value === undefined || value >= 0,
      { message: "Price must be 0 or greater" },
    ),
    price_display: z.string().trim().max(80).optional(),
    event_url: optionalUrl,
    registration_url: z.preprocess(
      emptyToUndefined,
      z.string().url("Enter a valid registration URL").optional(),
    ),
    is_online: checkboxBoolean.default(false),
    location_name: z.string().trim().max(120).optional(),
    address: z.string().trim().max(180).optional(),
    city: z.string().trim().max(80).optional(),
    state: z.string().trim().max(40).optional(),
    zip: z.string().trim().max(20).optional(),
    country: z.string().trim().max(80).default("United States"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.preprocess(emptyToUndefined, z.string().optional()),
    start_time: z.preprocess(emptyToUndefined, z.string().optional()),
    end_time: z.preprocess(emptyToUndefined, z.string().optional()),
    timezone: z.string().trim().default("America/Los_Angeles"),
    image_url: optionalUrl,
    standards_acknowledged: z.literal("on", {
      errorMap: () => ({
        message: "You must acknowledge the event submission standards",
      }),
    }),
  })
  .superRefine((value, ctx) => {
    if (value.end_date && value.end_date < value.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_date"],
        message: "End date cannot be before start date",
      });
    }

    if (
      value.age_min !== undefined &&
      value.age_max !== undefined &&
      value.age_max < value.age_min
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["age_max"],
        message: "Maximum age cannot be below minimum age",
      });
    }

    if (!value.is_online && (!value.city || !value.state)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["city"],
        message: "City and state are required for in-person events",
      });
    }
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

export function eventFormDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function eventValidationErrors(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}
