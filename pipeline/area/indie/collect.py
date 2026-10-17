"""個人・小規模ジムの公式サイト候補を集める（research/indie_candidates.json）。

比較サイトの駅別記事から外部リンク（＝各ジムの公式サイト）を拾うだけで、比較サイトの文章や数字は使わない。
候補の公式ページから住所・アクセス・営業時間・料金の該当箇所を抜き出し、人が確認してから indie/gyms.py に登録する。
"""

import html
import json
import os
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse

HERE = os.path.dirname(__file__)
sys.path.insert(0, os.path.join(HERE, ".."))
from stations import STATIONS  # noqa: E402
from stations_major import MAJOR  # noqa: E402
from stations_wave3 import WAVE3  # noqa: E402
from stations_wave4 import WAVE4  # noqa: E402

OUT = os.path.join(HERE, "..", "research", "indie_candidates.json")
UA = {"User-Agent": "Mozilla/5.0"}

SKIP_HOST = re.compile(
    r"google|facebook|twitter|x\.com|instagram|line\.me|lin\.ee|amazon|rakuten|a8\.net|valuecommerce|afb|moshimo|accesstrade|felmat|hotpepper|"
    r"youtube|tiktok|apple\.com|yahoo|hatena|pinterest|linkedin|wordpress|gstatic|jquery|cloudflare|doubleclick|bit\.ly|getpocket|feedly|"
    r"wikipedia|fontawesome|coubic|maps\.app|livedoor|\.or\.jp|\.ac\.jp|\.go\.jp|ekiten|fitmap|minhyo|jmty|indeed|note\.com|ameblo|"
    r"aspirest|katagirijuku|applegym|miyazaki-gym|beyond-gym|247-sports|eaglebase|exercisecoach|realworkout|b-concept|outline-gym|ratgym|"
    r"totalworkout|johnny-style|space-gym|rizap|goodlifegym|drtraining|the-personal-gym|dietpartner|arisanfit|waple|evigym|reset-gym|"
    r"chocozap|anytimefitness|goldsgym|konami|tipness|joyfit|curves|megalos|central|renaissance|fitplace|shapes-international|"
    r"basis-gym|nexus-gym|element-gym|b-monster|willbefit|af-mark|privateboxfit|pts-reawell|mewodas|sazanamifit"
)

SOURCES = [
    "https://oceans.tokyo.jp/choice/fitness/{s}-personalgym-osusume",
    "https://tokiel.jp/media/{s}_personalgym/",
]


def get(u):
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=25) as r:
            return r.read().decode("utf-8", "ignore"), r.geturl()
    except Exception:
        return "", u


def text(t):
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", t, flags=re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html.unescape(t)))


def romaji_keys():
    keys = {}
    for st in STATIONS + MAJOR + WAVE3 + WAVE4:
        for k in st["slug"].split("-"):
            keys.setdefault(k, st["slug"])
    keys.update({"gotanda": "gotanda", "takanawa": "shinagawa-takanawagateway", "kanda": "akihabara-kanda", "meguro": "meguro"})
    return keys


def collect_links():
    found = {}
    jobs = [(k, slug, src.format(s=k)) for k, slug in romaji_keys().items() for src in SOURCES]

    def one(job):
        k, slug, url = job
        t, final = get(url)
        if len(t) < 20000:
            return []
        out = []
        for m in re.finditer(r'<a[^>]+href="(https?://[^"#]+)"[^>]*>(.*?)</a>', t, re.S):
            h = m.group(1)
            host = urlparse(h).netloc
            if not host or urlparse(url).netloc in host or SKIP_HOST.search(host):
                continue
            out.append((host, h, re.sub(r"<[^>]+>", "", m.group(2)).strip()[:40], slug))
        return out

    with ThreadPoolExecutor(8) as ex:
        for res in ex.map(one, jobs):
            for host, h, label, slug in res:
                found.setdefault(host, {"urls": set(), "labels": set(), "articles": set()})
                found[host]["urls"].add(h)
                if label:
                    found[host]["labels"].add(label)
                found[host]["articles"].add(slug)
    return found


def probe(url):
    t, final = get(url)
    x = text(t)
    title = (re.findall(r"<title>(.*?)</title>", t, re.S) or [""])[0].strip()[:90]
    return {
        "url": final,
        "title": html.unescape(title),
        "addr": list(dict.fromkeys(re.findall(r"東京都[^ ]{3,40}(?: [^ ]{1,20})?", x)))[:3],
        "access": list(dict.fromkeys(m.group(0) for m in re.finditer(r"[^ 。、]{0,25}駅[^。]{0,15}徒歩\s?約?\d+\s?分", x)))[:3],
        "hours": re.findall(r"営業時間[^。]{0,60}", x)[:2],
        "prices": list(dict.fromkeys(m.group(0) for m in re.finditer(r"[^。]{0,40}\d{1,3},\d{3}円[^。]{0,30}", x)))[:12],
        "entry": (x[x.find("入会金"): x.find("入会金") + 80] if "入会金" in x else ""),
        "len": len(t),
    }


def main():
    found = collect_links()
    print(len(found), "hosts")
    # 公式トップ（同一ホストで最も短いURL）を代表に
    items = []
    for host, v in found.items():
        url = sorted(v["urls"], key=len)[0]
        items.append((host, url, v))
    with ThreadPoolExecutor(10) as ex:
        probes = list(ex.map(lambda it: probe(it[1]), items))
    rows = []
    for (host, url, v), p in zip(items, probes):
        if not any("東京都" in a for a in p["addr"]):
            continue
        rows.append({"host": host, "labels": sorted(v["labels"])[:5], "articles": sorted(v["articles"]), **p})
    json.dump(rows, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(rows), "Tokyo candidates")


if __name__ == "__main__":
    main()
