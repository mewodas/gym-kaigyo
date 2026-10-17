"""公開後に見つかった店舗の追記（inventory.py の結果から、既存記事に漏れていたもの）。2026年10月に公式で確認。"""

from stations_major import g, MIYA_H, RW_H
from stations_wave3 import BY_H, kh

SPACE_H = "9:00〜23:00（年中無休）"
RZ_H = "7:00〜23:00"

ADDITIONS = {
    "tokyo-yurakucho-shinbashi": [
        g("spacegym", "SPACE GYM 東京駅店", "東京都中央区日本橋3-4-3 八重洲N3ビル", "JR東京駅八重洲中央口 徒歩5分、日本橋駅B3出口 徒歩4分", "東京駅 徒歩5分", SPACE_H),
        g("spacegym", "SPACE GYM 銀座店", "東京都中央区銀座2-2-18 TH銀座ビル8F", "銀座一丁目駅4番出口すぐ、JR有楽町駅中央口 徒歩3分", "有楽町駅 徒歩3分", SPACE_H),
    ],
    "ginza": [
        g("spacegym", "SPACE GYM 銀座店", "東京都中央区銀座2-2-18 TH銀座ビル8F", "銀座一丁目駅4番出口すぐ、銀座駅C6出口 徒歩5分", "銀座一丁目駅すぐ", SPACE_H),
        g("spacegym", "SPACE GYM 東銀座店", "東京都中央区銀座1-20-11 BORU", "東銀座駅・新富町駅・銀座一丁目駅 徒歩4分", "東銀座駅 徒歩4分", SPACE_H),
    ],
    "shibuya": [
        g("beyond", "BEYOND 渋谷宮益坂店", "東京都渋谷区渋谷2-10-9 210野村ビル", "渋谷駅B5出口 徒歩5分", "渋谷駅 徒歩5分", "10:00〜22:00（定休日なし）"),
        g("spacegym", "SPACE GYM 渋谷店", "東京都渋谷区渋谷3-1-10 IRIE", "渋谷駅C1出口 徒歩7分", "渋谷駅 徒歩7分", SPACE_H),
    ],
    "ikebukuro": [
        g("w247", "24/7Workout 池袋東口店", "東京都豊島区東池袋4-29-12 サンフラット佐藤2F", "東池袋駅 徒歩3分", "東池袋駅 徒歩3分"),
        g("beyond", "BEYOND 池袋ANNEX店", "東京都豊島区東池袋4-3-3 東池袋ビル", "東池袋駅 徒歩1分、池袋駅東口 徒歩10分", "東口 徒歩10分", BY_H),
    ],
    "shinjuku": [
        g("spacegym", "SPACE GYM 西新宿店", "東京都新宿区西新宿6-5-1 新宿アイランド1階", "丸ノ内線 西新宿駅 徒歩2分", "西新宿駅 徒歩2分", SPACE_H),
    ],
    "yotsuya-ichigaya": [
        g("beyond", "BEYOND 四谷三丁目新宿御苑店", "東京都新宿区左門町6-17 SEN四谷", "四谷三丁目駅3番出口 徒歩1分", "四谷三丁目駅 徒歩1分", BY_H),
        g("katagiri", "かたぎり塾 四谷三丁目店", "東京都新宿区四谷3-8-3 三橋ビル", "四谷三丁目駅 徒歩1分、四ツ谷駅 徒歩10分", "四谷三丁目駅 徒歩1分", "平日10:00〜22:00、土8:00〜20:00、日9:00〜20:00"),
    ],
    "tamachi-hamamatsucho": [
        g("spacegym", "SPACE GYM 田町三田店", "東京都港区芝4-11-1 TB田町ビル1F", "公式表記は「駅徒歩5分」（三田駅・田町駅の間）", "駅徒歩5分", SPACE_H),
    ],
    "oimachi": [
        g("katagiri", "かたぎり塾 大井町店", "東京都品川区東大井5-1-9 1階", "JR大井町駅 徒歩1〜2分", "大井町駅 徒歩2分", "曜日により異なる（公式で確認）"),
    ],
    "ogikubo-nishiogikubo": [
        g("katagiri", "かたぎり塾 西荻窪店", "東京都杉並区西荻南3-14-6 フェスタ西荻窪", "西荻窪駅 徒歩2分", "西荻窪駅 徒歩2分", "平日10:00〜22:00、土日9:00〜20:00"),
        g("realworkout", "REAL WORKOUT 西荻窪店", "東京都杉並区西荻北2-27-8 西荻STビル1F", "JR西荻窪駅 徒歩5分", "西荻窪駅 徒歩5分", "8:00〜24:00", extra_tags=["long_hours"]),
    ],
}

