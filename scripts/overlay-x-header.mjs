#!/usr/bin/env node
/**
 * X ヘッダー画像にクリーンな日本語テキストを SVG で重ねるスクリプト
 *
 * 使い方:
 *   node scripts/overlay-x-header.mjs <input.jpg> [output.jpg]
 *
 * 入力画像は 16:9 推奨。出力は 1500x500 (3:1) にクロップ＆リサイズ。
 */

import sharp from "sharp";
import path from "node:path";

const [, , inputArg, outputArg] = process.argv;
const input = inputArg ?? "public/x-header-v2-3.jpg";
const output = outputArg ?? "public/x-header-final.jpg";

const W = 1500;
const H = 500;

// SVG でクリーンに日本語を描画
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .heading {
        font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
        font-weight: 900;
        fill: #ffffff;
        letter-spacing: -1px;
      }
      .sub {
        font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
        font-weight: 700;
        fill: rgba(255, 255, 255, 0.92);
      }
      .url {
        font-family: 'Helvetica', 'Arial', sans-serif;
        font-weight: 600;
        fill: rgba(255, 255, 255, 0.85);
      }
    </style>
  </defs>

  <!-- メイン見出し（左半分のオレンジ部分に配置） -->
  <text class="heading" x="60" y="180" font-size="62">副業から始める</text>
  <text class="heading" x="60" y="260" font-size="62">ジム経営のリアル</text>

  <!-- サブコピー -->
  <text class="sub" x="60" y="310" font-size="20">副業 × AI × 2業態のオーナーが</text>
  <text class="sub" x="60" y="338" font-size="20">実数字で公開</text>

  <!-- URL（左下） -->
  <text class="url" x="60" y="450" font-size="22">gym-kaigyo.jp</text>

  <!-- 装飾の細い横線 -->
  <line x1="60" y1="285" x2="200" y2="285" stroke="rgba(255,255,255,0.85)" stroke-width="2" />
</svg>
`;

console.log(`📐 入力: ${input}`);
console.log(`📐 出力: ${output} (${W}x${H})`);

await sharp(input)
  .resize(W, H, { fit: "cover", position: "center" })
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .jpeg({ quality: 90 })
  .toFile(output);

console.log(`✅ 完成: ${output}`);
console.log("");
console.log("📌 X にアップロードする際:");
console.log("   - そのまま 1500x500 でアップロード可能");
console.log("   - スマホ表示は中央 1500x362 のみ表示されることに注意");
