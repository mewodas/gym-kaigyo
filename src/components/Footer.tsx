import Link from "next/link";

const LINKS = [
  { label: "開業手順", href: "/kaigyo" },
  { label: "費用・資金", href: "/hiyou" },
  { label: "器具・設備", href: "/kigu" },
  { label: "集客", href: "/shukaku" },
  { label: "AI活用経営", href: "/ai-keiei" },
  { label: "副業トレーナー", href: "/fukugyou" },
  { label: "著者プロフィール", href: "/profile" },
  { label: "お問い合わせ", href: "/contact" },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--color-canvas)", borderTop: "1px solid var(--color-hairline)" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <p style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
              ジム開業ラボ
            </p>
            <p style={{ color: "var(--color-body)", fontSize: 14, maxWidth: 260, lineHeight: 1.6 }}>
              実際に開業したオーナーが書く、リアルな開業マニュアル。
            </p>
          </div>
          <nav className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ color: "var(--color-body)", fontSize: 14 }}
                className="hover:opacity-70 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div style={{ borderTop: "1px solid var(--color-hairline)", marginTop: 48, paddingTop: 24 }}>
          <p style={{ color: "var(--color-muted)", fontSize: 12 }}>© 2026 ジム開業ラボ</p>
        </div>
      </div>
    </footer>
  );
}