RIZAP = {
    "ginza": [g("rizap", "RIZAP 銀座店", "東京都中央区銀座2-11-8 ラウンドクロス銀座2丁目5F", "東銀座駅A2出口 徒歩7分、銀座一丁目駅11番出口 徒歩10分", "東銀座駅 徒歩7分", RZ_H),
              g("rizap", "RIZAP 銀座（女性専用）店", "東京都中央区銀座6-13-6 ヒューリック銀座ウォールビル2階", "銀座駅 徒歩5分、東銀座駅 徒歩4分", "銀座駅 徒歩5分", RZ_H, extra_tags=["women"], note="女性専用店です。")],
    "shinagawa-takanawagateway": [g("rizap", "RIZAP 品川店", "東京都港区高輪3-25-22 高輪カネオビル8階", "JR品川駅高輪口 徒歩約3分", "品川駅 徒歩3分", RZ_H)],
    "shinjuku": [g("rizap", "RIZAP 新宿店", "東京都新宿区西新宿7-16-11 FORECAST西新宿3F・4F", "新宿西口駅D5出口 徒歩4分、JR新宿駅B16出口 徒歩6分", "新宿駅 徒歩6分", RZ_H)],
    "ueno-okachimachi-uguisudani": [g("rizap", "RIZAP 上野店", "東京都台東区上野2-12-20 NDKロータスビルB1F", "JR上野駅不忍口 徒歩5分", "上野駅 徒歩5分", RZ_H)],
    "kinshicho": [g("rizap", "RIZAP 錦糸町店", "東京都墨田区江東橋3-9-10 丸井錦糸町店6F", "JR錦糸町駅南口 徒歩2分", "南口 徒歩2分", "10:00〜22:00")],
    "jiyugaoka": [g("rizap", "RIZAP 自由が丘店", "東京都目黒区自由が丘1-14-14 自由ヶ丘アルネックビル3・4F", "自由が丘駅北口 徒歩5分", "自由が丘駅 徒歩5分", RZ_H)],
    "shimokitazawa": [g("rizap", "RIZAP 下北沢店", "東京都世田谷区北沢2-6-10 仙田ビル1・2F", "下北沢駅 徒歩2分", "下北沢駅 徒歩2分", RZ_H)],
    "futakotamagawa": [g("rizap", "RIZAP 二子玉川店", "東京都世田谷区玉川2-24-1 キュープラザ二子玉川B1F", "二子玉川駅 徒歩1分", "二子玉川駅 徒歩1分", RZ_H)],
    "ebisu": [g("rizap", "RIZAP 恵比寿店", "東京都渋谷区恵比寿南2-3-14 キュープラザ恵比寿南4F", "JR恵比寿駅西口 徒歩3分", "西口 徒歩3分", RZ_H)],
    "ikebukuro": [g("rizap", "RIZAP 池袋西口店", "東京都豊島区池袋2-40-13 デュープレックスビズ3F", "池袋駅西口C6出口 徒歩5分", "西口 徒歩5分", RZ_H)],
    "kitasenju": [g("rizap", "RIZAP 北千住店", "東京都足立区千住仲町19-6 和光ビル2F", "東京メトロ千代田線 北千住駅1番出口 徒歩5分", "北千住駅 徒歩5分", RZ_H)],
    "tachikawa": [g("rizap", "RIZAP 立川店", "東京都立川市曙町1-13-11 立川クレストビル7F", "JR立川駅北口 徒歩6分", "北口 徒歩6分", RZ_H)],
    "kichijoji": [g("rizap", "RIZAP 吉祥寺店", "東京都武蔵野市吉祥寺本町2-15-4 ミュプレ吉祥寺2F", "吉祥寺駅北口 徒歩6分", "北口 徒歩6分", RZ_H)],
    "machida": [g("rizap", "RIZAP 町田店", "東京都町田市原町田4-5-8 MIキューブ町田イースト3F", "JR町田駅北口・小田急線町田駅東口 徒歩5分", "町田駅 徒歩5分", RZ_H)],
    "seisekisakuragaoka-tamacenter": [g("rizap", "RIZAP 聖蹟桜ヶ丘店", "東京都多摩市関戸2-39-12 桜ヶ丘NKビル2F", "京王線 聖蹟桜ヶ丘駅東口 徒歩3分", "聖蹟桜ヶ丘駅 徒歩3分", RZ_H)],
}


def _auto():
    """assign_new.py が作った自動振り分け（GOODLIFE GYM・Dr.トレーニング・THE PERSONAL GYM など）。"""
    import json
    import os
    p = os.path.join(os.path.dirname(__file__), "research", "auto_additions.json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}


def apply(stations):
    auto = _auto()
    for st in stations:
        st["gyms"] = st["gyms"] + ADDITIONS.get(st["slug"], []) + RIZAP.get(st["slug"], []) + auto.get(st["slug"], [])
    return stations
