import Link from "next/link";

const COLS = [
  {
    heading: "Categories",
    headingJp: "カテゴリ",
    links: [
      { label: "開業手順", href: "/kaigyo" },
      { label: "費用・資金", href: "/hiyou" },
      { label: "器具・設備", href: "/kigu" },
      { label: "集客", href: "/shukaku" },
      { label: "AI活用経営", href: "/ai-keiei" },
      { label: "副業トレーナー", href: "/fukugyou" },
    ],
  },
  {
    heading: "About",
    headingJp: "サイトについて",
    links: [
      { label: "著者プロフィール", href: "/profile" },
      { label: "お問い合わせ", href: "/contact" },
    ],
  },
];

export function FooterV2() {
  return (
    <footer style={{
      background: "#070912",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      color: "#fff",
    }}>
      <div className="max-w-6xl mx-auto px-6" style={{ padding: "80px 24px 40px" }}>

        {/* Top: Brand + Cols */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12">

          {/* Brand block */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <span style={{
                display: "inline-block",
                width: 2,
                height: 40,
                background: "#FF6200",
                boxShadow: "0 0 8px rgba(255,98,0,0.6)",
              }} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "0.02em",
                }}>
                  Gym<span style={{ color: "#FF6200" }}>·</span>Kaigyo
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.35em",
                  marginTop: 5,
                  textTransform: "uppercase",
                }}>
                  The Lab — est. 2026
                </span>
              </div>
            </div>
            <p style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 13,
              lineHeight: 1.85,
              maxWidth: 320,
              marginBottom: 24,
            }}>
              副業から始める、ジム経営のリアル。<br />
              パーソナル＋レンタルの2業態を運営するオーナーが、費用・器具・集客・AI活用まで実数字で公開しています。
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {/* Social placeholders */}
              {[
                { label: "X", href: "https://x.com/gym_kaigyo_lab" },
                { label: "Threads", href: "#" },
                { label: "Note", href: "#" },
              ].map((s) => (
                <Link key={s.label} href={s.href}
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                    paddingBottom: 2,
                  }}
                  className="hover:text-white hover:border-white transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {COLS.map((col) => (
            <div key={col.heading}>
              <div style={{ marginBottom: 18 }}>
                <span style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontStyle: "italic",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#FF8C42",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  display: "block",
                }}>
                  {col.heading}
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2, display: "block" }}>
                  {col.headingJp}
                </span>
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((link) => (
                  <Link key={link.href} href={link.href}
                    style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none" }}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "rgba(255,255,255,0.08)",
          margin: "60px 0 24px",
        }} />

        {/* Bottom: Copyright */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            fontStyle: "italic",
          }}>
            © 2026 Gym Kaigyo Lab. All rights reserved.
          </p>
          <p style={{
            fontSize: 10,
            fontWeight: 600,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}>
            Tokyo / Japan
          </p>
        </div>
      </div>
    </footer>
  );
}
