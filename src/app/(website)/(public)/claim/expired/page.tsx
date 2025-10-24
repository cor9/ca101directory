export const metadata = {
  title: "Claim Link Expired - Child Actor 101",
  description: "Your claim link has expired. Request a fresh link.",
};

export default function ClaimExpiredPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-ink mb-2">This claim link has expired</h1>
      <p className="text-paper mb-4">
        No worries — your listing is still live. Please contact us and we’ll send a fresh claim link.
      </p>
      <a
        href="mailto:corey@childactor101.com?subject=Claim%20Link%20Request"
        className="inline-flex items-center rounded-md bg-brand-blue text-white px-4 py-2"
      >
        Request a new claim link
      </a>
    </div>
  );
}

