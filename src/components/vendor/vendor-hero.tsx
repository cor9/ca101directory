import { LoginWrapper } from "@/components/auth/login-button";

export default function VendorHero() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="bauhaus-heading text-4xl md:text-6xl mb-6 text-paper">
        Get discovered by{" "}
        <span className="text-bauhaus-orange">thousands of families</span>{" "}
        looking for acting professionals
      </h1>
      <p className="bauhaus-body text-xl text-paper/90 mb-8 max-w-2xl mx-auto">
        Join the #1 directory for child actor vendors & industry pros
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <LoginWrapper mode="redirect" defaultRole="vendor">
          <button type="button" className="bauhaus-btn-primary text-lg">
            SIGN IN AS VENDOR
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
        <a href="/submit" className="bauhaus-btn-secondary text-lg">
          SUBMIT YOUR LISTING
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
