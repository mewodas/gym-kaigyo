import Link from "next/link";
import { getAllArticles, getCategoryLabel } from "@/lib/articles";
import { buildWebsiteJsonLd, buildOrganizationJsonLd } from "@/lib/structured-data";

const CATEGORIES = [
  { slug: "kaigyo", labelJp: "開業手順", desc: "物件・工事・手続きの全ステップ", num: "01" },
  { slug: "hiyou", labelJp: "費用・資金", desc: "実際にかかった金額を全公開", num: "02" },
  { slug: "kigu", labelJp: "器具・設備", desc: "何を買うべきか・中古活用術", num: "03" },
  { slug: "shukaku", labelJp: "集客", desc: "Google・SNS・紹介の効果別解説", num: "04" },
  { slug: "ai-keiei", labelJp: "AI活用経営", desc: "Claudeで業務を8割自動化", num: "05" },
  { slug: "fukugyou", labelJp: "副業トレーナー", desc: "副業→独立へのロードマップ", num: "06" },
];

export default function Home() {
  const allArticles = getAllArticles();
  const recentArticles = allArticles.slice(0, 6);
  const websiteJsonLd = buildWebsiteJsonLd();
  const orgJsonLd = buildOrganizationJsonLd();

  return (
    <div style={{ background: "#0a0e1a", color: "#fff", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: 620,
        overflow: "hidden",
        background: "#0a0e1a",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/x-header-noperson-v3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          opacity: 0.9,
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(10,14,26,0.85) 0%, rgba(10,14,26,0.55) 40%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,14,26,0.4) 0%, transparent 30%, transparent 70%, rgba(10,14,26,0.6) 100%)",
        }} />

        <div style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "110px 24px 90px",
        }}>
          <p style={{
            color: "#FF8C42",
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 20,
            letterSpacing: "0.05em",
          }}>
            副業で今も2業態を運営するオーナーが書く
          </p>

          <h1 style={{
            fontSize: "clamp(38px, 5.5vw, 70px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.18,
            letterSpacing: "-1.5px",
            marginBottom: 24,
            maxWidth: 760,
          }}>
            <span style={{
              background: "linear-gradient(135deg, #FF6200 0%, #FFB169 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>パーソナルジム開業</span>の<br />
            リアルをすべて公開
          </h1>

          <p style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.85,
            marginBottom: 36,
            maxWidth: 580,
          }}>
            パーソナルジムとレンタルジムを運営するオーナーが、
            費用・器具・集客・<span style={{ color: "#FF8C42", fontWeight: 700 }}>AI活用で事務作業の8割を工数削減する方法</span>まで、
            実数字で解説します。
          </p>

          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/kaigyo/kanzen-guide" style={{
              background: "#FF6200",
              color: "#fff",
              borderRadius: 100,
              padding: "15px 32px",
              fontSize: 15,
              fontWeight: 700,
              boxShadow: "0 8px 28px rgba(255,98,0,0.45)",
              display: "inline-block",
            }} className="hover:opacity-90 transition-opacity">
              開業完全ガイドを読む →
            </Link>
            <Link href="#categories" style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 14,
              fontWeight: 600,
              borderBottom: "1px solid rgba(255,255,255,0.4)",
              paddingBottom: 4,
            }} className="hover:text-white hover:border-white transition-colors">
              カテゴリを探す
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" style={{ background: "#0a0e1a", padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <span style={{
              display: "inline-block",
              background: "#FF6200",
              color: "#fff",
              borderRadius: 100,
              padding: "5px 20px",
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
            }}>
              カテゴリから探す
            </span>
            <h2 style={{
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 900,
              letterSpacing: "-0.8px",
              marginBottom: 10,
              color: "#fff",
            }}>
              6つのテーマで、開業のすべてを。
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
              現場で得た学びを、実数字で構造化しています。
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`} style={{
                position: "relative",
                background: "#e8e2d6",
                border: "1px solid rgba(255, 98, 0, 0.35)",
                borderRadius: 14,
                padding: "26px 24px 22px",
                display: "block",
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
                transition: "all 0.3s",
              }} className="hover:-translate-y-1 hover:shadow-xl">

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#fff",
                    background: "#FF6200",
                    padding: "3px 10px",
                    borderRadius: 4,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.05em",
                  }}>
                    {cat.num}
                  </span>
                  <span style={{ color: "#FF6200", fontSize: 20, fontWeight: 700 }}>→</span>
                </div>
                <div style={{ fontWeight: 900, fontSize: 22, color: "#1a1a1a", marginBottom: 8, letterSpacing: "-0.3px" }}>
                  {cat.labelJp}
                </div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT ARTICLES ── */}
      {recentArticles.length > 0 && (
        <section style={{ background: "#0a0e1a", padding: "60px 24px 100px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{
              borderBottom: "1px solid rgba(255,98,0,0.4)",
              paddingBottom: 12,
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{
                background: "#FF6200",
                color: "#fff",
                borderRadius: 4,
                padding: "3px 12px",
                fontWeight: 700,
                fontSize: 13,
              }}>NEW</span>
              <h2 style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.3px",
              }}>
                新着記事
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {recentArticles.map((article) => (
                <Link key={`${article.category}/${article.slug}`}
                  href={`/${article.category}/${article.slug}`}
                  style={{
                    position: "relative",
                    background: "#e8e2d6",
                    border: "1px solid rgba(255, 98, 0, 0.35)",
                    borderRadius: 14,
                    padding: "24px 26px 26px",
                    display: "block",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
                    transition: "all 0.3s",
                  }}
                  className="hover:-translate-y-1"
                >
                  <span style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#fff",
                    background: "#FF6200",
                    padding: "3px 10px",
                    borderRadius: 4,
                    display: "inline-block",
                    marginBottom: 12,
                  }}>
                    {getCategoryLabel(article.category)}
                  </span>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#1a1a1a",
                    lineHeight: 1.5,
                    marginBottom: 8,
                    letterSpacing: "-0.2px",
                  }}>
                    {article.title}
                  </h3>
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{
        background: "#0a0e1a",
        padding: "80px 24px 120px",
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          background: "linear-gradient(135deg, #131826 0%, #0a0e1a 100%)",
          border: "1px solid rgba(255,98,0,0.25)",
          borderRadius: 20,
          padding: "60px 48px",
          textAlign: "center",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 360,
            height: 360,
            background: "radial-gradient(circle, rgba(255,98,0,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 280,
            height: 280,
            background: "radial-gradient(circle, rgba(255,98,0,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 34px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: 14,
              letterSpacing: "-0.3px",
            }}>
              副業からでも、ジム経営は始められる。
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 32 }}>
              開業ノウハウ・実数値・AI活用法を、すべて公開しています。
            </p>
            <Link href="/kaigyo/kanzen-guide" style={{
              background: "#FF6200",
              color: "#fff",
              borderRadius: 100,
              padding: "15px 36px",
              fontSize: 15,
              fontWeight: 700,
              display: "inline-block",
              boxShadow: "0 8px 28px rgba(255,98,0,0.45)",
            }} className="hover:opacity-90 transition-opacity">
              開業完全ガイドを読む →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
