export default function VendorFinalCta() {
  return (
    <div className="bg-paper border border-primary-orange/20 rounded-xl p-12 text-center shadow-lg">
      <h2 className="bauhaus-heading text-3xl md:text-4xl mb-4" style={{ color: "#1e1f23" }}>
        Ready to grow your business?
      </h2>
      <p className="bauhaus-body text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#1e1f23" }}>
        Join thousands of professionals who trust Child Actor 101 to connect
        them with families
      </p>
      <a
        href="/auth/register?role=vendor"
        className="bauhaus-btn-primary text-lg"
      >
        LIST YOUR BUSINESS TODAY
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
