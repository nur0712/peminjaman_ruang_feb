import { PencilLine, Plus, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { rooms } from "@/lib/data";

export default function AdminRoomsPage() {
  return (
    <>
      <section className="fade-up">
        <Card className="glass-panel">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="font-display text-4xl">Manajemen Ruangan</CardTitle>
              <CardDescription>
                Tampilan CRUD-ready untuk ruangan. Tombol belum disambungkan ke backend karena scope saat ini frontend only.
              </CardDescription>
            </div>
            <Button size="lg">
              <Plus className="size-4" />
              Tambah Ruang
            </Button>
          </CardHeader>
        </Card>
      </section>

      <section className="fade-up stagger-1 grid gap-6 xl:grid-cols-2">
        {rooms.map((room) => (
          <Card key={room.slug} className="glass-panel overflow-hidden">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br p-6 text-white ${room.theme}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">{room.floor}</p>
                <h2 className="font-display mt-2 text-4xl">{room.name}</h2>
                <p className="mt-3 max-w-xl text-white/85">{room.summary}</p>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="text-2xl">{room.capacity} kapasitas</CardTitle>
              <CardDescription>{room.hours}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[22px] bg-background/70 p-4">
                <p className="mb-2 text-sm font-semibold">Fasilitas utama</p>
                <p className="text-sm leading-6 text-muted-foreground">{room.amenities.join(" • ")}</p>
              </div>
              <div className="rounded-[22px] bg-background/70 p-4">
                <p className="mb-2 text-sm font-semibold">Catatan operasional</p>
                <p className="text-sm leading-6 text-muted-foreground">{room.notice}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">
                  <PencilLine className="size-4" />
                  Edit
                </Button>
                <Button variant="outline">
                  <Settings2 className="size-4" />
                  Atur Fasilitas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
