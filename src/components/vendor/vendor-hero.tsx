import { LoginWrapper } from "@/components/auth/login-button";

export default function VendorHero() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-paper">
        Get discovered by{" "}
        <span className="bg-gradient-to-r from-primary-orange via-primary-mustard to-primary-orange bg-clip-text text-transparent">
          thousands of families
        </span>{" "}
        looking for acting professionals
      </h1>
      <p className="text-xl text-paper/90 mb-8 max-w-2xl mx-auto">
        Join the #1 directory for child actor vendors & industry pros
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <LoginWrapper mode="redirect" defaultRole="vendor">
          <button type="button" className="btn-primary text-lg">
            Sign In as Vendor
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
          </button>
        </LoginWrapper>
        <a
          href="/submit"
          className="btn-secondary text-lg"
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
