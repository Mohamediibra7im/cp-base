import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let dbError: string | null = null;

export function getDb() {
  if (dbError) return null;
  if (!db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      dbError = "DATABASE_URL not set";
      return null;
    }
    try {
      const sql = neon(url);
      db = drizzle(sql, { schema });
    } catch (e) {
      dbError = String(e);
      return null;
    }
  }
  return db;
}

export { schema };
