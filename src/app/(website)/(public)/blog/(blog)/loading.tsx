import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <Skeleton className="w-full aspect-[16/9] rounded-lg" />
            <Skeleton className="h-12 w-full" />
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Skeleton className="h-10 w-64" /> {/* Pagination button */}
      </div>
    </div>
  );
}