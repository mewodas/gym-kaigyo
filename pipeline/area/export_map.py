"""出店エリア診断マップ用のデータ（public/data/map.json）を作る。

- ジム：記事に載せた店舗（stations*.py + additions.py）と、inventory.py / RIZAP で集めた公式店舗の全件
- 座標：国土地理院の住所検索API（無料・キー不要）で住所から取得。research/geocode.json にキャッシュ
- 駅：HeartRails Express の東京都の駅（research/stations_tokyo.json）

使い方:  python3 pipeline/area/export_map.py
"""

import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request

HERE = os.path.dirname(__file__)
sys.path.insert(0, HERE)
from chains import CHAINS  # noqa: E402
from stations import STATIONS  # noqa: E402
from stations_major import MAJOR  # noqa: E402
from stations_wave3 import WAVE3  # noqa: E402
from stations_wave4 import WAVE4  # noqa: E402
from additions import apply  # noqa: E402

RESEARCH = os.path.join(HERE, "research")
OUT = os.path.join(HERE, "..", "..", "public", "data", "map.json")
CACHE = os.path.join(RESEARCH, "geocode.json")

INV_CHAIN_NAMES = {k: v["name"] for k, v in CHAINS.items()}


def z(s):
    return unicodedata.normalize("NFKC", s or "")


def addr_key(a):
    a = z(a).replace("東京都", "").replace(" ", "")
    a = re.sub(r"[−ー‐-]", "-", a)
    a = re.sub(r"(\d+)丁目", r"\1-", a)
    a = re.sub(r"番地?|号", "-", a)
    m = re.match(r"(.*?\d+-\d+)", a)
    return m.group(1) if m else a[:12]


def clean_addr(a):
    a = z(a)
    a = re.sub(r"（.*?）|\(.*?\)", "", a)
    a = a.split(" アクセス")[0]
    if not a.startswith("東京都"):
        a = "東京都" + a
    return a.strip()


def geocode(addr, cache):
    q = re.sub(r"\s.*$", "", clean_addr(addr))  # 建物名を落とす
    if q in cache:
        return cache[q]
    url = "https://msearch.gsi.go.jp/address-search/AddressSearch?q=" + urllib.parse.quote(q)
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            res = json.loads(r.read().decode())
        lng, lat = res[0]["geometry"]["coordinates"] if res else (None, None)
    except Exception:
        lng, lat = None, None
    cache[q] = [lat, lng]
    time.sleep(0.15)
    return cache[q]


def store_name(chain, title):
    """inventory のページタイトルから「◯◯店」を取り出す。"""
    t = z(title)
    for m in re.finditer(r"([^\s|｜【】\]\[]{1,14}店)", t):
        s = m.group(1)
        if "パーソナル" in s or s in ("店",):
            continue
        s = re.sub(r"^(かたぎり塾|アップルジム|ジム|MIYAZAKIGYM|BEYOND|ビーコンセプト)", "", s)
        return s
    return ""


