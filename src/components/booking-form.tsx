"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheckBig, FileText, LogIn, Upload } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { BookingFormDraft } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type BookingFormProps = {
  roomName: string;
  roomSlug: string;
};

const initialForm: BookingFormDraft = {
  bookingDate: "",
  attendees: "",
  startTime: "",
  endTime: "",
  organization: "",
  purpose: "",
  requestLetterName: "",
};

export function BookingForm({ roomName, roomSlug }: BookingFormProps) {
  const fileInputId = useId();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [form, setForm] = useState<BookingFormDraft>(initialForm);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Key extends keyof BookingFormDraft>(field: Key, value: BookingFormDraft[Key]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Form Pengajuan</CardTitle>
        <CardDescription>
          Form ini sudah terhubung ke API Route Handler. Anda perlu masuk terlebih dahulu sebelum mengirim booking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {submittedCode ? (
          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <CircleCheckBig className="size-5" />
              Permintaan booking terkirim
            </div>
            <p className="text-sm leading-6">
              Pengajuan untuk <span className="font-semibold">{roomName}</span> sudah masuk ke antrian review admin.
              Lampiran <span className="font-semibold">{form.requestLetterName}</span> ikut tercatat untuk langkah
              approval. Kode booking Anda: <span className="font-semibold">{submittedCode}</span>.
            </p>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</div>
        ) : null}

        <form
          className="space-y-4"
          encType="multipart/form-data"
          onSubmit={async (event) => {
            event.preventDefault();
            setErrorMessage(null);

            if (!session) {
              setErrorMessage("Silakan masuk terlebih dahulu sebelum mengajukan booking.");
              return;
            }

            setIsSubmitting(true);

            const payload = new FormData(event.currentTarget);
            payload.set("roomSlug", roomSlug);

            try {
              const response = await fetch("/api/bookings", {
                method: "POST",
                body: payload,
              });

              const result = (await response.json()) as {
                message?: string;
                booking?: { bookingCode: string };
              };

              if (!response.ok) {
                setErrorMessage(result.message ?? "Booking gagal diproses.");
                return;
              }

              setSubmittedCode(result.booking?.bookingCode ?? null);
              setForm(initialForm);
              event.currentTarget.reset();
              router.refresh();
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <input type="hidden" name="roomSlug" value={roomSlug} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Nama peminjam</label>
              <Input value={session?.user.name ?? (isPending ? "Memuat sesi..." : "Silakan masuk")} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email</label>
              <Input type="email" value={session?.user.email ?? (isPending ? "Memuat sesi..." : "Silakan masuk")} readOnly />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Tanggal</label>
              <Input
                type="date"
                name="bookingDate"
                required
                value={form.bookingDate}
                onChange={(event) => updateField("bookingDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Jumlah peserta</label>
              <Input
                type="number"
                min="1"
                name="attendees"
                placeholder="Contoh: 20"
                required
                value={form.attendees}
                onChange={(event) => updateField("attendees", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Jam mulai</label>
              <Input
                type="time"
                name="startTime"
                required
                value={form.startTime}
                onChange={(event) => updateField("startTime", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Jam selesai</label>
              <Input
                type="time"
                name="endTime"
                required
                value={form.endTime}
                onChange={(event) => updateField("endTime", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Instansi / unit</label>
            <Input
              name="organization"
              placeholder="Program Studi, BEM, Fakultas, atau mitra"
              value={form.organization}
              onChange={(event) => updateField("organization", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Tujuan kegiatan</label>
            <Textarea
              name="purpose"
              placeholder="Jelaskan agenda, kebutuhan teknis, dan susunan acara singkat..."
              required
              value={form.purpose}
              onChange={(event) => updateField("purpose", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Surat pengajuan</label>
            <div className="overflow-hidden rounded-[26px] border border-dashed border-border bg-background/70 transition hover:bg-muted/25">
              <div className="flex items-start gap-3 border-b border-border/60 px-5 py-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted/70 text-foreground">
                  <Upload className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium">Upload lampiran surat pengajuan</p>
                  <p className="text-sm text-muted-foreground">Format PDF, DOC, atau DOCX. Maksimal 5MB.</p>
                </div>
              </div>

              <div className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm text-muted-foreground">
                    {form.requestLetterName ? form.requestLetterName : "Belum ada file yang dipilih."}
                  </span>
                </div>

                <label
                  htmlFor={fileInputId}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition hover:-translate-y-0.5"
                >
                  Pilih File
                </label>
                <Input
                  id={fileInputId}
                  type="file"
                  name="requestLetter"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required
                  className="sr-only"
                  onChange={(event) => updateField("requestLetterName", event.target.files?.[0]?.name ?? "")}
                />
              </div>
            </div>
          </div>

          {!session ? (
            <div className="rounded-[24px] border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
              Masuk terlebih dahulu agar sistem dapat mengaitkan booking ke akun Anda dan menampilkan riwayatnya.
              <div className="mt-3">
                <Button type="button" variant="outline" onClick={() => router.push("/sign-in")}>
                  <LogIn className="size-4" />
                  Masuk Sekarang
                </Button>
              </div>
            </div>
          ) : null}

          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!session || isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
