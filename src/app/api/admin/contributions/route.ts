import { NextResponse } from "next/server";
import { getDb, schema } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const rows = await db.query.contributions.findMany({
    with: { category: true, template: true },
    orderBy: (c, { desc }) => [desc(c.createdAt)],
  });

  return NextResponse.json(rows);
}

export async function DELETE(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const [row] = await db
    .delete(schema.contributions)
    .where(eq(schema.contributions.id, Number(id)))
    .returning();

  if (!row) return NextResponse.json({ error: "Contribution not found" }, { status: 404 });

  return NextResponse.json({ message: "Contribution deleted" });
}

export async function PUT(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await request.json();
  const { id, action, adminNote } = body;

  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const [contribution] = await db
    .select()
    .from(schema.contributions)
    .where(eq(schema.contributions.id, Number(id)));

  if (!contribution) {
    return NextResponse.json({ error: "Contribution not found" }, { status: 404 });
  }

  if (contribution.status !== "pending") {
    return NextResponse.json({ error: "Already reviewed" }, { status: 400 });
  }

  if (action === "approve") {
    if (contribution.type === "new") {
      const baseSlug =
        contribution.slug ||
        (contribution.title || "untitled")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      // Ensure slug is unique — suffix -2, -3, ... on collision
      let slug = baseSlug;
      let suffix = 2;
      while (true) {
        const [clash] = await db
          .select({ id: schema.templates.id })
          .from(schema.templates)
          .where(eq(schema.templates.slug, slug));
        if (!clash) break;
        slug = `${baseSlug}-${suffix++}`;
      }

      let newTemplate;
      try {
        [newTemplate] = await db
          .insert(schema.templates)
          .values({
            title: contribution.title || "Untitled",
            slug,
            description: contribution.description || "",
            categoryId: contribution.categoryId || 1,
            tags: (contribution.tags as string[]) || [],
            complexity: contribution.complexity || "",
            notes: contribution.notes || null,
            contributorName: contribution.contributorName,
            contributorCfHandle: contribution.contributorCfHandle || null,
          })
          .returning();
      } catch (e) {
        console.error("Failed to insert approved template:", e);
        return NextResponse.json(
          { error: "Failed to publish template. Check the category exists and the slug is valid." },
          { status: 500 }
        );
      }

      const codes = (contribution.codes as Array<{ language: string; code: string }>) || [];
      if (codes.length > 0) {
        await db.insert(schema.templateCodes).values(
          codes.map((c) => ({
            templateId: newTemplate.id,
            language: c.language,
            code: c.code,
          }))
        );
      }

      await db
        .update(schema.contributions)
        .set({ status: "approved", adminNote: adminNote || null, reviewedAt: new Date() })
        .where(eq(schema.contributions.id, Number(id)));

      try {
        await sendApprovalEmail(
          contribution.contributorEmail,
          contribution.contributorName,
          contribution.title || "Untitled",
          slug,
          "new"
        );
      } catch (e) {
        console.error("Failed to send approval email:", e);
      }

      revalidatePath("/");
      revalidatePath("/templates");
      revalidatePath(`/template/${slug}`);

      return NextResponse.json({ message: "Approved and published", templateId: newTemplate.id });
    }

    if (contribution.type === "edit" && contribution.templateId) {
      const [existingTemplate] = await db
        .select()
        .from(schema.templates)
        .where(eq(schema.templates.id, contribution.templateId));

      if (!existingTemplate) {
        return NextResponse.json({ error: "Target template not found" }, { status: 404 });
      }

      const updates: Record<string, any> = {
        contributorName: contribution.contributorName,
        contributorCfHandle: contribution.contributorCfHandle || null,
        updatedAt: new Date(),
      };

      if (contribution.editNotes) {
        updates.notes = contribution.editNotes;
      }

      await db
        .update(schema.templates)
        .set(updates)
        .where(eq(schema.templates.id, contribution.templateId));

      const editCodes = contribution.editCodes as Array<{ language: string; code: string }> | null;
      if (editCodes && editCodes.length > 0) {
        await db
          .delete(schema.templateCodes)
          .where(eq(schema.templateCodes.templateId, contribution.templateId));

        await db.insert(schema.templateCodes).values(
          editCodes.map((c) => ({
            templateId: contribution.templateId!,
            language: c.language,
            code: c.code,
          }))
        );
      }

      await db
        .update(schema.contributions)
        .set({ status: "approved", adminNote: adminNote || null, reviewedAt: new Date() })
        .where(eq(schema.contributions.id, Number(id)));

      try {
        await sendApprovalEmail(
          contribution.contributorEmail,
          contribution.contributorName,
          existingTemplate.title,
          existingTemplate.slug,
          "edit"
        );
      } catch (e) {
        console.error("Failed to send approval email:", e);
      }

      revalidatePath(`/template/${existingTemplate.slug}`);
      revalidatePath("/templates");

      return NextResponse.json({ message: "Edit approved and applied" });
    }
  }

  if (action === "reject") {
    await db
      .update(schema.contributions)
      .set({ status: "rejected", adminNote: adminNote || null, reviewedAt: new Date() })
      .where(eq(schema.contributions.id, Number(id)));

    try {
      await sendRejectionEmail(
        contribution.contributorEmail,
        contribution.contributorName,
        contribution.title || "Edit Request",
        adminNote
      );
    } catch (e) {
      console.error("Failed to send rejection email:", e);
    }

    return NextResponse.json({ message: "Contribution rejected" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
