#!/bin/bash
# 次の1記事 + X投稿草稿 + ヒーロー画像を一括生成するスクリプト

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# .env を読み込み（Gemini API キー）
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# pending 件数を確認
PENDING=$(jq '[.queue[] | select(.status == "pending")] | length' pipeline/topics.json)

if [ "$PENDING" -eq 0 ]; then
  echo "✅ pending な記事がありません。トピックを追加してください。"
  exit 0
fi

echo "📝 残り pending: ${PENDING}件"

# 次のpending記事のメタ情報を取得
NEXT_SLUG=$(jq -r '[.queue[] | select(.status == "pending")][0].slug' pipeline/topics.json)
NEXT_CATEGORY=$(jq -r '[.queue[] | select(.status == "pending")][0].category' pipeline/topics.json)
NEXT_TITLE=$(jq -r '[.queue[] | select(.status == "pending")][0].title' pipeline/topics.json)

echo "🎯 次の記事: $NEXT_SLUG ($NEXT_CATEGORY)"
echo "🤖 Claude Code に記事＋X投稿草稿の生成を依頼します..."

# Claude Code に記事 ＋ X投稿草稿の生成を一括で実行させる
claude -p "
pipeline/PROMPT.md と pipeline/x-prompt.md を読み、以下を順番に実行してください。

1. pipeline/topics.json から status='pending' の最初の記事を1件取り出す
2. その記事を content/{category}/{slug}.mdx に保存（2,500文字以上）
3. 同じ記事内容から pipeline/x-prompt.md のマスタープロンプトに従って
   X投稿草稿（スレッド + 単発3本 + 告知1本）を生成し
   pipeline/x-posts/{slug}.md に保存
4. topics.json の該当項目の status を 'published' に更新
5. （Bashの呼び出しは不要・人間側がgenerate.shで処理）
"

# Gemini で記事のヒーロー画像を生成
if [ -n "$GEMINI_API_KEY" ]; then
  echo "🎨 Gemini でヒーロー画像を生成..."
  node scripts/generate-article-image.mjs "$NEXT_SLUG" "$NEXT_CATEGORY" "$NEXT_TITLE" || \
    echo "⚠️ 画像生成に失敗しましたが、処理は続行します"
else
  echo "⚠️ GEMINI_API_KEY 未設定のため画像生成をスキップ"
fi

# git commit & push
git add -A
git commit -m "feat(content): add ${NEXT_SLUG} (+X drafts +image)" || \
  echo "⚠️ commit するものがありません"
git push || echo "⚠️ push できませんでした"

echo "✅ 全処理が完了しました"
echo "📱 X予約投稿: pipeline/x-posts/${NEXT_SLUG}.md を確認"
echo "🖼  ヒーロー画像: public/images/${NEXT_SLUG}.jpg"
