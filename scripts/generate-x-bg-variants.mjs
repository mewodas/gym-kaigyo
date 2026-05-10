#!/usr/bin/env node
/**
 * X ヘッダー背景のバリエーションを一気に生成
 *
 * 出力: public/x-bg-{name}.jpg
 */

import fs from "node:fs/promises";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "imagen-4.0-generate-001";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY が設定されていません");
  process.exit(1);
}

const VARIANTS = [
  {
    name: "minimal-single",
    prompt: "Wide horizontal banner image, 16:9 aspect ratio. Two-tone split design: left half solid darker orange flat color (#FF6200), right half slightly lighter orange (#FF8C42) with ONE single elegant thin-line minimalist dumbbell illustration in white at center, drawn as clean hairline strokes at low opacity. Editorial premium minimalist design. No clutter, lots of negative space. Apple-store quality aesthetic. Absolutely NO TEXT, no letters, no logos, no symbols, no characters.",
  },
  {
    name: "weight-plates",
    prompt: "Wide horizontal banner image, 16:9 aspect ratio. Split design: left half solid darker orange flat color, right half lighter orange with circular weight plates silhouettes (stacked discs / iron plates) in slightly darker tone, low opacity, geometric flat design. Modern editorial gym branding. Clean minimalist. Absolutely NO TEXT, no letters, no logos.",
  },
  {
    name: "geometric-abstract",
    prompt: "Wide horizontal banner image, 16:9 aspect ratio. Two-tone orange split: left half solid darker orange flat, right half lighter orange with subtle abstract geometric pattern of thin circles, lines, and small dots arranged in editorial composition, conveying motion and rhythm. Modern minimalist abstract design. No gym equipment. Apple-store premium aesthetic. Absolutely NO TEXT, no letters.",
  },
  {
    name: "diagonal-streaks",
    prompt: "Wide horizontal banner image, 16:9 aspect ratio. Pure orange background gradient from darker orange on left (#FF6200) to lighter on right (#FF8C42). Diagonal speed-lines / streaks running across the right two-thirds in slightly varied orange tones, conveying energy and motion. Modern dynamic minimalist editorial design. Absolutely NO TEXT, no letters, no objects, no logos.",
  },
  {
    name: "photo-split",
    prompt: "Wide horizontal banner image, 16:9 aspect ratio. Split design: left half is solid flat orange color (#FF6200) clean empty space. Right half is realistic photograph of a modern small Japanese personal training gym interior with warm afternoon light through windows, dumbbells on a wall rack, mirror, wood floor. NO people visible. Editorial magazine quality. Sharp visual divide between left orange and right photo. Absolutely NO TEXT, no letters.",
  },
  {
    name: "wave-curves",
    prompt: "Wide horizontal banner image, 16:9 aspect ratio. Smooth orange gradient background from darker (#FF6200) on left to lighter (#FF8C42) on right. Elegant flowing wave curves / abstract liquid shapes on the right side in slightly varied orange tones, low opacity, creating depth without busyness. Modern editorial design, premium aesthetic. Absolutely NO TEXT, no letters, no objects.",
  },
];

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

async function gen(variant) {
  console.log(`🎨 生成中: ${variant.name}`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt: variant.prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "16:9",
        personGeneration: "dont_allow",
      },
    }),
  });

  if (!res.ok) {
    console.error(`❌ ${variant.name}: ${res.status}`);
    return;
  }

  const data = await res.json();
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) {
    console.error(`❌ ${variant.name}: no image`);
    return;
  }

  const path = `public/x-bg-${variant.name}.jpg`;
  await fs.writeFile(path, Buffer.from(b64, "base64"));
  console.log(`✅ ${path}`);
}

await fs.mkdir("public", { recursive: true });

// 並列で6つ実行
await Promise.allSettled(VARIANTS.map(gen));

console.log("\n📌 全パターン生成完了");
console.log("   public/x-bg-*.jpg を確認してください");
