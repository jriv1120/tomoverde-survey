import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tomoverde — Tell us what you actually want.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background:
            "linear-gradient(135deg, #f2ecde 0%, #ebe3d0 55%, #e0d6bc 100%)",
          padding: "80px",
          color: "#1f1c18",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#2e3a2a",
              fontWeight: 600,
            }}
          >
            Tomoverde
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 88,
            lineHeight: 1.05,
            letterSpacing: -2.5,
            maxWidth: 1040,
            fontFamily: "Georgia, serif",
          }}
        >
          <span>Tell us what you&nbsp;</span>
          <span style={{ color: "#2e3a2a", fontStyle: "italic" }}>actually&nbsp;</span>
          <span>want.</span>
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 28,
            color: "#6b4f3a",
            maxWidth: 900,
            lineHeight: 1.4,
            fontStyle: "italic",
          }}
        >
          Discover Green Together.
        </div>
      </div>
    ),
    { ...size },
  );
}
