import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../schema";

export type Db = ReturnType<typeof drizzle<typeof schema>>;
export type CatMap = Record<string, number>;

/** Remove main() test code, keep only the template implementation */
export function stripMain(src: string): string {
  const mainIdx = src.indexOf("int main()");
  if (mainIdx === -1) return src;
  return src.substring(0, mainIdx).trimEnd();
}
