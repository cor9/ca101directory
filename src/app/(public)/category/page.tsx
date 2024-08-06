import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery } from "@/sanity/lib/queries";
import { CategoryListQueryResult } from "@/sanity.types";
import Link from "next/link";

export default async function CategoryListPage() {
    const categoryList = await sanityFetch<CategoryListQueryResult>({
        query: categoryListQuery
    });
    console.log('CategoryListPage, categoryList:', categoryList);

    return (
        <div>
            <Link href={`/item`} className="block">Item List</Link>
            <Link href={`/tag`} className="block">Tag List</Link>
            <Link href={`/category`} className="block">Category List</Link>
            {
                categoryList.map(category => (
                    <div key={category._id}>
                        <Link href={`/tag/${category.slug}`}>
                            {category.name?.find(kv => kv._key === "en")?.value}
                        </Link>
                    </div>
                ))
            }
        </div>
    );
}
