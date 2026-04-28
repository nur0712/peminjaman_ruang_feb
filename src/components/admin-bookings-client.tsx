"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { BookingRecord } from "@/lib/types";
import { useApiQuery } from "@/hooks/use-api-query";
import { AdminBookingTable } from "@/components/admin-booking-table";
import { ErrorState, LoadingState } from "@/components/load-state";
import { Card, CardContent } from "@/components/ui/card";

type BookingsResponse = {
  bookings: BookingRecord[];
};

function isAdmin(role: string | null | undefined) {
  return role?.split(",").includes("admin") ?? false;
}

export function AdminBookingsClient() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const enabled = !!session && isAdmin(session.user.role);
  const { data, error, isLoading } = useApiQuery<BookingsResponse>("/api/admin/bookings", {
    enabled,
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, router, session]);

  if (isPending) {
    return <LoadingState title="Memeriksa akses admin..." description="Memuat sesi pengguna saat ini." />;
  }

  if (!session) {
    return <ErrorState title="Akses ditolak." description="Silakan masuk dengan akun admin." />;
  }

  if (!isAdmin(session.user.role)) {
    return <ErrorState title="Bukan akun admin." description="Halaman ini hanya tersedia untuk admin FEB." />;
  }

  if (isLoading) {
    return <LoadingState title="Memuat daftar booking..." description="Mengambil queue peminjaman dari API admin." />;
  }

  if (error || !data) {
    return <ErrorState title="Data booking admin gagal dimuat." description={error ?? "Silakan coba lagi."} />;
  }

  return (
    <Card className="glass-panel">
      <CardContent className="p-6">
        <AdminBookingTable bookings={data.bookings} />
      </CardContent>
    </Card>
  );
}
