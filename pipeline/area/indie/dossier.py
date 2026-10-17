"""候補ごとに公式サイトのトップ＋料金・アクセスページを読み、確認用の調書（research/indie_dossier.json）を作る。"""

import json
import os
import re
import sys
import unicodedata
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urljoin, urlparse

HERE = os.path.dirname(__file__)
sys.path.insert(0, HERE)
from collect import get, text  # noqa: E402

R = os.path.join(HERE, "..", "research")
SUB = re.compile(r"price|plan|ryokin|fee|cost|menu|course|system|access|shop|store|studio|about|tenpo|料金|プラン|アクセス", re.I)


def z(s):
    return unicodedata.normalize("NFKC", s or "")


def pages(url):
    t, final = get(url)
    out = [(final, t)]
    host = urlparse(final).netloc
    subs = []
    for h in re.findall(r'href="([^"#]+)"', t):
        u = urljoin(final, h)
        if urlparse(u).netloc == host and SUB.search(u) and u not in subs and u != final:
            subs.append(u)
    for u in subs[:4]:
        tt, ff = get(u)
        if tt:
            out.append((ff, tt))
    return out


def extract(url):
    ps = pages(url)
    xs = [z(text(t)) for _, t in ps]
    allx = " ".join(xs)
    title = z((re.findall(r"<title>(.*?)</title>", ps[0][1], re.S) or [""])[0]).strip()[:100]
    addr = list(dict.fromkeys(re.findall(r"東京都[^\s]{2,12}[区市町村][^\s]{2,30}\d[^\s]{0,25}(?: [^\s]{1,20})?", allx)))[:4]
    access = list(dict.fromkeys(m.group(0).strip() for m in re.finditer(r"[^ 。、]{0,30}駅[^。]{0,15}徒歩\s?約?\d+\s?分", allx)))[:4]
    hours = list(dict.fromkeys(re.findall(r"営業時間[:：]?\s?[^。]{0,60}", allx)))[:3]
    prices = list(dict.fromkeys(m.group(0).strip() for m in re.finditer(r"[^。]{0,45}\d{1,3}(?:,\d{3})+円[^。]{0,35}", allx)))[:20]
    entry = list(dict.fromkeys(m.group(0) for m in re.finditer(r"入会金[^。]{0,60}", allx)))[:3]
    stores = len(set(re.findall(r"([一-龥ァ-ヶーA-Za-z0-9]{1,8}店)", allx)))
    flags = {k: (k in allx) for k in ["女性専用", "30分", "完全個室", "マンツーマン", "セミパーソナル", "通い放題", "整体", "ピラティス", "キックボクシング", "加圧"]}
    return {"url": ps[0][0], "pages": [p for p, _ in ps], "title": title, "addr": addr, "access": access, "hours": hours,
            "prices": prices, "entry": entry, "store_words": stores, "flags": flags}


def main():
    cands = json.load(open(os.path.join(R, "indie_candidates.json"), encoding="utf-8"))
    with ThreadPoolExecutor(10) as ex:
        res = list(ex.map(lambda c: extract(c["url"]), cands))
    out = []
    for c, r in zip(cands, res):
        r["host"] = c["host"]
        r["seen_in"] = c["articles"]
        out.append(r)
    json.dump(out, open(os.path.join(R, "indie_dossier.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(out))


if __name__ == "__main__":
    main()
