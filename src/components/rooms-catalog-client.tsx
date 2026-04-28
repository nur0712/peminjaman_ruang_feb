"use client";

import { RoomCard } from "@/components/room-card";
import { ErrorState, LoadingState } from "@/components/load-state";
import { Room } from "@/lib/types";
import { useApiQuery } from "@/hooks/use-api-query";

type RoomsResponse = {
  rooms: Room[];
};

export function RoomsCatalogClient() {
  const { data, error, isLoading } = useApiQuery<RoomsResponse>("/api/rooms");

  if (isLoading) {
    return <LoadingState title="Memuat daftar ruang..." description="Mengambil data ruang dan ketersediaan terbaru." />;
  }

  if (error || !data) {
    return <ErrorState title="Gagal memuat ruang." description={error ?? "Silakan coba lagi."} />;
  }

  return (
    <div className="grid gap-6">
      {data.rooms.map((room) => (
        <RoomCard key={room.slug} room={room} />
      ))}
    </div>
  );
}
