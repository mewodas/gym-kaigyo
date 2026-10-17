"""inventory で集めた新チェーンの店舗を、近い駅の記事へ自動で振り分ける（research/auto_additions.json）。

記事の駅（短い名前を「・」で分けたもの）から 800m 以内の店舗を、その記事に追加する。
使い方:  python3 pipeline/area/assign_new.py
"""

import json
import math
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(__file__)
sys.path.insert(0, HERE)
from export_map import geocode, addr_key, CACHE  # noqa: E402
from inventory import get, text  # noqa: E402
from stations import STATIONS  # noqa: E402
from stations_major import MAJOR  # noqa: E402
from stations_wave3 import WAVE3  # noqa: E402
from stations_wave4 import WAVE4  # noqa: E402

R = os.path.join(HERE, "research")
NEW_CHAINS = {"goodlife", "drtraining", "tpg", "dietpartner", "arisanfit"}
MAX_M = 800


def z(s):
    return unicodedata.normalize("NFKC", s or "")


def dist(a, b, c, d):
    p1, p2 = math.radians(a), math.radians(c)
    return 2 * 6371000 * math.asin(math.sqrt(math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(d - b) / 2) ** 2))


def name_of(r):
    t, c = z(r.get("title", "")), r["chain"]
    if r.get("store"):
        return f"GOODLIFE GYM {r['store']}"
    pats = {
        "drtraining": r"Dr\.?トレーニング\s?([^\s|｜]+?店)",
        "dietpartner": r"ダイエットパートナー\s?([^\s|｜]+?店)",
        "tpg": r"([一-龥ァ-ヶーヶ々A-Za-z0-9・]+?)(?:駅\d+分)?のパーソナルジム",
    }
    tpg_names = {"azabujuban-annex": "麻布十番ANNEX店", "kanamachi": "金町店", "kichijoji": "吉祥寺店", "kokubunji": "国分寺店",
                 "monzennakacho": "門前仲町店", "nishisugamo-itabashi-annex": "西巣鴨店（板橋ANNEX店）", "shimoigusa": "下井草店",
                 "takadanobaba": "高田馬場店", "nippori": "日暮里店", "kikukawa-morishita": "菊川・森下店"}
    slug = r["url"].rstrip("/").split("/")[-1]
    if c == "tpg" and slug in tpg_names:
        return "THE PERSONAL GYM " + tpg_names[slug]
    if c == "arisanfit":
        return "ARISANFIT " + {"s-shibuya": "渋谷店", "s-koenji": "東高円寺店", "s-ikebukuro": "池袋店"}[r["url"].rstrip("/").split("/")[-1]]
    m = re.search(pats.get(c, "$^"), t)
    if not m:
        return ""
    n = m.group(1)
    if c == "tpg":
        n = re.sub(r"^.*】", "", n) + "店"
        return "THE PERSONAL GYM " + n
    return {"drtraining": "Dr.トレーニング ", "dietpartner": "ダイエットパートナー "}[c] + n


def hours_of(r):
    h = z(r.get("hours", ""))
    m = re.search(r"営業時間[:：]?\s*([0-9０-９平日土日祝月火水木金 /〜～~:：\-、()（）最終受付は]+)", h)
    if not m:
        return ""
    v = m.group(1).strip(" /")
    v = v.replace("~", "〜").replace("～", "〜").replace("-", "〜")
    return v if re.search(r"\d", v) else ""


def official_block(r):
    """THE PERSONAL GYM / ダイエットパートナーは店舗情報欄から営業時間とアクセスを読む（口コミ欄を拾わないため）。"""
    x = z(text(get(r["url"])[0]))
    if r["chain"] == "tpg":
        m = re.search(r"営業時間 (\d[^ア]{3,40}?) アクセス (.{4,80}?) 電話番号", x)
        if m:
            return m.group(2).split("、")[0].strip(), m.group(1).strip()
    if r["chain"] == "dietpartner":
        h = re.search(r"営業時間 営業時間 (\d+:\d+-\d+:\d+)", x)
        a = re.search(r"『([^』]+駅)』より徒歩(\d+)分", x)
        if a:
            return f"{a.group(1)} 徒歩{a.group(2)}分", (h.group(1).replace("-", "〜") if h else "")
    return None


