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

  return (
    <>
      {/* Breadcrumb + Title */}
      <div style={{ background: "var(--color-canvas)", borderBottom: "1px solid var(--color-hairline)", padding: "32px 0" }}>
        <div className="max-w-3xl mx-auto px-6">
          <nav style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}>
            <Link href="/" style={{ color: "var(--color-muted)", fontSize: 13 }} className="hover:opacity-70">ホーム</Link>
            <span style={{ color: "var(--color-muted)", fontSize: 13 }}>/</span>
            <Link href={`/${article.category}`} style={{ color: "var(--color-muted)", fontSize: 13 }} className="hover:opacity-70">
              {getCategoryLabel(article.category)}
            </Link>
          </nav>
          <span
            style={{
              background: "var(--color-surface-strong)",
              color: "var(--color-ink)",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 100,
              padding: "4px 12px",
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            {getCategoryLabel(article.category)}
          </span>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 400,
              color: "var(--color-ink)",
              lineHeight: 1.15,
              letterSpacing: "-0.8px",
            }}
          >
            {article.title}
          </h1>
          {article.date && (
            <p style={{ color: "var(--color-muted)", fontSize: 13, marginTop: 12 }}>{article.date}</p>
          )}
        </div>
      </div>

      {/* Article Body */}
      <div style={{ background: "var(--color-canvas)", padding: "64px 0" }}>
        <div className="max-w-3xl mx-auto px-6">
          <article className="prose prose-gray max-w-none">
            <MDXRemote source={article.content} />
          </article>
        </div>
      </div>

      {/* Dark CTA Band */}
      <section style={{ background: "var(--color-surface-dark)", padding: "96px 0" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "var(--color-on-dark)",
              letterSpacing: "-0.5px",
              marginBottom: 16,
            }}
          >
            開業前に相談したい方へ
          </h2>
          <p style={{ fontSize: 15, color: "var(--color-on-dark-soft)", lineHeight: 1.6, marginBottom: 32 }}>
            物件選定・資金計画・集客設計まで、実体験をもとに伴走します。
          </p>
          <Link
            href="/contact"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              borderRadius: 100,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 600,
              display: "inline-block",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            無料相談（30分）を申し込む
          </Link>
        </div>
      </section>
    </>
  );
}
