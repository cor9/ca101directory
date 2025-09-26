"use server";

import { createListing, getCategories } from "@/lib/airtable";
import { currentUser } from "@/lib/auth";
import type { SUPPORT_ITEM_ICON } from "@/lib/constants";
import { SubmitSchema } from "@/lib/schemas";
import { FreePlanStatus, PricePlans } from "@/lib/submission";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

type BaseSubmitFormData = {
  name: string;
  link: string;
  description: string;
  introduction: string;
  unique: string;
  format: string;
  notes: string;
  imageId: string;
  tags: string[];
  categories: string[];
  plan: string;
  performerPermit: boolean;
  bonded: boolean;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  bondNumber: string;
};

export type SubmitFormData = typeof SUPPORT_ITEM_ICON extends true
  ? BaseSubmitFormData & { iconId: string }
  : BaseSubmitFormData;

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  id?: string;
};

/**
 * https://nextjs.org/learn/dashboard-app/mutating-data
 */
export async function submit(
  formData: SubmitFormData,
): Promise<ServerActionResponse> {
  try {
    // Allow submissions without authentication for public form
    // const user = await currentUser();
    // if (!user) {
    //   return { status: "error", message: "Unauthorized" };
    // }

    // console.log("submit, data:", formData);
    const {
      name,
      link,
      description,
      introduction,
      unique,
      format,
      notes,
      imageId,
      tags,
      categories,
      plan,
      performerPermit,
      bonded,
      email,
      phone,
      city,
      state,
      zip,
      bondNumber,
      ...rest
    } = SubmitSchema.parse(formData);
    const iconId = "iconId" in rest ? rest.iconId : undefined;
    console.log("submit, name:", name, "link:", link, "plan:", plan);

    // Get categories to convert IDs to names
    const categoryList = await getCategories();
    const categoryName =
      categories.length > 0
        ? categoryList.find((cat) => cat.id === categories[0])?.categoryName ||
          ""
        : "";

    // Create form data in the format expected by toAirtable transform
    const airtableFormData = {
      name: name,
      link: link,
      description: description,
      introduction: introduction,
      unique: unique,
      format: format,
      notes: notes,
      email: email,
      phone: phone,
      city: city,
      state: state,
      zip: zip,
      bondNumber: bondNumber,
      plan: plan,
      performerPermit: performerPermit,
      bonded: bonded,
      categories: categories, // Pass the original category IDs
      tags: [], // Not implemented yet
      iconId: iconId,
    };

    console.log("submit, creating listing in Airtable:", airtableFormData);

    const listingId = await createListing(airtableFormData);
    if (!listingId) {
      console.log("submit, failed to create listing in Airtable");
      console.error("Airtable creation failed - check server logs for details");
      return {
        status: "error",
        message:
          "Failed to submit listing to Airtable. Please check the console for details.",
      };
    }

    console.log("submit, success, listingId:", listingId);

    // Revalidate the submit page
    revalidatePath("/submit");

    return {
      status: "success",
      message: "Successfully submitted listing",
      id: listingId,
    };
  } catch (error) {
    console.log("submit, error", error);
    console.error("Submit error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      formData: formData,
    });
    return {
      status: "error",
      message: `Failed to submit: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
