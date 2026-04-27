import { Badge } from "@/components/ui/badge";
import { AvailabilityStatus, BookingStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: BookingStatus | AvailabilityStatus | "available";
};

const badgeMap = {
  approved: { label: "Approved", variant: "success" as const },
  pending: { label: "Pending", variant: "warning" as const },
  rejected: { label: "Rejected", variant: "destructive" as const },
  available: { label: "Available", variant: "secondary" as const },
  limited: { label: "Limited", variant: "warning" as const },
  booked: { label: "Booked", variant: "destructive" as const },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = badgeMap[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
