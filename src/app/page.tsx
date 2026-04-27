import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, ShieldCheck, Sparkles, Users } from "lucide-react";

import { RoomCard } from "@/components/room-card";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { rooms } from "@/lib/data";

const steps = [
  {
    title: "Pilih ruang",
    description: "Bandingkan kapasitas, fasilitas, dan ketersediaan sebelum memilih slot terbaik.",
  },
  {
    title: "Ajukan booking",
    description: "Isi tanggal, jam, tujuan kegiatan, dan jumlah peserta dalam satu form singkat.",
  },
  {
    title: "Tunggu approval",
    description: "Admin meninjau kebutuhan ruangan dan memberi status approved atau rejected.",
  },
];

export default function Home() {
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
                  Frontend modern untuk melihat ketersediaan, mengajukan peminjaman, dan memantau approval admin
                  dalam satu alur yang terasa rapi sejak layar pertama.
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
                    Kalender visual
                  </div>
                  <p className="text-sm text-muted-foreground">Status harian mudah dibaca dengan warna dan slot waktu.</p>
                </div>
                <div className="rounded-[24px] bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="size-4" />
                    Approval terpusat
                  </div>
                  <p className="text-sm text-muted-foreground">Admin bisa fokus ke queue persetujuan dan okupansi.</p>
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
                            <p className="text-sm text-white/65">{room.calendar[0].occupancy}</p>
                          </div>
                          <StatusBadge status={room.calendar[0].status} />
                        </div>
                        <div className="space-y-2">
                          {room.calendar[0].slots.slice(0, 2).map((slot) => (
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
              <CardTitle className="font-display text-3xl">Kenapa tampilan ini enak dipakai?</CardTitle>
              <CardDescription>
                Fokus UI ada pada keputusan cepat: ruang mana, kapan tersedia, dan apa status pengajuannya.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-background/70 p-5">
                <Clock3 className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Arah visual jelas</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Kontras warna membedakan info penting, detail administratif, dan aksi utama.
                </p>
              </div>
              <div className="rounded-[24px] bg-background/70 p-5">
                <CalendarDays className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Kalender lebih terbaca</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Status available, limited, dan booked terlihat dalam sekali sapuan mata.
                </p>
              </div>
              <div className="rounded-[24px] bg-background/70 p-5">
                <ShieldCheck className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Admin cepat menindak</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Queue approval disusun agar tindak lanjut approval atau reject terasa langsung.
                </p>
              </div>
              <div className="rounded-[24px] bg-background/70 p-5">
                <Users className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Cocok untuk berbagai role</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Mahasiswa, dosen, dan staf tetap nyaman karena alur tidak bergantung jargon teknis.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
