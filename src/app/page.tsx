import Link from "next/link";
import { getAllArticles, getCategoryLabel } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";

const CATEGORIES = [
  { slug: "kaigyo", label: "開業手順", desc: "物件・工事・手続きの全ステップ" },
  { slug: "hiyou", label: "費用・資金", desc: "実際にかかった金額を全公開" },
  { slug: "kigu", label: "器具・設備", desc: "何を買うべきか・中古活用術" },
  { slug: "shukaku", label: "集客", desc: "Google・SNS・紹介の効果別解説" },
  { slug: "ai-keiei", label: "AI活用経営", desc: "Claudeで業務を8割自動化" },
  { slug: "fukugyou", label: "副業トレーナー", desc: "副業→独立へのロードマップ" },
];

const STATS = [
  { value: "300〜800万円", label: "標準規模の開業費用" },
  { value: "3〜6ヶ月", label: "開業までの準備期間" },
  { value: "8割", label: "AIで自動化できる業務" },
];

export default function Home() {
  const recentArticles = getAllArticles().slice(0, 4);

  return (
    <>
      {/* ── Dark Hero ── */}
      <section
        style={{ background: "var(--color-surface-dark)", padding: "96px 0" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left: Copy */}
            <div className="flex-1">
              <span
                style={{
                  background: "var(--color-surface-dark-elevated)",
                  color: "var(--color-on-dark-soft)",
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 100,
                  padding: "4px 14px",
                  display: "inline-block",
                  marginBottom: 24,
                  letterSpacing: "0.05em",
                }}
              >
                BUILD IN PUBLIC
              </span>
              <h1
                style={{
                  fontSize: "clamp(40px, 6vw, 72px)",
                  fontWeight: 400,
                  color: "var(--color-on-dark)",
                  lineHeight: 1.05,
                  letterSpacing: "-2px",
                  marginBottom: 24,
                }}
              >
                パーソナルジム開業の<br />
                リアルをすべて公開
              </h1>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--color-on-dark-soft)",
                  lineHeight: 1.6,
                  maxWidth: 420,
                  marginBottom: 36,
                }}
              >
                「メヲダス」「delight gym」2業態を同一スペースで運営するオーナーが、
                費用・器具・集客・AI活用まで実数字で解説します。
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href="/kaigyo/kanzen-guide"
                  style={{
                    background: "var(--color-primary)",
                    color: "#fff",
                    borderRadius: 100,
                    padding: "14px 28px",
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    display: "inline-block",
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  開業完全ガイドを読む
                </Link>
                <Link
                  href="/contact"
                  style={{
                    background: "transparent",
                    color: "var(--color-on-dark)",
                    borderRadius: 100,
                    padding: "14px 28px",
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    border: "1px solid rgba(255,255,255,0.3)",
                    display: "inline-block",
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  無料相談（30分）
                </Link>
              </div>
            </div>

            {/* Right: Floating Product UI Cards */}
            <div className="flex-1 relative hidden md:flex justify-center">
              {/* Card 1 — Main */}
              <div
                style={{
                  background: "var(--color-surface-dark-elevated)",
                  borderRadius: 24,
                  padding: 28,
                  width: 280,
                  position: "relative",
                  zIndex: 2,
                  boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
                }}
              >
                <p style={{ color: "var(--color-on-dark-soft)", fontSize: 12, marginBottom: 16 }}>開業費用シミュレーション</p>
                {[
                  { label: "物件・保証金", value: "120万円" },
                  { label: "内装工事", value: "80万円" },
                  { label: "器具・設備", value: "70万円" },
                  { label: "広告・IT", value: "30万円" },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span style={{ color: "var(--color-on-dark-soft)", fontSize: 13 }}>{row.label}</span>
                    <span style={{ color: "var(--color-on-dark)", fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {row.value}
                    </span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12 }}>
                  <span style={{ color: "var(--color-on-dark)", fontSize: 13, fontWeight: 600 }}>合計</span>
                  <span style={{ color: "var(--color-primary)", fontSize: 15, fontWeight: 700 }}>約300万円</span>
                </div>
              </div>

              {/* Card 2 — Overlapping */}
              <div
                style={{
                  background: "var(--color-surface-dark-elevated)",
                  borderRadius: 24,
                  padding: 24,
                  width: 200,
                  position: "absolute",
                  bottom: -32,
                  right: -20,
                  zIndex: 3,
                  transform: "rotate(3deg)",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.5)",
                }}
              >
                <p style={{ color: "var(--color-on-dark-soft)", fontSize: 11, marginBottom: 12 }}>月次売上</p>
                <p style={{ color: "#05b169", fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  +18%
                </p>
                <p style={{ color: "var(--color-on-dark)", fontSize: 13, marginTop: 4 }}>¥1,200,000</p>
                <p style={{ color: "var(--color-on-dark-soft)", fontSize: 11, marginTop: 2 }}>先月比</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section style={{ background: "var(--color-surface-soft)", padding: "64px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  style={{
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 400,
                    color: "var(--color-ink)",
                    letterSpacing: "-0.5px",
                    marginBottom: 8,
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: 14, color: "var(--color-body)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ background: "var(--color-canvas)", padding: "96px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 400,
              color: "var(--color-ink)",
              letterSpacing: "-1px",
              marginBottom: 48,
            }}
          >
            カテゴリから探す
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
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
                <p style={{ fontWeight: 600, fontSize: 15, color: "var(--color-ink)", marginBottom: 8 }}>
                  {cat.label}
                </p>
                <p style={{ fontSize: 13, color: "var(--color-body)", lineHeight: 1.5 }}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Articles ── */}
      {recentArticles.length > 0 && (
        <section style={{ background: "var(--color-surface-soft)", padding: "96px 0" }}>
          <div className="max-w-6xl mx-auto px-6">
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 400,
                color: "var(--color-ink)",
                letterSpacing: "-1px",
                marginBottom: 48,
              }}
            >
              新着記事
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recentArticles.map((article) => (
                <ArticleCard key={`${article.category}/${article.slug}`} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Dark CTA Band ── */}
      <section style={{ background: "var(--color-surface-dark)", padding: "96px 0" }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 400,
              color: "var(--color-on-dark)",
              letterSpacing: "-1px",
              marginBottom: 20,
            }}
          >
            開業前の不安を、一緒に解消しましょう
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--color-on-dark-soft)",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: "0 auto 36px",
            }}
          >
            物件選定・資金計画・集客設計まで、実際の開業経験をもとに30分でお答えします。
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                borderRadius: 100,
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 600,
                display: "inline-block",
              }}
              className="hover:opacity-90 transition-opacity"
            >
              無料相談を申し込む
            </Link>
            <Link
              href="/profile"
              style={{
                background: "var(--color-surface-dark-elevated)",
                color: "var(--color-on-dark)",
                borderRadius: 100,
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 600,
                display: "inline-block",
              }}
              className="hover:opacity-80 transition-opacity"
            >
              著者プロフィール
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
