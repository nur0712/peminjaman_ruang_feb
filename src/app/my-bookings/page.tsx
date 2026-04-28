import { MyBookingsClient } from "@/components/my-bookings-client";
import { SiteHeader } from "@/components/site-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
                Halaman ini menggunakan Better Auth client untuk sesi pengguna dan membaca data lewat API booking.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="fade-up stagger-1">
          <MyBookingsClient />
        </section>
      </main>
    </div>
  );
}
