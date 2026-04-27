# PRD dan Struktur Dasar Kode Website Peminjaman Ruang Gedung FEB

> **Tech Stack:** Next.js 14 (App Router), shadcn/ui, Tailwind CSS, Drizzle ORM, PostgreSQL, Docker

---

## 1. Product Requirements Document (PRD)

### 1.1. Overview

Website peminjaman ruang di Gedung Fakultas Ekonomi dan Bisnis (FEB) yang memfasilitasi peminjaman dua ruangan utama:

- **FEB Meeting Room** – kapasitas 20 orang
- **Seminar Room** – kapasitas 600 orang

Website memungkinkan pengguna melihat ketersediaan ruangan, mengajukan peminjaman, dan admin mengelola persetujuan.

### 1.2. Tujuan

- Menyediakan sistem peminjaman ruangan secara digital dan terpusat.
- Menghindari bentrokan jadwal pemakaian ruang.
- Mempermudah proses approval oleh admin.
- Menyediakan informasi ruangan yang jelas (kapasitas, foto, fasilitas).

### 1.3. User Roles

1. **Peminjam (User)** – Mahasiswa/dosen/staf yang hendak meminjam ruangan.
2. **Admin** – Petugas yang mengelola persetujuan, melihat semua peminjaman, dan mengatur ruangan.

### 1.4. Fitur Utama

#### 1.4.1. Untuk Peminjam

- Melihat daftar ruangan beserta detail (kapasitas, foto, deskripsi).
- Kalender interaktif untuk melihat ketersediaan ruang per tanggal.
- Form pengajuan peminjaman (tanggal, jam mulai, jam selesai, tujuan).
- Riwayat peminjaman & status (pending/approved/rejected).
- Notifikasi status peminjaman (opsional, dapat via email/toast).

#### 1.4.2. Untuk Admin

- Dashboard ringkasan peminjaman hari ini / mendatang.
- List semua peminjaman dengan filter status.
- Approve / Reject pengajuan.
- Manajemen data ruangan (CRUD) – opsional di tahap awal bisa langsung via database seed.
- Melihat kalender okupansi tiap ruangan.

### 1.5. User Stories

- Sebagai peminjam, saya ingin melihat kapan Meeting Room tersedia agar saya bisa memilih waktu yang tepat.
- Sebagai peminjam, saya ingin mengisi form peminjaman dengan mudah dan mendapatkan konfirmasi.
- Sebagai admin, saya ingin menyetujui/menolak permintaan peminjaman agar ruangan digunakan sesuai aturan.
- Sebagai admin, saya ingin melihat jadwal ruangan agar tidak terjadi tabrakan.

### 1.6. Functional Requirements

1. **Manajemen Ruangan** (admin):
   - CRUD ruangan (nama, kapasitas, deskripsi, gambar).
   - Data awal: Meeting Room (20) dan Seminar Room (600).

2. **Peminjaman Ruangan**:
   - Pengguna memilih ruangan, tanggal, jam mulai & selesai.
   - Sistem memvalidasi tidak ada tumpang tindih (overlap) dengan peminjaman lain yang sudah disetujui.
   - Peminjaman baru berstatus `pending`.
   - Batasan durasi: misal maksimal 8 jam per sesi (opsional).

3. **Persetujuan (Approval)**:
   - Admin dapat melihat daftar peminjaman `pending`.
   - Admin menyetujui (`approved`) atau menolak (`rejected`).
   - Peminjaman yang disetujui tampil di kalender okupansi.

4. **Kalender & Cek Ketersediaan**:
   - Menampilkan ketersediaan per hari (misal warna hijau/merah).
   - Slot waktu yang sudah di-approve tidak bisa dipilih ulang.

5. **Autentikasi (opsional tahap awal)**:
   - Minimal menggunakan email untuk identifikasi peminjam.
   - Bisa dikembangkan dengan NextAuth.js (login Google/SSO kampus).

### 1.7. Non-Functional Requirements

- **Responsif** – antarmuka mobile-friendly berkat Tailwind CSS.
- **Keamanan** – validasi server-side, pencegahan double booking melalui database constraint/application logic.
- **Kemudahan deployment** – konfigurasi Docker Compose untuk app + database.
- **Dokumentasi kode** – struktur terorganisir, type safety dengan TypeScript.

### 1.8. Ruangan yang Disediakan

| Ruang            | Kapasitas |
| ---------------- | --------- |
| FEB Meeting Room | 20 orang  |
| Seminar Room     | 600 orang |

### 1.9. Aturan Peminjaman (contoh)

- Waktu peminjaman minimal 1 jam, maksimal 8 jam per hari.
- Peminjaman bisa dilakukan maksimal H-30 sebelum acara.
- Overlap otomatis dicegah untuk peminjaman `approved` dan `pending` (opsional).
- Admin dapat membatalkan peminjaman yang sudah disetujui jika terjadi force majeure.

### 1.10. Wireframe Alur Sederhana

```
[Home] → [Daftar Ruang] → [Detail Ruang + Kalender] → [Form Peminjaman] → [Konfirmasi]
[Login Admin] → [Dashboard Admin] → [Daftar Peminjaman] → [Approve/Reject]
```

---

## 2. Struktur Dasar Kode (Next.js App Router)

