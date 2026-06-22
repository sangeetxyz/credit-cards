import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

const globalForDb = globalThis as typeof globalThis & {
  sql?: ReturnType<typeof postgres>;
  db?: ReturnType<typeof drizzle<typeof schema>>;
  dbUrl?: string;
};

function createClient(url: string) {
  return postgres(url, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

export function getDb() {
  const url = getDatabaseUrl();

  if (globalForDb.db && globalForDb.dbUrl !== url) {
    globalForDb.sql?.end({ timeout: 0 }).catch(() => {});
    globalForDb.sql = undefined;
    globalForDb.db = undefined;
    globalForDb.dbUrl = undefined;
  }

  if (!globalForDb.db) {
    globalForDb.dbUrl = url;
    globalForDb.sql = createClient(url);
    globalForDb.db = drizzle(globalForDb.sql, { schema });
  }

  return globalForDb.db;
}

export function formatDbError(error: unknown): string {
  if (error instanceof Error && error.cause instanceof Error) {
    return error.cause.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Database error";
}

export { schema };
