import { AdminBookingTable } from "@/components/admin-booking-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookings } from "@/lib/data";

export default function AdminBookingsPage() {
  return (
    <>
      <section className="fade-up">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="font-display text-4xl">Manajemen Peminjaman</CardTitle>
            <CardDescription>
              Tabel approval frontend-only dengan aksi visual untuk approve dan reject.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Total booking</p>
              <p className="font-display text-4xl">{bookings.length}</p>
            </div>
            <div className="rounded-[22px] bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="font-display text-4xl">{bookings.filter((item) => item.status === "pending").length}</p>
            </div>
            <div className="rounded-[22px] bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="font-display text-4xl">{bookings.filter((item) => item.status === "approved").length}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="fade-up stagger-1">
        <Card className="glass-panel">
          <CardContent className="p-6">
            <AdminBookingTable bookings={bookings} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
