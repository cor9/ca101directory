"use server";

import { auth } from "@/auth";
import { SubmitSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { nanoid } from 'nanoid';

export type UpdateFormData = {
  name: string;
  link: string;
  description: string;
  introduction: string;
  tags: string[];
  categories: string[];
  imageId: string;
};

// https://nextjs.org/learn/dashboard-app/mutating-data
export async function Update(data: UpdateFormData) {
  try {
    const session = await auth();
    if (!session?.user || !session?.user?.id) {
      console.log("update, unauthorized");
      throw new Error("Unauthorized");
    }
    console.log("update, username:", session?.user?.name);

    console.log("update, data:", data);
    const { name, link, description, introduction, imageId,
      tags, categories } = SubmitSchema.parse(data);
    console.log("update, name:", name, "link:", link);

    const submitData = {
      _type: "item",
      name,
      slug: {
        _type: "slug",
        current: slugify(name),
      },
      link,
      description,
      introduction,
      // status: "reviewing",
      submitter: {
        _type: "reference",
        _ref: session.user.id,
      },
      publishDate: new Date().toISOString(),
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

    console.log("update, data:", submitData);

    const res = await sanityClient.create(submitData);
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
    revalidatePath('/dashboard/update');
    return { status: "success" };
  } catch (error) {
    console.log("update, error", error);
    return { status: "error" };
  }
}
