import Link from "next/link";

const NAV_ITEMS = [
  { label: "開業手順", href: "/kaigyo" },
  { label: "費用・資金", href: "/hiyou" },
  { label: "器具・設備", href: "/kigu" },
  { label: "集客", href: "/shukaku" },
  { label: "AI活用", href: "/ai-keiei" },
  { label: "副業", href: "/fukugyou" },
];

export function Header() {
  return (
    <header style={{
      background: "#fff",
      borderBottom: "3px solid #FF6200",
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ color: "#FF6200", fontSize: 11, fontWeight: 700 }}>パーソナルジム開業マニュアル</span>
          <span style={{ color: "#333", fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px" }}>ジム開業ラボ</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ color: "#006EBD", fontSize: 14, fontWeight: 500 }}
              className="hover:opacity-60 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          style={{
            background: "#FF6200",
            color: "#fff",
            borderRadius: 6,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 4px 11px rgba(0,0,0,0.16)",
          }}
          className="hover:opacity-80 transition-opacity"
        >
          AI活用の相談をする
        </Link>
      </div>
    </header>
  );
}
