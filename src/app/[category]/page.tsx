import { notFound } from "next/navigation";
import { getArticlesByCategory, getCategoryLabel } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

const VALID_CATEGORIES = ["kaigyo", "hiyou", "kigu", "shukaku", "gyomu", "horitsu", "ai-keiei", "fukugyou"];

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = getCategoryLabel(category);
  return {
    title: `${label}の記事一覧`,
    description: `パーソナルジム開業における「${label}」に関する記事一覧です。`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category)) notFound();

  const articles = getArticlesByCategory(category);
  const label = getCategoryLabel(category);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">{label}</h1>
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
