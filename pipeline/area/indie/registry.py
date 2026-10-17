"""個人・小規模ジムの登録の仕組み。gyms.py に1ジム1行で書き、ここで CHAINS 形式に変換する。

各ジムの情報は公式サイト（url）で確認したものだけを書くこと。
"""

BAND_TEXT = {
    "low": "1回あたりの料金を抑えて長く通いたい人",
    "mid": "相場並みの料金で、小規模ジムならではの丁寧な指導を受けたい人",
    "course": "期間を決めて集中的に体を変えたい人",
    "other": "短時間や少人数など、自分の生活に合った形で通いたい人",
}


def I(key, name, url, address, access, short, hours, prices, entry, band, low, tags, note="", area=""):
    return {"key": key, "name": name, "url": url, "address": address, "access": access, "short": short, "hours": hours,
            "prices": prices, "entry": entry, "band": band, "low": low, "tags": tags, "note": note, "area": area}


def to_chain(g):
    price_md = "\n".join(f"- {p}" for p in g["prices"])
    price_md += f"\n- 入会金：{g['entry']}\n- 出典：[公式サイト]({g['url']})（料金・キャンペーンは変わることがあるため申し込み前に確認してください）"
    feats = [g["note"]] if g["note"] else []
    feats.append("独立系（個人・小規模）のジム")
    first = g["prices"][0] if g["prices"] else "公式サイトで確認"
    return {
        "band": g["band"],
        "cheap_note": first,
        "name": g["name"],
        "price60": first,
        "entry": g["entry"],
        "low": g["low"],
        "strength": g["note"] or "独立系のジム",
        "tags": g["tags"],
        "about": f"{g['name']}は、{g['area'] or 'この駅の周辺'}にある独立系（個人・小規模）のパーソナルジムです。大手チェーンとは違い、店舗ごとに料金や指導方針が大きく異なります。",
        "price_md": price_md,
        "features": feats,
        "for": f"{BAND_TEXT[g['band']]}に向いています。",
        "comment": "個人経営のジムは、担当トレーナーとの相性がそのまま満足度につながります。体験では「誰が担当するのか」「予約は取りやすいか」を必ず確認しましょう。",
        "independent": True,
    }
