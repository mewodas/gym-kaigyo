import Link from "next/link";
import { getAllArticles, getCategoryLabel } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCarousel } from "@/components/ArticleCarousel";
import { buildWebsiteJsonLd, buildOrganizationJsonLd } from "@/lib/structured-data";

const CATEGORIES = [
  { slug: "kaigyo", label: "開業手順", desc: "物件・工事・手続きの全ステップ", num: "01" },
  { slug: "hiyou", label: "費用・資金", desc: "実際にかかった金額を全公開", num: "02" },
  { slug: "kigu", label: "器具・設備", desc: "何を買うべきか・中古活用術", num: "03" },
  { slug: "shukaku", label: "集客", desc: "Google・SNS・紹介の効果別解説", num: "04" },
  { slug: "ai-keiei", label: "AI活用経営", desc: "Claudeで業務を8割自動化", num: "05" },
  { slug: "fukugyou", label: "副業トレーナー", desc: "副業→独立へのロードマップ", num: "06" },
];

const KEYWORDS = [
  "開業費用", "器具リスト", "物件選び", "保証金", "日本政策金融公庫",
  "NSCA資格", "集客方法", "Instagram", "Googleビジネス", "副業トレーナー",
  "AI活用", "レンタルジム", "ビフォーアフター", "小規模事業者補助金",
];

export default function Home() {
  const allArticles = getAllArticles();
  const recentArticles = allArticles.slice(0, 4);
  const featuredArticles = allArticles.slice(0, 8);

  const websiteJsonLd = buildWebsiteJsonLd();
  const orgJsonLd = buildOrganizationJsonLd();

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* ── Hero ── */}
      <section style={{
        background: "#FEF6EA",
        borderRadius: 10,
        padding: "40px 40px 0",
        marginTop: 30,
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: 20,
        overflow: "hidden",
        minHeight: 220,
      }}>
        <div style={{ paddingBottom: 40 }}>
          <p style={{ color: "#FF6200", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
            副業からスタートし、2業態を運営するオーナーが書く
          </p>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 900,
            color: "#FF6200",
            lineHeight: 1.3,
            marginBottom: 16,
          }}>
            パーソナルジム開業の<br />リアルをすべて公開
          </h1>
          <p style={{ fontSize: 15, color: "#333", lineHeight: 1.7, marginBottom: 24 }}>
            パーソナルジムとレンタルジムを運営するオーナーが、
            費用・器具・集客・AI活用まで実数字で解説します。
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/kaigyo/kanzen-guide" style={{
              background: "#6FBA2C",
              color: "#fff",
              borderRadius: 6,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 700,
              boxShadow: "0 4px 11px rgba(0,0,0,0.16)",
            }} className="hover:opacity-80 transition-opacity">
              開業完全ガイドを読む
            </Link>
          </div>
        </div>
        {/* Hero image */}
        <div style={{
          borderRadius: "0 0 0 10px",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}>
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=560&h=480&fit=crop&q=80"
            alt="パーソナルジムのトレーニング"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </section>

      {/* ── Hot Keywords ── */}
      <section style={{ marginTop: 60, position: "relative" }}>
        <div style={{
          border: "4px solid #FF6200",
          borderRadius: 10,
          background: "#FEF6EA",
          padding: "30px 28px 24px",
        }}>
          <div style={{
            border: "3px solid #FF6200",
            borderRadius: 6,
            boxShadow: "3px 3px 0 0 #FF6200",
            padding: "6px 16px",
            background: "#fff",
            width: "fit-content",
            margin: "-52px auto 24px",
            color: "#FF6200",
            fontSize: 18,
            fontWeight: 900,
          }}>
            🔥 よく読まれているキーワード
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {KEYWORDS.map((kw) => (
              <span key={kw} style={{
                background: "#fff",
                border: "1px solid #DEDEDE",
                borderRadius: 26,
                padding: "4px 14px",
                fontSize: 14,
                fontWeight: 700,
                color: "#006EBD",
                cursor: "pointer",
              }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ marginTop: 70, paddingBottom: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{
            background: "#FF6200",
            color: "#fff",
            borderRadius: 20,
            padding: "5px 20px",
            fontSize: 16,
            fontWeight: 700,
            display: "inline-block",
            marginBottom: 8,
          }}>
            カテゴリから探す
          </span>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px 20px",
        }}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`} style={{
              background: "#fff",
              border: "3px solid #FF6200",
              borderRadius: 10,
              padding: "18px 18px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              boxShadow: "3px 4px 0 0 #FF6200",
            }} className="hover:opacity-80 transition-opacity">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  background: "#FF6200",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "1px 7px",
                  fontSize: 13,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {cat.num}
                </span>
                <span style={{ fontWeight: 900, fontSize: 15, color: "#FF6200" }}>{cat.label}</span>
              </div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent Articles ── */}
      {recentArticles.length > 0 && (
        <section style={{ marginTop: 80 }}>
          <div style={{
            borderBottom: "2px solid #FF6200",
            paddingBottom: 8,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span style={{
              background: "#FF6200",
              color: "#fff",
              borderRadius: 4,
              padding: "2px 10px",
              fontWeight: 700,
              fontSize: 14,
            }}>NEW</span>
            <h2 style={{ fontWeight: 900, fontSize: 18, color: "#333" }}>新着記事</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {recentArticles.map((article) => (
              <ArticleCard key={`${article.category}/${article.slug}`} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* ── 深掘りコラム（横スクロール） ── */}
      {featuredArticles.length > 0 && (
        <ArticleCarousel
          title="【深掘り】開業オーナーが解説する実践コラム"
          articles={featuredArticles}
        />
      )}

      {/* ── AI活用バナー ── */}
      <section style={{
        border: "4px solid #FF6200",
        borderRadius: 20,
        background: "#FEF6EA",
        margin: "80px auto 60px",
        padding: "40px 32px",
        textAlign: "center",
      }}>
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

    </div>
  );
}
