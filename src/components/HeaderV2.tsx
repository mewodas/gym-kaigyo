import Link from "next/link";

const NAV_ITEMS = [
  { label: "開業手順", href: "/kaigyo" },
  { label: "費用・資金", href: "/hiyou" },
  { label: "器具・設備", href: "/kigu" },
  { label: "集客", href: "/shukaku" },
  { label: "AI活用", href: "/ai-keiei" },
  { label: "副業", href: "/fukugyou" },
];

export function HeaderV2() {
  return (
    <header style={{
      background: "rgba(10, 14, 26, 0.78)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <span style={{
            display: "inline-block",
            width: 2,
            height: 28,
            background: "#FF6200",
            boxShadow: "0 0 8px rgba(255,98,0,0.6)",
          }} />
          <span style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: "0.04em",
          }}>
            ジム開業ラボ
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ color: "rgba(255,255,255,0.78)", fontSize: 13.5, fontWeight: 500 }}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          style={{
            background: "rgba(255, 98, 0, 0.15)",
            border: "1px solid rgba(255, 98, 0, 0.4)",
            color: "#FF8C42",
            borderRadius: 100,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 700,
            backdropFilter: "blur(10px)",
          }}
          className="hover:bg-orange-500/25 transition-colors"
        >
          相談する
        </Link>
      </div>
    </header>
  );
}
