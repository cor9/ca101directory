import { sanityFetch } from "@/sanity/lib/fetch";
import { tagListQuery } from "@/sanity/lib/queries";
import { TagListQueryResult } from "@/sanity.types";
import Link from "next/link";

export default async function TagListPage() {
    const tagList = await sanityFetch<TagListQueryResult>({
        query: tagListQuery
    });
    console.log('TagListPage, tagList:', tagList);

    return (
        <div>
            <Link href={`/item`} className="block">Item List</Link>
            <Link href={`/tag`} className="block">Tag List</Link>
            <Link href={`/category`} className="block">Category List</Link>
            {
                tagList.map(tag => (
                    <div key={tag._id}>
                        <Link href={`/tag/${tag.slug?.current}`}>
                            {tag.name?.find(entry => entry._key === "en")?.value}
                        </Link>
                    </div>
                ))
            }
        </div>
    );
}
