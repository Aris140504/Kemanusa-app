-- ============================================================
-- KEMANUSA — Schema Update (jalankan di Supabase SQL Editor)
-- Tambahan kolom pdf_url untuk catatan_buku
-- ============================================================

-- Tambah kolom pdf_url ke catatan_buku (untuk upload PDF)
ALTER TABLE public.catatan_buku 
ADD COLUMN IF NOT EXISTS pdf_url text;

-- Tambah kolom foto_url ke profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS foto_url text;

-- Buat storage bucket untuk PDF (jalankan di Supabase Storage)
-- Nama bucket: kemanusa-files (public)
