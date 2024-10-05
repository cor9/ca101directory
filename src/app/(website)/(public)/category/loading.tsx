import Container from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="mt-8 pb-16">
      <div className="flex flex-col gap-8">
        {/* Category Header */}
        <div className="text-center">
          <Skeleton className="h-6 w-32 mx-auto mb-2" /> {/* Category label */}
          <Skeleton className="h-12 w-64 mx-auto" /> {/* Category title */}
        </div>

        {/* Category Filter */}
        <div className="w-full mx-auto text-center">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-[16/9] rounded-lg" /> {/* Item image */}
              <Skeleton className="h-6 w-3/4" /> {/* Item title */}
              <Skeleton className="h-4 w-1/2" /> {/* Item subtitle */}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <Skeleton className="h-10 w-32" /> {/* Pagination button */}
        </div>
      </div>
    </Container>
  );
}