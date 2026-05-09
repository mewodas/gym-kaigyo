import Link from "next/link";
import { ArticleMeta, getCategoryLabel } from "@/lib/articles";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/${article.category}/${article.slug}`}
      style={{
        background: "#fff",
        border: "3px solid #FF6200",
        borderRadius: 10,
        padding: "20px 20px 24px",
        display: "block",
        boxShadow: "3px 4px 0 0 #FF6200",
        transition: "opacity 0.2s",
      }}
      className="hover:opacity-80"
    >
      <span style={{
        background: "#FF6200",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 4,
        padding: "2px 8px",
        display: "inline-block",
        marginBottom: 10,
      }}>
        {getCategoryLabel(article.category)}
      </span>
      <h2 style={{
        fontWeight: 700,
        fontSize: 15,
        color: "#333",
        lineHeight: 1.5,
        marginBottom: 8,
      }}>
        {article.title}
      </h2>
      <p style={{
        fontSize: 13,
        color: "#666",
        lineHeight: 1.7,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {article.description}
      </p>
    </Link>
  );
}
