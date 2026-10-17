#!/usr/bin/env node
/**
 * Threads「OLAF」ライフスタイル系 — ジム要素なしバージョン
 */

import fs from "node:fs/promises";
import sharp from "sharp";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-image";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY が設定されていません");
  process.exit(1);
}

const refPath = "/mnt/c/Users/mwdsb/Downloads/S__91709463.jpg";
const refData = await fs.readFile(refPath);
const refBase64 = refData.toString("base64");

const COMMON_HEAD = `Tall vertical 3:4 portrait editorial product photograph for Threads.

Subject: the cute plush dog mascot from the reference photo. It is a fluffy white plush wearing a bright blue beret and black earmuffs over its ears, with simple cute black cartoon eyes, small black nose, slight pink tongue, soft round body, short stubby arms. Preserve all distinctive features exactly.

Bold sans-serif word "OLAF" in clean cream-colored typography fills the upper part of the frame, oversized, perfectly legible.`;

const COMMON_TAIL = `Editorial luxury mascot collaboration aesthetic (Moschino / Maison Kitsuné / KAWS style). Glossy mirrored polished floor reflecting subject and the giant object. Apple-store premium quality, magazine cover, ultra-clean composition with massive negative space, soft cinematic side-lighting. Real product photograph (NOT illustration, NOT 3D render). Tall vertical portrait format with the plush positioned in the lower half.`;

const CREATIVES = [
  {
    name: "lifestyle-coffee",
    prompt: `${COMMON_HEAD}

Centerpiece: a colossal monumental ceramic coffee cup on a saucer, the size of a small car, oversized like a museum sculpture. Steam rising softly from the cup. Cream and matte ceramic finish.

The OLAF plush mascot is sitting on the saucer beside the giant coffee cup, peaceful editorial pose, slightly leaning against the cup.

Studio backdrop: warm caramel-tan gradient with subtle orange light. Cinematic dramatic side-lighting.

${COMMON_TAIL}`,
  },
  {
    name: "lifestyle-book",
    prompt: `${COMMON_HEAD}

Centerpiece: a colossal monumental open hardcover book lying flat on the floor, oversized like a giant reading platform, with cream-colored pages and elegant typography on the visible page. The size of a queen-size bed.

The OLAF plush mascot is sitting on top of the open pages, in the middle of the spread, paws relaxed, looking up with curious editorial pose.

Studio backdrop: warm beige-tan gradient with subtle orange highlight.

${COMMON_TAIL}`,
  },
  {
    name: "lifestyle-lightbulb",
    prompt: `${COMMON_HEAD}

Centerpiece: a colossal monumental classic vintage lightbulb sculpture standing upright on its base, glowing softly with warm orange filament light from inside, oversized to room scale, glass body translucent.

The OLAF plush mascot is sitting at the base of the giant lightbulb, looking up at it with curious editorial pose, paws together.

Studio backdrop: deep navy gradient with the lightbulb's warm glow illuminating the scene dramatically.

${COMMON_TAIL}`,
  },
  {
    name: "lifestyle-notebook",
    prompt: `${COMMON_HEAD}

Centerpiece: a colossal monumental closed leather notebook with a giant matte black fountain pen lying diagonally across it, oversized like a writing desk for a giant. Cream-colored leather cover with subtle texture.

The OLAF plush mascot is sitting on top of the notebook cover, paws relaxed, editorial pose looking at camera.

Studio backdrop: warm cream-beige gradient with cinematic side-lighting.

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
          { inline_data: { mime_type: "image/jpeg", data: refBase64 } },
        ],
      }],
    }),
  });

  if (!res.ok) {
    console.error(`❌ ${c.name}: ${res.status}`);
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
  console.error(`❌ ${c.name}: ${data.candidates?.[0]?.finishReason ?? "no image"}`);
}

await fs.mkdir("public", { recursive: true });
await Promise.allSettled(CREATIVES.map(gen));
console.log("\n📌 完了");
