export default function VendorHero() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-charcoal">
        Get discovered by thousands of families looking for acting professionals
      </h1>
      <p className="text-xl text-charcoal/70 mb-8 max-w-2xl mx-auto">
        Join the #1 directory for child actor vendors & industry pros
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/submit"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-retro-blue to-tomato-red text-cream rounded-xl hover:from-retro-blue/90 hover:to-tomato-red/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
        >
          Submit Your Listing
          <svg
            className="ml-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
