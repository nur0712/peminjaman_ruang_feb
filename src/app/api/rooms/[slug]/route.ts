import { NextResponse } from "next/server";

import { getRoomBookingsForDisplay, getRoomForDisplay } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext<"/api/rooms/[slug]">) {
  const { slug } = await context.params;
  const room = await getRoomForDisplay(slug);

  if (!room) {
    return NextResponse.json({ message: "Ruang tidak ditemukan." }, { status: 404 });
  }

  const recentBookings = await getRoomBookingsForDisplay(slug);

  return NextResponse.json({
    room,
    recentBookings,
  });
}
