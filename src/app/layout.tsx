import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ジム開業ラボ｜実際に開業したオーナーが書く開業マニュアル",
    template: "%s | ジム開業ラボ",
  },
  description:
    "パーソナルジムを実際に開業したオーナーが、費用・器具・集客・AI活用まで全手順をリアルな数字で解説。副業トレーナーから独立を目指す方にも。",
  openGraph: {
    siteName: "ジム開業ラボ",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} bg-white text-gray-900 antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
