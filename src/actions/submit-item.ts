"use server";

import { auth } from "@/auth";
import { SubmitItemSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type SubmitItemFormData = {
  name: string;
  link: string;
  description: string;
  tags: string[];
  categories: string[];
  logoImageId: string;
  coverImageId: string;
};

// https://nextjs.org/learn/dashboard-app/mutating-data
export async function SubmitItem(data: SubmitItemFormData) {
  try {
    const session = await auth();
    if (!session?.user || !session?.user?.id) {
      console.log("submitItem, unauthorized");
      throw new Error("Unauthorized");
    }
    console.log("submitItem, username:", session?.user?.name);

    console.log("submitItem, data:", data);
    const { name, link, description, logoImageId, coverImageId,
      tags, categories } = SubmitItemSchema.parse(data);
    console.log("submitItem, name:", name, "link:", link);

    const submitData = {
      _type: "item",
      name,
      slug: {
        _type: "slug",
        current: slugify(name),
      },
      link,
      // TODO: rename to excerpt
      description,
      content: [{
        _type: 'block',
        style: 'h3',
        _key: 'key_12345',
        children: [
          {
            _type: 'span',
            text: 'Hello world!',
            _key: 'key_67890',
          }
        ]
      },
      {
        _type: 'block',
        style: 'h4',
        _key: 'key_123456',
        children: [
          {
            _type: 'span',
            text: 'Hello world!',
            _key: 'key_567890',
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        _key: 'key_1234567',
        children: [
          {
            _type: 'span',
            text: 'Hello world!',
            _key: 'key_4567890',
          }
        ]
      }],
      // status: "reviewing",
      submitter: {
        _type: "reference",
        _ref: session.user.id,
      },
      publishDate: new Date().toISOString(),
      // TODO: fix key- prefix here
      tags: tags.map(tag => ({
        _type: 'reference',
        _ref: tag,
        _key: `key_${tag}`,
      })),
      categories: categories.map(category => ({
        _type: 'reference',
        _ref: category,
        _key: `key_${category}`,
      })),
      // TODO: maybe remove logo image
      ...(logoImageId ?
        {
          logo: {
            _type: "image",
            alt: `logo of ${name}`,
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
            alt: `screenshot of ${name}`,
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