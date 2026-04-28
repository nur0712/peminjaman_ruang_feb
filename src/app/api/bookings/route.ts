import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { findRoomConflict, getMyBookings, getRoomBySlugForApi } from "@/lib/queries";
import { bookings } from "@/lib/schema";
import { saveRequestLetter } from "@/lib/storage";
import { bookingPayloadSchema, validateRequestLetter } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function createBookingCode() {
  const stamp = new Intl.DateTimeFormat("en-CA", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Jakarta",
  })
    .format(new Date())
    .replaceAll("-", "");

  const suffix = Math.floor(Math.random() * 900 + 100);
  return `BK-${stamp}-${suffix}`;
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ message: "Silakan masuk untuk melihat booking Anda." }, { status: 401 });
  }

  const data = await getMyBookings(session.user.id);
  return NextResponse.json({ bookings: data });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ message: "Silakan masuk sebelum mengajukan booking." }, { status: 401 });
  }

  const formData = await request.formData();
  const payload = bookingPayloadSchema.safeParse({
    roomSlug: formData.get("roomSlug"),
    organization: formData.get("organization"),
    purpose: formData.get("purpose"),
    bookingDate: formData.get("bookingDate"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    attendees: formData.get("attendees"),
  });

  if (!payload.success) {
    return NextResponse.json(
      {
        message: payload.error.issues[0]?.message ?? "Data booking tidak valid.",
      },
      { status: 400 },
    );
  }

  const requestLetter = formData.get("requestLetter");
  const letterFile = requestLetter instanceof File ? requestLetter : null;
  const letterError = validateRequestLetter(letterFile);

  if (letterError) {
    return NextResponse.json({ message: letterError }, { status: 400 });
  }

  if (!letterFile) {
    return NextResponse.json({ message: "Surat pengajuan wajib diunggah." }, { status: 400 });
  }

  const room = await getRoomBySlugForApi(payload.data.roomSlug);
  if (!room) {
    return NextResponse.json({ message: "Ruang tidak ditemukan." }, { status: 404 });
  }

  const startTime = new Date(`${payload.data.bookingDate}T${payload.data.startTime}:00+07:00`);
  const endTime = new Date(`${payload.data.bookingDate}T${payload.data.endTime}:00+07:00`);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  if (startTime > maxDate) {
    return NextResponse.json({ message: "Pengajuan maksimal H-30 dari tanggal acara." }, { status: 400 });
  }

  const conflict = await findRoomConflict(room.id, startTime, endTime);
  if (conflict) {
    return NextResponse.json({ message: "Slot waktu bentrok dengan booking lain." }, { status: 409 });
  }

  const savedLetter = await saveRequestLetter(letterFile);
  const bookingCode = createBookingCode();

  const [createdBooking] = await db
    .insert(bookings)
    .values({
      bookingCode,
      roomId: room.id,
      userId: session.user.id,
      borrowerName: session.user.name,
      borrowerEmail: session.user.email,
      organization: payload.data.organization,
      purpose: payload.data.purpose,
      attendees: payload.data.attendees,
      startTime,
      endTime,
      requestLetterName: savedLetter.fileName,
      requestLetterPath: savedLetter.publicPath,
    })
    .returning({
      id: bookings.id,
      bookingCode: bookings.bookingCode,
      status: bookings.status,
    });

  return NextResponse.json(
    {
      message: "Pengajuan berhasil dikirim.",
      booking: createdBooking,
    },
    { status: 201 },
  );
}
