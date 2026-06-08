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

export default function PendaftaranPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [tab, setTab] = useState<'pending' | 'aktif' | 'ditolak'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', tab)
        .order('created_at', { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    load();
  }, [tab]);

  const handleAction = async (id: string, status: 'aktif' | 'ditolak') => {
    await supabase.from('profiles').update({ status }).eq('id', id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <DashboardLayout navItems={adminNavItems} sidebarTitle="KEMANUSA" sidebarSub="Panel Admin">
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Manajemen Pendaftaran
          <small>Review dan kelola pendaftaran anggota baru</small>
        </div>
      </div>

      {/* TAB */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['pending', 'aktif', 'ditolak'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
              fontFamily: 'var(--font-b)', cursor: 'pointer', border: '1.5px solid',
              background: tab === t ? 'var(--hijau-mid)' : '#fff',
              color: tab === t ? '#fff' : 'var(--abu)',
              borderColor: tab === t ? 'var(--hijau-mid)' : 'var(--batas)',
              transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {t === 'pending' ? '⏳ Pending' : t === 'aktif' ? '✅ Diterima' : '❌ Ditolak'}
          </button>
        ))}
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
          <div className={styles.sectionCardTitle}>
            {tab === 'pending' ? '⏳ Menunggu Persetujuan' : tab === 'aktif' ? '✅ Anggota Diterima' : '❌ Pendaftaran Ditolak'}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.tbl}>
            <thead>
              <tr><th>Nama</th><th>Email</th><th>Role</th><th>WhatsApp</th><th>Tanggal Daftar</th><th>Status</th>{tab === 'pending' && <th>Aksi</th>}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--abu)' }}>Memuat data...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--abu)' }}>Tidak ada data</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.nama_depan} {u.nama_belakang}</td>
                  <td>{u.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                  <td>{u.no_whatsapp || '—'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span className={`status-pill sp-${u.status === 'aktif' ? 'aktif' : u.status === 'ditolak' ? 'ditolak' : 'pending'}`}>
                      {u.status === 'aktif' ? 'Diterima' : u.status === 'ditolak' ? 'Ditolak' : 'Pending'}
                    </span>
                  </td>
                  {tab === 'pending' && (
                    <td>
                      <button className={`${styles.actionBtn} ${styles.abOk}`} onClick={() => handleAction(u.id, 'aktif')}>✓ Terima</button>
                      <button className={`${styles.actionBtn} ${styles.abNo}`} onClick={() => handleAction(u.id, 'ditolak')}>✗ Tolak</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
