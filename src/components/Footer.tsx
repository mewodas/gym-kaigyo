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
    <footer>
      <div style={{ background: "#FAFAFA", borderTop: "1px solid #DEDEDE", padding: "40px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10 justify-between">
            <div>
              <p style={{ color: "#FF6200", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>パーソナルジム開業マニュアル</p>
              <p style={{ color: "#333", fontSize: 18, fontWeight: 900, marginBottom: 8 }}>ジム開業ラボ</p>
              <p style={{ color: "#666", fontSize: 13, maxWidth: 240, lineHeight: 1.7 }}>
                実際に開業したオーナーが書く、リアルな開業マニュアル。
              </p>
            </div>
            <nav className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ color: "#006EBD", fontSize: 13 }}
                  className="hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div style={{ background: "#333", padding: "14px 0", textAlign: "center" }}>
        <p style={{ color: "#fff", fontSize: 10 }}>© 2026 ジム開業ラボ</p>
      </div>
    </footer>
  );
}
