import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Fetch JetBrains Mono fonts from Google Fonts CDN (Fontsource CDN)
  let fontRegular: ArrayBuffer;
  let fontBold: ArrayBuffer;
  try {
    const [regRes, boldRes] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@5.0.19/latin-400-normal.woff"),
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@5.0.19/latin-700-normal.woff"),
    ]);

    if (!regRes.ok || !boldRes.ok) {
      throw new Error("Failed to fetch fonts from CDN");
    }

    fontRegular = await regRes.arrayBuffer();
    fontBold = await boldRes.arrayBuffer();
  } catch (error) {
    console.error("Failed to read Google Fonts for OG image, falling back to system fonts:", error);
    fontRegular = new ArrayBuffer(0);
    fontBold = new ArrayBuffer(0);
  }

  const options: Record<string, any> = {
    ...size,
  };

  if (fontRegular.byteLength > 0 && fontBold.byteLength > 0) {
    options.fonts = [
      {
        name: "JetBrains Mono",
        data: fontRegular,
        style: "normal",
        weight: 400,
      },
      {
        name: "JetBrains Mono",
        data: fontBold,
        style: "normal",
        weight: 700,
      },
    ];
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          fontFamily: "JetBrains Mono, monospace",
          padding: "60px",
          color: "#22c55e",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Radial Glow (Green) */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0) 70%)",
            display: "flex",
          }}
        />
        {/* Background Radial Glow (Cyan) */}
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(6, 182, 212, 0) 70%)",
            display: "flex",
          }}
        />

        {/* Faint Tech Grid Lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: 0.04,
            padding: "20px",
          }}
        >
          {/* Vertical grid lines */}
          <div style={{ position: "absolute", left: "20%", top: 0, bottom: 0, width: "1px", backgroundColor: "#22c55e", display: "flex" }} />
          <div style={{ position: "absolute", left: "40%", top: 0, bottom: 0, width: "1px", backgroundColor: "#22c55e", display: "flex" }} />
          <div style={{ position: "absolute", left: "60%", top: 0, bottom: 0, width: "1px", backgroundColor: "#22c55e", display: "flex" }} />
          <div style={{ position: "absolute", left: "80%", top: 0, bottom: 0, width: "1px", backgroundColor: "#22c55e", display: "flex" }} />
          {/* Horizontal grid lines */}
          <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: "1px", backgroundColor: "#22c55e", display: "flex" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", backgroundColor: "#22c55e", display: "flex" }} />
          <div style={{ position: "absolute", top: "75%", left: 0, right: 0, height: "1px", backgroundColor: "#22c55e", display: "flex" }} />
        </div>

        {/* Technical Corner Brackets */}
        <div style={{ position: "absolute", top: "24px", left: "24px", color: "rgba(34, 197, 94, 0.35)", fontSize: "16px", display: "flex" }}>[</div>
        <div style={{ position: "absolute", top: "24px", right: "24px", color: "rgba(34, 197, 94, 0.35)", fontSize: "16px", display: "flex" }}>]</div>
        <div style={{ position: "absolute", bottom: "24px", left: "24px", color: "rgba(34, 197, 94, 0.35)", fontSize: "16px", display: "flex" }}>[</div>
        <div style={{ position: "absolute", bottom: "24px", right: "24px", color: "rgba(34, 197, 94, 0.35)", fontSize: "16px", display: "flex" }}>]</div>

        {/* Thin border wrapper */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            right: "24px",
            bottom: "24px",
            border: "1px solid rgba(34, 197, 94, 0.08)",
            pointerEvents: "none",
            display: "flex",
          }}
        />

        {/* Top Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Branding Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#22c55e",
                color: "#0a0a0a",
                padding: "2px 8px",
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "1px",
                display: "flex",
                alignItems: "center",
              }}
            >
              CP
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#ffffff",
                letterSpacing: "3px",
                display: "flex",
              }}
            >
              BASE
            </div>
          </div>

          {/* Status info */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                boxShadow: "0 0 8px rgba(34, 197, 94, 0.8)",
                display: "flex",
              }}
            />
            <div style={{ fontSize: "11px", color: "rgba(34, 197, 94, 0.6)", letterSpacing: "1.5px", display: "flex" }}>
              ONLINE // VER_2.0
            </div>
          </div>
        </div>

        {/* Central Display Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "360px",
          }}
        >
          {/* Left Column: Brand Statement */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "53%",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#06b6d4",
                  fontWeight: "bold",
                  letterSpacing: "3px",
                  display: "flex",
                }}
              >
                // COMPETITIVE PROGRAMMING TEMPLATES
              </div>
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  lineHeight: "1.2",
                  letterSpacing: "-0.5px",
                  display: "flex",
                }}
              >
                Speed up code implementation.
              </div>
            </div>

            <div
              style={{
                fontSize: "15px",
                color: "rgba(255, 255, 255, 0.55)",
                lineHeight: "1.6",
                fontWeight: 400,
                display: "flex",
              }}
            >
              An organized collection of fast, copy-paste ready data structures, algorithms, and templates optimized for coding contests.
            </div>

            {/* Languages Row */}
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              {["C++", "Python", "Java", "Rust", "Go", "JS"].map((lang) => (
                <div
                  key={lang}
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#22c55e",
                    backgroundColor: "rgba(34, 197, 94, 0.06)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    padding: "3px 10px",
                    borderRadius: "1px",
                    display: "flex",
                  }}
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Code Terminal Block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "43%",
              backgroundColor: "#0d0d0d",
              border: "1px solid rgba(34, 197, 94, 0.15)",
              borderRadius: "4px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* Terminal Topbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                backgroundColor: "#121212",
                borderBottom: "1px solid rgba(34, 197, 94, 0.08)",
              }}
            >
              {/* Window Controls */}
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "rgba(239, 68, 68, 0.7)", display: "flex" }} />
                <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "rgba(234, 179, 8, 0.7)", display: "flex" }} />
                <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "rgba(34, 197, 94, 0.7)", display: "flex" }} />
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.35)", fontWeight: "bold", display: "flex" }}>segtree.cpp</div>
              <div style={{ width: "39px", display: "flex" }} />
            </div>

            {/* Code Content */}
            <div
              style={{
                display: "flex",
                padding: "16px",
                fontSize: "12px",
                lineHeight: "1.7",
                backgroundColor: "#080808",
              }}
            >
              {/* Line Numbers */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  color: "rgba(34, 197, 94, 0.25)",
                  textAlign: "right",
                  paddingRight: "12px",
                  borderRight: "1px solid rgba(34, 197, 94, 0.08)",
                  userSelect: "none",
                }}
              >
                {Array.from({ length: 9 }).map((_, idx) => (
                  <span key={idx} style={{ fontFamily: "JetBrains Mono" }}>{idx + 1}</span>
                ))}
              </div>

              {/* Code markup */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "12px",
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "JetBrains Mono",
                }}
              >
                <div style={{ display: "flex" }}>
                  <span style={{ color: "#ef4444" }}>template</span>
                  <span style={{ color: "rgba(255,255,255,0.75)", marginLeft: "4px", marginRight: "4px" }}>&lt;</span>
                  <span style={{ color: "#06b6d4" }}>typename</span>
                  <span style={{ color: "rgba(255,255,255,0.75)", marginLeft: "4px" }}>T&gt;</span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: "#ef4444" }}>struct</span>
                  <span style={{ color: "#eab308", marginLeft: "4px", marginRight: "4px" }}>SegTree</span>
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{"{"}</span>
                </div>
                <div style={{ display: "flex", paddingLeft: "16px" }}>
                  <span style={{ color: "#06b6d4" }}>int</span>
                  <span style={{ color: "rgba(255,255,255,0.75)", marginLeft: "4px" }}>n;</span>
                </div>
                <div style={{ display: "flex", paddingLeft: "16px" }}>
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>vector&lt;T&gt; tree;</span>
                </div>
                <div style={{ display: "flex", paddingLeft: "16px" }}>
                  <span style={{ color: "#8b5cf6" }}>void</span>
                  <span style={{ color: "#3b82f6", marginLeft: "4px", marginRight: "4px" }}>update</span>
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>(</span>
                  <span style={{ color: "#06b6d4" }}>int</span>
                  <span style={{ color: "rgba(255,255,255,0.75)", marginLeft: "4px" }}>i, T v) {"{"}</span>
                </div>
                <div style={{ display: "flex", paddingLeft: "32px" }}>
                  <span style={{ color: "rgba(34, 197, 94, 0.35)" }}>// O(log n)</span>
                </div>
                <div style={{ display: "flex", paddingLeft: "32px" }}>
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>tree[i] = v;</span>
                </div>
                <div style={{ display: "flex", paddingLeft: "16px" }}>
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{"}"}</span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{"};"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(34, 197, 94, 0.08)",
            paddingTop: "20px",
          }}
        >
          <div style={{ fontSize: "14px", color: "rgba(34, 197, 94, 0.5)", display: "flex", alignItems: "center" }}>
            <span>$ cat cp-base.dev</span>
            <span
              style={{
                display: "flex",
                width: "7px",
                height: "14px",
                backgroundColor: "#22c55e",
                marginLeft: "4px",
              }}
            />
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.25)", display: "flex" }}>
            © {new Date().getFullYear()} Mohamed Ibrahim
          </div>
        </div>
      </div>
    ),
    options
  );
}
