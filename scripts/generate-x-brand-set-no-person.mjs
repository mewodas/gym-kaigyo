#!/usr/bin/env node
/**
 * X用のブランドセット（ヘッダー＋アバター）を「人物なし」で生成
 * オブジェクトのみ：AIチップ × ケトルベル × ダンベル のジム彫刻
 */

import fs from "node:fs/promises";
import sharp from "sharp";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "imagen-4.0-generate-001";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY が設定されていません");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

async function genImage(name, prompt, aspectRatio) {
  console.log(`🎨 生成中: ${name} (${aspectRatio})`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio,
        personGeneration: "dont_allow",
      },
    }),
  });

  if (!res.ok) {
    console.error(`❌ ${name}: ${res.status}\n${await res.text()}`);
    return null;
  }

  const data = await res.json();
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) {
    console.error(`❌ ${name}: no image`);
    return null;
  }

  const path = `public/x-${name}-raw.jpg`;
  await fs.writeFile(path, Buffer.from(b64, "base64"));
  console.log(`  ✅ raw: ${path}`);
  return path;
}

// === HEADER (16:9 → crop to 3:1) ===
const headerPrompt = `Avant-garde sports fashion editorial advertising photograph. Wide cinematic banner composition. CENTER-RIGHT: a colossal monumental sculpture FUSING a kettlebell with an AI processor chip — round body of giant kettlebell covered in glowing orange (#FF6200) AI circuit patterns and microchip details, handle is matte black metal, oversized to room scale like a museum sculpture. Beside the kettlebell-chip, additional gym objects float at slightly smaller scale: a single matte black dumbbell, a circular weight plate with subtle circuit details. Studio backdrop is deep navy blue (#0f172a) with subtle warm orange light gradient from below. Glossy mirrored polished floor reflecting the sculpture. The LEFT TWO-THIRDS is empty navy space (for text overlay). Cinematic side-lighting. Apple-store premium quality, magazine cover, ultra-clean composition, lots of negative space. Real photograph (NOT illustration, NOT 3D render). Avant-garde, futuristic, high-end luxury sports advertising aesthetic. NO PEOPLE in the image. NO TEXT, NO LETTERS, NO LOGOS.`;

// === AVATAR (1:1) ===
const avatarPrompt = `Avant-garde editorial product photograph. Square 1:1 composition. Centered: a colossal monumental sculpture FUSING a kettlebell with an AI processor chip — the round body of the kettlebell is covered in glowing orange (#FF6200) AI circuit patterns and microchip details, handle is matte black metal. The sculpture is the only subject, oversized hero shot. Studio backdrop is deep navy blue (#0f172a) with subtle warm orange light glow behind the sculpture. Glossy mirrored polished floor reflecting the sculpture. Cinematic dramatic side-lighting. Apple-store premium product photography quality, magazine cover, ultra-clean minimal composition. Real photograph (NOT illustration, NOT 3D render). Avant-garde futuristic high-end luxury aesthetic. The kettlebell-chip sculpture should fill the center of the square frame as a hero icon. NO PEOPLE in the image. NO TEXT, NO LETTERS, NO LOGOS.`;

await fs.mkdir("public", { recursive: true });

const headerRaw = await genImage("header-noperson", headerPrompt, "16:9");
const avatarRaw = await genImage("avatar-noperson", avatarPrompt, "1:1");

// === Post-process: Header to 1500x500 with text overlay ===
if (headerRaw) {
  console.log("\n📐 ヘッダーを 1500x500 に変換 + テキスト合成...");

  const W = 1500, H = 500;

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
  <line x1="60" y1="120" x2="180" y2="120" stroke="#FF6200" stroke-width="3" />
  <text class="brand" x="60" y="200" font-size="56">ジム開業ラボ</text>
  <text class="heading" x="60" y="260" font-size="22">副業から始める、ジム経営のリアル。</text>
  <text class="heading" x="60" y="295" font-size="18" style="font-weight:500; fill:rgba(255,255,255,0.75);">副業 × AI × 2業態オーナーが実数字で公開</text>
  <text class="url" x="60" y="440" font-size="20">gym-kaigyo.jp</text>
</svg>
`;

  await sharp(headerRaw)
    .resize(W, H, { fit: "cover", position: "center" })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile("public/x-header-brand-noperson.jpg");

  console.log("  ✅ public/x-header-brand-noperson.jpg (1500x500)");
}

// === Post-process: Avatar to 400x400 ===
if (avatarRaw) {
  console.log("\n📐 アバターを 400x400 に変換...");
  await sharp(avatarRaw)
    .resize(400, 400, { fit: "cover", position: "center" })
    .jpeg({ quality: 92 })
    .toFile("public/x-avatar-brand-noperson.jpg");

  console.log("  ✅ public/x-avatar-brand-noperson.jpg (400x400)");
}

console.log("\n📌 完了");
