import { sorting } from "@/lib/constants";
import FilterList from "./filter/filter-list";

export default function SortList() {
    return (
        <FilterList list={sorting} title="Sort by" />
    );
}