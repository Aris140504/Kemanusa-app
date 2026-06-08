-- ============================================================
-- KEMANUSA Parepare — Supabase Database Schema
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================================

-- 1. PROFILES (extend auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  nama_depan text not null,
  nama_belakang text not null,
  no_whatsapp text,
  role text not null default 'anggota' check (role in ('admin','anggota','humas')),
  divisi text,
  universitas text,
  status text not null default 'pending' check (status in ('pending','aktif','ditolak')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nama_depan, nama_belakang, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nama_depan', ''),
    coalesce(new.raw_user_meta_data->>'nama_belakang', ''),
    coalesce(new.raw_user_meta_data->>'role', 'anggota')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PENGUMUMAN
create table public.pengumuman (
  id uuid default gen_random_uuid() primary key,
  judul text not null,
  isi text not null,
  dibuat_oleh uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. CATATAN BUKU (Modul Humas)
create table public.catatan_buku (
  id uuid default gen_random_uuid() primary key,
  judul_buku text not null,
  nama_penulis text not null,
  tahun text,
  kategori text,
  ringkasan text not null,
  pelajaran text not null,
  dicatat_oleh uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 4. ARSIP DOKUMEN
create table public.arsip_dokumen (
  id uuid default gen_random_uuid() primary key,
  nama_file text not null,
  deskripsi text,
  drive_url text not null,
  drive_file_id text,
  kategori text,
  diupload_oleh uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 5. KEGIATAN
create table public.kegiatan (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  deskripsi text,
  tanggal date not null,
  lokasi text,
  status text not null default 'upcoming' check (status in ('upcoming','ongoing','selesai')),
  dibuat_oleh uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.pengumuman enable row level security;
alter table public.catatan_buku enable row level security;
alter table public.arsip_dokumen enable row level security;
alter table public.kegiatan enable row level security;

-- Profiles: user can view all aktif profiles, edit own
create policy "profiles_select" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_update_admin" on public.profiles
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Pengumuman: anyone authenticated can read, admin/humas can write
create policy "pengumuman_select" on public.pengumuman
  for select using (auth.role() = 'authenticated');

create policy "pengumuman_insert" on public.pengumuman
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','humas'))
  );

create policy "pengumuman_update" on public.pengumuman
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','humas'))
  );

create policy "pengumuman_delete" on public.pengumuman
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Catatan buku: anyone authenticated can read, humas/admin can write
create policy "catatan_buku_select" on public.catatan_buku
  for select using (auth.role() = 'authenticated');

create policy "catatan_buku_insert" on public.catatan_buku
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','humas'))
  );

create policy "catatan_buku_delete" on public.catatan_buku
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','humas'))
  );

-- Arsip dokumen: similar to catatan buku
create policy "arsip_select" on public.arsip_dokumen
  for select using (auth.role() = 'authenticated');

create policy "arsip_insert" on public.arsip_dokumen
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','humas'))
  );

-- Kegiatan: admin can manage
create policy "kegiatan_select" on public.kegiatan
  for select using (auth.role() = 'authenticated');

create policy "kegiatan_insert" on public.kegiatan
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
