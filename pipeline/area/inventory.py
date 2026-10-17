"""主要チェーンの都内全店舗を公式サイトから集めて research/stores.json に保存する。

使い方:  python3 pipeline/area/inventory.py
記事に載せる前に、出力の住所・アクセスは目で確認すること（自動抽出のため崩れることがある）。
"""

import html
import json
import os
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor

OUT = os.path.join(os.path.dirname(__file__), "research", "stores.json")
UA = {"User-Agent": "Mozilla/5.0"}


def get(url):
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode("utf-8", "ignore"), r.geturl()
    except Exception:
        return "", url


def text(t):
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", t, flags=re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html.unescape(t)))


def links(url, pattern):
    t, _ = get(url)
    return sorted(set(re.findall(pattern, t)))


def sources():
    s = []
    for p in links("https://aspirest.com/access/", r'/access/tokyo/[a-z_\-]+/'):
        s.append(("aspi", "https://aspirest.com" + p))
    for p in links("https://katagirijuku.jp/gyms/location/kanto/tokyo", r'href="(/gyms/[a-z0-9-]+)"'):
        if "location" not in p:
            s.append(("katagiri", "https://katagirijuku.jp" + p))
    for p in links("https://applegym.jp/", r'applegym.jp/shop/([a-z0-9-]+)/'):
        s.append(("apple", f"https://applegym.jp/shop/{p}/"))
    for p in links("https://miyazaki-gym.jp/", r'href="/shop/([a-z0-9-]+)/"'):
        s.append(("miyazaki", f"https://miyazaki-gym.jp/shop/{p}/"))
    for p in links("https://beyond-gym.com/gym/area/tokyo/", r'https://beyond-gym.com/gym/gym-[a-z0-9-]+/'):
        s.append(("beyond", p))
    for p in links("https://247-sports.jp/workout/gym/kantou/tokyo/", r'/workout/gym/kantou/tokyo/[a-z]+\.html'):
        s.append(("w247", "https://247-sports.jp" + p))
    for p in links("https://realworkout.jp/location/tokyo-to/", r'https://realworkout.jp/location/[a-z-]+/'):
        if not p.rstrip("/").endswith("-ken") and not p.rstrip("/").endswith("tokyo-to"):
            s.append(("realworkout", p))
    for p in links("https://b-concept.tokyo/", r'https://b-concept.tokyo/clublist/[a-z-]+/'):
        s.append(("bconcept", p))
    for p in links("https://www.outline-gym.com/gym", r'/gym/([a-z0-9-]+)'):
        if p not in ("icon", "store"):
            s.append(("outline", f"https://www.outline-gym.com/gym/{p}"))
    for p in links("https://ratgym.jp/", r'https://ratgym.jp/shop/tokyo/[a-z]+/'):
        s.append(("rat", p))
    for p in links("https://www.space-gym.com/", r'https://www.space-gym.com/shop/[a-z]+/'):
        s.append(("spacegym", p))
    return s


def parse(item):
    chain, url = item
    t, final = get(url)
    x = text(t)
    title = (re.findall(r"<title>(.*?)</title>", t, re.S) or [""])[0].strip()
    addr = re.findall(r"(?:住所|ADDRESS)[^東]{0,20}(東京都[^ ]{2,40}(?: [^ ]{1,20})?)", x)
    if not addr:
        addr = re.findall(r"〒?\d{3}-\d{4} ?(東京都[^ ]{2,40}(?: [^ ]{1,20})?)", x)
    if not addr and chain == "realworkout":
        addr = re.findall(r"住所 ([^ ]{2,4}[区市][^ ]{2,40}(?: [^ ]{1,20})?)", x)
    access = list(dict.fromkeys(
        m.group(0).strip() for m in re.finditer(r"[^ 。、]{0,25}駅[^。]{0,12}徒歩\s?約?[0-9０-９]+\s?分", x)))[:3]
    hours = re.findall(r"営業時間 ?(?:Opening Hours)? ?[^。]{0,70}", x)[:1]
    return {"chain": chain, "url": url, "final": final, "title": title[:80],
            "address": addr[0] if addr else "", "access": access, "hours": hours[0] if hours else ""}


def main():
    src = sources()
    with ThreadPoolExecutor(12) as ex:
        rows = list(ex.map(parse, src))
    rows = [r for r in rows if "東京都" in r["address"] or (r["chain"] == "realworkout" and r["address"])]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=1)
    print(len(src), "pages →", len(rows), "Tokyo stores")


if __name__ == "__main__":
    main()
