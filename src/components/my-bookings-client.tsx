"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock3, FileText, Mail, Users } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { BookingRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useApiQuery } from "@/hooks/use-api-query";
import { ErrorState, LoadingState } from "@/components/load-state";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type BookingsResponse = {
  bookings: BookingRecord[];
};

export function MyBookingsClient() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data, error, isLoading } = useApiQuery<BookingsResponse>("/api/bookings", {
    enabled: !!session,
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, router, session]);

  if (isPending) {
    return <LoadingState title="Memeriksa sesi..." description="Menyiapkan riwayat peminjaman akun Anda." />;
  }

  if (!session) {
    return (
      <ErrorState
        title="Akun belum masuk."
        description="Silakan masuk terlebih dahulu untuk melihat riwayat peminjaman Anda."
      />
    );
  }

  if (isLoading) {
    return <LoadingState title="Memuat riwayat booking..." description="Mengambil data dari API booking pengguna." />;
  }

  if (error || !data) {
    return <ErrorState title="Riwayat booking gagal dimuat." description={error ?? "Silakan coba lagi."} />;
  }

  if (data.bookings.length === 0) {
    return (
      <Card className="glass-panel">
        <CardContent className="p-6">
          <p className="text-lg font-semibold">Belum ada booking.</p>
          <p className="mt-2 text-sm text-muted-foreground">Mulai dari halaman ruang untuk mengirim pengajuan pertama Anda.</p>
          <Button className="mt-4" onClick={() => router.push("/rooms")}>
            Buka Daftar Ruang
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {data.bookings.map((booking) => (
        <Card key={booking.id} className="glass-panel">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{booking.bookingCode}</p>
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
    </div>
  );
}
