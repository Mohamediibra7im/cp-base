import { getDb, schema } from "@/db";
import { eq } from "drizzle-orm";

type Db = NonNullable<ReturnType<typeof getDb>>;

/**
 * Capture the CURRENT persisted state of a template (fields + codes) into
 * template_history before it gets overwritten. Call this right before applying
 * an edit or a revert so the prior version can be restored later.
 *
 * Best-effort: never throws — a snapshot failure must not block the edit.
 */
export async function snapshotTemplate(
  db: Db,
  templateId: number,
  reason: string,
  contributionId?: number,
): Promise<void> {
  try {
    const [tpl] = await db
      .select()
      .from(schema.templates)
      .where(eq(schema.templates.id, templateId));
    if (!tpl) return;

    const codes = await db
      .select({ language: schema.templateCodes.language, code: schema.templateCodes.code })
      .from(schema.templateCodes)
      .where(eq(schema.templateCodes.templateId, templateId));

    await db.insert(schema.templateHistory).values({
      templateId: tpl.id,
      contributionId: contributionId ?? null,
      title: tpl.title,
      slug: tpl.slug,
      description: tpl.description,
      categoryId: tpl.categoryId,
      tags: tpl.tags,
      complexity: tpl.complexity,
      notes: tpl.notes,
      hidden: tpl.hidden,
      contributorName: tpl.contributorName,
      contributorCfHandle: tpl.contributorCfHandle,
      codes,
      reason,
    });
  } catch (e) {
    console.error("Failed to snapshot template history:", e);
  }
}
