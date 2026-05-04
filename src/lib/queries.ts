import { and, asc, count, desc, eq, gte, lte, ne, sql } from "drizzle-orm";

import { db, pool } from "@/lib/db";
import { roomSeeds, sampleBookings } from "@/lib/data";
import { BookingRecord, CalendarDay, Room } from "@/lib/types";
import { bookings, rooms, user } from "@/lib/schema";

const slotTemplates: Record<string, Array<{ start: string; end: string }>> = {
  "feb-meeting-room": [
    { start: "08:00", end: "10:00" },
    { start: "10:30", end: "12:00" },
    { start: "13:00", end: "15:00" },
    { start: "15:30", end: "17:00" },
  ],
  "seminar-room": [
    { start: "07:00", end: "10:00" },
    { start: "10:30", end: "13:00" },
    { start: "13:30", end: "16:30" },
    { start: "17:00", end: "20:00" },
  ],
};

type BookingRow = typeof bookings.$inferSelect;
type CalendarBookingLike = Pick<BookingRow, "startTime" | "endTime" | "purpose" | "status">;
type DisplayRoomSource = Omit<Room, "utilization" | "calendar">;

const DATABASE_CHECK_TTL_MS = 30_000;

const databaseState = {
  checkedAt: 0,
  isReady: true,
  warningCacheKey: "",
};

