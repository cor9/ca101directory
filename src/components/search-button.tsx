import Link from "next/link";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

export const SearchButton = ({ clickAction }: { clickAction?: () => void }) => {
    return (
        <Button asChild variant="ghost" size="icon" className="px-0">
            <Link href={'/search'}
                onClick={clickAction}
                prefetch={false}>
                <Search className="size-5" />
                <span className="sr-only">Search</span>
            </Link>
        </Button>
    )
}