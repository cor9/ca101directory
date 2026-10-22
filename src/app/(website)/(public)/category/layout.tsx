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

      {/* Full-width content without sidebar */}
      <main className="max-w-7xl mx-auto px-6">{children}</main>
    </div>
  );
}
