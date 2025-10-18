import { CategoryFilter } from "@/components/category/category-filter";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";

export default function CategoryLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="bauhaus">
      {/* Eyebrow label only (H1 rendered on page.tsx) */}
      <div className="py-4 text-center relative hollywood-accent">
        <HeaderSection labelAs="p" label="Category" />
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
