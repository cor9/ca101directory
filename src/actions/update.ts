"use server";

import { auth } from "@/auth";
import { UpdateSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { nanoid } from 'nanoid';
import { revalidatePath } from "next/cache";

export type UpdateFormData = {
  id: string;
  name: string;
  link: string;
  description: string;
  introduction: string;
  tags: string[];
  categories: string[];
  imageId: string;
};

/**
 * https://nextjs.org/learn/dashboard-app/mutating-data
 */
export async function Update(formData: UpdateFormData) {
  try {
    const session = await auth();
    if (!session?.user || !session?.user?.id) {
      console.log("update, unauthorized");
      throw new Error("Unauthorized");
    }
    console.log("update, username:", session?.user?.name);

    console.log("update, data:", formData);
    const { id, name, link, description, introduction, imageId,
      tags, categories } = UpdateSchema.parse(formData);
    console.log("update, name:", name, "link:", link);

    // TODO: check if the user is the submitter of the item

    const data = {
      _id: id,
      _type: "item",
      name,
      slug: {
        _type: "slug",
        current: slugify(name),
      },
      link,
      description,
      introduction,

      // don't update submitter
      // submitter: {
      //   _type: "reference",
      //   _ref: session.user.id,
      // },

      // don't update publishDate
      // publishDate: new Date().toISOString(),

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
      ...(imageId ?
        {
          image: {
            _type: "image",
            alt: `image of ${name}`,
            asset: {
              _type: 'reference',
              _ref: imageId
            }
          }
        } : {})
    };

    console.log("update, data:", data);

    const res = await sanityClient.patch(id).set(data).commit();
    if (!res) {
      console.log("update, fail");
      return { status: "error" };
    }

    console.log("update, success, res:", res);

    // Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. 
    // Along with prefetching, this cache ensures that users can quickly navigate between routes 
    // while reducing the number of requests made to the server.
    // Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. 
    // You can do this with the revalidatePath function from Next.js.
    revalidatePath('/update');
    return { status: "success" };
  } catch (error) {
    console.log("update, error", error);
    return { status: "error" };
  }
}
