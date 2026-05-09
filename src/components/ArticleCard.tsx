import Link from "next/link";
import { ArticleMeta, getCategoryLabel } from "@/lib/articles";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/${article.category}/${article.slug}`}
      style={{
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        borderRadius: 24,
        padding: 32,
        display: "block",
        transition: "box-shadow 0.15s",
      }}
      className="hover:shadow-md"
    >
      <span
        style={{
          background: "var(--color-surface-strong)",
          color: "var(--color-ink)",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 100,
          padding: "4px 12px",
          display: "inline-block",
        }}
      >
        {getCategoryLabel(article.category)}
      </span>
      <h2
        style={{
          marginTop: 12,
          fontWeight: 600,
          fontSize: 16,
          color: "var(--color-ink)",
          lineHeight: 1.4,
          letterSpacing: "-0.2px",
        }}
      >
        {article.title}
      </h2>
      <p
        style={{
          marginTop: 8,
          fontSize: 14,
          color: "var(--color-body)",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {article.description}
      </p>
    </Link>
  );
}
