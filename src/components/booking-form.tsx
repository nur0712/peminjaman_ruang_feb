"use client";

import { useId, useState } from "react";
import { CircleCheckBig, FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormDraft } from "@/lib/types";

type BookingFormProps = {
  roomName: string;
};

const initialForm: BookingFormDraft = {
  borrowerName: "",
  email: "",
  bookingDate: "",
  attendees: "",
  startTime: "",
  endTime: "",
  organization: "",
  purpose: "",
  requestLetterName: "",
};

export function BookingForm({ roomName }: BookingFormProps) {
  const fileInputId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<BookingFormDraft>(initialForm);

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
          Frontend demo untuk alur booking. Data belum tersimpan ke database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {submitted ? (
          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <CircleCheckBig className="size-5" />
              Permintaan booking terkirim
            </div>
            <p className="text-sm leading-6">
              Pengajuan untuk <span className="font-semibold">{roomName}</span> sudah masuk ke antrian review admin.
              Lampiran <span className="font-semibold">{form.requestLetterName}</span> ikut tercatat untuk langkah
              integrasi berikutnya ke server action atau API.
            </p>
          </div>
        ) : null}

        <form
          className="space-y-4"
          encType="multipart/form-data"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Nama peminjam</label>
              <Input
                placeholder="Nama lengkap"
                required
                value={form.borrowerName}
                onChange={(event) => updateField("borrowerName", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email</label>
              <Input
                type="email"
                placeholder="nama@kampus.ac.id"
                required
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Tanggal</label>
              <Input
                type="date"
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
                required
                value={form.startTime}
                onChange={(event) => updateField("startTime", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Jam selesai</label>
              <Input
                type="time"
                required
                value={form.endTime}
                onChange={(event) => updateField("endTime", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Instansi / unit</label>
            <Input
              placeholder="Program Studi, BEM, Fakultas, atau mitra"
              value={form.organization}
              onChange={(event) => updateField("organization", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Tujuan kegiatan</label>
            <Textarea
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
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required
                  className="sr-only"
                  onChange={(event) => updateField("requestLetterName", event.target.files?.[0]?.name ?? "")}
                />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Kirim Pengajuan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
