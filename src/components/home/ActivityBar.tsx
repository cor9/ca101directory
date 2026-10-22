/**
 * Badge legend: what the public badges on a listing mean.
 * Used on homepage and category pages.
 */
export function ActivityBar() {
  return (
    <div className="activity-bar">
      <span>
        <strong>Verified Business</strong> = owner completed ownership
        verification (not an endorsement)
      </span>
      <span className="activity-bar__dot" aria-hidden="true">·</span>
      <span>
        <strong>Featured</strong> = paid promotional placement
      </span>

      <style>{`
        .activity-bar {
          background: #f1e6cf;
          border-bottom: 1px solid #e2dacb;
          color: #2a303b;
          font-size: 13px;
          padding: 9px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          text-align: center;
          letter-spacing: 0.01em;
        }
        .activity-bar__dot {
          color: #76561f;
        }
      `}</style>
    </div>
  );
}
