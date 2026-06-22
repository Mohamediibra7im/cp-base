import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid #22c55e",
          borderRadius: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at center, rgba(34, 197, 94, 0.3) 0%, rgba(0, 0, 0, 0) 80%)",
            display: "flex",
          }}
        />
        {/* Text [CP] */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            color: "#ffffff",
            fontFamily: "monospace",
            fontSize: "64px",
            fontWeight: "bold",
            position: "relative",
          }}
        >
          <span style={{ color: "#22c55e" }}>[</span>
          <span style={{ color: "#ffffff", marginLeft: "4px", marginRight: "4px" }}>
            CP
          </span>
          <span style={{ color: "#22c55e" }}>]</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
