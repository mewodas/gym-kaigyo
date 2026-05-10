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
      background: "rgba(10, 14, 26, 0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/v2" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 30,
            height: 30,
            background: "linear-gradient(135deg, #FF6200 0%, #ff8c42 100%)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 900,
            color: "#fff",
            boxShadow: "0 0 20px rgba(255,98,0,0.5)",
          }}>G</span>
          <span style={{
            color: "#fff",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: "-0.3px",
          }}>
            ジム開業ラボ
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ color: "rgba(255,255,255,0.7)", fontSize: 13.5, fontWeight: 500 }}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

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
          相談する →
        </Link>
      </div>
    </header>
  );
}
