import { CategoryFilter } from "@/components/category/category-filter";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";

export default function CategoryLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="bauhaus">
      <div className="hero hollywood-accent">
        <HeaderSection
          labelAs="h1"
          label="Category"
          titleAs="h2"
          title="Explore by categories"
        />
      </div>

      <main className="layout">
        <aside className="sidebar" style={{ borderRadius: 4 }}>
          <CategoryFilter />
        </aside>
        <section className="min-w-0">
          <div className="grid">
            <div className="card">{children}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
