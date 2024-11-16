import Container from "@/components/container";
import { ItemGridSkeleton } from "@/components/item/item-grid";

export default function Loading() {
  return (
    <div>
      {/* home content */}
      <Container className="mt-12 flex flex-col gap-8">
        <ItemGridSkeleton count={12} />
      </Container>
    </div>
  );
}
