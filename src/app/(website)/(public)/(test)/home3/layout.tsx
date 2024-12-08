import Container from "@/components/container";
import HomeHero from "@/components/home/home-hero";
import { HomeCategoryList } from "@/components/home3/home-category-list";
import { HomeSearchFilter } from "@/components/home3/home-search-filter";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Container className="mt-12 mb-16 flex flex-col gap-12">
      <HomeHero />

      <div className="flex flex-col md:flex-row gap-8">
        {/* left sidebar: category list */}
        <div className="hidden md:block w-[250px] flex-shrink-0">
          <div className="sticky top-24">
            <HomeCategoryList urlPrefix="/home3" />
          </div>
        </div>

        {/* right content: item grid */}
        <div className="flex-1">
          <div className="flex flex-col gap-8">
            <HomeSearchFilter urlPrefix="/home3" />
            {children}
          </div>
        </div>
      </div>

      <NewsletterCard />
    </Container>
  );
}
