'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from '@/components/dashboard/DashboardLayout.module.css';
import type { Profile } from '@/types';

const adminNavItems = [
  { href: '/dashboard/admin', icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/admin/anggota', icon: '👥', label: 'Anggota' },
  { href: '/dashboard/admin/pendaftaran', icon: '📋', label: 'Pendaftaran' },
  { href: '/dashboard/admin/kegiatan', icon: '📅', label: 'Kegiatan' },
  { href: '/dashboard/admin/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/admin/pengaturan', icon: '⚙️', label: 'Pengaturan' },
];

export default function AnggotaPage() {
  const supabase = createClient();
  const [anggota, setAnggota] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'aktif')
        .order('created_at', { ascending: false });
      setAnggota(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = anggota.filter(a =>
    `${a.nama_depan} ${a.nama_belakang} ${a.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={adminNavItems} sidebarTitle="KEMANUSA" sidebarSub="Panel Admin">
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Manajemen Anggota
          <small>Kelola seluruh anggota aktif KEMANUSA Parepare</small>
        </div>
        <button className="btn-green" style={{ fontSize: '13px' }}>+ Tambah Anggota</button>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
          <div className={styles.sectionCardTitle}>👥 Anggota Aktif ({filtered.length})</div>
          <input
            type="text"
            placeholder="🔍 Cari nama atau email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 14px', borderRadius: '8px', border: '1.5px solid var(--batas)',
              fontSize: '13px', fontFamily: 'var(--font-b)', outline: 'none', width: '220px',
            }}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.tbl}>
            <thead>
              <tr><th>Nama</th><th>Email</th><th>Role</th><th>Divisi</th><th>Universitas</th><th>Bergabung</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--abu)' }}>Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--abu)' }}>Tidak ada anggota ditemukan</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.nama_depan} {a.nama_belakang}</td>
                  <td>{a.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{a.role}</td>
                  <td>{a.divisi || '—'}</td>
                  <td>{a.universitas || '—'}</td>
                  <td>{new Date(a.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</td>
                  <td><span className="status-pill sp-aktif">Aktif</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
