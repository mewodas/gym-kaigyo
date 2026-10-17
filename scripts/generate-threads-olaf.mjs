#!/usr/bin/env node
/**
 * Threads クリエイティブ「OLAF」シリーズを4パターン生成
 * OLAFマスコット ＋ 巨大モチーフ ＋ "OLAF" タイポグラフィ
 */

import fs from "node:fs/promises";
import sharp from "sharp";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-image";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY が設定されていません");
  process.exit(1);
}

const refPath = process.argv[2] ?? "/mnt/c/Users/mwdsb/Downloads/S__91709463.jpg";
const refData = await fs.readFile(refPath);
const refBase64 = refData.toString("base64");
const mimeType = refPath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";

const COMMON_HEAD = `Generate a TALL VERTICAL portrait image with 3:4 aspect ratio (taller than wide), Threads/Instagram portrait format.

CRITICAL: Use the EXACT SAME plush mascot character from the reference photo as the subject. It is a fluffy white plush dog/character wearing a bright blue beret on its head, large black earmuffs/headphones over its ears, with simple cute black cartoon eyes, small black nose, slight pink tongue sticking out, soft round body, short stubby arms and legs. Preserve ALL these distinctive features exactly. The plush is approximately 30cm tall in real life but in this scene it appears at the size described per composition.

CRITICAL: The bold sans-serif typography "OLAF" must appear cleanly and accurately rendered behind/around the central object — letters perfectly legible in capital letters, NOT distorted, NOT garbled, NO extra characters.`;

const COMMON_TAIL = `Editorial high-fashion mascot collaboration aesthetic (think Moschino, KAWS, Maison Kitsuné style — luxury brand featuring a cute plush mascot). Glossy mirrored polished floor reflecting subject and sculpture. Apple-store premium quality, magazine cover, ultra-clean composition, massive negative space, cinematic side-lighting. Real product photograph (NOT illustration, NOT 3D render, NOT cartoon). Avant-garde luxury editorial advertising aesthetic. Warm orange (#FF6200) accent in the lighting palette. The plush feels like a real plush toy in a high-end studio setting. 3:4 vertical aspect ratio.`;

const CREATIVES = [
  {
    name: "olaf-kettlebell",
    prompt: `${COMMON_HEAD}

Composition (top to bottom):
- TOP THIRD: huge bold sans-serif word "OLAF" in dimensional matte cream-colored letterforms, oversized to fill the upper portion against deep navy backdrop
- MIDDLE: a colossal monumental matte black kettlebell sculpture, oversized to giant scale
- ON the kettlebell: the OLAF plush mascot from the reference photo (fluffy white with blue beret and black earmuffs) sitting confidently on top of the round body of the kettlebell, posed like a high-fashion model
- Studio backdrop: deep navy blue (#0f172a) with subtle warm orange (#FF6200) light from below

${COMMON_TAIL}`,
  },
  {
    name: "olaf-dumbbell",
    prompt: `${COMMON_HEAD}

Composition (top to bottom):
- TOP: huge bold sans-serif word "OLAF" in dimensional matte black letterforms, oversized to fill the upper portion
- CENTER: a colossal monumental matte black dumbbell sculpture lying horizontally as if floating, the size of a couch
- The OLAF plush mascot from the reference photo (fluffy white with blue beret and black earmuffs) elegantly draped on top of the dumbbell handle as if posing on modern furniture, casual editorial pose with paws relaxed
- Studio backdrop: warm cream-orange gradient with cinematic side-lighting

${COMMON_TAIL}`,
  },
  {
    name: "olaf-phone",
    prompt: `${COMMON_HEAD}

Composition (top to bottom):
- TOP: huge bold sans-serif word "OLAF" in dimensional cream-colored letterforms behind the phone
- CENTER: a colossal monumental smartphone standing vertically like a sculpture, the size of a small refrigerator, screen showing minimal AI chat interface in dark mode with subtle orange accents
- The OLAF plush mascot from the reference photo (fluffy white with blue beret and black earmuffs) leaning casually against the side of the giant phone, sitting on the floor, looking up at the screen with curious editorial pose
- Studio backdrop: deep midnight navy with warm orange glow accent from one corner

${COMMON_TAIL}`,
  },
  {
    name: "olaf-plate",
    prompt: `${COMMON_HEAD}

Composition (top to bottom):
- TOP THIRD: huge bold sans-serif word "OLAF" in dimensional matte cream letterforms
- CENTER: a colossal monumental black iron weight plate (round disc) sculpture standing on its edge like a giant ring, the size of a small car, photorealistic with a large center hole
- The OLAF plush mascot from the reference photo (fluffy white with blue beret and black earmuffs) sitting comfortably inside the center hole of the giant weight plate as if framed by it, paws hanging out playfully
- Studio backdrop: warm deep amber gradient with cinematic dramatic side-lighting

${COMMON_TAIL}`,
  },
];

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function gen(c) {
  console.log(`🎨 生成中: ${c.name}`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: c.prompt },
          { inline_data: { mime_type: mimeType, data: refBase64 } },
        ],
      }],
    }),
  });

  if (!res.ok) {
    console.error(`❌ ${c.name}: ${res.status}\n${await res.text()}`);
    return;
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    const b64 = part.inline_data?.data ?? part.inlineData?.data;
    if (b64) {
      const rawPath = `public/threads-${c.name}-raw.jpg`;
      await fs.writeFile(rawPath, Buffer.from(b64, "base64"));

      const meta = await sharp(rawPath).metadata();
      const w = meta.width ?? 0;
      const h = meta.height ?? 0;
      const targetH = Math.round((w * 4) / 3);

      const finalPath = `public/threads-${c.name}-final.jpg`;
      if (targetH > h) {
        const padTotal = targetH - h;
        const padTop = Math.floor(padTotal / 2);
        const padBottom = padTotal - padTop;
        await sharp(rawPath)
          .extend({ top: padTop, bottom: padBottom, left: 0, right: 0, background: "#0a0e1a" })
          .jpeg({ quality: 92 })
          .toFile(finalPath);
      } else {
        await fs.copyFile(rawPath, finalPath);
      }
      console.log(`  ✅ ${finalPath}`);
      return;
    }
  }
  console.error(`❌ ${c.name}: 画像が含まれていない`);
}

await fs.mkdir("public", { recursive: true });

await Promise.allSettled(CREATIVES.map(gen));

console.log("\n📌 完了");
