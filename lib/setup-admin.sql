-- ============================================================
-- CARA BUAT AKUN ADMIN PERTAMA KALI
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================================

-- LANGKAH 1: Jalankan schema.sql dulu (jika belum)

-- LANGKAH 2: Setelah ada user yang daftar, ubah role-nya jadi admin
-- Ganti 'email_kamu@gmail.com' dengan email yang sudah daftar

UPDATE public.profiles
SET role = 'admin', status = 'aktif'
WHERE email = 'email_kamu@gmail.com';

-- ============================================================
-- CARA BUAT AKUN HUMAS
-- ============================================================
UPDATE public.profiles
SET role = 'humas', status = 'aktif'
WHERE email = 'email_humas@gmail.com';

-- ============================================================
-- CARA LIHAT SEMUA USER
-- ============================================================
SELECT id, email, nama_depan, nama_belakang, role, status, created_at
FROM public.profiles
ORDER BY created_at DESC;

-- ============================================================
-- CARA APPROVE ANGGOTA MANUAL
-- ============================================================
UPDATE public.profiles
SET status = 'aktif'
WHERE email = 'email_anggota@gmail.com';

-- ============================================================
-- CARA TOLAK ANGGOTA
-- ============================================================
UPDATE public.profiles
SET status = 'ditolak'
WHERE email = 'email_anggota@gmail.com';
