import { relations } from "drizzle-orm";
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { account, accountRelations, session, sessionRelations, user, userRelations, verification } from "@/lib/auth-schema";

export const bookingStatusEnum = pgEnum("booking_status", ["pending", "approved", "rejected"]);

export const rooms = pgTable(
  "rooms",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    shortName: text("short_name").notNull(),
    capacity: integer("capacity").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    floor: text("floor").notNull(),
    hours: text("hours").notNull(),
    notice: text("notice").notNull(),
    responseTime: text("response_time").notNull(),
    popularity: text("popularity").notNull(),
    amenities: jsonb("amenities").$type<string[]>().notNull(),
    idealFor: jsonb("ideal_for").$type<string[]>().notNull(),
    theme: text("theme").notNull(),
    glow: text("glow").notNull(),
    accent: text("accent").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("rooms_slug_idx").on(table.slug)],
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingCode: text("booking_code").notNull().unique(),
    roomId: integer("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    borrowerName: text("borrower_name").notNull(),
    borrowerEmail: text("borrower_email").notNull(),
    organization: text("organization").notNull(),
    purpose: text("purpose").notNull(),
    attendees: integer("attendees").notNull(),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    requestLetterName: text("request_letter_name").notNull(),
    requestLetterPath: text("request_letter_path").notNull(),
    status: bookingStatusEnum("status").default("pending").notNull(),
    statusNote: text("status_note"),
    reviewedByUserId: text("reviewed_by_user_id").references(() => user.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("bookings_booking_code_idx").on(table.bookingCode),
    uniqueIndex("bookings_request_letter_path_idx").on(table.requestLetterPath),
  ],
);

export const roomsRelations = relations(rooms, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  room: one(rooms, {
    fields: [bookings.roomId],
    references: [rooms.id],
  }),
  user: one(user, {
    fields: [bookings.userId],
    references: [user.id],
  }),
  reviewedBy: one(user, {
    fields: [bookings.reviewedByUserId],
    references: [user.id],
  }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  rooms,
  bookings,
  userRelations,
  sessionRelations,
  accountRelations,
  roomsRelations,
  bookingsRelations,
};

export { account, session, user, verification } from "@/lib/auth-schema";
export { accountRelations, sessionRelations, userRelations } from "@/lib/auth-schema";
