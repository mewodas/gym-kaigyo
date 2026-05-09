# コンテンツ自動生成パイプライン

ジム開業ラボ＋X運用を自動化するためのインフラ。

---

## 構成

```
pipeline/
├── README.md          # このファイル
├── topics.json        # 記事トピックの待機キュー
├── PROMPT.md          # 記事生成プロンプト
├── x-strategy.md      # X運用戦略
├── x-prompt.md        # X投稿生成プロンプト
├── x-templates.md     # 定型ツイートテンプレ集
├── tasks.md           # タスク管理（Threads等含む）
└── x-posts/           # 生成されたX投稿草稿（{slug}.md）
```

---

## 自動化フロー

```
[1] 記事生成
    pipeline/topics.json から pending を1件取得
    → content/{category}/{slug}.mdx を生成
    → status を "published" に更新

[2] X投稿草稿生成
    生成した記事を読み込み
    → pipeline/x-posts/{slug}.md にスレッド・単発・告知を生成

[3] git commit & push
    → Vercel が自動デプロイ
    → サイトに記事が公開

[4] X予約投稿（手動 or 半自動）
    pipeline/x-posts/{slug}.md を確認
    → TweetDeck / X Pro の予約機能に登録
    → 1週間分のスケジュール完成
```

---

## 状態確認コマンド

```bash
# pending件数
jq '[.queue[] | select(.status == "pending")] | length' pipeline/topics.json

# 公開済み件数
jq '[.queue[] | select(.status == "published")] | length' pipeline/topics.json

# 次に生成される記事
jq '.queue[] | select(.status == "pending") | .title' pipeline/topics.json | head -1
```

---

## 手動でX投稿を生成する場合

1. `pipeline/x-prompt.md` のマスタープロンプトを開く
2. 対象記事のMDXコンテンツをコピー
3. プロンプト内の `{記事のMDXコンテンツをここに貼る}` を置換
4. Claude に投げる
5. 結果を `pipeline/x-posts/{slug}.md` として保存

---

## トピック追加方法

`topics.json` の `queue` 配列末尾に追加：

```json
{
  "category": "shukaku",
  "slug": "new-topic",
  "title": "...",
  "description": "...",
  "keywords": ["...", "..."],
  "status": "pending"
}
```

---

## スケジュール設定

### 推奨：1日1記事ペース（最速モード）

Claude Code の `/schedule` skill を使って毎日朝6:00に実行：

```
/schedule create
名前: gym-kaigyo-auto
スケジュール: 0 6 * * *
プロンプト: pipeline/PROMPT.md と pipeline/x-prompt.md を読み、
          topics.json の次のpending記事を1件生成。
          MDX とX投稿草稿を作成して commit & push。
```

### 慎重モード：週3記事ペース

```
スケジュール: 0 6 * * 1,3,5  # 月水金のみ
```

---

## 失敗時の対応

### 記事が生成されなかった
- `topics.json` の構造エラー → JSON validate
- `content/{category}/` ディレクトリが存在しない → mkdir
- 既に同名ファイルが存在 → スキップして次のpending

### X投稿草稿の品質が低い
- `x-prompt.md` のマスタープロンプトを改善
- 「実数値」「失敗談」「具体例」の重み付けを上げる

---

## 注意事項

- **記事は2,500文字以上を厳守**（短すぎるとSEO評価が下がる）
- **薬機法・景品表示法に違反する表現は禁止**（X投稿も同様）
- **重複チェック必須**（既存ファイルがある場合はスキップ）
- **生成された内容は必ず人間が最終確認**してから公開推奨

---

## 関連ドキュメント

- `pipeline/x-strategy.md` — X運用全体の戦略・KPI
- `pipeline/x-templates.md` — 定型ツイート集（記事と無関係な投稿用）
- `pipeline/tasks.md` — 手動タスク・将来タスク（Threads運用含む）

---

## ヒーロー画像の自動生成（Gemini Imagen）

### セットアップ（初回のみ）

1. https://aistudio.google.com/apikey で Gemini API キーを取得（無料枠あり）
2. プロジェクト直下に `.env` ファイルを作成：
   ```
   GEMINI_API_KEY=AIza...（取得したキー）
   ```
3. `.env` は `.gitignore` 済み（コミットされない）

### 単体テスト

```bash
# 単独で画像を生成（記事ファイルがなくても動く）
node scripts/generate-article-image.mjs bukken-erabi kaigyo "物件選びガイド"

# → public/images/bukken-erabi.jpg が生成される
```

### 自動実行

`pipeline/generate.sh` 実行時、`GEMINI_API_KEY` が設定されていれば、
記事＋X投稿草稿の生成と同時にヒーロー画像も生成・コミットされる。

### カテゴリ別プロンプト

`scripts/generate-article-image.mjs` 内の `CATEGORY_PROMPTS` に
カテゴリごとの画像方針が定義されている。**全画像「日本人・リアル写真風・モデル体型を避ける」**
を共通方針とし、カテゴリで構図を変える。

| カテゴリ | 画像の傾向 |
|---|---|
| kaigyo | ジム内観（人なし） |
| hiyou | デスク・書類・電卓 |
| kigu | 器具のクローズアップ |
| shukaku | スマホ・PC操作（日本人女性30〜40代） |
| ai-keiei | AIチャット画面付きラップトップ |
| fukugyou | オフィスとジムの切替シーン |
| gyomu | 受付・予約管理デスク |
| horitsu | 契約書・万年筆 |

プロンプトを変えたい場合は `scripts/generate-article-image.mjs` を編集。
