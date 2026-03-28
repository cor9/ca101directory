/**
 * Proof of Life strip — social proof bar showing recent directory activity.
 * Used on homepage and category pages.
 */
export function ActivityBar() {
  return (
    <div className="activity-bar">
      <span>🔥 Parents are actively searching for vendors right now</span>
      <span className="activity-bar__dot" aria-hidden="true">·</span>
      <span>⭐ New listings added weekly</span>
      <span className="activity-bar__dot" aria-hidden="true">·</span>
      <span>✅ Verified professionals only</span>

      <style>{`
        .activity-bar {
          background: rgba(237, 209, 125, 0.08);
          border-top: 1px solid rgba(237, 209, 125, 0.2);
          border-bottom: 1px solid rgba(237, 209, 125, 0.2);
          color: #94a3b8;
          font-size: 12.5px;
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
