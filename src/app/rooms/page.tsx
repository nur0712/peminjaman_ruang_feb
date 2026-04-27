import { Filter, Sparkles } from "lucide-react";

import { RoomCard } from "@/components/room-card";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingPolicies, rooms } from "@/lib/data";

export default function RoomsPage() {
  return (
    <div className="page-shell">
      <div className="mesh" />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="fade-up grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="glass-panel">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Katalog Ruangan
              </Badge>
              <CardTitle className="font-display text-5xl">Cari ruang berdasarkan kapasitas dan suasana acara.</CardTitle>
              <CardDescription className="max-w-2xl text-base">
                Semua halaman ini bersifat frontend-only. Data ruangan, kalender, dan form sudah siap untuk nanti
                dihubungkan ke backend atau server action.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-panel">
            <CardContent className="grid h-full gap-4 p-6 sm:grid-cols-2">
              <div className="rounded-[24px] bg-background/70 p-5">
                <Filter className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Segmentasi cepat</h3>
                <p className="text-sm leading-6 text-muted-foreground">Meeting kecil dan acara besar dipisahkan dengan jelas.</p>
              </div>
              <div className="rounded-[24px] bg-background/70 p-5">
                <Sparkles className="mb-3 size-5 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Visual lebih hidup</h3>
                <p className="text-sm leading-6 text-muted-foreground">Setiap ruang punya identitas warna agar tidak terasa generik.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="fade-up stagger-1 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.slug} room={room} />
            ))}
          </div>

          <Card className="glass-panel h-fit">
            <CardHeader>
              <CardTitle className="font-display text-3xl">Aturan Peminjaman</CardTitle>
              <CardDescription>Rule ini diambil dari PRD dan ditampilkan sebagai referensi pengguna sebelum mengajukan booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookingPolicies.map((policy) => (
                <div key={policy} className="rounded-[22px] bg-background/70 px-4 py-4 text-sm leading-6 text-muted-foreground">
                  {policy}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
