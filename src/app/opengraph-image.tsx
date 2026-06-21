import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        {/* Scanline effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "#22c55e88",
              letterSpacing: "0.1em",
            }}
          >
            {"$ cat /etc/motd"}
          </div>
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#22c55e",
              textShadow: "0 0 20px #22c55e44, 0 0 40px #22c55e22",
              letterSpacing: "0.15em",
            }}
          >
            CP-BASE
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#22c55e66",
              letterSpacing: "0.05em",
            }}
          >
            Competitive Programming Templates
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "12px",
            }}
          >
            {["C++", "Python", "Java", "Rust", "Go", "JS"].map((lang) => (
              <div
                key={lang}
                style={{
                  fontSize: "14px",
                  color: "#22c55e55",
                  border: "1px solid #22c55e33",
                  padding: "4px 12px",
                  letterSpacing: "0.05em",
                }}
              >
                {lang}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#22c55e44",
              marginTop: "24px",
            }}
          >
            mohamediibrahim.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
