"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Map as LeafletMap, LayerGroup } from "leaflet";

type Gym = {
  name: string;
  chain: string;
  address: string;
  access: string;
  hours: string;
  tags: string[];
  articles: string[];
  lat: number;
  lng: number;
};
type Station = { name: string; city: string; lat: number; lng: number };
type Chain = { name: string; price60: string; entry: string; strength: string; band: string; tags: string[]; cheap_note: string };
type MapData = { checked: string; gyms: Gym[]; stations: Station[]; chains: Record<string, Chain> };

const BANDS: Record<string, { label: string; color: string }> = {
  low: { label: "低価格帯（1回7,000円台以下）", color: "#FF6200" },
  mid: { label: "中価格帯（1回8,000〜10,000円台）", color: "#2563eb" },
  course: { label: "コース型（短期集中・高価格）", color: "#9333ea" },
  other: { label: "短時間・少人数・会員制など", color: "#6b7280" },
};

const FEATURES: { tag: string; label: string }[] = [
  { tag: "women", label: "女性専用" },
  { tag: "short", label: "30分以下のコース" },
  { tag: "no_entry", label: "入会金0円" },
  { tag: "early", label: "朝7時から営業" },
  { tag: "semi", label: "少人数指導で低価格" },
  { tag: "program", label: "短期集中プログラム" },
];

const RADII = [500, 1000, 1500, 2000];

function dist(a: number, b: number, c: number, d: number) {
  const R = 6371000;
  const p1 = (a * Math.PI) / 180;
  const p2 = (c * Math.PI) / 180;
  const dp = p2 - p1;
  const dl = ((d - b) * Math.PI) / 180;
  return 2 * R * Math.asin(Math.sqrt(Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2));
}

