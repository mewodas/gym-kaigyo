import Link from "next/link";
import { getAllArticles, getCategoryLabel } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";

const CATEGORIES = [
  { slug: "kaigyo", label: "開業手順", desc: "物件・工事・手続きの全ステップ" },
  { slug: "hiyou", label: "費用・資金", desc: "実際にかかった金額を全公開" },
  { slug: "kigu", label: "器具・設備", desc: "何を買うべきか・中古活用術" },
  { slug: "shukaku", label: "集客", desc: "Google・SNS・紹介の効果別解説" },
  { slug: "ai-keiei", label: "AI活用経営", desc: "Claudeで業務を8割自動化" },
  { slug: "fukugyou", label: "副業トレーナー", desc: "副業→独立へのロードマップ" },
];

export default function Home() {
  const recentArticles = getAllArticles().slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center py-12 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-500 mb-3">実際に開業したオーナーが書く</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          パーソナルジム開業の<br />リアルをすべて公開
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
          「メヲダス」「delight gym」の2業態を同一スペースで運営するオーナーが、
          費用・器具・集客・AI活用まで実数字で解説します。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/kaigyo/kanzen-guide"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            開業完全ガイドを読む
          </Link>
          <Link
            href="/contact"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-gray-500 transition-colors"
          >
            無料相談（30分）
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <h2 className="text-xl font-bold mb-6">カテゴリから探す</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors"
            >
              <p className="font-bold text-gray-900 text-sm">{cat.label}</p>
              <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="py-8 border-t border-gray-100">
          <h2 className="text-xl font-bold mb-6">新着記事</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {recentArticles.map((article) => (
              <ArticleCard key={`${article.category}/${article.slug}`} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Profile CTA */}
      <section className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
        <p className="text-sm text-gray-500 mb-2">このサイトについて</p>
        <h2 className="text-xl font-bold mb-3">「日本一AIを使いこなすパーソナルトレーナー」を目指して</h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto mb-6 leading-relaxed">
          副業トレーナーからジムを開業し、AIで業務を自動化しながら7つの収益柱を構築中。
          すべてのプロセスをリアルタイムで公開します。
        </p>
        <Link href="/profile" className="text-sm font-medium text-gray-900 underline underline-offset-2">
          著者プロフィールを見る →
        </Link>
      </section>
    </div>
  );
}
