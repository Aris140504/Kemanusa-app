import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KEMANUSA Parepare — Sistem Digital Organisasi',
  description: 'Sistem digital terpadu untuk pengelolaan anggota, kegiatan, dan arsip organisasi KEMANUSA Cabang Kota Parepare.',
  keywords: 'KEMANUSA, Parepare, organisasi mahasiswa, Sulawesi Selatan, digital',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
