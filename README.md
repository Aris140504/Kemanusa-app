# 🌿 KEMANUSA Parepare — Sistem Digital Organisasi

Aplikasi web terpadu untuk pengelolaan anggota, kegiatan, dan arsip organisasi **KEMANUSA (Kejayaan Mahasiswa Nusantara) Cabang Kota Parepare**.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | **Next.js 14** (App Router) |
| Bahasa | **TypeScript** |
| Database | **Supabase** (PostgreSQL) |
| Auth | **Supabase Auth** |
| Styling | **CSS Modules** |
| Deploy | **Vercel** |

---

## 📁 Struktur Folder

```
kemanusa/
├── app/
│   ├── page.tsx                        ← Landing Page
│   ├── page.module.css
│   ├── layout.tsx
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx              ← Halaman Login
│   │   └── register/page.tsx           ← Halaman Register
│   └── dashboard/
│       ├── admin/
│       │   ├── page.tsx                ← Dashboard Admin Utama
│       │   ├── anggota/page.tsx        ← Manajemen Anggota
│       │   ├── pendaftaran/page.tsx    ← Review Pendaftaran
│       │   ├── kegiatan/page.tsx       ← Kelola Kegiatan
│       │   ├── pengumuman/page.tsx     ← Kelola Pengumuman
│       │   └── pengaturan/page.tsx     ← Pengaturan Akun
│       └── humas/
│           ├── page.tsx                ← Catatan Buku Bacaan
│           ├── arsip/page.tsx          ← Arsip Dokumen
│           ├── pengumuman/page.tsx     ← Pengumuman Humas
│           └── data-penting/page.tsx   ← Data Penting
├── components/
│   └── dashboard/
│       ├── DashboardLayout.tsx         ← Layout sidebar shared
│       └── DashboardLayout.module.css
├── lib/
│   ├── supabase.ts                     ← Supabase client (browser)
│   ├── supabase-server.ts              ← Supabase client (server)
│   └── schema.sql                      ← SQL schema database
├── types/
│   └── index.ts                        ← TypeScript types
├── .env.example                        ← Template env variables
└── README.md
```

---

## 🚀 Cara Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** di Supabase dashboard
3. Salin isi file `lib/schema.sql` dan jalankan
4. Dapatkan URL dan Anon Key dari **Settings → API**

### 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Isi nilainya:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📊 Fitur Lengkap

### 🏠 Landing Page
- Hero section dengan animasi
- Tentang KEMANUSA
- Fitur platform
- Peta lokasi (Google Maps)
- Footer

### 🔐 Autentikasi
- Register dengan pilihan role (Admin / Anggota)
- Login dengan email & password
- Auto-redirect berdasarkan role
- Session management via Supabase Auth

### ⚙️ Dashboard Admin
- **Overview**: Statistik anggota, pendaftaran, kegiatan, dokumen
- **Anggota**: Lihat semua anggota aktif, filter & search
- **Pendaftaran**: Approve / Tolak pendaftaran baru (tab: pending / diterima / ditolak)
- **Kegiatan**: Tambah, lihat, hapus kegiatan organisasi
- **Pengumuman**: Buat dan hapus pengumuman
- **Pengaturan**: Edit profil akun

### 📚 Modul Humas
- **Catatan Buku**: Tambah, cari, hapus catatan buku bacaan
- **Arsip Dokumen**: Upload link Google Drive, kelola arsip
- **Pengumuman**: Buat pengumuman dari divisi humas
- **Data Penting**: Simpan informasi penting organisasi

---

## 🗄️ Database Tables

| Tabel | Kegunaan |
|-------|----------|
| `profiles` | Data pengguna (extend auth.users) |
| `pengumuman` | Pengumuman organisasi |
| `catatan_buku` | Catatan buku bacaan (Humas) |
| `arsip_dokumen` | Link arsip ke Google Drive |
| `kegiatan` | Agenda kegiatan organisasi |

---

## 🌐 Deploy ke Vercel

1. Push kode ke GitHub
2. Connect repo ke [vercel.com](https://vercel.com)
3. Tambahkan environment variables di Vercel dashboard
4. Deploy otomatis setiap `git push`

---

## 👨‍💻 Pengembang

Dibuat untuk **KEMANUSA Cabang Kota Parepare** — Sulawesi Selatan  
© 2026 — Kejayaan Mahasiswa Nusantara
