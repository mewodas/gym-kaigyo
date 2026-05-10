#!/usr/bin/env node
/**
 * Threads クリエイティブを参照人物の顔で生成（gemini-2.5-flash-image）
 *
 * 使い方:
 *   GEMINI_API_KEY=xxx node scripts/generate-threads-with-face.mjs <reference-image-path>
 */

import fs from "node:fs/promises";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-image";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY が設定されていません");
  process.exit(1);
}

const refPath = process.argv[2] ?? "/mnt/c/Users/mwdsb/OneDrive/Desktop/meodas_hp/代表挨拶.jpg";

console.log(`📸 参照画像を読み込み: ${refPath}`);
const refData = await fs.readFile(refPath);
const refBase64 = refData.toString("base64");
const mimeType = refPath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";

const PROMPTS = [
  {
    name: "kettlebell-aichip-shift",
    prompt: `Generate a TALL VERTICAL portrait image with 3:4 aspect ratio (width:height = 3:4, taller than wide). This is for Threads/Instagram portrait posts. The image MUST be taller than it is wide. Vertical composition only.

CRITICAL: Use the EXACT SAME man from the reference photo — preserve his face, hairstyle, age, build, ethnicity. He is a Japanese man in his late 30s with short black hair, slight goatee, athletic but natural build. Keep his face features identical to the reference.

VERTICAL composition layout (top to bottom):
- TOP THIRD: huge bold sans-serif word "SHIFT" in dimensional matte cream letterforms, filling the upper portion against navy backdrop
- MIDDLE: a colossal monumental sculpture FUSING a kettlebell with an AI processor chip — round body of kettlebell covered in glowing orange AI circuit patterns and microchip details, handle is matte black metal, oversized to room scale
- ON the sculpture: the same man from the reference, in minimalist all-black athletic clothing (compression tee, joggers), sitting confidently on the round body of the kettlebell with one leg up, looking at camera with calm confident editorial expression
- BOTTOM: glossy mirrored polished floor reflecting subject and sculpture

Studio backdrop: deep navy blue (#0f172a) with subtle warm orange (#FF6200) light gradient from below.

Style: Apple-store premium, magazine cover, ultra-clean minimal composition, massive negative space, cinematic side-lighting, real photograph (NOT illustration, NOT 3D render). High-end luxury sports editorial, avant-garde, futuristic. AI circuit lines glow softly orange.

REPEAT: aspect ratio is 3:4 VERTICAL portrait, height greater than width. Tall image. Threads-optimized format.`,
  },
];

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function gen(p) {
  console.log(`🎨 生成中: ${p.name}`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: p.prompt },
          { inline_data: { mime_type: mimeType, data: refBase64 } },
        ],
      }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ ${p.name}: ${res.status}\n${errText}`);
    return;
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];

  let saved = false;
  for (const part of parts) {
    if (part.inline_data?.data || part.inlineData?.data) {
      const b64 = part.inline_data?.data ?? part.inlineData?.data;
      const path = `public/threads-${p.name}.jpg`;
      await fs.writeFile(path, Buffer.from(b64, "base64"));
      console.log(`✅ ${path}`);
      saved = true;
    }
    if (part.text) {
      console.log(`   text: ${part.text.slice(0, 200)}`);
    }
  }

  if (!saved) {
    console.error(`❌ ${p.name}: 画像が含まれていない`);
    console.error(JSON.stringify(data, null, 2).slice(0, 500));
  }
}

await fs.mkdir("public", { recursive: true });

for (const p of PROMPTS) {
  await gen(p);
}

console.log("\n📌 完了");
