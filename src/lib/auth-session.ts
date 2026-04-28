import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

function hasAdminRole(role: string | null | undefined) {
  return role?.split(",").includes("admin") ?? false;
}

export async function getServerSession(): Promise<Session | null> {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireUserSession() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireUserSession();

  if (!hasAdminRole(session.user.role)) {
    redirect("/");
  }

  return session;
}

export function isAdmin(role: string | null | undefined) {
  return hasAdminRole(role);
}
