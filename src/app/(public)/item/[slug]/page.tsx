import { sanityClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";

type Props = {
  params: { slug: string };
};

export default async function ItemPage({ params }: Props) {
  const slug = params.slug;

  const itemQry = groq`*[_type == "item" && slug.current == ${slug}][0]`;
  const userQry = `*[_type == "user" && email == "${email}"][0]`;
  const itemResult = await sanityClient.fetch(itemQry);
  console.log('ItemPage, itemResult:', itemResult);
  
  return (
    <div>
      <h1>{itemResult.title}</h1>
      <h1>{itemResult.description}</h1>
      <h1>{itemResult.slug}</h1>
    </div>
  );
}
