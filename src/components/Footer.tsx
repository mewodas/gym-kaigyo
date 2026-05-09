import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-20">
      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">
        <div>
          <p className="font-bold text-gray-900 mb-1">ジム開業ラボ</p>
          <p>実際に開業したオーナーが書くリアルな開業マニュアル</p>
        </div>
        <nav className="flex flex-col gap-1">
          <Link href="/kaigyo" className="hover:text-gray-900">開業手順</Link>
          <Link href="/hiyou" className="hover:text-gray-900">費用・資金</Link>
          <Link href="/kigu" className="hover:text-gray-900">器具・設備</Link>
          <Link href="/shukaku" className="hover:text-gray-900">集客</Link>
          <Link href="/ai-keiei" className="hover:text-gray-900">AI活用経営</Link>
          <Link href="/fukugyou" className="hover:text-gray-900">副業トレーナー</Link>
        </nav>
        <nav className="flex flex-col gap-1">
          <Link href="/profile" className="hover:text-gray-900">著者プロフィール</Link>
          <Link href="/contact" className="hover:text-gray-900">お問い合わせ・無料相談</Link>
        </nav>
      </div>
      <p className="text-center text-xs text-gray-400 pb-6">© 2026 ジム開業ラボ</p>
    </footer>
  );
}
