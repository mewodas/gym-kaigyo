#!/usr/bin/env node
/**
 * Threads「OLAF」フード系
 */

import fs from "node:fs/promises";
import sharp from "sharp";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-image";

if (!API_KEY) { console.error("❌ GEMINI_API_KEY"); process.exit(1); }

const refData = await fs.readFile("/mnt/c/Users/mwdsb/Downloads/S__91709463.jpg");
const refBase64 = refData.toString("base64");

const HEAD = `Tall vertical 3:4 portrait editorial product photograph for Threads.

Subject: the cute plush dog mascot from the reference photo. Fluffy white plush wearing a bright blue beret and black earmuffs over its ears, simple cute black cartoon eyes, small black nose, slight pink tongue, soft round body. Preserve all distinctive features exactly.

Bold sans-serif word "OLAF" in clean cream-colored typography fills the upper part of the frame, oversized, perfectly legible.`;

const TAIL = `Editorial luxury mascot collaboration aesthetic (Moschino / Maison Kitsuné / KAWS / Disney×Tiffany style — luxury brand featuring a cute plush mascot with delicious-looking food). Glossy mirrored polished floor reflecting subject and the giant food sculpture. Magazine cover quality, ultra-clean composition with massive negative space, soft cinematic side-lighting that makes the food look extra appetizing. Real food product photograph (NOT illustration, NOT 3D render). Tall vertical portrait format with the plush positioned in the lower half. Hyper-realistic and tasty-looking food details.`;

const CREATIVES = [
  {
    name: "food-donut",
    prompt: `${HEAD}

Centerpiece: a colossal monumental glazed donut with colorful pastel sprinkles, oversized like a museum sculpture (the size of a large car wheel). Pink frosting with white, blue, and pastel sprinkles. Mouth-watering soft texture.

The OLAF plush mascot is sitting beside or leaning against the giant donut, peaceful editorial pose.

Studio backdrop: soft pastel pink-cream gradient with subtle warm side-lighting.

${TAIL}`,
  },
  {
    name: "food-cookie",
    prompt: `${HEAD}

Centerpiece: a colossal monumental chocolate chip cookie standing upright on its edge like a giant disc sculpture, oversized to room scale. Golden-brown baked surface with rich dark chocolate chips visible. Slightly cracked edges showing the soft inner texture.

The OLAF plush mascot is sitting at the base of the giant cookie, leaning casually against it with paws relaxed, editorial pose.

Studio backdrop: warm caramel-tan gradient with soft cinematic lighting.

${TAIL}`,
  },
  {
    name: "food-macaron",
    prompt: `${HEAD}

Centerpiece: a colossal monumental stack of three French macarons in pastel colors (pink, cream, mint), oversized like a luxurious dessert sculpture. Perfect glossy ruffled feet on each macaron, smooth domed tops, visible cream filling between layers.

The OLAF plush mascot is sitting beside the macaron stack, leaning gently against the bottom macaron, peaceful editorial pose.

Studio backdrop: soft mint-cream gradient with delicate cinematic lighting.

${TAIL}`,
  },
  {
    name: "food-cupcake",
    prompt: `${HEAD}

Centerpiece: a colossal monumental cupcake with tall swirled buttercream frosting on top (cream-colored with a single cherry on top), oversized like a giant treat sculpture. Brown paper liner, fluffy moist cake visible at the base.

The OLAF plush mascot is sitting on top of the cupcake's frosting swirl as if resting on a cloud, paws relaxed, peaceful editorial pose.

Studio backdrop: warm cream-pink gradient with soft cinematic lighting.

${TAIL}`,
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

  if (!res.ok) { console.error(`❌ ${c.name}: ${res.status}`); return; }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const b64 = part.inline_data?.data ?? part.inlineData?.data;
    if (b64) {
      const rawPath = `public/threads-${c.name}-raw.jpg`;
      await fs.writeFile(rawPath, Buffer.from(b64, "base64"));
      const meta = await sharp(rawPath).metadata();
      const targetH = Math.round((meta.width * 4) / 3);
      const finalPath = `public/threads-${c.name}-final.jpg`;
      if (targetH > meta.height) {
        const padTotal = targetH - meta.height;
        await sharp(rawPath)
          .extend({ top: Math.floor(padTotal / 2), bottom: padTotal - Math.floor(padTotal / 2), left: 0, right: 0, background: "#0a0e1a" })
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
