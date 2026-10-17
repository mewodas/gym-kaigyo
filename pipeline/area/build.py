"""エリア調査記事（content/area/*.mdx）を chains.py と stations.py から生成する。

使い方:  python3 pipeline/area/build.py
五反田（gotanda.mdx）は手書き記事なので生成対象外。
"""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from chains import CHAINS, CHECKED  # noqa: E402
from stations import RIDERSHIP, STATIONS  # noqa: E402

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "content", "area")
DATE = "2026-10-17"

# 目的別の見出しと、対応するタグ
PURPOSES = [
    ("初期費用を抑えて始めたい", "no_entry", "入会金がかからない"),
    ("30分以下の短い時間で通いたい", "short", "30分以下のコースがある"),
    ("1回あたりの料金を下げたい", "low", "60分前後で1回7,000円台以下にできる"),
    ("朝7時から通いたい", "early", "7時から営業している"),
    ("女性だけの空間で通いたい", "women", "女性専用"),
    ("少人数指導でもいいから、とにかく安くしたい", "semi", "トレーナー1人で複数人を見る形式"),
    ("短期間で結果を出したい・返金保証がほしい", "program", "短期集中のコース・プログラムがある"),
]

# 経営者向け「打ち出し方」の表に使う軸
AXES = [
    ("低価格", ["low"]),
    ("入会金0円", ["no_entry"]),
    ("短時間（30分以下）", ["short"]),
    ("女性専用", ["women"]),
    ("早朝・深夜営業", ["early", "long_hours"]),
    ("短期集中・返金保証", ["program", "refund"]),
    ("少人数指導で低価格", ["semi"]),
    ("会員制・トレーナー指名", ["premium"]),
]

GAP_LABELS = {
    "women": "女性専用",
    "short": "30分以下の短時間コース",
    "no_entry": "入会金0円",
    "early": "朝7時台からの営業",
}

BAND_LABELS = {
    "low": "低価格帯（60分前後で1回7,000円台以下にできる）",
    "mid": "中価格帯（1回8,000〜10,000円台）",
    "course": "コース型（2か月前後のプログラムで1回1万円以上）",
    "other": "別の物差しのジム（短時間・少人数・会員制など）",
}


def resolve(g):
    c = CHAINS[g["chain"]]
    tags = list(c["tags"]) + g.get("extra_tags", [])
    return {**c, **g, "tags": tags}


def chain_list(gs):
    """店舗名の羅列（同じチェーンは1回）。"""
    seen, names = set(), []
    for g in gs:
        if g["name"] not in seen:
            seen.add(g["name"])
            names.append(g["name"])
    return "、".join(names)


