import "dotenv/config";
import { sql, eq } from "drizzle-orm";
import { getDb } from "./index";
import { categories, templates } from "./schema";
import { seedAlgebra } from "./seeds/seed-algebra";
import { seedBinarySearch } from "./seeds/seed-binary-search";
import { seedBitManip } from "./seeds/seed-bit-manip";
import { seedCombinatorics } from "./seeds/seed-combinatorics";
import { seedDataStruct } from "./seeds/seed-data-struct";
import { seedGraph } from "./seeds/seed-graph";
import { seedDP } from "./seeds/seed-dp";
import { seedStrings } from "./seeds/seed-strings";
import { seedGeometry } from "./seeds/seed-geometry";
import { seedNumberTheory } from "./seeds/seed-number-theory";
import { seedRangeQueries } from "./seeds/seed-range-queries";
import { seedUtilities } from "./seeds/seed-utilities";
import type { Db, CatMap } from "./seeds/helpers";

const targetSlug = process.argv[2];

const seedBySlug: Record<string, (db: Db, catMap: CatMap) => Promise<void>> = {
  "algebra": seedAlgebra,
  "binary-search": seedBinarySearch,
  "bit-manipulation": seedBitManip,
  "combinatorics": seedCombinatorics,
  "data-structures": seedDataStruct,
  "graph": seedGraph,
  "dp": seedDP,
  "strings": seedStrings,
  "geometry": seedGeometry,
  "number-theory": seedNumberTheory,
  "range-queries": seedRangeQueries,
  "utilities": seedUtilities,
};

const seedCategories = [
  { name: "Algebra", slug: "algebra", description: "Number theory and algebraic algorithms", icon: "Sigma", color: "#a855f7", order: 1 },
  { name: "Binary Search", slug: "binary-search", description: "Binary search and ternary search algorithms", icon: "Search", color: "#f59e0b", order: 2 },
  { name: "Bit Manipulation", slug: "bit-manipulation", description: "Bit manipulation utilities", icon: "Binary", color: "#06b6d4", order: 3 },
  { name: "Combinatorics", slug: "combinatorics", description: "Combinatorial algorithms and counting", icon: "Split", color: "#ec4899", order: 4 },
  { name: "Data Structures", slug: "data-structures", description: "Essential data structures for CP", icon: "Layers", color: "#3b82f6", order: 5 },
  { name: "Geometry", slug: "geometry", description: "Computational geometry", icon: "Triangle", color: "#22c55e", order: 6 },
  { name: "Number Theory", slug: "number-theory", description: "Number theory utilities and functions", icon: "Hash", color: "#8b5cf6", order: 7 },
  { name: "Range Queries", slug: "range-queries", description: "Static range query algorithms", icon: "BetweenHorizontalEnd", color: "#10b981", order: 8 },
  { name: "Utilities", slug: "utilities", description: "General CP utilities and helpers", icon: "Wrench", color: "#6b7280", order: 9 },
  { name: "Graph", slug: "graph", description: "Graph algorithms: shortest paths, SCC, LCA", icon: "GitBranch", color: "#ef4444", order: 10 },
  { name: "Dynamic Programming", slug: "dp", description: "Dynamic programming patterns and optimizations", icon: "Layers", color: "#f97316", order: 11 },
  { name: "Strings", slug: "strings", description: "String processing algorithms (KMP, hashing, palindromes)", icon: "Type", color: "#14b8a6", order: 12 },
];

async function seed() {
  const db = getDb()!;
  if (!db) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  if (targetSlug) {
    // Single-category update mode: seed -- only updates one category
    const [cat] = await db.select().from(categories).where(eq(categories.slug, targetSlug)).limit(1);
    if (!cat) {
      console.error(`Category "${targetSlug}" not found. Run full seed first.`);
      process.exit(1);
    }
    const seedFn = seedBySlug[targetSlug];
    if (!seedFn) {
      console.error(`No seed function for "${targetSlug}".`);
      process.exit(1);
    }
    console.log(`Updating category: ${cat.name}...`);
    await db.delete(templates).where(eq(templates.categoryId, cat.id));
    await seedFn(db, { [targetSlug]: cat.id });
    console.log(`Category "${targetSlug}" updated!`);
    return;
  }

  // Full seed mode
  console.log("Clearing existing data...");
  await db.execute(sql`TRUNCATE template_codes, templates, categories RESTART IDENTITY CASCADE`);

  console.log("Seeding categories...");
  for (const cat of seedCategories) {
    await db.insert(categories).values(cat);
  }

  const catRows = await db.select().from(categories);
  const catMap = Object.fromEntries(catRows.map((c) => [c.slug, c.id]));

  console.log("Seeding templates...");

  await seedAlgebra(db, catMap);
  await seedBinarySearch(db, catMap);
  await seedBitManip(db, catMap);
  await seedCombinatorics(db, catMap);
  await seedDataStruct(db, catMap);
  await seedGraph(db, catMap);
  await seedDP(db, catMap);
  await seedStrings(db, catMap);
  await seedGeometry(db, catMap);
  await seedNumberTheory(db, catMap);
  await seedRangeQueries(db, catMap);
  await seedUtilities(db, catMap);

  console.log("Seed complete! ");
}

seed().catch(console.error);
