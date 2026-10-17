import { notFound } from "next/navigation";
import { getArticlesByCategory, getAreaArticles, getCategoryLabel } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

const VALID_CATEGORIES = ["area", "kaigyo", "hiyou", "kigu", "shukaku", "gyomu", "horitsu", "ai-keiei", "fukugyou"];

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = getCategoryLabel(category);
  return {
    title: category === "area" ? "山手線 駅別パーソナルジム調査" : `${label}の記事一覧`,
    description: category === "area"
      ? "山手線の駅ごとに、パーソナルジムの料金・立地・強みを公式情報で比較。開業を考える人向けの競合分析も掲載しています。"
      : `パーソナルジム開業における「${label}」に関する記事一覧です。`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category)) notFound();

  const articles = category === "area" ? getAreaArticles() : getArticlesByCategory(category);
  const label = getCategoryLabel(category);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">{label}</h1>
      {category === "area" && (
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          山手線の駅ごとに、パーソナルジムの料金・立地・強みを各ジムの公式サイトで調べて比較しています。
          ジムを探している人向けの目的別おすすめと、開業を考える人向けの競合分析を1本にまとめました。
        </p>
      )}
      <p className="text-gray-500 text-sm mb-8">{articles.length}本の記事</p>
      {articles.length === 0 ? (
        <p className="text-gray-500">記事を準備中です。</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
