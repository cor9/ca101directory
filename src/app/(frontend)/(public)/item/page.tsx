import { sanityFetch } from "@/sanity/lib/fetch";
import { itemListQuery } from "@/sanity/lib/queries";
import { ItemListQueryResult } from "@/sanity.types";
import Link from "next/link";

export default async function ItemListPage() {
    const itemList = await sanityFetch<ItemListQueryResult>({
        query: itemListQuery
    });
    console.log('ItemListPage, itemList:', itemList);

    return (
        <div>
            <Link href={`/item`} className="block">Item List</Link>
            <Link href={`/tag`} className="block">Tag List</Link>
            <Link href={`/category`} className="block">Category List</Link>
            {
                itemList.map(item => (
                    <div key={item._id}>
                        <Link href={`/item/${item.slug?.current}`}>
                            {item.name?.find(entry => entry._key === "en")?.value}
                        </Link>
                        {/* {item.description?.find(entry => entry._key === "en")?.value} */}
                    </div>
                ))
            }
        </div>
    );
}
