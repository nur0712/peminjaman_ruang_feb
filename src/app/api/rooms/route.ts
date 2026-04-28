import { NextResponse } from "next/server";

import { getRoomsForDisplay } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const rooms = await getRoomsForDisplay();
  return NextResponse.json({ rooms });
}
