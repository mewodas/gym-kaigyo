import Link from "next/link";

const COLS = [
  {
    heading: "カテゴリ",
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
    heading: "サイトについて",
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
      <div className="max-w-6xl mx-auto px-6" style={{ padding: "72px 24px 36px" }}>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12">

          {/* Brand block */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{
                display: "inline-block",
                width: 2,
                height: 32,
                background: "#FF6200",
                boxShadow: "0 0 8px rgba(255,98,0,0.6)",
              }} />
              <span style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: "0.04em",
              }}>
                ジム開業ラボ
              </span>
            </div>
            <p style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 13,
              lineHeight: 1.85,
              maxWidth: 320,
              marginBottom: 22,
            }}>
              副業から始める、ジム経営のリアル。<br />
              パーソナルジムとレンタルジムを運営するオーナーが、費用・器具・集客・AI活用まで実数字で公開しています。
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "X", href: "https://x.com/gym_kaigyo_lab" },
                { label: "Threads", href: "#" },
                { label: "note", href: "#" },
              ].map((s) => (
                <Link key={s.label} href={s.href}
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
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
              <span style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 18,
                display: "block",
                paddingBottom: 10,
                borderBottom: "1px solid rgba(255,98,0,0.4)",
                width: "fit-content",
              }}>
                {col.heading}
              </span>
              <nav style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
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

        <div style={{
          height: 1,
          background: "rgba(255,255,255,0.08)",
          margin: "56px 0 24px",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            © 2026 ジム開業ラボ
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            東京 / Japan
          </p>
        </div>
      </div>
    </footer>
  );
}
