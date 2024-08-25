"use server";

import { auth } from "@/auth";
import { SubmitSchema } from "@/lib/schemas";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type submitItemFormData = {
  name: string;
  link: string;
  description: string;
  logoImageId: string;
  coverImageId: string;
  // types: string[]; // TODO: fix this
  // tags: string[];
  // categories: string[];
};

// https://nextjs.org/learn/dashboard-app/mutating-data
export async function submitItem(data: submitItemFormData) {
  try {
    const session = await auth();
    if (!session?.user || !session?.user?.id) {
      console.log("submitItem, unauthorized");
      throw new Error("Unauthorized");
    }
    console.log("submitItem, username:", session?.user?.name);

    const { logoImageId, coverImageId, /* tags, categories, */ } = data;
    console.log("submitItem, data:", data);
    const { name, link, description } = SubmitSchema.parse(data);
    console.log("submitItem, name:", name, "link:", link,
      "description:", description);

    const submitData = {
      _type: "item",
      name,
      link,
      description,
      // status: "reviewing",
      submitter: {
        _type: "reference",
        _ref: session.user.id,
      },
      publishDate: new Date().toISOString(),
      // types: types.map(type => ({ // TODO: fix this
      //   _type: 'reference',
      //   _ref: type,
      //   _key: `key-${type}`,
      // })),
      // tags: tags.map(tag => ({
      //   _type: 'reference',
      //   _ref: tag,
      //   _key: `key-${tag}`,
      // })),
      // categories: categories.map(category => ({
      //   _type: 'reference',
      //   _ref: category,
      //   _key: `key-${category}`,
      // })),
      ...(logoImageId ?
        {
          logo: {
            _type: "image",
            asset: {
              _type: 'reference',
              _ref: logoImageId
            }
          }
        } : {}),
      ...(coverImageId ?
        {
          image: {
            _type: "image",
            asset: {
              _type: 'reference',
              _ref: coverImageId
            }
          }
        } : {})
    };

    console.log("submitItem, submitData:", submitData);

    const res = await sanityClient.create(submitData);
    if (!res) {
      console.log("submitItem, fail");
      return { status: "error" };
    }

    console.log("submitItem, success, res:", res);

    // Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. 
    // Along with prefetching, this cache ensures that users can quickly navigate between routes 
    // while reducing the number of requests made to the server.
    // Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. 
    // You can do this with the revalidatePath function from Next.js.
    revalidatePath('/dashboard/submit');
    return { status: "success" };
  } catch (error) {
    console.log("submitItem, error", error);
    return { status: "error" };
  }
}