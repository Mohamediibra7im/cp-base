import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const NOTES_DIR = join(process.cwd(), "templates_notes");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const filePath = join(NOTES_DIR, `${slug}.md`);
    const content = await readFile(filePath, "utf-8");
    return NextResponse.json({ slug, content });
  } catch {
    // File doesn't exist, return empty content
    return NextResponse.json({ slug, content: "" });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { slug, content } = body;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    // Ensure directory exists
    await mkdir(NOTES_DIR, { recursive: true });
    
    const filePath = join(NOTES_DIR, `${slug}.md`);
    await writeFile(filePath, content, "utf-8");
    
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error writing notes file:", error);
    return NextResponse.json({ error: "Failed to write notes file" }, { status: 500 });
  }
}
