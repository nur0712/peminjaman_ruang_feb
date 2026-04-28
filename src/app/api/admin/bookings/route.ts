import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getAdminBookings } from "@/lib/queries";

export const dynamic = "force-dynamic";

function isAdmin(role: string | null | undefined) {
  return role?.split(",").includes("admin") ?? false;
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 });
  }

  const data = await getAdminBookings();
  return NextResponse.json({ bookings: data });
}
