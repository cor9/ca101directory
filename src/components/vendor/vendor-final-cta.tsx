export default function VendorFinalCta() {
  return (
    <div className="bg-gradient-to-r from-retro-blue to-tomato-red rounded-xl p-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
        Ready to grow your business?
      </h2>
      <p className="text-xl text-cream/90 mb-8 max-w-2xl mx-auto">
        Join thousands of professionals who trust Child Actor 101 to connect them with families
      </p>
      <a
        href="/submit"
        className="inline-flex items-center px-8 py-4 bg-cream text-charcoal rounded-xl hover:bg-cream/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
      >
        List Your Business Today
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
  );
}
