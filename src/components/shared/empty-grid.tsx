export default function EmptyGrid() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4">No professionals found</h3>
        <p className="text-muted-foreground mb-6">
          We're still building our directory. Check back soon for more professionals, or submit your own listing to be featured.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Submit Your Listing
          </a>
          <a
            href="/"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse All Categories
          </a>
        </div>
      </div>
    </div>
  );
}
