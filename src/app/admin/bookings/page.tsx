import { AdminBookingsClient } from "@/components/admin-bookings-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBookingsPage() {
  return (
    <>
      <section className="fade-up">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="font-display text-4xl">Manajemen Peminjaman</CardTitle>
            <CardDescription>
              Tabel approval ini menggunakan Better Auth client untuk akses admin dan memuat data lewat API.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Aksi approve dan reject tetap dilakukan ke API admin dan akan refresh data tabel setelah status berubah.
          </CardContent>
        </Card>
      </section>

      <section className="fade-up stagger-1">
        <AdminBookingsClient />
      </section>
    </>
  );
}
