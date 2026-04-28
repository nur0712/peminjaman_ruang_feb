import { and, asc, count, desc, eq, gte, lte, ne, sql } from "drizzle-orm";

import { db } from "@/lib/db";
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
type RoomRow = typeof rooms.$inferSelect;

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

function buildCalendar(room: RoomRow, roomBookings: BookingRow[]): CalendarDay[] {
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

function mapRoom(room: RoomRow, roomBookings: BookingRow[], utilization: string): Room {
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
  const [roomRows, upcomingBookings] = await Promise.all([
    db.select().from(rooms).orderBy(asc(rooms.id)),
    getUpcomingBookings(),
  ]);

  return roomRows.map((room) => {
    const roomBookings = upcomingBookings.filter((booking) => booking.roomId === room.id);
    const utilizationPercent = Math.min(100, roomBookings.length * 17 + 35);

    return mapRoom(room, roomBookings, `${utilizationPercent}% terisi`);
  });
}

export async function getRoomForDisplay(slug: string) {
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
}

export async function getRoomBookingsForDisplay(slug: string) {
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
}

export async function getMyBookings(userId: string) {
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
}

export async function getAdminBookings() {
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
}

export async function getDashboardMetrics() {
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
}

export async function getDashboardPendingBookings() {
  const rows = await getAdminBookings();
  return rows.filter((booking) => booking.status === "pending").slice(0, 5);
}

export async function getRoomBySlugForApi(slug: string) {
  return db.query.rooms.findFirst({
    where: eq(rooms.slug, slug),
  });
}

export async function findRoomConflict(roomId: number, startTime: Date, endTime: Date) {
  return db.query.bookings.findFirst({
    where: and(
      eq(bookings.roomId, roomId),
      ne(bookings.status, "rejected"),
      sql`${bookings.startTime} < ${endTime} and ${bookings.endTime} > ${startTime}`,
    ),
  });
}

export async function getUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: eq(user.email, email),
  });
}
