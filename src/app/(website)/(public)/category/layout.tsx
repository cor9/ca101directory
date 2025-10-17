import { CategoryFilter } from "@/components/category/category-filter";
import Container from "@/components/container";

export default function CategoryLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="bauhaus mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-2 text-foreground text-center">
          <p className="uppercase tracking-wider font-semibold text-gradient_blue-orange">
            Category
          </p>
          <h1 className="mt-2 px-4 text-3xl md:text-5xl font-bold">
            Explore by categories
          </h1>
          <p className="mt-4 px-4 text-lg opacity-80 max-w-3xl">
            Browse all categories and find professionals that match your needs.
          </p>
        </div>
      </div>

      <Container className="mt-4">
        <div className="flex gap-8 text-foreground">
          <CategoryFilter />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </Container>
    </div>
  );
}