def main():
    cache = json.load(open(CACHE, encoding="utf-8")) if os.path.exists(CACHE) else {}
    gyms, seen = [], {}

    # 1. 記事に載せた店舗（記事へのリンクつき）
    for st in apply(STATIONS + MAJOR + WAVE3 + WAVE4):
        for g in st["gyms"]:
            k = addr_key(g["address"]) + g["chain"]
            if k in seen:
                gyms[seen[k]]["articles"].append(st["slug"])
                continue
            c = CHAINS[g["chain"]]
            seen[k] = len(gyms)
            gyms.append({"name": g["store"], "chain": g["chain"], "address": g["address"], "access": g["access"],
                         "hours": g.get("hours") or "", "tags": sorted(set(c["tags"]) | set(g.get("extra_tags", []))),
                         "articles": [st["slug"]]})
    # 五反田（手書き記事）の店舗
    for name, chain, addr, acc, tags in [
        ("メヲダス 五反田店", None, "東京都品川区西五反田2-18-3 グレイス五反田519号室", "五反田駅 徒歩2分", ["short", "early", "long_hours", "monthly", "low"]),
        ("EAGLE BASE 五反田店", "eagle", "東京都品川区東五反田5-22-32", "JR五反田駅 徒歩2分", None),
        ("JOHNNY STYLE 五反田店", "johnny", "東京都品川区東五反田1-18-3 竹田ビル501", "駅から2〜5分", None),
        ("sazanami Gotanda", None, "東京都品川区西五反田7-16-3 東京モリスビル第10 2階", "五反田駅 徒歩約7分", ["no_entry", "medical"]),
        ("MIYAZAKI GYM 五反田", "miyazaki", "東京都品川区西五反田2-18-3 グレイス五反田903", "JR五反田駅 徒歩3分", None),
        ("ASPI 五反田店", "aspi", "東京都品川区東五反田2-19-4 アロマ・フェリー201", "JR五反田駅東口 徒歩6分", None),
        ("BEYOND 五反田店", "beyond", "東京都品川区東五反田2-3-3 AMビル7F", "JR五反田駅東口 徒歩2分", None),
        ("アップルジム 五反田店", "apple", "東京都品川区東五反田5-28-11 クレール五反田1003号室", "JR五反田駅 徒歩2分", None),
        ("B/Y GYM 五反田店", None, "東京都品川区東五反田2-9-7 ピロティ五反田101", "五反田駅 徒歩4分", ["monthly", "early", "long_hours"]),
        ("SIN-YOU GYM（五反田）", None, "東京都品川区東五反田1-8-3 ディーウィング島津山702", "JR五反田駅 徒歩4分", ["women"]),
    ]:
        k = addr_key(addr) + (chain or name)
        if k in seen:
            gyms[seen[k]]["articles"].append("gotanda")
            continue
        seen[k] = len(gyms)
        gyms.append({"name": name, "chain": chain or "independent", "address": addr, "access": acc, "hours": "",
                     "tags": tags if tags is not None else sorted(CHAINS[chain]["tags"]), "articles": ["gotanda"]})

    # 2. inventory で集めた公式店舗（記事未掲載のものも地図には載せる）
    inv = json.load(open(os.path.join(RESEARCH, "stores.json"), encoding="utf-8"))
    for r in inv:
        if not r["access"] or "Opening Hours 曜日 営業時間 月曜日 定休日 火曜日 定休日 水曜日 定休日" in r["hours"]:
            continue
        k = addr_key(r["address"]) + r["chain"]
        if k in seen:
            continue
        sn = store_name(r["chain"], r["title"])
        if not sn:
            continue
        seen[k] = len(gyms)
        c = CHAINS[r["chain"]]
        gyms.append({"name": f"{c['name']} {sn}", "chain": r["chain"], "address": clean_addr(r["address"]),
                     "access": z(r["access"][0]).replace("最寄駅 ", ""), "hours": "", "tags": sorted(c["tags"]), "articles": []})
    for r in json.load(open(os.path.join(RESEARCH, "rizap.json"), encoding="utf-8")):
        k = addr_key(r["address"]) + "rizap"
        if k in seen:
            continue
        seen[k] = len(gyms)
        gyms.append({"name": f"RIZAP {r['name']}店", "chain": "rizap", "address": r["address"],
                     "access": r["station"].split("\r\n")[0], "hours": r["business_hours"], "tags": sorted(CHAINS["rizap"]["tags"]), "articles": []})

    # 2b. 第2弾で集めたチェーン（GOODLIFE GYM・Dr.トレーニング・THE PERSONAL GYM など）
    from assign_new import name_of, access_of  # 循環 import を避けるためここで読む
    for r in json.load(open(os.path.join(RESEARCH, "stores2.json"), encoding="utf-8")):
        k = addr_key(r["address"]) + r["chain"]
        nm = name_of(r)
        if k in seen or not nm or r["chain"] not in CHAINS:
            continue
        seen[k] = len(gyms)
        gyms.append({"name": nm, "chain": r["chain"], "address": clean_addr(r["address"]),
                     "access": access_of(r) or "最寄駅は公式サイトで確認", "hours": "", "tags": sorted(CHAINS[r["chain"]]["tags"]), "articles": []})

    # 3. 座標
    for i, gm in enumerate(gyms):
        lat, lng = geocode(gm["address"], cache)
        gm["lat"], gm["lng"] = lat, lng
        if i % 50 == 0:
            json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
    json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
    ok = [g for g in gyms if g["lat"]]
    for g in ok:
        g["access"] = re.sub(r"[■【】]", "", g["access"]).strip()

    stations = json.load(open(os.path.join(RESEARCH, "stations_tokyo.json"), encoding="utf-8"))
    chains = {k: {"name": v["name"], "price60": v["price60"], "entry": v["entry"], "strength": v["strength"],
                  "band": v["band"], "tags": v["tags"], "cheap_note": v["cheap_note"]} for k, v in CHAINS.items()}
    chains["independent"] = {"name": "個人・その他", "price60": "店舗ごとに異なる", "entry": "店舗ごとに異なる",
                             "strength": "", "band": "other", "tags": [], "cheap_note": ""}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump({"checked": "2026年10月", "gyms": ok, "stations": stations, "chains": chains},
              open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(len(gyms), "gyms,", len(ok), "geocoded,", len(stations), "stations")


if __name__ == "__main__":
    main()