```
feb-room-booking/
├── public/
│   └── images/                 # Gambar ruangan
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Homepage
│   │   ├── rooms/
│   │   │   ├── page.tsx        # Daftar ruangan
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Detail ruangan + form peminjaman
│   │   │       └── actions.ts  # Server actions untuk booking
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Dashboard admin
│   │   │   ├── bookings/
│   │   │   │   └── page.tsx    # Manajemen peminjaman
│   │   │   └── rooms/
│   │   │       └── page.tsx    # Manajemen ruangan
│   │   └── api/                # API routes (jika diperlukan)
│   ├── components/
│   │   ├── ui/                 # Komponen shadcn/ui (button, calendar, dialog, form, dll.)
│   │   ├── RoomCard.tsx
│   │   ├── BookingForm.tsx
│   │   ├── CalendarView.tsx
│   │   ├── AdminBookingTable.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── db.ts               # Koneksi database (Drizzle + postgres)
│   │   ├── schema.ts           # Skema tabel (Drizzle ORM)
│   │   └── utils.ts            # Fungsi bantuan
│   ├── types/
│   │   └── index.ts            # Tipe data global
│   └── styles/
│       └── globals.css         # Tailwind directives
├── drizzle/
│   ├── migrations/             # File migrasi otomatis
│   └── meta/                   # Metadata migrasi
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── drizzle.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### Penjelasan Singkat Folder Penting

- **`src/app`** : Routing dan halaman utama (App Router).
- **`src/components`** : Komponen React reusable, termasuk komponen shadcn yang diinstal.
- **`src/lib/db.ts`** : Inisialisasi koneksi PostgreSQL menggunakan `drizzle-orm/node-postgres`.
- **`src/lib/schema.ts`** : Definisi tabel Drizzle.
- **`drizzle/`** : Folder migrasi database.
- **`docker-compose.yml`** : Orkestrasi container (Next.js app + PostgreSQL).
- **`Dockerfile`** : Build image untuk production.

---

## 3. Contoh Implementasi Dasar

### 3.1. Skema Database (Drizzle ORM)

Buat file `src/lib/schema.ts`:

```ts
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id")
    .notNull()
    .references(() => rooms.id),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  purpose: text("purpose"),
  status: text("status").default("pending").notNull(), // pending | approved | rejected
  createdAt: timestamp("created_at").defaultNow(),
});
```

Seed awal untuk ruangan (dapat dimasukkan via migrasi atau API seed):

```sql
INSERT INTO rooms (name, capacity, description) VALUES
('FEB Meeting Room', 20, 'Ruang rapat nyaman dengan AC dan proyektor'),
('Seminar Room', 600, 'Aula besar untuk seminar, dilengkapi sound system');
```

### 3.2. Koneksi Database

`src/lib/db.ts`:

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

### 3.3. Server Action untuk Cek Ketersediaan & Booking

`src/app/rooms/[id]/actions.ts`:

```ts
"use server";

import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { and, eq, lt, gt, or } from "drizzle-orm";

export async function checkAvailability(
  roomId: number,
  start: Date,
  end: Date,
): Promise<boolean> {
  const conflicts = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.roomId, roomId),
        eq(bookings.status, "approved"), // hanya yang disetujui
        lt(bookings.startTime, end),
        gt(bookings.endTime, start),
      ),
    );

  return conflicts.length === 0;
}

export async function createBooking(formData: FormData) {
  const roomId = Number(formData.get("roomId"));
  const startTime = new Date(formData.get("startTime") as string);
  const endTime = new Date(formData.get("endTime") as string);
  const userName = formData.get("userName") as string;
  const userEmail = formData.get("userEmail") as string;
  const purpose = formData.get("purpose") as string;

  const available = await checkAvailability(roomId, startTime, endTime);
  if (!available) throw new Error("Waktu tidak tersedia.");

  await db.insert(bookings).values({
    roomId,
    userName,
    userEmail,
    startTime,
    endTime,
    purpose,
  });
}
```

### 3.4. Komponen shadcn yang Direkomendasikan

- **Calendar** – untuk memilih tanggal pada form.
- **Form** + **Input**, **Textarea**, **Select** – untuk form peminjaman.
- **Dialog** / **Sheet** – konfirmasi peminjaman.
- **Table** – menampilkan daftar booking di admin.
- **Badge** – status peminjaman (pending, approved, rejected).

---

## 4. Panduan Menjalankan dengan Docker

### 4.1. `docker-compose.yml`

```yaml
version: "3.9"

services:
  app:
    build: .
    container_name: feb-room-app
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/feb_booking?schema=public
    depends_on:
      - db
    volumes:
      - .:/app # Untuk development hot reload (opsional)
      - /app/node_modules

  db:
    image: postgres:16-alpine
    container_name: feb-room-db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: feb_booking
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 4.2. `Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

### 4.3. Environment Variables

Buat `.env.example`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/feb_booking?schema=public
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4.4. Menjalankan Migrasi Drizzle

```bash
# Generate migrasi dari schema
npx drizzle-kit generate:pg

# Jalankan migrasi ke database
npx drizzle-kit push:pg
```

---

## 5. Catatan Tambahan

- **Keamanan**: Pastikan semua validasi dilakukan di server (server actions). Jangan percaya input klien.
- **Autentikasi**: Di tahap awal bisa menggunakan email sederhana. Upgrade nanti dengan NextAuth.js + provider Google atau SSO universitas.
- **Realtime update** (opsional): Bisa ditambahkan Supabase Realtime atau polling sederhana untuk melihat perubahan status.
- **Notifikasi**: Integrasi dengan Resend/Nodemailer untuk mengirim email pemberitahuan status.

---
