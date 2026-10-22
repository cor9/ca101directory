import Link from "next/link";

interface ClaimBannerProps {
  listingId: string;
}

/**
 * Shown at the very top of unclaimed listing pages.
 * Charcoal bar with a white action button (matches the site frame).
 */
export function ClaimBanner({ listingId }: ClaimBannerProps) {
  return (
    <div className="claim-banner">
      <div className="claim-banner__text">
        <strong>This listing is unclaimed.</strong>
        <span>You&apos;re already listed — but parents can&apos;t contact you yet.</span>
      </div>
      <Link href={`/claim/listing/${listingId}`} className="claim-banner__btn">
        Claim this listing →
      </Link>

      <style>{`
        .claim-banner {
          background: #0e1117;
          color: #fff;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.14);
          flex-wrap: wrap;
        }
        .claim-banner__text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .claim-banner__text strong {
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.01em;
        }
        .claim-banner__text span {
          color: #cbd5e1;
          font-size: 13px;
        }
        .claim-banner__btn {
          background: #ffffff;
          color: #18181b;
          padding: 8px 16px;
          font-weight: 700;
          font-size: 13px;
          text-decoration: none;
          border-radius: 6px;
          white-space: nowrap;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .claim-banner__btn:hover {
          background: #e4e4e7;
        }
        .claim-banner__btn:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
