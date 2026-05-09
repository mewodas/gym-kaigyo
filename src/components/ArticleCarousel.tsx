"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArticleMeta, getCategoryLabel } from "@/lib/types";

interface ArticleCarouselProps {
  title: string;
  articles: ArticleMeta[];
}

export function ArticleCarousel({ title, articles }: ArticleCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section style={{ marginTop: 60 }}>
      {/* セクション見出し（オレンジバー） */}
      <div style={{
        background: "#FF6200",
        color: "#fff",
        borderRadius: 8,
        padding: "12px 20px",
        fontSize: 17,
        fontWeight: 900,
        marginBottom: 24,
        boxShadow: "3px 3px 0 0 rgba(255,98,0,0.3)",
      }}>
        {title}
      </div>

      <div style={{ position: "relative" }}>
        {/* ◀ 左ボタン */}
        <button
          onClick={() => scroll("left")}
          aria-label="前へ"
          style={{
            position: "absolute",
            left: -16,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#FF6200",
            border: "3px solid #fff",
            color: "#fff",
            fontSize: 14,
            fontWeight: 900,
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="hover:opacity-85 transition-opacity"
        >
          ◀
        </button>

        {/* スクロールコンテナ */}
        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollBehavior: "smooth",
            paddingBottom: 12,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          {articles.map((article) => (
            <Link
              key={`${article.category}/${article.slug}`}
              href={`/${article.category}/${article.slug}`}
              style={{
                flexShrink: 0,
                width: 260,
                background: "#fff",
                border: "3px solid #FF6200",
                borderRadius: 10,
                padding: "18px 18px 14px",
                boxShadow: "3px 4px 0 0 #FF6200",
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
              }}
              className="hover:opacity-85 transition-opacity"
            >
              <span style={{
                background: "#FF6200",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 4,
                padding: "2px 8px",
                display: "inline-block",
                marginBottom: 10,
                width: "fit-content",
              }}>
                {getCategoryLabel(article.category)}
              </span>
              <h3 style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#333",
                lineHeight: 1.5,
                marginBottom: 8,
              }}>
                {article.title}
              </h3>
              <p style={{
                fontSize: 12,
                color: "#666",
                lineHeight: 1.65,
                marginBottom: 14,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}>
                {article.description}
              </p>
              <div style={{
                background: "#FF6200",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 4,
                padding: "7px 12px",
                textAlign: "center",
              }}>
                記事詳細を見る ▶
              </div>
            </Link>
          ))}
        </div>

        {/* ▶ 右ボタン */}
        <button
          onClick={() => scroll("right")}
          aria-label="次へ"
          style={{
            position: "absolute",
            right: -16,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#FF6200",
            border: "3px solid #fff",
            color: "#fff",
            fontSize: 14,
            fontWeight: 900,
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="hover:opacity-85 transition-opacity"
        >
          ▶
        </button>
      </div>
    </section>
  );
}
