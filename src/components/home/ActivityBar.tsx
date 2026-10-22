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
          background: rgba(237, 209, 125, 0.08);
          border-top: 1px solid rgba(237, 209, 125, 0.2);
          border-bottom: 1px solid rgba(237, 209, 125, 0.2);
          color: #cbd5e1;
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
          color: rgba(237, 209, 125, 0.4);
        }
      `}</style>
    </div>
  );
}
