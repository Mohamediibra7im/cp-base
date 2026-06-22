import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "CP-Base | Competitive Programming Templates";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "nodejs";
export const revalidate = 3600;

export default async function OpengraphImage() {
  let fontRegular: ArrayBuffer;
  let fontBold: ArrayBuffer;
  try {
    fontRegular = await readFile(
      join(process.cwd(), "public/fonts/JetBrainsMono-Regular.ttf")
    ).then((buf) => buf.buffer as ArrayBuffer);
    fontBold = await readFile(
      join(process.cwd(), "public/fonts/JetBrainsMono-Bold.ttf")
    ).then((buf) => buf.buffer as ArrayBuffer);
  } catch (error) {
    console.error("Failed to read local fonts for OG image:", error);
    fontRegular = new ArrayBuffer(0);
    fontBold = new ArrayBuffer(0);
  }

  const fonts = [];
  if (fontRegular.byteLength > 0) {
    fonts.push({
      name: "JetBrains Mono",
      data: fontRegular,
      style: "normal" as const,
      weight: 400 as const,
    });
  }
  if (fontBold.byteLength > 0) {
    fonts.push({
      name: "JetBrains Mono",
      data: fontBold,
      style: "normal" as const,
      weight: 700 as const,
    });
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
          backgroundColor: "#030a05",
          fontFamily: "JetBrains Mono, monospace",
          padding: "50px",
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
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0) 70%)",
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
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(6, 182, 212, 0) 70%)",
            display: "flex",
          }}
        />

        {/* Faint Grid Lines */}
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
          <div
            style={{
              position: "absolute",
              left: "10%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "20%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "30%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "40%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "60%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "70%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "80%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "90%",
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "15%",
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "75%",
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "90%",
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "#22c55e",
              display: "flex",
            }}
          />
        </div>

        {/* Technical Corner Coordinate Markers */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "rgba(34, 197, 94, 0.4)",
            fontSize: "11px",
            display: "flex",
          }}
        >
          [0x00]
        </div>
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: "rgba(34, 197, 94, 0.4)",
            fontSize: "11px",
            display: "flex",
          }}
        >
          [0x7F]
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            color: "rgba(34, 197, 94, 0.4)",
            fontSize: "11px",
            display: "flex",
          }}
        >
          [0x80]
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            color: "rgba(34, 197, 94, 0.4)",
            fontSize: "11px",
            display: "flex",
          }}
        >
          [0xFF]
        </div>

        {/* Double Border Frame */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            right: "16px",
            bottom: "16px",
            border: "1px solid rgba(34, 197, 94, 0.15)",
            pointerEvents: "none",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            right: "12px",
            bottom: "12px",
            border: "1px solid rgba(34, 197, 94, 0.05)",
            pointerEvents: "none",
            display: "flex",
          }}
        />

        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderBottom: "1px solid rgba(34, 197, 94, 0.2)",
            paddingBottom: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                backgroundColor: "#22c55e",
                color: "#030a05",
                padding: "3px 10px",
                fontSize: "15px",
                fontWeight: "bold",
                borderRadius: "0px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
              }}
            >
              CP
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#ffffff",
                letterSpacing: "4px",
                display: "flex",
                textShadow: "0 0 8px rgba(255,255,255,0.3)",
              }}
            >
              BASE
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                backgroundColor: "rgba(34, 197, 94, 0.04)",
                padding: "2px 10px",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  boxShadow: "0 0 6px rgba(34, 197, 94, 0.9)",
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: "#22c55e",
                  letterSpacing: "1px",
                  fontWeight: "bold",
                }}
              >
                SYSTEM_ONLINE
              </span>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(34, 197, 94, 0.4)",
                display: "flex",
              }}
            >
              CON_PORT: 3000
            </div>
          </div>
        </div>

        {/* Core Layout Split */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "360px",
          }}
        >
          {/* Left Column: Diagnostics + Slogan */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "48%",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#06b6d4",
                  fontWeight: "bold",
                  letterSpacing: "4px",
                  display: "flex",
                  textShadow: "0 0 6px rgba(6, 182, 212, 0.2)",
                }}
              >
                // OPTIMIZED CONTEST TEMPLATES
              </div>
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  lineHeight: "1.15",
                  letterSpacing: "-0.5px",
                  display: "flex",
                }}
              >
                Fast & Optimized Code Templates
              </div>
            </div>

            {/* Diagnostic Window Box */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgba(34, 197, 94, 0.15)",
                backgroundColor: "rgba(5, 20, 8, 0.4)",
                padding: "16px",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid rgba(34, 197, 94, 0.15)",
                  paddingBottom: "6px",
                  marginBottom: "4px",
                  fontSize: "9px",
                  fontWeight: "bold",
                  color: "rgba(34, 197, 94, 0.4)",
                  letterSpacing: "1px",
                }}
              >
                SYSTEM DIAGNOSTIC REPORT
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: "rgba(34, 197, 94, 0.5)" }}>OS_KERNEL</span>
                <span style={{ color: "#ffffff", fontWeight: "bold" }}>
                  cp-base-v2.0.sh
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: "rgba(34, 197, 94, 0.5)" }}>ALGORITHMS</span>
                <span style={{ color: "#ffffff" }}>SegmentTree, DSU, Dijkstra</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: "rgba(34, 197, 94, 0.5)" }}>OPTIMIZATION</span>
                <span style={{ color: "#06b6d4", fontWeight: "bold" }}>
                  O(1) / O(log N)
                </span>
              </div>
            </div>

            {/* Languages Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["C++", "Python", "Java", "Rust", "Go"].map((lang) => (
                <div
                  key={lang}
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#22c55e",
                    backgroundColor: "rgba(34, 197, 94, 0.05)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    padding: "3px 12px",
                    borderRadius: "0px",
                    display: "flex",
                  }}
                >
                  $ grep '{lang}'
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Code Terminal window */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "48%",
              backgroundColor: "#050f06",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              borderRadius: "0px",
              boxShadow:
                "0 25px 50px rgba(0,0,0,0.8), 0 0 20px rgba(34, 197, 94, 0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                backgroundColor: "rgba(34, 197, 94, 0.06)",
                borderBottom: "1px solid rgba(34, 197, 94, 0.15)",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <div
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(239, 68, 68, 0.6)",
                    display: "flex",
                  }}
                />
                <div
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(234, 179, 8, 0.6)",
                    display: "flex",
                  }}
                />
                <div
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(34, 197, 94, 0.6)",
                    display: "flex",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontWeight: "bold",
                  display: "flex",
                }}
              >
                dijkstra.cpp
              </div>
              <div style={{ width: "39px", display: "flex" }} />
            </div>

            {/* Code Body */}
            <div
              style={{
                display: "flex",
                padding: "18px 14px",
                fontSize: "12px",
                lineHeight: "1.75",
                backgroundColor: "#020703",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  color: "rgba(34, 197, 94, 0.2)",
                  textAlign: "right",
                  paddingRight: "12px",
                  borderRight: "1px solid rgba(34, 197, 94, 0.08)",
                  userSelect: "none",
                }}
              >
                {Array.from({ length: 8 }).map((_, idx) => (
                  <span key={idx} style={{ fontFamily: "JetBrains Mono" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "14px",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "JetBrains Mono",
                }}
              >
                <div style={{ display: "flex" }}>
                  <span style={{ color: "#ef4444" }}>vector</span>
                  <span style={{ color: "#ffffff" }}>&lt;</span>
                  <span style={{ color: "#06b6d4" }}>int</span>
                  <span style={{ color: "#ffffff" }}>&gt; dist(N, INF);</span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: "#f59e0b" }}>priority_queue</span>
                  <span style={{ color: "#ffffff" }}>
                    &lt;pii, vector&lt;pii&gt;, greater&lt;pii&gt;&gt; pq;
                  </span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: "#ffffff" }}>dist[src] = 0;</span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: "#ffffff" }}>pq.push({"{"}0, src{"}"});</span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: "#ef4444" }}>while</span>
                  <span style={{ color: "#ffffff" }}> (!pq.empty()) {"{"}</span>
                </div>
                <div style={{ display: "flex", paddingLeft: "16px" }}>
                  <span style={{ color: "#ffffff" }}>
                    auto [d, u] = pq.top(); pq.pop();
                  </span>
                </div>
                <div style={{ display: "flex", paddingLeft: "16px" }}>
                  <span style={{ color: "#ef4444" }}>if</span>
                  <span style={{ color: "#ffffff" }}> (d &gt; dist[u]) </span>
                  <span style={{ color: "#ef4444" }}>continue</span>
                  <span style={{ color: "#ffffff" }}>;</span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: "#ffffff" }}>{"}"}</span>
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
            borderTop: "1px solid rgba(34, 197, 94, 0.15)",
            paddingTop: "15px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "rgba(34, 197, 94, 0.6)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>$ cat info.txt</span>
            <span
              style={{
                display: "flex",
                width: "7px",
                height: "13px",
                backgroundColor: "#22c55e",
                marginLeft: "6px",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.2)",
              display: "flex",
            }}
          >
            © {new Date().getFullYear()} Mohamed Ibrahim // Mohamediibra7im
          </div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
