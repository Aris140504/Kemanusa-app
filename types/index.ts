// ============================================================
// KEMANUSA Types
// ============================================================

export type UserRole = 'admin' | 'anggota' | 'humas';

export interface Profile {
  id: string;
  email: string;
  nama_depan: string;
  nama_belakang: string;
  no_whatsapp: string | null;
  role: UserRole;
  divisi: string | null;
  universitas: string | null;
  status: 'pending' | 'aktif' | 'ditolak';
  created_at: string;
  updated_at: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  dibuat_oleh: string;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, 'nama_depan' | 'nama_belakang'>;
}

export interface CatatanBuku {
  id: string;
  judul_buku: string;
  nama_penulis: string;
  tahun: string | null;
  kategori: string | null;
  ringkasan: string;
  pelajaran: string;
  dicatat_oleh: string;
  created_at: string;
  profiles?: Pick<Profile, 'nama_depan' | 'nama_belakang'>;
}

export interface ArsipDokumen {
  id: string;
  nama_file: string;
  deskripsi: string | null;
  drive_url: string;
  drive_file_id: string | null;
  kategori: string | null;
  diupload_oleh: string;
  created_at: string;
  profiles?: Pick<Profile, 'nama_depan' | 'nama_belakang'>;
}

export interface Kegiatan {
  id: string;
  nama: string;
  deskripsi: string | null;
  tanggal: string;
  lokasi: string | null;
  status: 'upcoming' | 'ongoing' | 'selesai';
  dibuat_oleh: string;
  created_at: string;
}

export interface DashboardStats {
  total_anggota: number;
  anggota_pending: number;
  total_kegiatan: number;
  total_dokumen: number;
}
