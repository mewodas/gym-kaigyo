import { notFound } from "next/navigation";
import { getArticle, getAllSlugs, getCategoryLabel } from "@/lib/articles";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: { title: article.title, description: article.description },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href={`/${article.category}`} className="hover:text-gray-900">
          {getCategoryLabel(article.category)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{article.title}</span>
      </nav>

      <header className="mb-10">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {getCategoryLabel(article.category)}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold mt-3 leading-snug">{article.title}</h1>
        {article.date && (
          <p className="text-sm text-gray-400 mt-2">{article.date}</p>
        )}
      </header>

      <article className="prose prose-gray max-w-none">
        <MDXRemote source={article.content} />
      </article>

      <div className="mt-16 bg-gray-50 rounded-xl p-8 text-center">
        <p className="font-bold text-lg mb-2">開業前に相談したい方へ</p>
        <p className="text-gray-600 text-sm mb-5">
          物件選定・資金計画・集客設計まで、実体験をもとに伴走します。
        </p>
        <Link
          href="/contact"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          無料相談（30分）を申し込む
        </Link>
      </div>
    </div>
  );
}
