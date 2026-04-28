import "dotenv/config";

import { eq, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { roomSeeds, sampleBookings } from "@/lib/data";
import { db, pool } from "@/lib/db";
import { bookings, rooms, user } from "@/lib/schema";

async function ensureUser(name: string, email: string, password: string, role: "admin" | "user") {
  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (existing) {
    if (existing.role !== role) {
      await db.update(user).set({ role }).where(eq(user.id, existing.id));
    }
    return existing;
  }

  const created = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  await db.update(user).set({ role }).where(eq(user.id, created.user.id));

  return created.user;
}

async function main() {
  await db.insert(rooms).values(roomSeeds).onConflictDoUpdate({
    target: rooms.slug,
    set: {
      name: sql`excluded.name`,
      shortName: sql`excluded.short_name`,
      capacity: sql`excluded.capacity`,
      summary: sql`excluded.summary`,
      description: sql`excluded.description`,
      floor: sql`excluded.floor`,
      hours: sql`excluded.hours`,
      notice: sql`excluded.notice`,
      responseTime: sql`excluded.response_time`,
      popularity: sql`excluded.popularity`,
      amenities: sql`excluded.amenities`,
      idealFor: sql`excluded.ideal_for`,
      theme: sql`excluded.theme`,
      glow: sql`excluded.glow`,
      accent: sql`excluded.accent`,
    },
  });

  const adminUser = await ensureUser(
    process.env.SEED_ADMIN_NAME ?? "Admin FEB",
    process.env.SEED_ADMIN_EMAIL ?? "admin@feb.local",
    process.env.SEED_ADMIN_PASSWORD ?? "Password123!",
    "admin",
  );

  const memberUser = await ensureUser("Pengguna FEB", "user@feb.local", "Password123!", "user");

  const roomMap = new Map((await db.select().from(rooms)).map((room) => [room.slug, room.id]));

  await db
    .insert(bookings)
    .values(
      sampleBookings.map((booking) => ({
        bookingCode: booking.bookingCode,
        roomId: roomMap.get(booking.roomSlug)!,
        userId: booking.status === "approved" ? adminUser.id : memberUser.id,
        borrowerName: booking.borrower,
        borrowerEmail: booking.email,
        organization: booking.organization,
        purpose: booking.purpose,
        attendees: booking.attendees,
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        requestLetterName: booking.requestLetterName,
        requestLetterPath: `/uploads/request-letters/${booking.requestLetterName}`,
        status: booking.status,
      })),
    )
    .onConflictDoNothing({
      target: bookings.bookingCode,
    });

  console.log("Seed selesai.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
