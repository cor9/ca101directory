"use server";

import { currentUser } from "@/lib/auth";
import { SubmitSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { nanoid } from 'nanoid';
import { revalidatePath } from "next/cache";

export type SubmitFormData = {
  name: string;
  link: string;
  description: string;
  introduction: string;
  tags: string[];
  categories: string[];
  imageId: string;
};

// https://nextjs.org/learn/dashboard-app/mutating-data
export async function Submit(formData: SubmitFormData) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    console.log("submit, data:", formData);
    const { name, link, description, introduction, imageId,
      tags, categories } = SubmitSchema.parse(formData);
    console.log("submit, name:", name, "link:", link);

    const data = {
      _type: "item",
      name,
      slug: {
        _type: "slug",
        current: slugify(name),
      },
      link,
      description,
      introduction,
      publishDate: null,

      paid: false,
      pricePlan: "free",
      freePlanStatus: "submitted",
      submitter: {
        _type: "reference",
        _ref: user.id,
      },

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

    // console.log("submit, data:", data);

    const res = await sanityClient.create(data);
    if (!res) {
      console.log("submit, fail");
      return { status: "error" };
    }

    // console.log("submit, success, res:", res);

    // Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. 
    // Along with prefetching, this cache ensures that users can quickly navigate between routes 
    // while reducing the number of requests made to the server.
    // Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. 
    // You can do this with the revalidatePath function from Next.js.
    revalidatePath('/submit');

    return { status: "success", id: res._id };
  } catch (error) {
    console.log("submit, error", error);
    return { status: "error" };
  }
}
