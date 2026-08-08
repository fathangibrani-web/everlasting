import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#221810",
          borderRadius: "50%",
        }}
      >
        <div
          style={{
            width: "78%",
            height: "78%",
            borderRadius: "50%",
            border: "2px solid #e9cb8d",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              width: "50%",
              height: 2,
              background: "#e9cb8d",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: "38%",
              height: 2,
              background: "#e9cb8d",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: "50%",
              height: 2,
              background: "#e9cb8d",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
