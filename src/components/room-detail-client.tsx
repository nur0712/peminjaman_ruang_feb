"use client";

import { Clock3, MapPin, Users } from "lucide-react";

import { BookingForm } from "@/components/booking-form";
import { CalendarView } from "@/components/calendar-view";
import { ErrorState, LoadingState } from "@/components/load-state";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingPolicies } from "@/lib/data";
import { BookingRecord, Room } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useApiQuery } from "@/hooks/use-api-query";

type RoomDetailResponse = {
  room: Room;
  recentBookings: BookingRecord[];
};

type RoomDetailClientProps = {
  slug: string;
};

export function RoomDetailClient({ slug }: RoomDetailClientProps) {
  const { data, error, isLoading } = useApiQuery<RoomDetailResponse>(`/api/rooms/${slug}`);

  if (isLoading) {
    return <LoadingState title="Memuat detail ruang..." description="Menyiapkan jadwal, info ruang, dan booking terbaru." />;
  }

  if (error || !data) {
    return <ErrorState title="Ruang tidak dapat dimuat." description={error ?? "Silakan cek ulang tautan ruangan."} />;
  }

  const { room, recentBookings } = data;

  return (
    <>
      <section className="fade-up grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="glass-panel overflow-hidden">
          <CardContent className="p-0">
            <div className={`relative overflow-hidden rounded-[32px] bg-gradient-to-br p-8 text-white ${room.theme}`}>
              <div className={`absolute -right-10 top-10 size-40 rounded-full blur-3xl ${room.glow}`} />
              <div className="relative space-y-6">
                <StatusBadge status={room.calendar[0]?.status ?? "available"} />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70">{room.floor}</p>
                  <h1 className="font-display max-w-2xl text-5xl leading-tight">{room.name}</h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-white/88">{room.summary}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] bg-white/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Users className="size-4" />
                      Kapasitas
                    </div>
                    <p>{room.capacity} peserta</p>
                  </div>
                  <div className="rounded-[24px] bg-white/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="size-4" />
                      Lokasi
                    </div>
                    <p>{room.floor}</p>
                  </div>
                  <div className="rounded-[24px] bg-white/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Clock3 className="size-4" />
                      Jam Operasional
                    </div>
                    <p>{room.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Info Singkat</CardTitle>
            <CardDescription>{room.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-3 text-sm font-semibold">Fasilitas</p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((item) => (
                  <span key={item} className="rounded-full bg-muted/65 px-4 py-2 text-sm text-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">Cocok untuk</p>
              <div className="space-y-2">
                {room.idealFor.map((item) => (
                  <div key={item} className="rounded-[20px] bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] bg-background/70 p-4 text-sm leading-6 text-muted-foreground">{room.notice}</div>
          </CardContent>
        </Card>
      </section>

      <section className="fade-up stagger-1 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CalendarView days={room.calendar} />

        <div className="space-y-6">
          <BookingForm roomName={room.name} roomSlug={room.slug} />

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Riwayat Terdekat</CardTitle>
              <CardDescription>Daftar booking terbaru untuk ruangan ini berdasarkan data API backend.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="rounded-[24px] bg-background/70 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{booking.agenda}</p>
                      <p className="text-sm text-muted-foreground">{booking.borrower}</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.date)} | {booking.time}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">Surat: {booking.requestLetterName}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Aturan Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookingPolicies.map((policy) => (
                <div key={policy} className="rounded-[22px] bg-background/70 px-4 py-3 text-sm leading-6 text-muted-foreground">
                  {policy}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
