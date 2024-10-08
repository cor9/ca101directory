import { BlogGridSkeleton } from "@/components/blog/blog-grid";
import Container from "@/components/container";
import HomeHero from "@/components/home/home-hero";
import { ItemGridSkeleton } from "@/components/item/item-grid";

export default function Loading() {
  return (
    <div>
      {/* hero section */}
      <Container className="mt-8">
        <HomeHero />
      </Container>

      {/* home content */}
      <Container className="mt-8 flex flex-col gap-8">
        <ItemGridSkeleton />
        <ItemGridSkeleton />
        <BlogGridSkeleton count={3} />
      </Container>
    </div>
  )
}