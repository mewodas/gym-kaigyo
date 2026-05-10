import Link from "next/link";
import { getAllArticles, getCategoryLabel } from "@/lib/articles";

const CATEGORIES = [
  { slug: "kaigyo", labelJp: "開業手順", labelEn: "Open", desc: "物件・工事・手続きの全ステップ", num: "01" },
  { slug: "hiyou", labelJp: "費用・資金", labelEn: "Cost", desc: "実際にかかった金額を全公開", num: "02" },
  { slug: "kigu", labelJp: "器具・設備", labelEn: "Gear", desc: "何を買うべきか・中古活用術", num: "03" },
  { slug: "shukaku", labelJp: "集客", labelEn: "Reach", desc: "Google・SNS・紹介の効果別解説", num: "04" },
  { slug: "ai-keiei", labelJp: "AI活用経営", labelEn: "AI", desc: "Claudeで業務を8割自動化", num: "05" },
  { slug: "fukugyou", labelJp: "副業トレーナー", labelEn: "Side", desc: "副業→独立へのロードマップ", num: "06" },
];

const STATS = [
  { num: "副業", label: "から始められる", sub: "本業を続けながら2業態を運営" },
  { num: "8割", label: "業務をAI自動化", sub: "Claudeで月42h→6.5hに圧縮" },
  { num: "2業態", label: "同一スペース運営", sub: "パーソナル＋レンタルジム" },
];

const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";

export default function HomeV2() {
  const allArticles = getAllArticles();
  const recentArticles = allArticles.slice(0, 6);

  return (
    <div style={{ background: "#0a0e1a", color: "#fff", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: 640,
        overflow: "hidden",
        background: "#0a0e1a",
      }}>
        {/* 背景画像 */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/v2-hero-v2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.95,
        }} />
        {/* 左側だけ暗くして文字を読みやすく */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(10,14,26,0.85) 0%, rgba(10,14,26,0.5) 40%, transparent 70%)",
        }} />
        {/* 上下フェード */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,14,26,0.4) 0%, transparent 30%, transparent 70%, rgba(10,14,26,0.6) 100%)",
        }} />

        <div style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px 32px 100px",
        }}>
          {/* Eyebrow with elegant Latin label */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <span style={{ height: 1, width: 56, background: "#FF6200" }} />
            <span style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              color: "#FF8C42",
              fontSize: 14,
              fontWeight: 600,
            }}>
              The Lab Issue №01
            </span>
          </div>

          <p style={{
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
            fontSize: 13,
            marginBottom: 24,
            letterSpacing: "0.05em",
          }}>
            副業からスタートし、2業態を運営するオーナーが書く。
          </p>

          <h1 style={{
            fontFamily: SERIF,
            fontSize: "clamp(44px, 6vw, 84px)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
            marginBottom: 28,
            maxWidth: 820,
          }}>
            The Real of <span style={{ fontStyle: "italic", color: "#FF8C42" }}>Gym Business.</span>
          </h1>

          <p style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.85,
            marginBottom: 40,
            maxWidth: 540,
          }}>
            パーソナルジムとレンタルジムを運営するオーナーが、
            費用・器具・集客・AI活用まで実数字で解説します。
          </p>

          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/kaigyo/kanzen-guide" style={{
              background: "#fff",
              color: "#0a0e1a",
              borderRadius: 0,
              padding: "16px 32px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "inline-block",
            }} className="hover:bg-orange-500 hover:text-white transition-colors">
              Read the Guide →
            </Link>
            <Link href="#categories" style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(255,255,255,0.4)",
              paddingBottom: 4,
            }} className="hover:text-white hover:border-white transition-colors">
              Explore Topics
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#0a0e1a", padding: "80px 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
            <span style={{ height: 1, width: 56, background: "#FF6200" }} />
            <span style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              color: "#FF8C42",
              fontSize: 13,
              fontWeight: 600,
            }}>
              At a Glance
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {STATS.map((stat, i) => (
              <div key={stat.num} style={{
                padding: "32px 32px 32px 0",
                paddingLeft: i === 0 ? 0 : 32,
                borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{
                  fontFamily: SERIF,
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#FF6200",
                  letterSpacing: "-2px",
                  lineHeight: 1,
                  marginBottom: 14,
                }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" style={{ background: "#0a0e1a", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ marginBottom: 60, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
              <span style={{ height: 1, width: 40, background: "rgba(255,98,0,0.6)" }} />
              <span style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                color: "#FF8C42",
                fontSize: 14,
                fontWeight: 600,
              }}>
                Categories
              </span>
              <span style={{ height: 1, width: 40, background: "rgba(255,98,0,0.6)" }} />
            </div>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-1px",
              marginBottom: 14,
              color: "#fff",
            }}>
              Six themes, <span style={{ fontStyle: "italic" }}>one journey.</span>
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto" }}>
              現場で得た学びを、6つのテーマに整理しました。
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`} style={{
                position: "relative",
                background: "#0a0e1a",
                padding: "40px 32px 36px",
                display: "block",
                overflow: "hidden",
                transition: "all 0.3s",
              }} className="group hover:bg-[rgba(255,255,255,0.025)]">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                  <span style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 14,
                    color: "#FF8C42",
                    fontWeight: 600,
                  }}>
                    {cat.num} ／ {cat.labelEn}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>→</span>
                </div>
                <div style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 26,
                  color: "#fff",
                  marginBottom: 10,
                  letterSpacing: "-0.3px",
                }}>
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
        <section style={{ background: "#0a0e1a", padding: "60px 32px 100px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>
              <div>
                <span style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  color: "#FF8C42",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}>
                  Latest
                </span>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                }}>
                  新着の記録
                </h2>
              </div>
              <Link href="/" style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                paddingBottom: 2,
              }} className="hover:text-white">
                See All →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
              {recentArticles.map((article) => (
                <Link key={`${article.category}/${article.slug}`}
                  href={`/${article.category}/${article.slug}`}
                  style={{
                    background: "#0a0e1a",
                    padding: "32px 32px 32px 32px",
                    display: "block",
                    transition: "background 0.3s",
                  }}
                  className="hover:bg-white/5"
                >
                  <span style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 12,
                    color: "#FF8C42",
                    fontWeight: 600,
                    display: "inline-block",
                    marginBottom: 14,
                  }}>
                    — {getCategoryLabel(article.category)}
                  </span>
                  <h3 style={{
                    fontFamily: SERIF,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.3,
                    marginBottom: 12,
                    letterSpacing: "-0.3px",
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
        padding: "60px 32px 120px",
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          padding: "80px 60px",
          borderTop: "1px solid rgba(255,98,0,0.4)",
          borderBottom: "1px solid rgba(255,98,0,0.4)",
          textAlign: "center",
          overflow: "hidden",
        }}>
          {/* グロー */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse, rgba(255,98,0,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            <span style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              color: "#FF8C42",
              fontSize: 14,
              fontWeight: 600,
              display: "block",
              marginBottom: 14,
            }}>
              — Begin
            </span>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: 14,
              letterSpacing: "-0.5px",
            }}>
              副業からでも、ジム経営は始められる。
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, marginBottom: 36, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
              開業ノウハウ・実数値・AI活用法を、すべて公開しています。
            </p>
            <Link href="/kaigyo/kanzen-guide" style={{
              background: "#fff",
              color: "#0a0e1a",
              borderRadius: 0,
              padding: "16px 36px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "inline-block",
            }} className="hover:bg-orange-500 hover:text-white transition-colors">
              Read the Guide →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
