import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ジム開業ラボ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FEF6EA",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,98,0,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,140,66,0.15) 0%, transparent 50%)",
          padding: "80px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #FF6200 0%, #ff8c42 100%)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            🏋️
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#FF6200", fontSize: 22, fontWeight: 700 }}>
              パーソナルジム開業マニュアル
            </div>
            <div style={{ color: "#1a1a1a", fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>
              ジム開業ラボ
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 900,
              color: "#1a1a1a",
              letterSpacing: -2,
              lineHeight: 1.15,
            }}
          >
            実際に開業したオーナーが書く
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 900,
              color: "#FF6200",
              letterSpacing: -2,
              lineHeight: 1.15,
            }}
          >
            開業のリアル
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#666",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <span>費用・器具・集客・AI活用まで実数字で解説</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
