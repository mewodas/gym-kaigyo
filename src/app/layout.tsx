import type { Metadata } from "next";
import { Noto_Sans_JP, Playfair_Display } from "next/font/google";
import "./globals.css";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { FooterWrapper } from "@/components/FooterWrapper";
import { Analytics } from "@/components/Analytics";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gym-kaigyo.jp"),
  title: {
    default: "ジム開業ラボ｜パーソナルジムのエリア調査・競合分析と開業ノウハウ",
    template: "%s | ジム開業ラボ",
  },
  description:
    "現役ジムオーナーが山手線の駅ごとにパーソナルジムを調査。料金・立地・強みの比較と、開業を考える人向けの競合分析、開業の全手順をまとめています。",
  keywords: [
    "パーソナルジム開業",
    "ジム経営",
    "副業トレーナー",
    "AI活用",
    "開業費用",
    "レンタルジム",
    "集客",
    "個人事業主",
  ],
  authors: [{ name: "ジム開業ラボ" }],
  openGraph: {
    siteName: "ジム開業ラボ",
    locale: "ja_JP",
    type: "website",
    url: "https://gym-kaigyo.jp",
    title: "ジム開業ラボ｜パーソナルジムのエリア調査・競合分析と開業ノウハウ",
    description:
      "パーソナルジムを実際に開業したオーナーが、費用・器具・集客・AI活用まで全手順をリアルな数字で解説。",
  },
  twitter: {
    card: "summary_large_image",
    title: "ジム開業ラボ",
    description:
      "実際に開業したオーナーが書く、パーソナルジム開業の完全ガイド。費用・器具・集客・AI活用まで実数字で解説。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://gym-kaigyo.jp",
  },
  verification: {
    google: "GnXR6wd9HdZ0cGrMj1u7Yh7QwtfOyB7VyVYVvKEYL_M",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${playfair.variable}`}>
      <body className={`${notoSansJP.className} bg-white text-gray-900 antialiased`}>
        <HeaderWrapper />
        <main className="min-h-screen">{children}</main>
        <FooterWrapper />
        <Analytics />
      </body>
    </html>
  );
}