def access_of(r):
    for a in (r.get("access2") or []) + (r.get("access") or []):
        a = z(a)
        a = re.sub(r"^.*?(最寄り駅|アクセス)\s*", "", a)
        a = a.replace("「", "").replace("」", "")
        if "駅" in a and "徒歩" in a and len(a) < 60:
            return a.strip()
    return ""


def main():
    cache = json.load(open(CACHE, encoding="utf-8"))
    st_coords = {}
    all_st = json.load(open(os.path.join(R, "stations_tokyo.json"), encoding="utf-8"))
    for s in all_st:
        st_coords.setdefault(s["name"], (s["lat"], s["lng"]))
    articles = []
    for st in STATIONS + MAJOR + WAVE3 + WAVE4:
        names = [n for n in re.split("・", st["short"])] + st.get("stations", [])
        pts = [st_coords[n] for n in names if n in st_coords]
        existing = {addr_key(g["address"]) for g in st["gyms"]}
        articles.append((st["slug"], pts, existing))
    articles.append(("gotanda", [st_coords["五反田"]], set()))
    out, skipped, seen = {}, [], set()
    rows = json.load(open(os.path.join(R, "stores2.json"), encoding="utf-8"))
    for r in rows:
        if r["chain"] not in NEW_CHAINS:
            continue
        nm, acc, hrs = name_of(r), access_of(r), hours_of(r)
        if r["chain"] in ("tpg", "dietpartner"):
            ob = official_block(r)
            acc, hrs = (ob if ob else ("", ""))
        lat, lng = geocode(r["address"], cache)
        if not lat:
            continue
        if r["chain"] == "arisanfit":
            acc = {"s-shibuya": "JR渋谷駅 徒歩4分", "s-koenji": "東高円寺駅 徒歩2分", "s-ikebukuro": "北池袋駅 徒歩30秒"}[r["url"].rstrip("/").split("/")[-1]]
        if hrs:
            hrs = hrs.replace("~", "〜").replace(": ", ":").replace("平日:", "平日")
            hrs = re.sub(r"(\d)-(\d)", r"\1〜\2", hrs)
            if hrs.count("(") > hrs.count(")"):
                hrs = hrs[: hrs.rfind("(")].strip()
        if r["chain"] == "goodlife":
            near = min(all_st, key=lambda s: dist(lat, lng, s["lat"], s["lng"]))
            dd = dist(lat, lng, near["lat"], near["lng"])
            acc = f"最寄りは{near['name']}駅（直線距離 約{int(round(dd, -1))}m・公式に記載がないため当サイトが地図から算出）"
        if not nm or not acc:
            skipped.append((r["chain"], r["url"], nm, acc))
            continue
        best = None
        for slug, pts, existing in articles:
            if addr_key(r["address"]) in existing:
                best = None
                break
            for p in pts:
                d = dist(lat, lng, p[0], p[1])
                if d <= MAX_M and (best is None or d < best[1]):
                    best = (slug, d)
        k = addr_key(r["address"]) + r["chain"]
        if best and best[0] != "gotanda" and k not in seen:
            seen.add(k)
            m2 = re.search(r"([^\s、/・(（」『]+駅)[^。]*?(徒歩\s?約?\d+(?:分|秒)|直線距離 約\d+m)", acc)
            short = f"{m2.group(1)} {m2.group(2)}" if m2 else acc[:20]
            short = re.sub(r"^(JR|東京メトロ|都営|東急|京王|小田急|西武|東武|京急)?[^\s]*?線", "", short) or short
            extra = ["early"] if hrs and re.match(r"(平日\s*)?0?7:", hrs) else []
            out.setdefault(best[0], []).append({
                "chain": r["chain"], "store": nm, "address": z(r["address"]).split(" アクセス")[0],
                "access": acc, "short_access": short.replace("直線距離 約", "約"), "hours": hrs or None, "extra_tags": extra,
            })
    json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
    json.dump(out, open(os.path.join(R, "auto_additions.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(sum(len(v) for v in out.values()), "stores →", len(out), "articles; skipped", len(skipped))
    for s in skipped:
        print("  skip", s)


if __name__ == "__main__":
    main()
