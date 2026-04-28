import { NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { bookingStatusUpdateSchema } from "@/lib/validators";

export const runtime = "nodejs";

function isAdmin(role: string | null | undefined) {
  return role?.split(",").includes("admin") ?? false;
}

export async function PATCH(request: Request, context: RouteContext<"/api/admin/bookings/[id]/status">) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 });
  }

  const payload = bookingStatusUpdateSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ message: "Payload status tidak valid." }, { status: 400 });
  }

  const { id } = await context.params;

  const [updated] = await db
    .update(bookings)
    .set({
      status: payload.data.status,
      statusNote: payload.data.statusNote,
      reviewedByUserId: session.user.id,
      reviewedAt: new Date(),
    })
    .where(and(eq(bookings.id, id)))
    .returning({
      id: bookings.id,
      status: bookings.status,
    });

  if (!updated) {
    return NextResponse.json({ message: "Booking tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Status booking diperbarui.",
    booking: updated,
  });
}
