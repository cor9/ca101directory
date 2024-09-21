"use server";

import { auth } from "@/auth";
import { EditSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { nanoid } from 'nanoid';
import { revalidatePath } from "next/cache";

export type EditFormData = {
  id: string;
  name: string;
  link: string;
  description: string;
  introduction: string;
  tags: string[];
  categories: string[];
  imageId: string;
  pricePlan: string;
};

/**
 * https://nextjs.org/learn/dashboard-app/mutating-data
 */
export async function Edit(formData: EditFormData) {
  try {
    const session = await auth();
    if (!session?.user || !session?.user?.id) {
      console.log("edit, unauthorized");
      throw new Error("Unauthorized");
    }
    console.log("edit, username:", session?.user?.name);

    console.log("edit, data:", formData);
    const { id, name, link, description, introduction, imageId,
      tags, categories, pricePlan } = EditSchema.parse(formData);
    console.log("edit, name:", name, "link:", link);

    // TODO: check if the user is the submitter of the item

    const data = {
      _id: id,
      _type: "item",
      name,
      // TODO(javayhu): should I change slug? change slug only if name changes!
      slug: {
        _type: "slug",
        current: slugify(name),
      },
      link,
      description,
      introduction,

      // Free plan: update item leads to be unpublished and reviewed again
      ...(pricePlan === "free" && {
        publishDate: null,
        freePlanStatus: "reviewing",
      }),

      // The _key only needs to be unique within the array itself
      // use nanoid to generate a random string with 12 characters like sanity
      tags: tags.map(tag => ({
        _type: 'reference',
        _ref: tag,
        _key: nanoid(12),
      })),
      categories: categories.map(category => ({
        _type: 'reference',
        _ref: category,
        _key: nanoid(12),
      })),
      image: {
        _type: "image",
        alt: `image of ${name}`,
        asset: {
          _type: 'reference',
          _ref: imageId
        }
      }
    };

    // console.log("edit, data:", data);

    const res = await sanityClient.patch(id).set(data).commit();
    if (!res) {
      console.log("edit, fail");
      return { status: "error" };
    }

    // console.log("edit, success, res:", res);

    // Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. 
    // Along with prefetching, this cache ensures that users can quickly navigate between routes 
    // while reducing the number of requests made to the server.
    // Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. 
    // You can do this with the revalidatePath function from Next.js.

    // TODO: redirect to the updated item, but not working, still showing the old item
    revalidatePath(`/edit/${id}`);
    revalidatePath(`/item/${id}`);
    return { status: "success" };
  } catch (error) {
    console.log("edit, error", error);
    return { status: "error" };
  }
}
