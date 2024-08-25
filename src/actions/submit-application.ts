"use server";

import { auth } from "@/auth";
import { applicationSchema } from "@/lib/schemas";
// import { UserQueryResult } from "@/sanity.types";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type submitApplicationFormData = {
  name: string;
  link: string;
  logoImageId: string;
  coverImageId: string;
  description: string;
  // types: string[]; // TODO: fix this
  // tags: string[];
  // categories: string[];
  // sanityUser: UserQueryResult;
};

// https://nextjs.org/learn/dashboard-app/mutating-data
export async function submitApplication(/* userId: string,  */data: submitApplicationFormData) {
  try {
    const session = await auth();
    if (!session?.user/*  || session?.user.id !== userId */) { // TODO: fix this, remove userId parameter
      console.log("submitApplication, unauthorized");
      throw new Error("Unauthorized");
    }
    const userId = session?.user?.id; // TODO: fix this, remove userId parameter
    console.log("submitApplication, username:", session?.user?.name);

    const { logoImageId, coverImageId, /* tags, categories, */ /* types, sanityUser */ } = data;
    console.log("submitApplication, data:", data);
    const { name, link, description } = applicationSchema.parse(data);
    console.log("submitApplication, name:", name, "link:", link,
      "description:", description);

    const submitData = {
      _type: "item",
      name,
      link,
      description,
      // status: "reviewing",
      submitter: {
        _type: "reference",
        // _ref: sanityUser?._id,
        _ref: userId, // TODO: fix this
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

    console.log("submitApplication, submitData:", submitData);

    const res = await sanityClient.create(submitData);
    if (!res) {
      console.log("submitApplication, fail");
      return { status: "error" };
    }

    console.log("submitApplication, success, res:", res);

    // Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. 
    // Along with prefetching, this cache ensures that users can quickly navigate between routes 
    // while reducing the number of requests made to the server.
    // Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. 
    // You can do this with the revalidatePath function from Next.js.
    revalidatePath('/dashboard/submit');
    return { status: "success" };
  } catch (error) {
    console.log("submitApplication, error", error);
    return { status: "error" };
  }
}