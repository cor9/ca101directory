import { CategoryFilter } from "@/components/category/category-filter";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";

export default function CategoryLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="bauhaus">
      {/* Compact hero to avoid large empty band */}
      <div className="py-6 text-center relative hollywood-accent">
        <HeaderSection
          labelAs="h1"
          label="Category"
          titleAs="h2"
          title="Explore by categories"
        />
      </div>

      {/* Explicit grid so sidebar and content align without extra vertical gap */}
      <main className="max-w-7xl mx-auto px-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden md:block" style={{ borderRadius: 4 }}>
          <CategoryFilter />
        </aside>
        <section className="min-w-0">
          {children}
        </section>
      </main>
    </div>
  );
}
