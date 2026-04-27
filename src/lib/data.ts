import { BookingRecord, Room } from "@/lib/types";

export const rooms: Room[] = [
  {
    id: 1,
    slug: "feb-meeting-room",
    name: "FEB Meeting Room",
    shortName: "Meeting Room",
    capacity: 20,
    summary: "Ruang rapat hangat untuk koordinasi cepat, presentasi kecil, dan diskusi pimpinan.",
    description:
      "Dirancang untuk pertemuan formal dengan suasana fokus. Layout fleksibel untuk rapat meja bundar, coaching session, atau presentasi internal dengan kebutuhan teknis ringan.",
    floor: "Lantai 2 Gedung FEB",
    hours: "08.00 - 20.00 WIB",
    notice: "Disarankan ajukan minimal H-2 untuk kebutuhan konsumsi dan layout khusus.",
    responseTime: "< 4 jam kerja",
    utilization: "78% terisi",
    popularity: "Paling sering dipakai staf & dosen",
    amenities: [
      "Proyektor 4K",
      "Smart TV 65 inci",
      "Whiteboard kaca",
      "Conference speaker",
      "AC sentral",
      "Pantry corner",
    ],
    idealFor: ["Rapat pimpinan", "Sidang kecil", "Presentasi internal", "Interview panel"],
    theme: "from-[#123458] via-[#1f6e8c] to-[#74b3ce]",
    glow: "bg-[#74b3ce]/30",
    accent: "#1f6e8c",
    calendar: [
      {
        date: "2026-04-27",
        day: "Sen",
        occupancy: "2 dari 5 slot terpakai",
        status: "limited",
        slots: [
          { time: "08.00 - 10.00", label: "Rapat Dekanat", status: "approved" },
          { time: "10.30 - 12.00", label: "Kosong", status: "available" },
          { time: "13.00 - 15.00", label: "Review Akreditasi", status: "approved" },
          { time: "15.30 - 17.00", label: "Kosong", status: "available" },
        ],
      },
      {
        date: "2026-04-28",
        day: "Sel",
        occupancy: "1 dari 5 slot terpakai",
        status: "available",
        slots: [
          { time: "08.00 - 10.00", label: "Kosong", status: "available" },
          { time: "10.30 - 12.00", label: "Koordinasi Kurikulum", status: "pending" },
          { time: "13.00 - 15.00", label: "Kosong", status: "available" },
          { time: "15.30 - 17.00", label: "Kosong", status: "available" },
        ],
      },
      {
        date: "2026-04-29",
        day: "Rab",
        occupancy: "4 dari 5 slot terpakai",
        status: "booked",
        slots: [
          { time: "08.00 - 10.00", label: "Budget Planning", status: "approved" },
          { time: "10.30 - 12.00", label: "Kunjungan Mitra", status: "approved" },
          { time: "13.00 - 15.00", label: "Kosong", status: "available" },
          { time: "15.30 - 17.00", label: "Rapat Unit", status: "approved" },
        ],
      },
      {
        date: "2026-04-30",
        day: "Kam",
        occupancy: "2 dari 5 slot terpakai",
        status: "limited",
        slots: [
          { time: "08.00 - 10.00", label: "Kosong", status: "available" },
          { time: "10.30 - 12.00", label: "Kosong", status: "available" },
          { time: "13.00 - 15.00", label: "Presentasi Vendor", status: "pending" },
          { time: "15.30 - 17.00", label: "Kosong", status: "available" },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "seminar-room",
    name: "Seminar Room",
    shortName: "Seminar Room",
    capacity: 600,
    summary: "Aula utama berkapasitas besar untuk seminar, kuliah umum, dan peluncuran program kampus.",
    description:
      "Ruang skala besar dengan tata cahaya panggung, sound system, dan sirkulasi audiens yang cocok untuk agenda publik berskala fakultas maupun universitas.",
    floor: "Lantai 1 Gedung FEB",
    hours: "07.00 - 21.00 WIB",
    notice: "Agenda eksternal wajib melampirkan rundown dan PIC teknis saat pengajuan.",
    responseTime: "1 hari kerja",
    utilization: "61% terisi",
    popularity: "Favorit untuk acara besar kampus",
    amenities: [
      "Panggung modular",
      "Sound system auditorium",
      "Layar LED utama",
      "Ruang kontrol",
      "Mic wireless",
      "Akses kursi roda",
    ],
    idealFor: ["Seminar nasional", "Kuliah tamu", "Talkshow", "Wisuda internal"],
    theme: "from-[#4a1f4f] via-[#8c3061] to-[#d95d39]",
    glow: "bg-[#d95d39]/30",
    accent: "#8c3061",
    calendar: [
      {
        date: "2026-04-27",
        day: "Sen",
        occupancy: "1 dari 4 slot terpakai",
        status: "available",
        slots: [
          { time: "07.00 - 10.00", label: "Kosong", status: "available" },
          { time: "10.30 - 13.00", label: "Kosong", status: "available" },
          { time: "13.30 - 16.30", label: "Seminar Investasi", status: "approved" },
          { time: "17.00 - 20.00", label: "Kosong", status: "available" },
        ],
      },
      {
        date: "2026-04-28",
        day: "Sel",
        occupancy: "2 dari 4 slot terpakai",
        status: "limited",
        slots: [
          { time: "07.00 - 10.00", label: "Latihan Paduan Suara", status: "approved" },
          { time: "10.30 - 13.00", label: "Kosong", status: "available" },
          { time: "13.30 - 16.30", label: "Kuliah Umum Energi", status: "pending" },
          { time: "17.00 - 20.00", label: "Kosong", status: "available" },
        ],
      },
      {
        date: "2026-04-29",
        day: "Rab",
        occupancy: "3 dari 4 slot terpakai",
        status: "booked",
        slots: [
          { time: "07.00 - 10.00", label: "Setting Panggung", status: "approved" },
          { time: "10.30 - 13.00", label: "Open House FEB", status: "approved" },
          { time: "13.30 - 16.30", label: "Open House FEB", status: "approved" },
          { time: "17.00 - 20.00", label: "Kosong", status: "available" },
        ],
      },
      {
        date: "2026-04-30",
        day: "Kam",
        occupancy: "1 dari 4 slot terpakai",
        status: "available",
        slots: [
          { time: "07.00 - 10.00", label: "Kosong", status: "available" },
          { time: "10.30 - 13.00", label: "Kosong", status: "available" },
          { time: "13.30 - 16.30", label: "Kosong", status: "available" },
          { time: "17.00 - 20.00", label: "Townhall Mahasiswa", status: "pending" },
        ],
      },
    ],
  },
];

export const bookings: BookingRecord[] = [
  {
    id: "BK-240427-01",
    roomSlug: "feb-meeting-room",
    roomName: "FEB Meeting Room",
    borrower: "Nadia Putri",
    email: "nadia.putri@kampus.ac.id",
    organization: "Program Studi Manajemen",
    agenda: "Koordinasi akreditasi dan pembagian tugas asesor",
    status: "pending",
    date: "2026-04-28",
    time: "10.30 - 12.00",
    attendees: 12,
    requestLetterName: "surat-pengajuan-prodi-manajemen.pdf",
    submittedAt: "2026-04-27T07:20:00+07:00",
  },
  {
    id: "BK-240427-02",
    roomSlug: "seminar-room",
    roomName: "Seminar Room",
    borrower: "BEM FEB",
    email: "sekretariat@bemfeb.id",
    organization: "BEM FEB",
    agenda: "Kuliah umum dan panel diskusi ekonomi kreatif",
    status: "approved",
    date: "2026-04-29",
    time: "10.30 - 16.30",
    attendees: 420,
    requestLetterName: "surat-pengajuan-bem-feb.pdf",
    submittedAt: "2026-04-25T09:10:00+07:00",
  },
  {
    id: "BK-240427-03",
    roomSlug: "feb-meeting-room",
    roomName: "FEB Meeting Room",
    borrower: "Dian Arif",
    email: "dian.arif@kampus.ac.id",
    organization: "UPT Kerja Sama",
    agenda: "Presentasi vendor dan evaluasi kebutuhan sistem",
    status: "rejected",
    date: "2026-04-30",
    time: "13.00 - 15.00",
    attendees: 16,
    requestLetterName: "surat-pengajuan-upt-kerjasama.docx",
    submittedAt: "2026-04-26T16:45:00+07:00",
  },
  {
    id: "BK-240427-04",
    roomSlug: "seminar-room",
    roomName: "Seminar Room",
    borrower: "Rahma Aulia",
    email: "rahma.aulia@kampus.ac.id",
    organization: "FEB Career Center",
    agenda: "Townhall dan pemaparan program magang mitra",
    status: "pending",
    date: "2026-04-30",
    time: "17.00 - 20.00",
    attendees: 300,
    requestLetterName: "surat-pengajuan-career-center.pdf",
    submittedAt: "2026-04-27T06:35:00+07:00",
  },
];

export const dashboardMetrics = [
  { label: "Permintaan hari ini", value: "14", detail: "+4 dibanding kemarin" },
  { label: "Menunggu approval", value: "5", detail: "2 prioritas tinggi" },
  { label: "Okupansi minggu ini", value: "69%", detail: "Rata-rata dua ruang" },
  { label: "SLA respons admin", value: "3j 12m", detail: "Target < 4 jam kerja" },
];

export const bookingPolicies = [
  "Durasi minimal 1 jam dan maksimal 8 jam per sesi.",
  "Pengajuan bisa dilakukan hingga H-30 dari tanggal acara.",
  "Slot yang berstatus approved tidak dapat dipilih ulang.",
  "Surat pengajuan wajib dilampirkan dalam format PDF, DOC, atau DOCX.",
  "Admin dapat menolak jika agenda, kapasitas, atau kebutuhan teknis tidak sesuai.",
];

export function getRoomBySlug(slug: string) {
  return rooms.find((room) => room.slug === slug);
}

export function getRoomBookings(slug: string) {
  return bookings.filter((booking) => booking.roomSlug === slug);
}
