import { ItemFullInfo } from "@/types";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";

interface ItemBreadCrumbProps {
  item: ItemFullInfo;
}

/**
 * breadcrumb for item, we just show the first category of items
 */
export default function ItemBreadCrumb({ item }: ItemBreadCrumbProps) {
  return <Breadcrumb className="">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href={`/`}>
          <div className="flex items-center gap-1">
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </div>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href={`/category`}>
          <span>Category</span>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href={`/category/${item?.categories?.[0]?.slug?.current}`}>
          {item?.categories?.[0]?.name}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="font-medium">
          {item?.name}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>;
}