import Link from "next/link";

const NAV_ITEMS = [
  { label: "OPEN", labelJp: "開業手順", href: "/kaigyo" },
  { label: "COST", labelJp: "費用", href: "/hiyou" },
  { label: "GEAR", labelJp: "器具", href: "/kigu" },
  { label: "REACH", labelJp: "集客", href: "/shukaku" },
  { label: "AI", labelJp: "AI活用", href: "/ai-keiei" },
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
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo - editorial magazine style */}
        <Link href="/v2" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
          <span style={{
            display: "inline-block",
            width: 2,
            height: 36,
            background: "#FF6200",
            boxShadow: "0 0 8px rgba(255,98,0,0.6)",
          }} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.02em",
            }}>
              Gym<span style={{ color: "#FF6200" }}>·</span>Kaigyo
            </span>
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.35em",
              marginTop: 4,
              textTransform: "uppercase",
            }}>
              The Lab — est. 2026
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1, textDecoration: "none" }}
            >
              <span style={{
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}>
                {item.label}
              </span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600 }}
                className="group-hover:text-white transition-colors">
                {item.labelJp}
              </span>
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          style={{
            background: "transparent",
            border: "1px solid rgba(255, 98, 0, 0.5)",
            color: "#FF8C42",
            borderRadius: 100,
            padding: "9px 22px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            backdropFilter: "blur(10px)",
          }}
          className="hover:bg-orange-500/10 transition-colors"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