def build(st):
    gyms = [resolve(g) for g in st["gyms"]]
    n = len(gyms)
    label = st["label"]
    short = st["short"]
    out = []

    title = f"{label}のパーソナルジムおすすめ{n}選｜料金・特徴を比較【{CHECKED}調査】"
    desc = (
        f"{label}周辺のパーソナルジム{n}店を、公式サイトの料金・立地・強みで比較。"
        "目的別のおすすめに加え、トレーナー目線の選び方と、開業を考える人向けの競合分析もまとめました。"
    )
    tags = st["tags"] + ["パーソナルジム比較", "エリア調査"]
    out.append("---")
    out.append(f'title: "{title}"')
    out.append(f'description: "{desc}"')
    out.append(f'date: "{DATE}"')
    out.append("tags: [" + ", ".join(f'"{t}"' for t in tags) + "]")
    out.append(f'station: "{short}"')
    out.append('line: "山手線"')
    out.append(f"order: {st['order']}")
    out.append("---")
    out.append("")
    out.append(st["intro"])
    out.append("")
    out.append("> **この記事の調べ方**")
    out.append(f"> - 調査日：{CHECKED}。料金・所在地・営業時間は**各ジムの公式サイトに載っている内容**です（料金は税込。公式に税込表記がないものは本文に明記）。")
    out.append("> - 掲載したのは、公式サイトで料金と所在地を確認できたジムだけです。個人経営のジムなど、ここに載っていない選択肢もあります。")
    out.append("> - 料金やキャンペーンは変わることがあります。申し込む前に必ず公式サイトで確認してください。")
    out.append("> - 口コミの引用はしていません。掲載は無償で、広告費は受け取っていません。")
    out.append("")

    # 早見表
    out.append(f"## {short}のパーソナルジム早見表")
    out.append("")
    out.append("| ジム | 駅から | 1回の目安 | 入会金 | 強み |")
    out.append("|---|---|---|---|---|")
    for g in gyms:
        strength = "女性専門店" if "women" in g.get("extra_tags", []) else g["strength"]
        out.append(f"| {g['store']} | {g['short_access']} | {g['price60']} | {g['entry']} | {strength} |")
    out.append("")
    out.append("※「1回の目安」は公式の料金表をもとに1回あたりに直した金額です。チェーン共通の料金のため、店舗によって異なる場合があります。")
    if any(g["chain"] == "apple" for g in gyms):
        out.append("※アップルジムはトレーナー1人が最大2名を同時に指導する形式のため、完全マンツーマンのジムとは単純に比べられません。")
    out.append("")

    # 目的別
    out.append("## 目的別：こんな人にはこのジム")
    out.append("")
    for head, tag, _ in PURPOSES:
        hit = [g for g in gyms if tag in g["tags"]]
        if hit:
            out.append(f"- **{head}** → {chain_list(hit)}")
    out.append("")

    # 各店舗
    shown = set()
    for i, g in enumerate(gyms, 1):
        out.append(f"## {i}. {g['store']}")
        out.append("")
        first = g["chain"] not in shown
        out.append(g["about"] if first else f"{g['name']}の別店舗です。料金やサービスは、上で紹介した店舗と同じチェーン共通の内容です。")
        if g.get("note"):
            out.append("")
            out.append(g["note"])
        out.append("")
        out.append("### 店舗情報")
        out.append(f"- 住所：{g['address']}")
        out.append(f"- アクセス：{g['access']}")
        if g.get("hours"):
            out.append(f"- 営業時間：{g['hours']}")
        else:
            out.append("- 営業時間：公式サイトで確認してください")
        out.append("")
        if first:
            out.append(f"### 料金（{CHECKED}時点の公式料金）")
            out.append(g["price_md"])
            out.append("")
            out.append("### 特徴")
            for f in g["features"]:
                out.append(f"- {f}")
            out.append("")
            out.append("### こんな人におすすめ")
            out.append(g["for"])
            out.append("")
            out.append("> **トレーナー目線のひとこと**")
            out.append(f"> {g['comment']}")
            out.append("")
        shown.add(g["chain"])

    # 選び方
    out.append(f"## {short}でジムを選ぶポイント")
    out.append("")
    out.append(st["tips"])
    out.append("")
    out.append("**料金は「1回あたり」と「入会金込みの総額」の両方で比べる**")
    out.append("1回の単価が安くても、入会金が数万円かかると、最初の数か月の総額は逆転することがあります。気になるジムが2〜3店に絞れたら、「入会金＋4か月分」の総額で比べてみてください。")
    out.append("")
    out.append("**体験で「予約の取りやすさ」を必ず聞く**")
    out.append("仕事帰りの19〜21時は、どのジムも予約が集中しがちです。自分が通いたい曜日・時間帯に空きがあるかを、体験のときに確認しましょう。")
    out.append("")

    # 経営者向け
    out.append(f"## 【経営者向け】{short}エリアの競合分析")
    out.append("")
    out.append(f"ここからは、{short}周辺でパーソナルジムを開業したい人、すでに運営している人向けの内容です。")
    out.append("")
    out.append("### 商圏の特徴")
    for s in st["stations"]:
        if s in RIDERSHIP:
            num, rank = RIDERSHIP[s]
            out.append(f"- JR{s}駅の1日平均乗車人員は**{num:,}人**（山手線30駅中{rank}位）")
    out.append("- 出典：JR東日本「各駅の乗車人員 2024年度」")
    out.append(f"- {st['market']}")
    out.append("")

    out.append("### 価格帯の分布")
    out.append(f"今回掲載した{n}店を、公式料金をもとに価格帯で分けると次のようになります。")
    out.append("")
    for band, blabel in BAND_LABELS.items():
        hit = [g for g in gyms if g["band"] == band]
        if hit:
            seen, items = set(), []
            for g in hit:
                if g["name"] in seen:
                    continue
                seen.add(g["name"])
                items.append(f"{g['name']}（{g['cheap_note']}）")
            out.append(f"- **{blabel}**：" + "、".join(items))
    out.append("")

    out.append("### 競合の打ち出し方")
    out.append("| 軸 | 打ち出しているジム |")
    out.append("|---|---|")
    for axis, ts in AXES:
        hit = [g for g in gyms if any(t in g["tags"] for t in ts)]
        out.append(f"| {axis} | {chain_list(hit) if hit else '今回の掲載店にはなし'} |")
    out.append("")

    out.append("### まだ空いているポジション（筆者の見立て）")
    missing = [lbl for t, lbl in GAP_LABELS.items() if not any(t in g["tags"] for g in gyms)]
    if missing:
        out.append(f"- 今回掲載した{n}店には、「" + "」「".join(missing) + "」を打ち出すジムがありませんでした（個人経営のジムなど、掲載外の店舗にはある可能性があります）。")
    out.append(f"- {st['gaps']}")
    out.append("")

    out.append("### 出店するならここを見る")
    out.append(f"- {st['advice']}")
    out.append("- 物件選びの考え方は「[パーソナルジムの物件選び](/kaigyo/bukken-erabi)」、集客の基本は「[Googleビジネスプロフィール](/shukaku/google-business)」で詳しく解説しています。")
    out.append("")

    # FAQ
    out.append("## よくある質問")
    out.append("")
    full = [g for g in gyms if g["band"] in ("low", "mid")]
    if full:
        cheapest = min(full, key=lambda g: g["low"])
        others = [g for g in gyms if g["band"] == "other"]
        ans = f"60分前後の完全マンツーマンで比べると、公式料金で1回の単価が最も低くなるのは{cheapest['name']}（{cheapest['cheap_note']}）です。"
        if others:
            o = min(others, key=lambda g: g["low"])
            ans += f"短時間や少人数制まで含めると、{o['name']}（{o['cheap_note']}）も選択肢になります。"
        ans += "入会金を含めた総額でも比べてみてください。"
        out.append(f"**Q. {short}でいちばん安いパーソナルジムはどこですか？**")
        out.append(f"A. {ans}")
        out.append("")
    women = [g for g in gyms if "women" in g["tags"]]
    out.append("**Q. 女性専用のジムはありますか？**")
    if women:
        out.append(f"A. 今回掲載した中では、{chain_list(women)}が女性専用（女性専門店）です。")
    else:
        out.append(f"A. 今回公式で確認できた範囲では、{short}の周辺に女性専用をうたうパーソナルジムはありませんでした。女性トレーナーを指名できるかは、各ジムに問い合わせてください。")
    out.append("")
    out.append("**Q. 体験だけ受けて入会しなくても大丈夫ですか？**")
    out.append("A. 多くのジムが体験やカウンセリングを無料または低価格で行っており、当日の入会を必須にはしていません。ただし「体験当日の入会で入会金が割引」というジムもあるため、比べたい場合は割引の条件を確認しておきましょう。")
    out.append("")

    # まとめ
    out.append("## まとめ")
    out.append("")
    out.append(f"{short}周辺には、今回公式で確認できただけで{n}店のパーソナルジムがあります。")
    out.append("")
    out.append("- 費用を抑えたいなら、入会金と1回の単価をあわせた「総額」で比べる")
    out.append("- 忙しい人は、短時間コースや営業時間の長いジムが続けやすい")
    out.append("- 開業を考える人は、競合の少ない打ち出し方と場所を探す")
    out.append("")
    out.append("気になるジムが見つかったら、まずは体験で雰囲気と予約の取りやすさを確かめてみてください。")
    out.append("")
    return "\n".join(out)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for st in STATIONS:
        path = os.path.join(OUT_DIR, f"{st['slug']}.mdx")
        with open(path, "w", encoding="utf-8") as f:
            f.write(build(st))
        print("wrote", os.path.relpath(path))


if __name__ == "__main__":
    main()
