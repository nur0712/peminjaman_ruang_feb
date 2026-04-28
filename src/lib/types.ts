export type AvailabilityStatus = "available" | "limited" | "booked";
export type BookingStatus = "approved" | "pending" | "rejected";

export type TimeSlot = {
  time: string;
  label: string;
  status: BookingStatus | "available";
};

export type CalendarDay = {
  date: string;
  day: string;
  occupancy: string;
  status: AvailabilityStatus;
  slots: TimeSlot[];
};

export type Room = {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  capacity: number;
  summary: string;
  description: string;
  floor: string;
  hours: string;
  notice: string;
  responseTime: string;
  utilization: string;
  popularity: string;
  amenities: string[];
  idealFor: string[];
  theme: string;
  glow: string;
  accent: string;
  calendar: CalendarDay[];
};

export type BookingRecord = {
  id: string;
  bookingCode: string;
  roomSlug: string;
  roomName: string;
  borrower: string;
  email: string;
  organization: string;
  agenda: string;
  status: BookingStatus;
  date: string;
  time: string;
  attendees: number;
  requestLetterName: string;
  submittedAt: string;
};

export type BookingFormDraft = {
  bookingDate: string;
  attendees: string;
  startTime: string;
  endTime: string;
  organization: string;
  purpose: string;
  requestLetterName: string;
};
