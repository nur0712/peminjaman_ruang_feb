import { CalendarClock } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDay } from "@/lib/types";
import { formatDay } from "@/lib/utils";

type CalendarViewProps = {
  days: CalendarDay[];
};

export function CalendarView({ days }: CalendarViewProps) {
  return (
    <Card className="glass-panel">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="font-display text-2xl">Kalender Ketersediaan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Slot berstatus approved dianggap terkunci, pending tetap terlihat untuk kebutuhan review admin.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-muted/70 px-4 py-2 text-sm text-muted-foreground sm:flex">
          <CalendarClock className="size-4" />
          Update manual frontend demo
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {days.map((day) => (
          <div key={day.date} className="rounded-[24px] border border-border/70 bg-background/70 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{day.day}</p>
                <h3 className="text-lg font-semibold">{formatDay(day.date)}</h3>
                <p className="text-sm text-muted-foreground">{day.occupancy}</p>
              </div>
              <StatusBadge status={day.status} />
            </div>
            <div className="space-y-3">
              {day.slots.map((slot) => (
                <div
                  key={`${day.date}-${slot.time}`}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-muted/45 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{slot.time}</p>
                    <p className="text-sm text-muted-foreground">{slot.label}</p>
                  </div>
                  <StatusBadge status={slot.status} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