export function AreaMap() {
  const [data, setData] = useState<MapData | null>(null);
  const [query, setQuery] = useState("五反田");
  const [center, setCenter] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [radius, setRadius] = useState(1000);
  const [mode, setMode] = useState<"owner" | "user">("owner");
  const [filters, setFilters] = useState<string[]>([]);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);

  useEffect(() => {
    fetch("/data/map.json")
      .then((r) => r.json())
      .then((d: MapData) => {
        setData(d);
        const s = d.stations.find((x) => x.name === "五反田");
        if (s) setCenter({ lat: s.lat, lng: s.lng, label: "五反田駅" });
      });
  }, []);

  // 地図の初期化（Leaflet はブラウザでのみ読み込む）
  useEffect(() => {
    if (!data || !mapEl.current || mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !mapEl.current) return;
      LRef.current = L;
      const map = L.map(mapEl.current, { zoomControl: true }).setView([35.681, 139.767], 13);
      L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
        maxZoom: 18,
      }).addTo(map);
      map.on("click", (e) => setCenter({ lat: e.latlng.lat, lng: e.latlng.lng, label: "地図で選んだ地点" }));
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setCenter((c) => (c ? { ...c } : c));
    })();
    return () => {
      cancelled = true;
    };
  }, [data]);

  const inRange = useMemo(() => {
    if (!data || !center) return [];
    return data.gyms
      .map((g) => ({ ...g, d: dist(center.lat, center.lng, g.lat, g.lng) }))
      .filter((g) => g.d <= radius)
      .sort((a, b) => a.d - b.d);
  }, [data, center, radius]);

  const shown = useMemo(
    () => inRange.filter((g) => filters.every((f) => g.tags.includes(f))),
    [inRange, filters]
  );

  // 都内の全駅で同じ半径の店舗数を数え、選んだ地点の位置づけを出す
  const ranking = useMemo(() => {
    if (!data) return null;
    const counts = data.stations.map((s) => data.gyms.filter((g) => dist(s.lat, s.lng, g.lat, g.lng) <= radius).length);
    const sorted = [...counts].sort((a, b) => a - b);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const n = inRange.length;
    const below = sorted.filter((c) => c < n).length;
    return { avg, pct: Math.round((below / sorted.length) * 100), max: sorted[sorted.length - 1] };
  }, [data, radius, inRange.length]);

  // マーカーと円を描き直す
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer || !center || !data) return;
    layer.clearLayers();
    L.circle([center.lat, center.lng], { radius, color: "#FF6200", weight: 2, fillOpacity: 0.06 }).addTo(layer);
    L.circleMarker([center.lat, center.lng], { radius: 5, color: "#111", fillColor: "#111", fillOpacity: 1 }).addTo(layer);
    const visible = mode === "user" ? data.gyms.filter((g) => filters.every((f) => g.tags.includes(f))) : data.gyms;
    for (const g of visible) {
      const band = data.chains[g.chain]?.band ?? "other";
      const color = g.chain === "independent" ? "#16a34a" : BANDS[band].color;
      const inside = dist(center.lat, center.lng, g.lat, g.lng) <= radius;
      const m = L.circleMarker([g.lat, g.lng], {
        radius: inside ? 7 : 4,
        color: "#fff",
        weight: 1,
        fillColor: color,
        fillOpacity: inside ? 0.95 : 0.45,
      }).addTo(layer);
      const c = data.chains[g.chain];
      const link = g.articles[0] ? `<br/><a href="/area/${g.articles[0]}">エリア記事を見る →</a>` : "";
      m.bindPopup(
        `<strong>${g.name}</strong><br/>${g.access}<br/><span style="color:#666">${c?.price60 ?? ""}</span>${link}`
      );
    }
    map.fitBounds(L.latLng(center.lat, center.lng).toBounds(radius * 2), { animate: false });
  }, [center, radius, data, mode, filters]);

  function pickStation(name: string) {
    if (!data) return;
    const s = data.stations.find((x) => x.name === name.replace(/駅$/, ""));
    if (s) setCenter({ lat: s.lat, lng: s.lng, label: `${s.name}駅` });
  }

  const bandCounts = Object.keys(BANDS).map((b) => ({
    band: b,
    n: inRange.filter((g) => (data?.chains[g.chain]?.band ?? "other") === b).length,
  }));
  const featureCounts = FEATURES.map((f) => ({ ...f, n: inRange.filter((g) => g.tags.includes(f.tag)).length }));
  const gaps = featureCounts.filter((f) => f.n === 0 && ["women", "short", "no_entry", "early"].includes(f.tag));
  const chainKinds = new Set(inRange.map((g) => g.chain)).size;

  let verdict = "";
  if (ranking) {
    if (ranking.pct >= 80) verdict = "都内でも競合がかなり多いエリアです。価格や駅近だけで勝負するのは厳しく、対象や目的を絞った打ち出しが必要です。";
    else if (ranking.pct >= 50) verdict = "競合は都内の平均より多めです。既存店とかぶらない打ち出し（下の「まだ空いているポジション」）を探しましょう。";
    else if (ranking.pct >= 20) verdict = "競合は都内の平均並みか、やや少なめです。住民向けの通いやすさを武器にしやすいエリアです。";
    else verdict = "大手チェーンの競合が少ないエリアです。ただし需要（人口・人通り）も少ない可能性があるため、商圏の人口もあわせて確認しましょう。";
  }

  return (
    <div>
      {/* 操作パネル */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", marginBottom: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, fontWeight: 700, color: "#333" }}>
          駅名で探す
          <span style={{ display: "flex", gap: 6 }}>
            <input
              list="station-list"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && pickStation(query)}
              placeholder="例：吉祥寺"
              style={{ border: "1px solid #ccc", borderRadius: 8, padding: "8px 10px", fontSize: 15, width: 180 }}
            />
            <button
              onClick={() => pickStation(query)}
              style={{ background: "#FF6200", color: "#fff", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 14 }}
            >
              表示
            </button>
          </span>
          <datalist id="station-list">
            {data?.stations.map((s) => (
              <option key={`${s.name}-${s.city}`} value={s.name}>{`${s.city}`}</option>
            ))}
          </datalist>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, fontWeight: 700, color: "#333" }}>
          半径
          <div style={{ display: "flex", gap: 6 }}>
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                style={{
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "1px solid #FF6200",
                  background: radius === r ? "#FF6200" : "#fff",
                  color: radius === r ? "#fff" : "#FF6200",
                }}
              >
                {r >= 1000 ? `${r / 1000}km` : `${r}m`}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, fontWeight: 700, color: "#333" }}>
          使い方
          <div style={{ display: "flex", gap: 6 }}>
            {(["owner", "user"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "1px solid #333",
                  background: mode === m ? "#333" : "#fff",
                  color: mode === m ? "#fff" : "#333",
                }}
              >
                {m === "owner" ? "開業を考えている" : "近くのジムを探す"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>地図をクリックすると、その地点を中心に調べられます。</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        <div ref={mapEl} style={{ height: 520, borderRadius: 12, border: "1px solid #ddd", zIndex: 0 }} />

        <div>
          {!data && <p>データを読み込み中…</p>}
          {data && center && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#222", marginBottom: 6 }}>
                {center.label}から半径{radius >= 1000 ? `${radius / 1000}km` : `${radius}m`}
              </h2>
              <p style={{ fontSize: 34, fontWeight: 900, color: "#FF6200", lineHeight: 1.2 }}>
                {inRange.length}
                <span style={{ fontSize: 15, color: "#333", marginLeft: 6 }}>店（{chainKinds}ブランド）</span>
              </p>

              {mode === "owner" && ranking && (
                <>
                  <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                    都内655駅の同じ半径での平均は{ranking.avg.toFixed(1)}店。この地点は
                    <strong>{ranking.pct >= 50 ? `多いほうから上位${100 - ranking.pct}%` : `少ないほうから${ranking.pct}%`}</strong>
                    の位置です。
                  </p>
                  <div style={{ background: "#FEF6EA", border: "1px solid #FFD2B0", borderRadius: 10, padding: "12px 14px", marginTop: 12, fontSize: 14, lineHeight: 1.7, color: "#333" }}>
                    <strong style={{ color: "#FF6200" }}>診断：</strong>
                    {verdict}
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 800, marginTop: 18, marginBottom: 8 }}>価格帯の内訳</h3>
                  {bandCounts.map((b) => (
                    <div key={b.band} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 4 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 5, background: BANDS[b.band].color, flex: "none" }} />
                      <span style={{ flex: 1 }}>{BANDS[b.band].label}</span>
                      <strong>{b.n}店</strong>
                    </div>
                  ))}

                  <h3 style={{ fontSize: 15, fontWeight: 800, marginTop: 18, marginBottom: 8 }}>打ち出し別の店舗数</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {featureCounts.map((f) => (
                      <span key={f.tag} style={{ fontSize: 13, border: "1px solid #ddd", borderRadius: 100, padding: "4px 10px", background: f.n ? "#fff" : "#f3f4f6" }}>
                        {f.label} <strong>{f.n}</strong>
                      </span>
                    ))}
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 800, marginTop: 18, marginBottom: 8 }}>まだ空いているポジション</h3>
                  {gaps.length ? (
                    <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                      この範囲の掲載店には「{gaps.map((g) => g.label).join("」「")}」を打ち出すジムがありません。
                    </p>
                  ) : (
                    <p style={{ fontSize: 14, lineHeight: 1.7 }}>主な打ち出し（女性専用・30分・入会金0円・早朝）はすべて既存店がカバーしています。目的特化（競技・リハビリ・シニアなど）で差別化を考えましょう。</p>
                  )}
                </>
              )}

              {mode === "user" && (
                <>
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginTop: 14, marginBottom: 8 }}>条件で絞り込む</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {FEATURES.map((f) => {
                      const on = filters.includes(f.tag);
                      return (
                        <button
                          key={f.tag}
                          onClick={() => setFilters(on ? filters.filter((x) => x !== f.tag) : [...filters, f.tag])}
                          style={{ fontSize: 13, borderRadius: 100, padding: "5px 12px", border: "1px solid #FF6200", background: on ? "#FF6200" : "#fff", color: on ? "#fff" : "#FF6200", fontWeight: 700 }}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <h3 style={{ fontSize: 15, fontWeight: 800, marginTop: 18, marginBottom: 8 }}>
                近い順{mode === "user" && filters.length ? `（条件に合う${shown.length}店）` : ""}
              </h3>
              <ul style={{ maxHeight: 260, overflowY: "auto", border: "1px solid #eee", borderRadius: 10 }}>
                {shown.slice(0, 60).map((g) => (
                  <li key={g.name + g.address} style={{ padding: "8px 12px", borderBottom: "1px solid #f1f1f1", fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <strong>{g.name}</strong>
                      <span style={{ color: "#888", flex: "none" }}>{Math.round(g.d)}m</span>
                    </div>
                    <div style={{ color: "#666" }}>
                      {g.access}　{data.chains[g.chain]?.price60}
                    </div>
                    {g.articles[0] && (
                      <Link href={`/area/${g.articles[0]}`} style={{ color: "#006EBD", fontSize: 12 }}>
                        エリア記事で詳しく見る →
                      </Link>
                    )}
                  </li>
                ))}
                {shown.length === 0 && <li style={{ padding: 12, fontSize: 13, color: "#666" }}>この範囲に該当するジムはありません。</li>}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
