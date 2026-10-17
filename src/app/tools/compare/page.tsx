import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "パーソナルジム料金・サービス比較｜主要チェーンの公式料金を一覧で比較",
  description:
    "RIZAP・BEYOND・かたぎり塾・GOODLIFE GYM・ASPI・アップルジム・Dr.トレーニング・THE PERSONAL GYM など主要パーソナルジムの公式料金・入会金・強みを一覧で比較。都内の店舗数も掲載しています。",
  alternates: { canonical: "https://gym-kaigyo.jp/tools/compare" },
};

type Chain = { name: string; price60: string; entry: string; strength: string; band: string; tags: string[]; cheap_note: string };
type Gym = { chain: string; articles: string[] };

const BAND_LABEL: Record<string, string> = {
  low: "低価格帯",
  mid: "中価格帯",
  course: "コース型",
  other: "短時間・少人数・会員制",
};
const BAND_ORDER = ["low", "mid", "other", "course"];
const TAG_LABEL: Record<string, string> = {
  women: "女性専用",
  short: "30分以下",
  no_entry: "入会金0円",
  early: "朝7時〜",
  monthly: "月額制",
  semi: "少人数指導",
  program: "短期集中",
  refund: "返金保証",
  pair: "ペア可",
  premium: "会員制",
};

// 料金の掲載元（各社公式）
const SOURCES: Record<string, string> = {
  aspi: "https://aspirest.com/course_monthly",
  katagiri: "https://katagirijuku.jp/price/",
  miyazaki: "https://miyazaki-gym.jp/plan/",
  beyond: "https://beyond-gym.com/price/",
  apple: "https://applegym.jp/price/",
  w247: "https://247-sports.jp/workout/course/",
  eagle: "https://gym.eaglebase-gym.com/access/gotanda/",
  exc: "https://exercisecoach.co.jp/",
  realworkout: "https://realworkout.jp/",
  bconcept: "https://b-concept.tokyo/",
  outline: "https://www.outline-gym.com/",
  rat: "https://ratgym.jp/",
  totalworkout: "https://totalworkout.jp/howtouse/",
  johnny: "https://www.johnny-style.com/price.html",
  spacegym: "https://www.space-gym.com/",
  rizap: "https://www.rizap.jp/",
  goodlife: "https://goodlifegym.jp/",
  drtraining: "https://drtraining.jp/price/",
  tpg: "https://the-personal-gym.com/#price",
  dietpartner: "https://dietpartner.jp/",
};

export default function ComparePage() {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data/map.json"), "utf-8")) as {
    checked: string;
    gyms: Gym[];
    chains: Record<string, Chain>;
  };
  const counts: Record<string, number> = {};
  for (const g of data.gyms) counts[g.chain] = (counts[g.chain] ?? 0) + 1;
  // 都内に3店舗以上あるチェーンを比較対象にする
  const rows = Object.entries(data.chains)
    .filter(([k]) => (counts[k] ?? 0) >= 3 && k !== "independent")
    .sort((a, b) => BAND_ORDER.indexOf(a[1].band) - BAND_ORDER.indexOf(b[1].band) || (counts[b[0]] ?? 0) - (counts[a[0]] ?? 0));

  return (
    <div style={{ background: "#fff" }}>
      <div style={{ borderBottom: "1px solid #DEDEDE", padding: "32px 0 24px" }}>
        <div className="max-w-6xl mx-auto px-6">
          <span style={{ background: "#FF6200", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 4, padding: "3px 10px" }}>比較</span>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: "#222", marginTop: 12, lineHeight: 1.3 }}>
            パーソナルジム料金・サービス比較
          </h1>
          <p style={{ fontSize: 15, color: "#555", marginTop: 10, lineHeight: 1.8, maxWidth: 760 }}>
            都内に3店舗以上ある主要チェーンの料金・入会金・強みを、各社の公式サイトで確認した内容で比べました（{data.checked}時点・税込）。
            ジム選びの比較にも、開業前に「どの価格帯・打ち出しが混み合っているか」を知るのにも使えます。
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6" style={{ padding: "28px 24px 56px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 880 }}>
            <thead>
              <tr style={{ background: "#1a1a1a", color: "#fff", textAlign: "left" }}>
                {["チェーン", "価格帯", "1回の目安", "最安になる条件", "入会金", "強み", "特徴", "都内店舗数"].map((h) => (
                  <th key={h} style={{ padding: "10px 10px", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, c], i) => (
                <tr key={k} style={{ background: i % 2 ? "#fafafa" : "#fff", borderBottom: "1px solid #eee", verticalAlign: "top" }}>
                  <td style={{ padding: "10px", fontWeight: 800, whiteSpace: "nowrap" }}>
                    {SOURCES[k] ? (
                      <a href={SOURCES[k]} target="_blank" rel="noopener noreferrer" style={{ color: "#222" }}>{c.name}</a>
                    ) : c.name}
                  </td>
                  <td style={{ padding: "10px", whiteSpace: "nowrap" }}>{BAND_LABEL[c.band]}</td>
                  <td style={{ padding: "10px" }}>{c.price60}</td>
                  <td style={{ padding: "10px" }}>{c.cheap_note}</td>
                  <td style={{ padding: "10px" }}>{c.entry}</td>
                  <td style={{ padding: "10px" }}>{c.strength}</td>
                  <td style={{ padding: "10px" }}>
                    {c.tags.filter((t) => TAG_LABEL[t]).map((t) => (
                      <span key={t} style={{ display: "inline-block", fontSize: 11, border: "1px solid #FFB98A", color: "#C24A00", borderRadius: 100, padding: "1px 8px", margin: "0 4px 4px 0" }}>{TAG_LABEL[t]}</span>
                    ))}
                  </td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: 800 }}>{counts[k]}店</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose prose-gray max-w-none" style={{ marginTop: 36 }}>
          <h2>表の見方</h2>
          <ul>
            <li><strong>1回の目安</strong>：公式の料金表を1回あたりに直した金額です。チェーン共通の料金のため、店舗やキャンペーンで変わることがあります。</li>
            <li><strong>都内店舗数</strong>：当サイトが2026年10月に各社公式サイトで確認できた都内の店舗数です。</li>
            <li>チェーン名のリンク先は、料金を確認した公式ページです。申し込み前に必ず最新の料金を確認してください。</li>
          </ul>
          <h2>開業を考えている人へ：価格帯ごとの競争の状況</h2>
          <p>
            都内の主要チェーンは、1回7,000円台の「低価格帯」に店舗数が集中しています。かたぎり塾・アップルジム・REAL WORKOUT・ASPI など、多店舗展開のチェーンほどこの価格帯で勝負しているため、
            個人で開業する場合は価格だけで差をつけるのは難しいのが実情です。
          </p>
          <p>
            自分の出店候補地にどの価格帯のジムが何店あるかは、<Link href="/tools/area-map">出店エリア診断マップ</Link>で確認できます。駅ごとの詳しい競合分析は<Link href="/area">エリア調査</Link>の各記事をご覧ください。
          </p>
        </div>
      </div>
    </div>
  );
}
