function getEnv(name: string) {
  return process.env[name];
}

export function getDatabaseUrl() {
  return getEnv("DATABASE_URL") ?? "";
}

export function getAppUrl() {
  return getEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
}

export function getBetterAuthUrl() {
  return getEnv("BETTER_AUTH_URL") ?? getAppUrl();
}

export function getBetterAuthSecret() {
  return getEnv("BETTER_AUTH_SECRET") ?? "dev-only-secret-change-me-at-runtime-123456";
}
