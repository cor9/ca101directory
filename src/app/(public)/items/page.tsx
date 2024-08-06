import { sanityFetch } from "@/sanity/lib/fetch";
import { itemListQuery } from "@/sanity/lib/queries";
import { ItemListQueryResult } from "@sanity/types";

export default async function ItemsPage() {
    const itemList = await sanityFetch<ItemListQueryResult>({
        query: itemListQuery
    });
    console.log('ItemsPage, itemList:', itemList);

    return (
        <div>
            {
                itemList.map(item => (
                    <div key={item._id}>
                        {item.name?.find(item => item._key === "en")?.value}
                        {item.description?.find(item => item._key === "en")?.value}
                    </div>
                ))
            }
        </div>
    );
}
