#!/usr/bin/env node
/**
 * X用のブランドセット（ヘッダー＋アバター）を生成
 *  - ヘッダー (1500x500)
 *  - アバター (400x400)
 * 同じ世界観：navy + orange、ご本人、AIチップ×ケトルベル、ジム開業ラボ
 */

import fs from "node:fs/promises";
import sharp from "sharp";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-image";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY が設定されていません");
  process.exit(1);
}

const refPath = process.argv[2] ?? "/mnt/c/Users/mwdsb/OneDrive/Desktop/meodas_hp/代表挨拶.jpg";
const refData = await fs.readFile(refPath);
const refBase64 = refData.toString("base64");
const mimeType = refPath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";

console.log(`📸 参照画像: ${refPath}\n`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function genImage(name, prompt) {
  console.log(`🎨 生成中: ${name}`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: refBase64 } },
        ],
      }],
    }),
  });

  if (!res.ok) {
    console.error(`❌ ${name}: ${res.status}\n${await res.text()}`);
    return null;
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const b64 = part.inline_data?.data ?? part.inlineData?.data;
    if (b64) {
      const path = `public/x-${name}-raw.jpg`;
      await fs.writeFile(path, Buffer.from(b64, "base64"));
      console.log(`  ✅ raw: ${path}`);
      return path;
    }
  }
  console.error(`❌ ${name}: 画像が含まれていない`);
  return null;
}

// === HEADER (1500x500, 3:1) ===
const headerPrompt = `Generate a wide horizontal banner image suitable for X (Twitter) profile header.

CRITICAL: Use the EXACT SAME man from the reference photo — preserve his face, hairstyle, age, build, ethnicity. Japanese man in his late 30s with short black hair, slight goatee, athletic but natural build (not extremely thin). Keep his face features identical.

VERY WIDE horizontal panoramic composition (3:1 aspect ratio, much wider than tall, cinematic banner format). Image should look like a movie banner or website header — extremely wide and short.

Composition layout (left to right):
- LEFT TWO-THIRDS: deep navy blue (#0f172a) backdrop with subtle warm orange (#FF6200) light gradient. EMPTY clean space for text overlay (DO NOT put any text here, leave it blank).
- RIGHT THIRD: a colossal monumental sculpture FUSING a kettlebell with an AI processor chip — round body of giant kettlebell covered in glowing orange AI circuit patterns and microchip details, handle is matte black metal. The same man from the reference photo is sitting confidently on top of the kettlebell-chip sculpture in minimalist all-black athletic wear (compression tee + joggers + black sneakers), looking at camera with calm confident editorial expression.

Glossy mirrored polished floor at the bottom, reflecting the sculpture and the man.

Style: Apple-store premium, magazine editorial, high-end luxury sports advertising. Cinematic side-lighting. Real photograph (NOT illustration, NOT 3D render). Avant-garde, futuristic. AI circuit lines glow softly in orange.

CRITICAL: NO TEXT, NO LETTERS, NO WORDS, NO BRAND NAMES, NO LOGOS in the image. Pure visual only — text will be added separately. Keep the left side completely empty.

REPEAT: very wide cinematic banner format, 3:1 aspect ratio, like a website header. Do not generate a square or portrait image.`;

// === AVATAR (400x400, 1:1) ===
const avatarPrompt = `Generate a square portrait image suitable for X (Twitter) profile avatar.

CRITICAL: Use the EXACT SAME man from the reference photo — preserve his face, hairstyle, age, build, ethnicity. Japanese man in his late 30s with short black hair, slight goatee. Keep his face features identical.

SQUARE 1:1 composition. Editorial close-up portrait, head and shoulders only.

Subject: The same man from the reference photo, wearing a minimalist black athletic shirt, looking directly at camera with calm confident expression. Slight smile or neutral powerful look. Magazine cover quality close-up.

Background: deep navy blue (#0f172a) with subtle warm orange (#FF6200) rim light/edge glow on one side adding cinematic depth.

Lighting: cinematic side-lighting from one side, with orange accent rim light highlighting his profile. Premium editorial portrait photography style.

Style: Apple-store premium quality, real photograph (NOT illustration, NOT 3D render, NOT cartoon). High-end magazine portrait aesthetic.

NO TEXT, NO LOGOS in the image.

REPEAT: square 1:1 aspect ratio, vertical portrait orientation similar to a profile avatar.`;

await fs.mkdir("public", { recursive: true });

const headerRaw = await genImage("header", headerPrompt);
const avatarRaw = await genImage("avatar", avatarPrompt);

// === Post-process: Header to 1500x500 with text overlay ===
if (headerRaw) {
  console.log("\n📐 ヘッダーを 1500x500 に変換 + テキスト合成...");

  const W = 1500, H = 500;
  const meta = await sharp(headerRaw).metadata();
  console.log(`  raw size: ${meta.width}x${meta.height}`);

  // Resize raw image to fit 3:1 ratio. If raw is wider than 3:1, crop sides; if taller, crop top/bottom.
  // We use cover-fit to 1500x500.
  const baseImage = sharp(headerRaw)
    .resize(W, H, { fit: "cover", position: "center" });

  // SVG overlay with brand text on left
  const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .brand {
        font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
        font-weight: 900;
        fill: #ffffff;
        letter-spacing: -1.5px;
      }
      .accent { fill: #FF6200; }
      .heading {
        font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
        font-weight: 800;
        fill: #ffffff;
      }
      .url {
        font-family: 'Helvetica', sans-serif;
        font-weight: 600;
        fill: rgba(255, 255, 255, 0.7);
        letter-spacing: 1px;
      }
    </style>
  </defs>

  <!-- 細い装飾線（上） -->
  <line x1="60" y1="120" x2="180" y2="120" stroke="#FF6200" stroke-width="3" />

  <!-- ブランド名 -->
  <text class="brand" x="60" y="200" font-size="56">ジム開業ラボ</text>

  <!-- タグライン -->
  <text class="heading" x="60" y="260" font-size="22">副業から始める、ジム経営のリアル。</text>
  <text class="heading" x="60" y="295" font-size="18" style="font-weight:500; fill:rgba(255,255,255,0.75);">副業 × AI × 2業態オーナーが実数字で公開</text>

  <!-- URL -->
  <text class="url" x="60" y="440" font-size="20">gym-kaigyo.jp</text>
</svg>
`;

  await baseImage
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile("public/x-header-brand.jpg");

  console.log("  ✅ public/x-header-brand.jpg (1500x500)");
}

// === Post-process: Avatar to 400x400 ===
if (avatarRaw) {
  console.log("\n📐 アバターを 400x400 に変換...");
  const meta = await sharp(avatarRaw).metadata();
  console.log(`  raw size: ${meta.width}x${meta.height}`);

  await sharp(avatarRaw)
    .resize(400, 400, { fit: "cover", position: "center" })
    .jpeg({ quality: 92 })
    .toFile("public/x-avatar-brand.jpg");

  console.log("  ✅ public/x-avatar-brand.jpg (400x400)");
}

console.log("\n📌 完了");
console.log("   ヘッダー: public/x-header-brand.jpg");
console.log("   アバター: public/x-avatar-brand.jpg");
