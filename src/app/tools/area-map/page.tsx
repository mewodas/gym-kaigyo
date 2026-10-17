import type { Metadata } from "next";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { AreaMap } from "@/components/AreaMap";

export const metadata: Metadata = {
  title: "出店エリア診断マップ｜駅ごとのパーソナルジム競合数を地図で確認",
  description:
    "都内の駅や地図上の地点を選ぶと、半径500m〜2km以内のパーソナルジムの数・価格帯・打ち出しを表示。開業前の競合調査にも、近くのジム探しにも使えます。",
  alternates: { canonical: "https://gym-kaigyo.jp/tools/area-map" },
};

export default function AreaMapPage() {
  return (
    <div style={{ background: "#fff" }}>
      <div style={{ borderBottom: "1px solid #DEDEDE", padding: "32px 0 24px" }}>
        <div className="max-w-6xl mx-auto px-6">
          <span style={{ background: "#FF6200", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 4, padding: "3px 10px" }}>
            無料ツール
          </span>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: "#222", marginTop: 12, lineHeight: 1.3 }}>
            出店エリア診断マップ
          </h1>
          <p style={{ fontSize: 15, color: "#555", marginTop: 10, lineHeight: 1.8, maxWidth: 760 }}>
            駅名を入れるか地図をクリックすると、その地点から半径500m〜2kmにあるパーソナルジムの数・価格帯・打ち出しを表示します。
            開業を考えている人は「競合の多さ」と「まだ空いているポジション」を、ジムを探している人は「近くのジム」を条件で絞り込めます。
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6" style={{ padding: "28px 24px 48px" }}>
        <AreaMap />

        <div style={{ marginTop: 32, fontSize: 13, color: "#555", lineHeight: 1.9, background: "#f9fafb", borderRadius: 12, padding: "18px 20px" }}>
          <strong style={{ color: "#222" }}>データについて</strong>
          <ul style={{ listStyle: "disc", paddingLeft: 20, marginTop: 6 }}>
            <li>掲載しているのは、主要チェーン（RIZAP・BEYOND・かたぎり塾・GOODLIFE GYM・ASPI・アップルジム・Dr.トレーニング・THE PERSONAL GYM・MIYAZAKI GYM・24/7Workout・REAL WORKOUT など、約640店）の都内店舗と、当サイトの調査で公式情報を確認できた個人ジムです（2026年10月時点）。</li>
            <li>個人経営のジムは一部しか含まれていないため、実際の競合数はこれより多くなります。開業判断の前には、必ず現地とGoogleマップでも確認してください。</li>
            <li>位置は住所から国土地理院の住所検索で求めたもので、建物の位置と多少ずれることがあります。駅の位置はHeartRails Expressのデータを使っています。</li>
            <li>都内平均との比較は、都内655駅それぞれを中心に同じ半径で数えた店舗数との比較です。</li>
          </ul>
          <p style={{ marginTop: 10 }}>
            チェーンごとの料金と特徴の比較は「<Link href="/tools/compare" style={{ color: "#006EBD", textDecoration: "underline" }}>パーソナルジム料金・サービス比較</Link>」、駅ごとの詳しい解説は「<Link href="/area" style={{ color: "#006EBD", textDecoration: "underline" }}>エリア調査</Link>」をご覧ください。
          </p>
        </div>
      </div>
    </div>
  );
}