function startOfDay(date = new Date()) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date = new Date()) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function formatDateOnly(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function toDateTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

function normalizeBooking(record: {
  bookingId: string;
  bookingCode: string;
  roomSlug: string;
  roomName: string;
  borrowerName: string;
  borrowerEmail: string;
  organization: string;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  attendees: number;
  requestLetterName: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
}): BookingRecord {
  return {
    id: record.bookingId,
    bookingCode: record.bookingCode,
    roomSlug: record.roomSlug,
    roomName: record.roomName,
    borrower: record.borrowerName,
    email: record.borrowerEmail,
    organization: record.organization,
    agenda: record.purpose,
    status: record.status,
    date: formatDateOnly(record.startTime),
    time: `${formatTime(record.startTime)} - ${formatTime(record.endTime)}`,
    attendees: record.attendees,
    requestLetterName: record.requestLetterName,
    submittedAt: record.createdAt.toISOString(),
  };
}

function buildCalendar(room: Pick<DisplayRoomSource, "slug">, roomBookings: CalendarBookingLike[]): CalendarDay[] {
  const baseDate = startOfDay(new Date());
  const templates = slotTemplates[room.slug] ?? [];

  return Array.from({ length: 4 }, (_, index) => {
    const date = addDays(baseDate, index);
    const formattedDate = formatDateOnly(date);
    const activeBookings = roomBookings.filter((booking) => formatDateOnly(booking.startTime) === formattedDate);

    const slots = templates.map((template) => {
      const slotStart = toDateTime(date, template.start);
      const slotEnd = toDateTime(date, template.end);
      const match = activeBookings.find(
        (booking) => booking.startTime < slotEnd && booking.endTime > slotStart && booking.status !== "rejected",
      );

      return {
        time: `${template.start.replace(":", ".")} - ${template.end.replace(":", ".")}`,
        label: match ? match.purpose : "Kosong",
        status: match ? match.status : "available",
      } as const;
    });

    const reservedCount = slots.filter((slot) => slot.status !== "available").length;
    const totalSlots = slots.length || 1;
    const status =
      reservedCount === 0 ? "available" : reservedCount >= totalSlots - 1 ? "booked" : "limited";

    return {
      date: formattedDate,
      day: dayLabel(date),
      occupancy: `${reservedCount} dari ${totalSlots} slot terpakai`,
      status,
      slots,
    };
  });
}

function mapRoom(room: DisplayRoomSource, roomBookings: CalendarBookingLike[], utilization: string): Room {
  return {
    id: room.id,
    slug: room.slug,
    name: room.name,
    shortName: room.shortName,
    capacity: room.capacity,
    summary: room.summary,
    description: room.description,
    floor: room.floor,
    hours: room.hours,
    notice: room.notice,
    responseTime: room.responseTime,
    utilization,
    popularity: room.popularity,
    amenities: room.amenities,
    idealFor: room.idealFor,
    theme: room.theme,
    glow: room.glow,
    accent: room.accent,
    calendar: buildCalendar(room, roomBookings),
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message || error.name;
  }

  if (typeof error === "object" && error && "code" in error) {
    return String(error.code);
  }

  return "Unknown database error";
}

function logDatabaseWarning(scope: string, reason: string) {
  const cacheKey = `${scope}:${reason}`;

  if (databaseState.warningCacheKey === cacheKey) {
    return;
  }

  databaseState.warningCacheKey = cacheKey;
  console.warn(`[queries:${scope}] Using fallback data because ${reason}.`);
}

function logQueryFailure(scope: string, error: unknown) {
  logDatabaseWarning(scope, getErrorMessage(error));
}

async function isDatabaseReady(scope: string) {
  const now = Date.now();

  if (now - databaseState.checkedAt < DATABASE_CHECK_TTL_MS) {
    return databaseState.isReady;
  }

  try {
    const result = await pool.query<{
      rooms_table: string | null;
      bookings_table: string | null;
      user_table: string | null;
    }>(
      `
        select
          to_regclass('public.rooms') as rooms_table,
          to_regclass('public.bookings') as bookings_table,
          to_regclass('public."user"') as user_table
      `,
    );

    const row = result.rows[0];
    const missingTables = [
      row?.rooms_table ? null : "rooms",
      row?.bookings_table ? null : "bookings",
      row?.user_table ? null : "user",
    ].filter(Boolean);

    databaseState.checkedAt = now;
    databaseState.isReady = missingTables.length === 0;

    if (!databaseState.isReady) {
      logDatabaseWarning(scope, `required tables are missing (${missingTables.join(", ")})`);
    }

    return databaseState.isReady;
  } catch (error) {
    databaseState.checkedAt = now;
    databaseState.isReady = false;
    logDatabaseWarning(scope, getErrorMessage(error));
    return false;
  }
}

async function withFallback<T>(scope: string, task: () => Promise<T>, fallback: () => T): Promise<T> {
  const ready = await isDatabaseReady(scope);

  if (!ready) {
    return fallback();
  }

  try {
    return await task();
  } catch (error) {
    databaseState.checkedAt = 0;
    databaseState.isReady = false;
    logQueryFailure(scope, error);
    return fallback();
  }
}

function getFallbackDisplayRooms(): DisplayRoomSource[] {
  return roomSeeds.map((room, index) => ({
    id: index + 1,
    ...room,
  }));
}

function getFallbackCalendarBookings(roomSlug?: string): Array<CalendarBookingLike & { roomSlug: string }> {
  return sampleBookings
    .filter((booking) => (roomSlug ? booking.roomSlug === roomSlug : true))
    .map((booking) => ({
      roomSlug: booking.roomSlug,
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
      purpose: booking.purpose,
      status: booking.status,
    }));
}

function getFallbackBookingRecords(roomSlug?: string): BookingRecord[] {
  const roomNameBySlug = new Map(roomSeeds.map((room) => [room.slug, room.name]));

  return sampleBookings
    .filter((booking) => (roomSlug ? booking.roomSlug === roomSlug : true))
    .sort((left, right) => new Date(right.startTime).getTime() - new Date(left.startTime).getTime())
    .map((booking, index) =>
      normalizeBooking({
        bookingId: `fallback-${index}-${booking.bookingCode}`,
        bookingCode: booking.bookingCode,
        roomSlug: booking.roomSlug,
        roomName: roomNameBySlug.get(booking.roomSlug) ?? booking.roomSlug,
        borrowerName: booking.borrower,
        borrowerEmail: booking.email,
        organization: booking.organization,
        purpose: booking.purpose,
        status: booking.status,
        attendees: booking.attendees,
        requestLetterName: booking.requestLetterName,
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        createdAt: new Date(booking.startTime),
      }),
    );
}

async function getUpcomingBookings() {
  const today = startOfDay(new Date());
  const fourDaysAhead = endOfDay(addDays(today, 3));

  return db
    .select()
    .from(bookings)
    .where(and(gte(bookings.startTime, today), lte(bookings.startTime, fourDaysAhead)))
    .orderBy(asc(bookings.startTime));
}

export async function getRoomsForDisplay() {
  return withFallback(
    "getRoomsForDisplay",
    async () => {
      const [roomRows, upcomingBookings] = await Promise.all([
        db.select().from(rooms).orderBy(asc(rooms.id)),
        getUpcomingBookings(),
      ]);

      return roomRows.map((room) => {
        const roomBookings = upcomingBookings.filter((booking) => booking.roomId === room.id);
        const utilizationPercent = Math.min(100, roomBookings.length * 17 + 35);

        return mapRoom(room, roomBookings, `${utilizationPercent}% terisi`);
      });
    },
    () =>
      getFallbackDisplayRooms().map((room) => {
        const roomBookings = getFallbackCalendarBookings(room.slug);
        const utilizationPercent = Math.min(100, roomBookings.length * 17 + 35);

        return mapRoom(room, roomBookings, `${utilizationPercent}% terisi`);
      }),
  );
}

export async function getRoomForDisplay(slug: string) {
  return withFallback(
    `getRoomForDisplay:${slug}`,
    async () => {
      const roomRow = await db.query.rooms.findFirst({
        where: eq(rooms.slug, slug),
      });

      if (!roomRow) {
        return null;
      }

      const roomBookings = await db
        .select()
        .from(bookings)
        .where(eq(bookings.roomId, roomRow.id))
        .orderBy(desc(bookings.startTime));

      const utilizationPercent = Math.min(100, roomBookings.length * 17 + 35);

      return mapRoom(roomRow, roomBookings, `${utilizationPercent}% terisi`);
    },
    () => {
      const room = getFallbackDisplayRooms().find((item) => item.slug === slug);

      if (!room) {
        return null;
      }

      const roomBookings = getFallbackCalendarBookings(room.slug);
      const utilizationPercent = Math.min(100, roomBookings.length * 17 + 35);
      return mapRoom(room, roomBookings, `${utilizationPercent}% terisi`);
    },
  );
}

export async function getRoomBookingsForDisplay(slug: string) {
  return withFallback(
    `getRoomBookingsForDisplay:${slug}`,
    async () => {
      const rows = await db
        .select({
          bookingId: bookings.id,
          bookingCode: bookings.bookingCode,
          roomSlug: rooms.slug,
          roomName: rooms.name,
          borrowerName: bookings.borrowerName,
          borrowerEmail: bookings.borrowerEmail,
          organization: bookings.organization,
          purpose: bookings.purpose,
          status: bookings.status,
          attendees: bookings.attendees,
          requestLetterName: bookings.requestLetterName,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          createdAt: bookings.createdAt,
        })
        .from(bookings)
        .innerJoin(rooms, eq(bookings.roomId, rooms.id))
        .where(eq(rooms.slug, slug))
        .orderBy(desc(bookings.startTime))
        .limit(4);

      return rows.map(normalizeBooking);
    },
    () => getFallbackBookingRecords(slug).slice(0, 4),
  );
}

export async function getMyBookings(userId: string) {
  return withFallback(
    `getMyBookings:${userId}`,
    async () => {
      const rows = await db
        .select({
          bookingId: bookings.id,
          bookingCode: bookings.bookingCode,
          roomSlug: rooms.slug,
          roomName: rooms.name,
          borrowerName: bookings.borrowerName,
          borrowerEmail: bookings.borrowerEmail,
          organization: bookings.organization,
          purpose: bookings.purpose,
          status: bookings.status,
          attendees: bookings.attendees,
          requestLetterName: bookings.requestLetterName,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          createdAt: bookings.createdAt,
        })
        .from(bookings)
        .innerJoin(rooms, eq(bookings.roomId, rooms.id))
        .where(eq(bookings.userId, userId))
        .orderBy(desc(bookings.createdAt));

      return rows.map(normalizeBooking);
    },
    () => [],
  );
}

export async function getAdminBookings() {
  return withFallback(
    "getAdminBookings",
    async () => {
      const rows = await db
        .select({
          bookingId: bookings.id,
          bookingCode: bookings.bookingCode,
          roomSlug: rooms.slug,
          roomName: rooms.name,
          borrowerName: bookings.borrowerName,
          borrowerEmail: bookings.borrowerEmail,
          organization: bookings.organization,
          purpose: bookings.purpose,
          status: bookings.status,
          attendees: bookings.attendees,
          requestLetterName: bookings.requestLetterName,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          createdAt: bookings.createdAt,
        })
        .from(bookings)
        .innerJoin(rooms, eq(bookings.roomId, rooms.id))
        .orderBy(desc(bookings.createdAt));

      return rows.map(normalizeBooking);
    },
    () => getFallbackBookingRecords(),
  );
}

export async function getDashboardMetrics() {
  return withFallback(
    "getDashboardMetrics",
    async () => {
      const today = startOfDay(new Date());
      const tomorrow = addDays(today, 1);
      const weekEnd = addDays(today, 7);

      const [totalToday, pendingTotal, totalWeekBookings, roomTotal] = await Promise.all([
        db.select({ value: count() }).from(bookings).where(and(gte(bookings.createdAt, today), lte(bookings.createdAt, tomorrow))),
        db.select({ value: count() }).from(bookings).where(eq(bookings.status, "pending")),
        db.select({ value: count() }).from(bookings).where(and(gte(bookings.startTime, today), lte(bookings.startTime, weekEnd), ne(bookings.status, "rejected"))),
        db.select({ value: count() }).from(rooms),
      ]);

      const totalRooms = roomTotal[0]?.value ?? 1;
      const weeklyBookings = totalWeekBookings[0]?.value ?? 0;
      const utilization = Math.min(100, Math.round((weeklyBookings / (totalRooms * 8)) * 100));

      return [
        { label: "Permintaan hari ini", value: String(totalToday[0]?.value ?? 0), detail: "Booking baru yang masuk hari ini" },
        { label: "Menunggu approval", value: String(pendingTotal[0]?.value ?? 0), detail: "Perlu ditinjau admin" },
        { label: "Okupansi minggu ini", value: `${utilization}%`, detail: "Rasio booking aktif 7 hari ke depan" },
        { label: "Jumlah ruang aktif", value: String(totalRooms), detail: "Ruang yang bisa dipesan saat ini" },
      ];
    },
    () => {
      const today = startOfDay(new Date());
      const tomorrow = addDays(today, 1);
      const weekEnd = addDays(today, 7);
      const fallbackRows = sampleBookings.map((booking) => ({
        ...booking,
        startTime: new Date(booking.startTime),
      }));

      const totalToday = fallbackRows.filter((booking) => booking.startTime >= today && booking.startTime <= tomorrow).length;
      const pendingTotal = fallbackRows.filter((booking) => booking.status === "pending").length;
      const totalWeekBookings = fallbackRows.filter(
        (booking) => booking.startTime >= today && booking.startTime <= weekEnd && booking.status !== "rejected",
      ).length;
      const totalRooms = roomSeeds.length || 1;
      const utilization = Math.min(100, Math.round((totalWeekBookings / (totalRooms * 8)) * 100));

      return [
        { label: "Permintaan hari ini", value: String(totalToday), detail: "Booking baru yang masuk hari ini" },
        { label: "Menunggu approval", value: String(pendingTotal), detail: "Perlu ditinjau admin" },
        { label: "Okupansi minggu ini", value: `${utilization}%`, detail: "Rasio booking aktif 7 hari ke depan" },
        { label: "Jumlah ruang aktif", value: String(totalRooms), detail: "Ruang yang bisa dipesan saat ini" },
      ];
    },
  );
}

export async function getDashboardPendingBookings() {
  const rows = await getAdminBookings();
  return rows.filter((booking) => booking.status === "pending").slice(0, 5);
}

export async function getRoomBySlugForApi(slug: string) {
  return withFallback(
    `getRoomBySlugForApi:${slug}`,
    async () =>
      db.query.rooms.findFirst({
        where: eq(rooms.slug, slug),
      }),
    () => null,
  );
}

export async function findRoomConflict(roomId: number, startTime: Date, endTime: Date) {
  return withFallback(
    `findRoomConflict:${roomId}`,
    async () =>
      db.query.bookings.findFirst({
        where: and(
          eq(bookings.roomId, roomId),
          ne(bookings.status, "rejected"),
          sql`${bookings.startTime} < ${endTime} and ${bookings.endTime} > ${startTime}`,
        ),
      }),
    () => null,
  );
}

export async function getUserByEmail(email: string) {
  return withFallback(
    `getUserByEmail:${email}`,
    async () =>
      db.query.user.findFirst({
        where: eq(user.email, email),
      }),
    () => null,
  );
}
