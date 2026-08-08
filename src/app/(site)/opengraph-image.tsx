import { ImageResponse } from "next/og";

export const alt = "Everlasting — Mindset, Intelek, Islami";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fdf9f2",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, #f3e1bb 0%, transparent 45%), radial-gradient(circle at 85% 80%, #e9cb8d 0%, transparent 45%)",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "6px solid #a67623",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: "50%",
              height: 8,
              background: "#a67623",
              borderRadius: 6,
            }}
          />
          <div
            style={{
              width: "38%",
              height: 8,
              background: "#a67623",
              borderRadius: 6,
            }}
          />
          <div
            style={{
              width: "50%",
              height: 8,
              background: "#a67623",
              borderRadius: 6,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 84,
            fontWeight: 700,
            color: "#3b2a1c",
          }}
        >
          Everlasting
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8a5f1b",
          }}
        >
          Mindset · Intelek · Islami
        </div>
      </div>
    ),
    { ...size }
  );
}
