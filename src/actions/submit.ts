"use server";

import { currentUser } from "@/lib/auth";
import { createListing } from "@/lib/airtable";
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
  imageId: string;
  tags: string[];
  categories: string[];
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
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }

    // console.log("submit, data:", formData);
    const {
      name,
      link,
      description,
      introduction,
      imageId,
      tags,
      categories,
      ...rest
    } = SubmitSchema.parse(formData);
    const iconId = "iconId" in rest ? rest.iconId : undefined;
    console.log("submit, name:", name, "link:", link);

    // Create listing in Airtable
    const listingData = {
      businessName: name,
      email: user.email || "",
      phone: "", // Will be filled in payment step
      website: link,
      description: description,
      servicesOffered: introduction,
      category: categories, // Array of category names
      ageRange: tags, // Array of age range tags
      location: "", // Will be filled in payment step
      virtual: false,
      plan: "Basic" as const,
      featured: false,
      approved101: false,
      status: "Pending" as const,
      dateSubmitted: new Date().toISOString(),
    };

    console.log("submit, creating listing in Airtable:", listingData);

    const listingId = await createListing(listingData);
    if (!listingId) {
      console.log("submit, failed to create listing in Airtable");
      return { status: "error", message: "Failed to submit listing" };
    }

    console.log("submit, success, listingId:", listingId);

    // Revalidate the submit page
    revalidatePath("/submit");

    return { status: "success", message: "Successfully submitted listing", id: listingId };
  } catch (error) {
    console.log("submit, error", error);
    return { status: "error", message: "Failed to submit" };
  }
}
