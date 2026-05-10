import Link from "next/link";
import { ArticleMeta, getCategoryLabel } from "@/lib/types";

export function RelatedArticles({ articles }: { articles: ArticleMeta[] }) {
  if (articles.length === 0) return null;

  return (
    <section style={{ background: "#FEF6EA", padding: "64px 0" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <span
            style={{
              background: "#FF6200",
              color: "#fff",
              borderRadius: 20,
              padding: "5px 20px",
              fontSize: 14,
              fontWeight: 700,
              display: "inline-block",
            }}
          >
            🔗 関連記事
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {articles.map((article) => (
            <Link
              key={`${article.category}/${article.slug}`}
              href={`/${article.category}/${article.slug}`}
              style={{
                background: "#fff",
                border: "3px solid #FF6200",
                borderRadius: 10,
                padding: "18px 18px 16px",
                boxShadow: "3px 4px 0 0 #FF6200",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                textDecoration: "none",
              }}
              className="hover:opacity-85 transition-opacity"
            >
              <span
                style={{
                  background: "#FF6200",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 4,
                  padding: "2px 8px",
                  display: "inline-block",
                  width: "fit-content",
                }}
              >
                {getCategoryLabel(article.category)}
              </span>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#333",
                  lineHeight: 1.5,
                  marginTop: 2,
                }}
              >
                {article.title}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: "#666",
                  lineHeight: 1.65,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {article.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
