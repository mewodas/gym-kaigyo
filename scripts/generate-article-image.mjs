#!/usr/bin/env node
/**
 * 記事用のヒーロー画像を Gemini Imagen で生成するスクリプト
 *
 * 使い方:
 *   GEMINI_API_KEY=xxx node scripts/generate-article-image.mjs <slug> <category> [title]
 *
 * 出力先: public/images/{slug}.jpg
 *
 * 環境変数:
 *   GEMINI_API_KEY  必須。https://aistudio.google.com/apikey で取得
 *   GEMINI_MODEL    任意。デフォルト: imagen-3.0-generate-002
 */

import fs from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL ?? "imagen-3.0-generate-002";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY が設定されていません");
  console.error("   .env または環境変数で設定してください。");
  process.exit(1);
}

const [, , slug, category, title = ""] = process.argv;

if (!slug || !category) {
  console.error("Usage: node generate-article-image.mjs <slug> <category> [title]");
  process.exit(1);
}

/**
 * カテゴリ別の画像プロンプト
 * 共通方針: 日本人・リアル写真風・モデル体型を避ける（メモリ準拠）
 */
const CATEGORY_PROMPTS = {
  kaigyo: "Realistic photograph of a small modern Japanese personal training gym interior in Tokyo. Well-lit, professional yet warm atmosphere. No people visible. Power rack, dumbbells, mirror. Wide shot. Soft natural lighting through windows. Documentary photo style. NOT illustration.",
  hiyou: "Realistic photograph of a Japanese gym owner's desk with a notebook computer, financial documents, calculator, coffee cup. Indoor, soft warm lighting. Top-down or side angle. Documentary photo style. NOT illustration.",
  kigu: "Realistic photograph close-up of professional gym equipment - dumbbells lined up on a rack, barbell with weight plates, in a Japanese personal gym. Industrial yet clean atmosphere. No people. Documentary photo style. NOT illustration.",
  shukaku: "Realistic photograph of a Japanese woman in her 30s-40s working at a smartphone and laptop in a personal gym, planning marketing. Natural body type, NOT model-thin, NOT foreign-looking. Wearing simple gym attire. Soft natural lighting. Documentary photo style. NOT illustration.",
  "ai-keiei": "Realistic photograph of a Japanese personal trainer (man or woman in their 30s) using a laptop with AI chat interface visible on screen, sitting at a desk in a modern gym. Documentary style photo. Soft natural lighting. NOT illustration.",
  fukugyou: "Realistic photograph of a Japanese person in their 30s in business casual clothing transitioning to gym clothes, scene split between office and gym. Side-business concept. Natural body type, NOT model-thin. Documentary photo style. NOT illustration.",
  gyomu: "Realistic photograph of an organized Japanese personal gym reception desk with appointment book, tablet, business card holder. Clean modern interior. No people. Documentary photo style. NOT illustration.",
  horitsu: "Realistic photograph of a desk with Japanese legal/business documents, contracts, a fountain pen, and a calculator in soft warm lighting. Indoor scene. No people. Documentary photo style. NOT illustration.",
};

const basePrompt = CATEGORY_PROMPTS[category] ?? CATEGORY_PROMPTS["kaigyo"];

const prompt = `${basePrompt}

Style: Photo-realistic, documentary, magazine quality. Warm soft natural lighting.
Aspect ratio: 16:9 wide format suitable for blog hero image.
Avoid: cartoon, anime, illustration, 3D render, foreign people, model-thin physique, exaggerated muscles, AI-generated looking faces.
Article context: Japanese personal training gym business blog. Topic: ${title || category}.`;

console.log(`🎨 画像生成中: ${slug} (${category})`);
console.log(`📝 プロンプト: ${prompt.slice(0, 120)}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "16:9",
      personGeneration: "allow_adult",
    },
  }),
});

if (!res.ok) {
  const errText = await res.text();
  console.error(`❌ API エラー (${res.status}): ${errText}`);
  process.exit(1);
}

const data = await res.json();
const b64 = data?.predictions?.[0]?.bytesBase64Encoded;

if (!b64) {
  console.error("❌ 画像データが返ってきませんでした:");
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}

const outputPath = path.join("public", "images", `${slug}.jpg`);
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, Buffer.from(b64, "base64"));

console.log(`✅ 画像生成完了: ${outputPath}`);
