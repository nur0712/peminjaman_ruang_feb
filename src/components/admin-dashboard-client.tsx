"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, CircleAlert, Sparkles, TimerReset } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Room, BookingRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useApiQuery } from "@/hooks/use-api-query";
import { ErrorState, LoadingState } from "@/components/load-state";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

type AdminDashboardResponse = {
  metrics: DashboardMetric[];
  pendingBookings: BookingRecord[];
  rooms: Room[];
};

const icons = [CircleAlert, TimerReset, CalendarClock, Sparkles];

function isAdmin(role: string | null | undefined) {
  return role?.split(",").includes("admin") ?? false;
}

export function AdminDashboardClient() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const enabled = !!session && isAdmin(session.user.role);
  const { data, error, isLoading } = useApiQuery<AdminDashboardResponse>("/api/admin/dashboard", {
    enabled,
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, router, session]);

  if (isPending) {
    return <LoadingState title="Memeriksa akses admin..." description="Menyiapkan dashboard admin." />;
  }

  if (!session) {
    return <ErrorState title="Akses ditolak." description="Silakan masuk dengan akun admin." />;
  }

  if (!isAdmin(session.user.role)) {
    return <ErrorState title="Bukan akun admin." description="Halaman ini hanya tersedia untuk admin Program Studi Bisnis Digital." />;
  }

  if (isLoading) {
    return <LoadingState title="Memuat dashboard..." description="Mengambil metrik dan queue booking dari API admin." />;
  }

  if (error || !data) {
    return <ErrorState title="Dashboard gagal dimuat." description={error ?? "Silakan coba lagi."} />;
  }

  return (
    <>
      <section className="fade-up grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => {
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
            {data.pendingBookings.map((booking) => (
              <div key={booking.id} className="rounded-[24px] bg-background/70 p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{booking.agenda}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.roomName} | {booking.attendees} peserta
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {booking.borrower} | {formatDate(booking.date)} | {booking.time}
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
            {data.rooms.map((room) => (
              <div key={room.slug} className="rounded-[24px] bg-background/70 p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{room.name}</p>
                    <p className="text-sm text-muted-foreground">{room.utilization}</p>
                  </div>
                  <StatusBadge status={room.calendar[0]?.status ?? "available"} />
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
