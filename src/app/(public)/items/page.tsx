import { sanityClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export default async function ItemsPage() {
    const itemListQuery = groq`*[_type == "item"]`;
    const itemList = await sanityClient.fetch(itemListQuery);
    console.log('ItemsPage, itemList:', itemList);

    return (
        <div>
            {
                itemList.map((item: { _id: string; }) => (
                    <div key={item._id}>
                        {item._id}
                    </div>
                ))
            }
        </div>
    );
}
