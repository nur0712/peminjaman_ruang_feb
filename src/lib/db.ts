import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { getDatabaseUrl } from "@/lib/env";
import { schema } from "@/lib/schema";

declare global {
  var __febRoomBookingPool: Pool | undefined;
}

function createPool() {
  const connectionString = getDatabaseUrl();

  return new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false },
  });
}

export const pool = globalThis.__febRoomBookingPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__febRoomBookingPool = pool;
}

export const db = drizzle({ client: pool, schema });
