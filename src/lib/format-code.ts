interface ClangFormat {
  format: (source: string, filename: string, style: string) => string;
}

let clangFormat: Promise<ClangFormat> | null = null;

function getClangFormat(): Promise<ClangFormat> {
  if (!clangFormat) {
    clangFormat = (async () => {
      const mod = await import("@wasm-fmt/clang-format/web");
      await mod.default();
      return { format: mod.format };
    })();
  }
  return clangFormat;
}

function basicTrim(code: string): string {
  const lines = code.split("\n").map((l) => l.replace(/\s+$/, "").replace(/\t/g, "  "));
  let start = 0;
  while (start < lines.length && !lines[start].trim()) start++;
  let end = lines.length - 1;
  while (end >= start && !lines[end].trim()) end--;
  return lines.slice(start, end + 1).join("\n");
}

export async function formatCode(code: string, language: string): Promise<string> {
  if (!code.trim()) return code;
  if (language === "cpp") {
    try {
      const cf = await getClangFormat();
      return cf.format(code, "source.cc", "Google");
    } catch {
      return basicTrim(code);
    }
  }
  return basicTrim(code);
}
