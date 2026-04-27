import { CalendarClock, CircleAlert, Sparkles, TimerReset } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookings, dashboardMetrics, rooms } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const icons = [CircleAlert, TimerReset, CalendarClock, Sparkles];

export default function AdminDashboardPage() {
  return (
    <>
      <section className="fade-up grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric, index) => {
          const Icon = icons[index];

          return (
            <Card key={metric.label} className="glass-panel">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <p className="font-display text-4xl">{metric.value}</p>
                <p className="mt-3 text-sm text-muted-foreground">{metric.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="fade-up stagger-1 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Queue Approval</CardTitle>
            <CardDescription>Fokus utama admin adalah booking pending yang butuh keputusan cepat.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookings
              .filter((booking) => booking.status === "pending")
              .map((booking) => (
                <div key={booking.id} className="rounded-[24px] bg-background/70 p-5">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{booking.agenda}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.roomName} • {booking.attendees} peserta
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.borrower} • {formatDate(booking.date)} • {booking.time}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Okupansi Ruang</CardTitle>
            <CardDescription>Snapshot singkat supaya admin tahu ruang mana yang perlu perhatian.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rooms.map((room) => (
              <div key={room.slug} className="rounded-[24px] bg-background/70 p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{room.name}</p>
                    <p className="text-sm text-muted-foreground">{room.utilization}</p>
                  </div>
                  <StatusBadge status={room.calendar[0].status} />
                </div>
                <p className="text-sm text-muted-foreground">{room.responseTime}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
