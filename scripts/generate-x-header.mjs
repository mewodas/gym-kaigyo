#!/usr/bin/env node
/**
 * X(旧Twitter)プロフィールヘッダー画像を Gemini Imagen で生成するスクリプト
 *
 * 使い方:
 *   GEMINI_API_KEY=xxx node scripts/generate-x-header.mjs
 *
 * オプション:
 *   --no-text     文字なしクリーン背景（テキストは別ツールで重ねる）
 *   --variant N   バリエーション生成（4枚まで、Nは1〜4）
 *   --style XX    スタイル指定: orange / dark / split / photo
 *
 * 出力: public/x-header-{n}.jpg（複数枚生成時）または public/x-header.jpg
 *
 * 注意:
 *   - X ヘッダー推奨サイズは 1500×500（3:1）
 *   - Imagen は 16:9 が最近接 → 生成後に上下クロップが必要
 *   - 文字込みの場合、Imagen は日本語が崩れることがある
 *     → うまく出ない時は --no-text で生成して別ツールで重ねる
 */

import fs from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL ?? "imagen-4.0-generate-001";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY が設定されていません（.env を確認）");
  process.exit(1);
}

const args = process.argv.slice(2);
const noText = args.includes("--no-text");
const styleIdx = args.indexOf("--style");
const style = styleIdx >= 0 ? args[styleIdx + 1] : "orange";
const variantIdx = args.indexOf("--variant");
const variantCount = variantIdx >= 0 ? parseInt(args[variantIdx + 1], 10) : 1;

if (variantCount < 1 || variantCount > 4 || isNaN(variantCount)) {
  console.error("❌ --variant は 1〜4 の数字を指定してください");
  process.exit(1);
}

// --- スタイル別ベースプロンプト ---
const STYLE_BASES = {
  orange: `Wide horizontal banner image, 16:9 aspect ratio (will be cropped to 3:1 for X profile header).
Background: vibrant orange gradient (#FF6200 to #FF8C42), Japanese personal training gym aesthetic.
Left third: empty space for text overlay (clean orange).
Right two-thirds: subtle abstract gym equipment graphics — dumbbell silhouettes, weight plates, in lighter orange tones at low opacity.
Style: modern, professional, slightly minimalistic, branding-friendly.
Mood: energetic but trustworthy.`,

  dark: `Wide horizontal banner image, 16:9 aspect ratio.
Background: dark navy/black (#0f172a) with subtle orange (#FF6200) glow effects in corners.
Realistic photograph of a Japanese personal training gym at golden hour, slightly out of focus on the right side.
Left side: dark space with orange accent for text overlay.
Style: cinematic, premium, professional.
Mood: confident, established.`,

  split: `Wide horizontal banner image, 16:9 aspect ratio, split design.
Left half: clean orange (#FF6200) solid color, empty for text overlay.
Right half: realistic photograph of a modern small Japanese personal training gym interior — dumbbells on rack, mirror, warm lighting, no people visible.
Sharp visual division between the two halves.
Style: editorial, magazine-cover quality, professional Japanese minimalism.
Mood: clean and trustworthy.`,

  photo: `Wide horizontal banner image, 16:9 aspect ratio.
Realistic photograph of a clean modern Japanese personal training gym interior. Wide angle.
Soft golden-hour natural lighting through windows. Warm orange tones throughout.
Power rack, dumbbells on wall rack, large mirror visible.
Empty space on the left side for text overlay (slightly out of focus).
NO people visible.
Documentary photo style. Magazine quality.
Mood: welcoming, professional, aspirational.`,
};

const baseStyle = STYLE_BASES[style] ?? STYLE_BASES.orange;

// --- テキスト要素 ---
const textPrompt = noText
  ? `\nIMPORTANT: NO text, NO letters, NO words, NO logos in the image. Pure background only.`
  : `\nText overlay (large, bold, clean modern Japanese gothic font, white color):
- Main heading (large, top-left): "副業から始める ジム経営のリアル"
- Subheading (smaller, below): "副業 × AI × 2業態のオーナーが実数字で公開"
- URL (small, bottom-right corner): "gym-kaigyo.jp"

CRITICAL: Render Japanese text clearly and accurately. Each character must be legible. No garbled or distorted characters.`;

const fullPrompt = `${baseStyle}${textPrompt}

Avoid: cartoon, anime, illustration, 3D render, foreign people, garbled text, distorted characters.`;

console.log(`🎨 X ヘッダーを生成中（style: ${style}, variant: ${variantCount}枚, ${noText ? "文字なし" : "文字あり"}）`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    instances: [{ prompt: fullPrompt }],
    parameters: {
      sampleCount: variantCount,
      aspectRatio: "16:9",
      personGeneration: "dont_allow",
    },
  }),
});

if (!res.ok) {
  const errText = await res.text();
  console.error(`❌ API エラー (${res.status}):\n${errText}`);
  process.exit(1);
}

const data = await res.json();
const predictions = data?.predictions ?? [];

if (predictions.length === 0) {
  console.error("❌ 画像が返ってきませんでした:");
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}

await fs.mkdir("public", { recursive: true });

for (let i = 0; i < predictions.length; i++) {
  const b64 = predictions[i]?.bytesBase64Encoded;
  if (!b64) continue;

  const filename = variantCount === 1
    ? "x-header.jpg"
    : `x-header-${i + 1}.jpg`;
  const outputPath = path.join("public", filename);
  await fs.writeFile(outputPath, Buffer.from(b64, "base64"));
  console.log(`✅ 保存: ${outputPath}`);
}

console.log("");
console.log("📌 次のステップ:");
console.log("   1. 画像を確認（public/x-header*.jpg）");
console.log("   2. X ヘッダーは 1500×500 (3:1) なので、上下を少しクロップして使用");
console.log("   3. 気に入らない場合は --style や --variant を変えて再実行");
console.log("");
console.log("📐 別スタイル試したい場合:");
console.log("   node scripts/generate-x-header.mjs --style dark --variant 3");
console.log("   node scripts/generate-x-header.mjs --style split");
console.log("   node scripts/generate-x-header.mjs --style photo --no-text");
