#!/usr/bin/env node
/**
 * Threads 向け 3:4 縦型クリエイティブを Gemini Imagen 4 で生成
 *
 * ブランドコンセプト: 副業 × ジム × AI × Build in Public
 * スタイル: ハイブランド広告 / アバンギャルド・スポーツファッション
 */

import fs from "node:fs/promises";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "imagen-4.0-generate-001";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY が設定されていません");
  process.exit(1);
}

const COMMON_TAIL = `Japanese model with natural athletic build (NOT extremely thin runway model, NOT foreign-looking). Real photograph, magazine editorial style. Apple-store premium quality. Cinematic lighting with hint of orange (#FF6200) accent in the palette. Glossy mirrored polished floor reflecting subject. Ultra-pure minimal composition. Massive negative space. Luxurious avant-garde sports fashion advertising aesthetic. 3:4 vertical composition optimized for Threads/Instagram portrait. NO illustration, NO 3D render, NO cartoon, NO garbled or distorted text — typography must be perfectly clean Latin letters.`;

const CREATIVES = [
  {
    name: "build-dumbbell",
    prompt: `Avant-garde sports fashion advertising. A monumental colossal black metal dumbbell at the center, photorealistic, oversized like a museum sculpture, weight plates the size of car wheels. A Japanese athletic man in his 30s in minimalist all-black athletic streetwear (oversized hoodie, tapered pants), leaning casually against the curved surface of the dumbbell handle as if it were modern furniture. The huge word "BUILD" in bold sans-serif typography behind in dimensional 3D matte black letterforms, oversized to fill the upper third. Burnt warm beige studio backdrop. ${COMMON_TAIL}`,
  },
  {
    name: "shift-aichip",
    prompt: `Avant-garde futuristic fashion advertising. A monumental colossal AI processor microchip sculpture at the center, photorealistic, oversized like contemporary art, with glowing thin orange circuit lines. A Japanese athletic woman in her 30s with shoulder-length hair, sitting cross-legged on top of the chip in minimalist cream-colored athletic loungewear, contemplative editorial pose looking off-camera. The huge word "SHIFT" in bold typography behind in clean dimensional letterforms, glowing soft orange. Deep navy studio backdrop with subtle orange light gradient from below. ${COMMON_TAIL}`,
  },
  {
    name: "next-kettlebell",
    prompt: `Avant-garde sports fashion advertising. A monumental colossal matte black kettlebell as a sculpture at center, photorealistic and oversized to room scale. A Japanese athletic man in his 30s in minimalist all-black workout attire (compression shirt, joggers), sitting on top of the kettlebell handle in a confident editorial pose, one leg drawn up. The huge word "NEXT" in bold sans-serif typography behind in dimensional letterforms, the size of a wall. Warm cream-orange studio backdrop with soft cinematic side-light. ${COMMON_TAIL}`,
  },
  {
    name: "grow-phone",
    prompt: `Avant-garde tech-lifestyle fashion advertising. A monumental colossal smartphone standing vertically like a sculpture at center, screen showing a minimal AI chat interface in dark mode, oversized to room scale. A Japanese athletic woman in her 30s in minimalist white athletic wear (loose tee, tapered pants), leaning her shoulder against the side of the giant phone in a casual editorial pose. The huge word "GROW" in bold sans-serif typography behind in dimensional letterforms, oversized. Soft cream studio backdrop with subtle orange (#FF6200) glow accent in the corner. ${COMMON_TAIL}`,
  },
];

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

async function gen(creative) {
  console.log(`🎨 生成中: ${creative.name}`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt: creative.prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "3:4",
        personGeneration: "allow_adult",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ ${creative.name}: ${res.status}\n${errText}`);
    return;
  }

  const data = await res.json();
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) {
    console.error(`❌ ${creative.name}: no image`);
    return;
  }

  const path = `public/threads-${creative.name}.jpg`;
  await fs.writeFile(path, Buffer.from(b64, "base64"));
  console.log(`✅ ${path}`);
}

await fs.mkdir("public", { recursive: true });

// 4つ並列で実行
await Promise.allSettled(CREATIVES.map(gen));

console.log("\n📌 Threads クリエイティブ生成完了");
console.log("   public/threads-*.jpg を確認してください");
