/**
 * Quick-find shortcut grid — placed above the listing results on the homepage.
 * Links to high-traffic categories for immediate navigation.
 */
export function QuickFindBlock() {
  const shortcuts = [
    { label: "Headshot Photographers", href: "/category/headshot-photographers" },
    { label: "Acting Coaches", href: "/category/acting-classes-coaches" },
    { label: "Self-Tape Studios", href: "/category/self-tape-studios" },
    { label: "Mental Health for Performers", href: "/category/mental-health-for-performers" },
  ];

  return (
    <section className="quick-find">
      <h2 className="quick-find__title">Find the Right Fit Fast</h2>
      <div className="quick-find__grid">
        {shortcuts.map(({ label, href }) => (
          <a key={href} href={href} className="quick-find__item">
            {label}
          </a>
        ))}
      </div>

      <style>{`
        .quick-find {
          padding: 28px 20px 12px;
          max-width: 900px;
          margin: 0 auto;
        }
        .quick-find__title {
          font-size: 18px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        .quick-find__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 640px) {
          .quick-find__grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .quick-find__item {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #cbd5e1;
          padding: 14px 12px;
          text-align: center;
          font-weight: 600;
          font-size: 13px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          line-height: 1.35;
        }
        .quick-find__item:hover {
          background: rgba(237, 209, 125, 0.12);
          border-color: #edd17d;
          color: #edd17d;
        }
      `}</style>
    </section>
  );
}
