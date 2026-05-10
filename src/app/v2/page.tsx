import Link from "next/link";
import { getAllArticles, getCategoryLabel } from "@/lib/articles";

const CATEGORIES = [
  { slug: "kaigyo", label: "OPEN", labelJp: "開業手順", desc: "物件・工事・手続きの全ステップ", num: "01" },
  { slug: "hiyou", label: "COST", labelJp: "費用・資金", desc: "実際にかかった金額を全公開", num: "02" },
  { slug: "kigu", label: "GEAR", labelJp: "器具・設備", desc: "何を買うべきか・中古活用術", num: "03" },
  { slug: "shukaku", label: "REACH", labelJp: "集客", desc: "Google・SNS・紹介の効果別解説", num: "04" },
  { slug: "ai-keiei", label: "SHIFT", labelJp: "AI活用経営", desc: "Claudeで業務を8割自動化", num: "05" },
  { slug: "fukugyou", label: "BUILD", labelJp: "副業トレーナー", desc: "副業→独立へのロードマップ", num: "06" },
];

const STATS = [
  { num: "副業", label: "から始められる", sub: "本業を続けながら2業態を運営" },
  { num: "8割", label: "業務をAI自動化", sub: "Claudeで月42h→6.5hに圧縮" },
  { num: "2業態", label: "同一スペース運営", sub: "パーソナル＋レンタルジム" },
];

export default function HomeV2() {
  const allArticles = getAllArticles();
  const recentArticles = allArticles.slice(0, 6);

  return (
    <div style={{ background: "#0a0e1a", color: "#fff", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: 560,
        overflow: "hidden",
        background: "#0a0e1a",
      }}>
        {/* 背景画像 */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/x-header-raw.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.55,
        }} />
        {/* グラデーションオーバーレイ */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.7) 50%, rgba(10,14,26,0.4) 100%)",
        }} />
        {/* オレンジグロー */}
        <div style={{
          position: "absolute",
          right: -120,
          top: -120,
          width: 480,
          height: 480,
          background: "radial-gradient(circle, rgba(255,98,0,0.35) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* コンテンツ */}
        <div style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "120px 24px 100px",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,98,0,0.12)",
            border: "1px solid rgba(255,98,0,0.4)",
            borderRadius: 100,
            padding: "6px 16px",
            marginBottom: 32,
            backdropFilter: "blur(10px)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6200", boxShadow: "0 0 12px #FF6200" }} />
            <span style={{ color: "#FF8C42", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>
              REAL OWNER ／ BUILD IN PUBLIC
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(48px, 7vw, 96px)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-2.5px",
            marginBottom: 28,
            maxWidth: 800,
          }}>
            副業から始める<br />
            <span style={{
              background: "linear-gradient(135deg, #FF6200 0%, #FFB169 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>ジム経営</span>のリアル。
          </h1>

          <p style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.85,
            marginBottom: 44,
            maxWidth: 560,
          }}>
            パーソナル＋レンタルの2業態を同一スペースで運営する個人オーナーが、
            費用・器具・集客・AI活用まで実数字で公開しています。
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/kaigyo/kanzen-guide" style={{
              background: "#FF6200",
              color: "#fff",
              borderRadius: 100,
              padding: "16px 32px",
              fontSize: 15,
              fontWeight: 700,
              boxShadow: "0 8px 32px rgba(255,98,0,0.5)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }} className="hover:opacity-90 transition-opacity">
              開業完全ガイドを読む →
            </Link>
            <Link href="#categories" style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: 100,
              padding: "16px 32px",
              fontSize: 15,
              fontWeight: 600,
              backdropFilter: "blur(10px)",
            }} className="hover:bg-white/15 transition-colors">
              カテゴリを探す
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#0a0e1a", padding: "64px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {STATS.map((stat) => (
            <div key={stat.num} style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "28px 24px",
            }}>
              <div style={{
                fontSize: 36,
                fontWeight: 900,
                background: "linear-gradient(135deg, #FF6200 0%, #FFB169 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}>
                {stat.num}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" style={{ background: "#0a0e1a", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#FF8C42",
            }}>
              CATEGORIES
            </span>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-1px",
              marginTop: 12,
              marginBottom: 12,
            }}>
              6つのテーマで、開業のすべてを。
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }}>
              現場で得た学びを、実数字で構造化しています。
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`} style={{
                position: "relative",
                background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "32px 28px",
                display: "block",
                overflow: "hidden",
                transition: "all 0.3s",
              }} className="group hover:border-orange-500/40 hover:bg-white/5">
                {/* オレンジコーナーグロー */}
                <div style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 140,
                  height: 140,
                  background: "radial-gradient(circle, rgba(255,98,0,0.18) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#FF8C42",
                    background: "rgba(255,98,0,0.12)",
                    padding: "4px 10px",
                    borderRadius: 4,
                  }}>
                    {cat.num} ／ {cat.label}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }}>→</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 8, letterSpacing: "-0.3px" }}>
                  {cat.labelJp}
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
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
            <div style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "#FF8C42" }}>
                  LATEST
                </span>
                <h2 style={{
                  fontSize: 32,
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                  marginTop: 8,
                }}>
                  新着の記録
                </h2>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {recentArticles.map((article) => (
                <Link key={`${article.category}/${article.slug}`}
                  href={`/${article.category}/${article.slug}`}
                  style={{
                    position: "relative",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: "28px 28px 28px 28px",
                    borderLeft: "2px solid rgba(255,98,0,0.6)",
                    display: "block",
                    transition: "all 0.3s",
                  }}
                  className="hover:bg-white/5 hover:border-orange-500/40"
                >
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#FF8C42",
                    background: "rgba(255,98,0,0.12)",
                    padding: "3px 10px",
                    borderRadius: 4,
                    display: "inline-block",
                    marginBottom: 14,
                  }}>
                    {getCategoryLabel(article.category)}
                  </span>
                  <h3 style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.5,
                    marginBottom: 10,
                  }}>
                    {article.title}
                  </h3>
                  <p style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
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
          padding: "72px 56px",
          textAlign: "center",
          overflow: "hidden",
        }}>
          {/* グロー */}
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
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.25em",
              color: "#FF8C42",
            }}>
              SHIFT YOUR PATH
            </span>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 900,
              color: "#fff",
              marginTop: 14,
              marginBottom: 16,
              letterSpacing: "-0.5px",
            }}>
              副業からでも、ジム経営は始められる。
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, marginBottom: 36 }}>
              開業ノウハウ・実数値・AI活用法を、すべて公開しています。
            </p>
            <Link href="/kaigyo/kanzen-guide" style={{
              background: "#FF6200",
              color: "#fff",
              borderRadius: 100,
              padding: "16px 40px",
              fontSize: 16,
              fontWeight: 700,
              display: "inline-block",
              boxShadow: "0 8px 32px rgba(255,98,0,0.5)",
            }} className="hover:opacity-90 transition-opacity">
              開業ガイドを読む →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
