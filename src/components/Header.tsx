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
    <header
      style={{ borderBottom: "1px solid var(--color-hairline)", background: "var(--color-canvas)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: 18, letterSpacing: "-0.3px" }}
        >
          ジム開業ラボ
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ color: "var(--color-ink)", fontSize: 14, fontWeight: 500 }}
              className="hover:opacity-70 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          style={{
            background: "var(--color-primary)",
            color: "#fff",
            borderRadius: 100,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.15,
          }}
          className="hover:opacity-90 transition-opacity"
        >
          無料相談
        </Link>
      </div>
    </header>
  );
}
