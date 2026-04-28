import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, ShieldCheck, Sparkles, Users } from "lucide-react";

import { RoomCard } from "@/components/room-card";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoomsForDisplay } from "@/lib/queries";

const steps = [
  {
    title: "Pilih ruang",
    description: "Bandingkan kapasitas, fasilitas, dan ketersediaan sebelum memilih slot terbaik.",
  },
  {
    title: "Ajukan booking",
    description: "Masuk dengan akun Anda, isi jadwal, upload surat pengajuan, lalu kirim melalui API booking.",
  },
  {
    title: "Tunggu approval",
    description: "Admin meninjau kebutuhan ruangan dan memberi status approved atau rejected.",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const rooms = await getRoomsForDisplay();

  return (
    <div className="page-shell">
      <div className="mesh" />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="fade-up overflow-hidden rounded-[36px] border border-border/60 glass-panel px-6 py-8 shadow-[0_24px_90px_-50px_rgba(22,30,46,0.55)] sm:px-8 lg:px-12 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <StatusBadge status="available" />
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Sistem Peminjaman Ruang Gedung FEB
                </p>
                <h1 className="font-display max-w-3xl text-5xl leading-tight text-foreground sm:text-6xl">
                  Booking ruang kampus tanpa drama bentrok jadwal.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Sekarang alurnya sudah didukung PostgreSQL, Drizzle ORM, Route Handlers, dan Better Auth untuk
                  autentikasi pengguna serta proteksi dashboard admin.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/rooms">
                    Cek Ketersediaan
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/admin">Masuk Dashboard Admin</Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Users className="size-4" />
                    2 ruang utama
                  </div>
                  <p className="text-sm text-muted-foreground">Meeting Room dan Seminar Room siap dipinjam.</p>
                </div>
                <div className="rounded-[24px] bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <CalendarDays className="size-4" />
                    Kalender live
                  </div>
                  <p className="text-sm text-muted-foreground">Status harian diambil dari booking yang tersimpan di database.</p>
                </div>
                <div className="rounded-[24px] bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="size-4" />
                    Approval terproteksi
                  </div>
                  <p className="text-sm text-muted-foreground">Admin view bisa dibatasi berdasarkan sesi dan role pengguna.</p>
                </div>
              </div>
            </div>

            <Card className="overflow-hidden border-none bg-transparent shadow-none">
              <CardContent className="p-0">
                <div className="rounded-[32px] bg-[#1d293d] p-6 text-white">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/60">Ringkasan Hari Ini</p>
                      <h2 className="font-display text-3xl">Operasional Ruang</h2>
                    </div>
                    <Sparkles className="size-6 text-[#ffcf99]" />
                  </div>
                  <div className="space-y-4">
                    {rooms.map((room) => (
                      <div key={room.slug} className="rounded-[24px] bg-white/8 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{room.shortName}</p>
                            <p className="text-sm text-white/65">{room.calendar[0]?.occupancy}</p>
                          </div>
                          <StatusBadge status={room.calendar[0]?.status ?? "available"} />
                        </div>
                        <div className="space-y-2">
                          {room.calendar[0]?.slots.slice(0, 2).map((slot) => (
                            <div key={slot.time} className="flex items-center justify-between rounded-2xl bg-white/8 px-3 py-2 text-sm">
                              <span>{slot.time}</span>
                              <span className="text-white/70">{slot.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="fade-up stagger-1 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Daftar Ruangan</p>
              <h2 className="font-display text-4xl">Pilih ruang sesuai skala kegiatan</h2>
            </div>
            <Button asChild variant="ghost">
              <Link href="/rooms">
                Lihat semua ruang
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            {rooms.map((room) => (
              <RoomCard key={room.slug} room={room} />
            ))}
          </div>
        </section>

        <section className="fade-up stagger-2 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="font-display text-3xl">Alur Pengajuan</CardTitle>
              <CardDescription>
                Dirancang ringkas supaya peminjam bisa langsung paham tanpa perlu briefing tambahan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-[24px] bg-background/70 p-5">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="font-display text-3xl">Kenapa stack backend ini kuat?</CardTitle>
              <CardDescription>
                Fokusnya bukan sekadar API hidup, tapi alur booking yang aman, typed, dan mudah dikembangkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-background/70 p-5">
                <Clock3 className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Query typed penuh</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Drizzle menjaga schema, query, dan hasil fetch tetap satu bahasa dengan TypeScript.
                </p>
              </div>
              <div className="rounded-[24px] bg-background/70 p-5">
                <CalendarDays className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Route handler eksplisit</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Endpoint rooms, bookings, dan status admin bisa dipakai UI maupun integrasi eksternal.
                </p>
              </div>
              <div className="rounded-[24px] bg-background/70 p-5">
                <ShieldCheck className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Sesi lebih aman</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Better Auth menangani akun, sesi, login email-password, dan role admin dalam satu fondasi.
                </p>
              </div>
              <div className="rounded-[24px] bg-background/70 p-5">
                <Users className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Siap untuk tim kampus</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Riwayat peminjam dan approval admin sekarang bisa terhubung ke akun masing-masing pengguna.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
