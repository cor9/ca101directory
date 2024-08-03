import { sanityClient } from "@/sanity/lib/client";

export default async function ItemsPage() {
    const itemListQuery = `*[_type == "item"]`;
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
