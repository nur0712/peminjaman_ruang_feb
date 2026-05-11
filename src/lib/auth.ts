import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { db } from "@/lib/db";
import { getBetterAuthSecret, getBetterAuthUrl } from "@/lib/env";
import { schema } from "@/lib/schema";

export const auth = betterAuth({
  appName: "Peminjaman Ruang Program Studi Bisnis Digital",
  secret: getBetterAuthSecret(),
  baseURL: getBetterAuthUrl(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    admin(),
  ],
});
