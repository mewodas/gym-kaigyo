import { notFound } from "next/navigation";
import { getArticle, getAllSlugs, getCategoryLabel, getRelatedArticles } from "@/lib/articles";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import Link from "next/link";
import { calculateReadingTime } from "@/lib/reading-time";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { RelatedArticles } from "@/components/RelatedArticles";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) return {};
  const url = `https://gym-kaigyo.jp/${category}/${slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.date,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) notFound();

  const readingTime = calculateReadingTime(article.content);
  const relatedArticles = getRelatedArticles(category, slug, 3);
  const articleJsonLd = buildArticleJsonLd(article);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(article);

  return (
    <>
      {/* JSON-LD: Article + Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb + Title */}
      <div style={{ background: "#fff", borderBottom: "1px solid #DEDEDE", padding: "32px 0" }}>
        <div className="max-w-3xl mx-auto px-6">
          <nav style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#666", fontSize: 13 }} className="hover:opacity-70">ホーム</Link>
            <span style={{ color: "#666", fontSize: 13 }}>/</span>
            <Link href={`/${article.category}`} style={{ color: "#666", fontSize: 13 }} className="hover:opacity-70">
              {getCategoryLabel(article.category)}
            </Link>
          </nav>
          <span
            style={{
              background: "#FF6200",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 4,
              padding: "3px 10px",
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            {getCategoryLabel(article.category)}
          </span>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 900,
              color: "#333",
              lineHeight: 1.3,
              letterSpacing: "-0.5px",
            }}
          >
            {article.title}
          </h1>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 16, color: "#666", fontSize: 13 }}>
            {article.date && <span>📅 {article.date}</span>}
            <span>⏱ 読了 約{readingTime}分</span>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div style={{ background: "#fff", padding: "48px 0 64px" }}>
        <div className="max-w-3xl mx-auto px-6">
          <article className="prose prose-gray max-w-none">
            <MDXRemote
              source={article.content}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </article>
        </div>
      </div>

      {/* Related Articles */}
      <RelatedArticles articles={relatedArticles} />

      {/* AI活用バナー */}
      <section style={{
        border: "4px solid #FF6200",
        borderRadius: 20,
        background: "#FEF6EA",
        margin: "60px auto",
        maxWidth: 800,
        padding: "40px 32px",
        textAlign: "center",
      }} className="mx-6 sm:mx-auto">
        <h2 style={{ fontWeight: 900, fontSize: 22, color: "#FF6200", marginBottom: 12 }}>
          🤖 AIを使った経営効率化に興味がありますか？
        </h2>
        <p style={{ fontSize: 15, color: "#333", lineHeight: 1.7, marginBottom: 8 }}>
          Claudeを活用した業務自動化・集客・コンテンツ制作の実例を「AI活用経営」カテゴリで公開中です。
        </p>
        <Link href="/ai-keiei" style={{
          color: "#006EBD",
          fontSize: 14,
          fontWeight: 700,
          textDecoration: "underline",
        }} className="hover:opacity-70 transition-opacity">
          AI活用経営の記事を読む →
        </Link>
      </section>
    </>
  );
}
