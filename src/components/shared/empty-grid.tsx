export default function EmptyGrid() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          No exact matches
        </h3>
        <p className="text-text-secondary mb-2">
          Try broadening your search or exploring categories.
        </p>
        <p className="text-sm text-text-muted">
          New professionals are added weekly.
        </p>
      </div>
    </div>
  );
}
