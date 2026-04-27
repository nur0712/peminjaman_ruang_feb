import { Clock3, FileText, Mail, Users } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookings } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default function MyBookingsPage() {
  return (
    <div className="page-shell">
      <div className="mesh" />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="fade-up">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="font-display text-5xl">Riwayat Peminjaman</CardTitle>
              <CardDescription className="max-w-2xl text-base">
                Halaman contoh untuk menampilkan status booking user: pending, approved, dan rejected.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="fade-up stagger-1 grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => (
            <Card key={booking.id} className="glass-panel">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{booking.id}</p>
                    <CardTitle className="mt-1 text-2xl">{booking.roomName}</CardTitle>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <CardDescription>{booking.agenda}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-background/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Clock3 className="size-4" />
                      Jadwal
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.date)}<br />
                      {booking.time}
                    </p>
                  </div>
                  <div className="rounded-[20px] bg-background/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Users className="size-4" />
                      Peserta
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.attendees} orang</p>
                  </div>
                </div>
                <div className="rounded-[20px] bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Mail className="size-4" />
                    Kontak
                  </div>
                  <p className="text-sm text-muted-foreground">{booking.borrower}</p>
                  <p className="text-sm text-muted-foreground">{booking.email}</p>
                </div>
                <div className="rounded-[20px] bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <FileText className="size-4" />
                    Surat pengajuan
                  </div>
                  <p className="text-sm text-muted-foreground">{booking.requestLetterName}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
