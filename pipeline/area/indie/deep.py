"""調書で料金・住所・アクセスが取れなかった候補（research/indie_todo.txt）を、公式サイト内をもっと深く読んで再調査する。

トップページのリンクに加えて sitemap.xml も見て、料金・アクセス・店舗ページを最大15ページ読む。
結果は research/indie_deep.json。登録は人が確認してから indie/gyms.py に行う。

使い方:  python3 pipeline/area/indie/deep.py
"""

import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urljoin, urlparse

HERE = os.path.dirname(__file__)
sys.path.insert(0, HERE)
from collect import get, text  # noqa: E402
from dossier import z  # noqa: E402

R = os.path.join(HERE, "..", "research")
KEY = re.compile(r"price|plan|ryokin|fee|cost|menu|course|system|access|shop|store|studio|about|tenpo|company|info|guide|gaiyo|map|faq|"
                 r"料金|プラン|アクセス|店舗|コース|会社|概要", re.I)
SKIP = re.compile(r"\.(jpg|jpeg|png|gif|svg|webp|pdf|css|js)(\?|$)|/blog/|/column/|/news/|/tag/|/category/|/author/|/feed|wp-json|#", re.I)


def site_pages(url):
    t, final = get(url)
    host = urlparse(final).netloc
    root = f"{urlparse(final).scheme}://{host}/"
    links = [urljoin(final, h) for h in re.findall(r'href="([^"]+)"', t)]
    for sm in ("sitemap.xml", "wp-sitemap.xml", "sitemap_index.xml", "page-sitemap.xml"):
        st, _ = get(root + sm)
        locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", st)
        for loc in locs:
            if loc.endswith(".xml") and len(locs) < 30:
                links += re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", get(loc)[0])
            else:
                links.append(loc)
    subs = []
    for u in links:
        u = u.split("#")[0]
        if urlparse(u).netloc == host and KEY.search(u) and not SKIP.search(u) and u not in subs and u.rstrip("/") != final.rstrip("/"):
            subs.append(u)
    out = [(final, t)]
    for u in subs[:15]:
        tt, ff = get(u)
        if tt:
            out.append((ff, tt))
    return out


def extract(url):
    ps = site_pages(url)
    allx = " ".join(z(text(t)) for _, t in ps)
    addr = list(dict.fromkeys(re.findall(r"東京都[^\s]{2,12}[区市町村][^\s]{2,30}\d[^\s]{0,25}(?: [^\s]{1,20})?", allx)))[:6]
    access = list(dict.fromkeys(m.group(0).strip() for m in re.finditer(r"[^ 。、]{0,30}駅[^。]{0,15}徒歩\s?約?\d+\s?分", allx)))[:6]
    hours = list(dict.fromkeys(re.findall(r"営業時間[:：]?\s?[^。]{0,70}", allx)))[:3]
    prices = list(dict.fromkeys(m.group(0).strip() for m in re.finditer(r"[^。]{0,50}\d{1,3}(?:,\d{3})+\s?円[^。]{0,40}", allx)))[:40]
    entry = list(dict.fromkeys(m.group(0) for m in re.finditer(r"入会金[^。]{0,60}", allx)))[:3]
    return {"url": ps[0][0], "pages": [p for p, _ in ps], "addr": addr, "access": access, "hours": hours, "prices": prices, "entry": entry}


def main():
    dossier = {d["host"]: d["url"] for d in json.load(open(os.path.join(R, "indie_dossier.json"), encoding="utf-8"))}
    todo = []
    for line in open(os.path.join(R, "indie_todo.txt"), encoding="utf-8"):
        if line.startswith(("#", "【")) or "｜" not in line or "チェーン" in line:
            continue
        host, need = line.strip().split("｜", 1)
        host = re.sub(r"（.*?）", "", host).strip()
        url = dossier.get(host) or dossier.get("www." + host) or f"https://{host}/"
        todo.append({"host": host, "need": need, "url": url})
    with ThreadPoolExecutor(10) as ex:
        res = list(ex.map(lambda c: extract(c["url"]), todo))
    for c, r in zip(todo, res):
        r.update(host=c["host"], need=c["need"])
    json.dump(res, open(os.path.join(R, "indie_deep.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(res))


if __name__ == "__main__":
    main()
