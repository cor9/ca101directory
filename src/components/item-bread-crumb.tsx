import { ItemFullInfo } from "@/types";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";

interface ItemBreadCrumbProps {
  item: ItemFullInfo;
}

export default function ItemBreadCrumb({ item }: ItemBreadCrumbProps) {
  return <Breadcrumb className="">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href={`/category`}>
          Category
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href={`/category/${item?.categories?.[0]?.slug?.current}`}>
          {item?.categories?.[0]?.name?.find(item => item._key === "en")?.value}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="font-medium">
          {item?.name?.find(item => item._key === "en")?.value}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>;
}