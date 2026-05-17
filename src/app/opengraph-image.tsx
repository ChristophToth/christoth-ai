import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Chris Toth - AI Adoption & Workforce Transformation";
export const size = {
  width: 1200,
  height: 630,
};
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
          justifyContent: "space-between",
          background: "#050507",
          color: "white",
          padding: 64,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(124,92,255,0.22), transparent 42%), linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "auto, 56px 56px, 56px 56px",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#c4b5fd",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <span>Chris Toth</span>
          <span style={{ color: "#5B8CFF" }}>AI Adoption</span>
        </div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              maxWidth: 960,
              fontSize: 86,
              lineHeight: 0.95,
              letterSpacing: 0,
              fontWeight: 700,
            }}
          >
            AI adoption is behavior change.
          </div>
          <div
            style={{
              marginTop: 28,
              maxWidth: 760,
              color: "#d4d4d8",
              fontSize: 30,
              lineHeight: 1.25,
            }}
          >
            Research, enablement, and operating rhythm for enterprise AI that sticks.
          </div>
        </div>
        <div
          style={{
            position: "relative",
            color: "#a1a1aa",
            fontSize: 24,
          }}
        >
          christoth.work
        </div>
      </div>
    ),
    size,
  );
}
