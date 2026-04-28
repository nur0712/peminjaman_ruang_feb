import { z } from "zod";

const acceptedLetterTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const bookingStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const bookingPayloadSchema = z
  .object({
    roomSlug: z.string().min(1),
    organization: z.string().min(2, "Instansi wajib diisi."),
    purpose: z.string().min(10, "Tujuan kegiatan terlalu singkat."),
    bookingDate: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    attendees: z.coerce.number().int().min(1).max(600),
  })
  .superRefine((data, ctx) => {
    const start = new Date(`${data.bookingDate}T${data.startTime}:00`);
    const end = new Date(`${data.bookingDate}T${data.endTime}:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tanggal atau jam booking tidak valid.",
        path: ["bookingDate"],
      });
      return;
    }

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Jam selesai harus lebih besar dari jam mulai.",
        path: ["endTime"],
      });
    }

    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours > 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Durasi booking maksimal 8 jam.",
        path: ["endTime"],
      });
    }
  });

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  statusNote: z.string().max(500).optional(),
});

export function validateRequestLetter(file: File | null) {
  if (!file) {
    return "Surat pengajuan wajib diunggah.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "Ukuran surat pengajuan maksimal 5MB.";
  }

  if (file.type && !acceptedLetterTypes.includes(file.type)) {
    return "Format surat pengajuan harus PDF, DOC, atau DOCX.";
  }

  return null;
}
