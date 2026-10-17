"""公開後に見つかった店舗の追記（inventory.py の結果から、既存記事に漏れていたもの）。2026年10月に公式で確認。"""

from stations_major import g, MIYA_H, RW_H
from stations_wave3 import BY_H, kh

SPACE_H = "9:00〜23:00（年中無休）"

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


def apply(stations):
    for st in stations:
        st["gyms"] = st["gyms"] + ADDITIONS.get(st["slug"], [])
    return stations
