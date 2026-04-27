import Link from "next/link";
import { ArrowRight, Clock3, Users } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Room } from "@/lib/types";

type RoomCardProps = {
  room: Room;
};

export function RoomCard({ room }: RoomCardProps) {
  const nextDay = room.calendar[0];

  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="gap-4">
        <div className={`rounded-[26px] bg-gradient-to-br p-6 text-white ${room.theme}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/70">{room.floor}</p>
              <CardTitle className="font-display text-3xl text-white">{room.name}</CardTitle>
            </div>
            <StatusBadge status={nextDay.status} />
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/88">{room.summary}</p>
        </div>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Users className="size-4" />
            Kapasitas {room.capacity} orang
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{room.popularity}</p>
        </div>
        <div className="rounded-3xl bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Clock3 className="size-4" />
            {room.hours}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{nextDay.occupancy}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <div className="text-sm text-muted-foreground">{room.responseTime}</div>
        <Button asChild>
          <Link href={`/rooms/${room.slug}`}>
            Lihat Detail
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
