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
            "linear-gradient(135deg, #0F1E17 0%, #1A2E24 55%, #22362B 100%)",
          padding: "80px",
          color: "#F4EDE0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: "#8FD9A8",
            }}
          />
          <span
            style={{
              fontSize: 32,
              letterSpacing: -0.5,
              fontFamily: "Georgia, serif",
            }}
          >
            Tomoverde
          </span>
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
          <span style={{ color: "#8FD9A8", fontStyle: "italic" }}>actually&nbsp;</span>
          <span>want.</span>
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 28,
            color: "#B8C5BC",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          A cannabis community that feels like coming home, not a transaction.
        </div>
      </div>
    ),
    { ...size },
  );
}
