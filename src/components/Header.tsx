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
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-gray-900 tracking-tight">
          ジム開業ラボ
        </Link>
        <nav className="hidden md:flex gap-5 text-sm text-gray-600">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-gray-900 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-700 transition-colors"
        >
          無料相談
        </Link>
      </div>
    </header>
  );
}
