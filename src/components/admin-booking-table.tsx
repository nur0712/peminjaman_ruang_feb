import { MoreHorizontal } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookingRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type AdminBookingTableProps = {
  bookings: BookingRecord[];
};

export function AdminBookingTable({ bookings }: AdminBookingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Peminjam</TableHead>
          <TableHead>Ruangan</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Surat</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-semibold">{booking.id}</TableCell>
            <TableCell>
              <p className="font-semibold">{booking.borrower}</p>
              <p className="text-xs text-muted-foreground">{booking.organization}</p>
            </TableCell>
            <TableCell>
              <p>{booking.roomName}</p>
              <p className="text-xs text-muted-foreground">{booking.attendees} peserta</p>
            </TableCell>
            <TableCell>
              <p>{formatDate(booking.date)}</p>
              <p className="text-xs text-muted-foreground">{booking.time}</p>
            </TableCell>
            <TableCell>
              <p className="font-medium">{booking.requestLetterName}</p>
              <p className="text-xs text-muted-foreground">Lampiran pengajuan</p>
            </TableCell>
            <TableCell>
              <StatusBadge status={booking.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  Approve
                </Button>
                <Button variant="outline" size="sm">
                  Reject
                </Button>
                <Button variant="ghost" size="icon" aria-label={`Lihat detail ${booking.id}`}>
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
