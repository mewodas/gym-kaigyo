#!/usr/bin/env node
/**
 * 横長の画像を 3:4 縦型にパディング（背景色で上下を埋める）
 * Usage: node scripts/pad-to-3x4.mjs <input> [output] [bg-color]
 */

import sharp from "sharp";

const [, , input, output = input.replace(/\.(jpg|png)$/, "-3x4.jpg"), bgColor = "#0f172a"] = process.argv;

if (!input) {
  console.error("Usage: node scripts/pad-to-3x4.mjs <input> [output] [bg-color]");
  process.exit(1);
}

const meta = await sharp(input).metadata();
const { width = 0, height = 0 } = meta;

// 3:4 (width:height) なので height = width * 4/3
const targetH = Math.round((width * 4) / 3);
const padTotal = targetH - height;
const padTop = Math.floor(padTotal / 2);
const padBottom = padTotal - padTop;

console.log(`📐 入力: ${width}×${height}`);
console.log(`📐 出力: ${width}×${targetH} (3:4)`);
console.log(`📐 上下パディング: top=${padTop}, bottom=${padBottom} (${bgColor})`);

await sharp(input)
  .extend({
    top: padTop,
    bottom: padBottom,
    left: 0,
    right: 0,
    background: bgColor,
  })
  .jpeg({ quality: 90 })
  .toFile(output);

console.log(`✅ 完成: ${output}`);
