import Link from "next/link";

interface ClaimBannerProps {
  listingId: string;
}

/**
 * Shown at the very top of unclaimed listing pages.
 * Keeps the site's dark aesthetic with the gold accent color.
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
          background: #0d1b2a;
          color: #fff;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          border-bottom: 2px solid #edd17d;
          flex-wrap: wrap;
        }
        .claim-banner__text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .claim-banner__text strong {
          font-weight: 700;
          color: #edd17d;
          letter-spacing: 0.01em;
        }
        .claim-banner__text span {
          color: #94a3b8;
          font-size: 13px;
        }
        .claim-banner__btn {
          background: #edd17d;
          color: #0d1b2a;
          padding: 8px 16px;
          font-weight: 700;
          font-size: 13px;
          text-decoration: none;
          border-radius: 4px;
          white-space: nowrap;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .claim-banner__btn:hover {
          background: #f5df9a;
        }
      `}</style>
    </div>
  );
}
