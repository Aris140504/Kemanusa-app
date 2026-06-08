'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from '@/components/dashboard/DashboardLayout.module.css';
import type { Profile, Pengumuman } from '@/types';

const adminNavItems = [
  { href: '/dashboard/admin', icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/admin/anggota', icon: '👥', label: 'Anggota' },
  { href: '/dashboard/admin/pendaftaran', icon: '📋', label: 'Pendaftaran' },
  { href: '/dashboard/admin/kegiatan', icon: '📅', label: 'Kegiatan' },
  { href: '/dashboard/admin/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/admin/pengaturan', icon: '⚙️', label: 'Pengaturan' },
];

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({ total: 0, pending: 0, kegiatan: 0, dokumen: 0 });
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Current user profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setCurrentUser(profile);

      // Stats
      const [{ count: total }, { count: pending }, { count: kegiatan }, { count: dokumen }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'aktif'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('kegiatan').select('*', { count: 'exact', head: true }),
        supabase.from('arsip_dokumen').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ total: total || 0, pending: pending || 0, kegiatan: kegiatan || 0, dokumen: dokumen || 0 });

      // Pending users
      const { data: pendingData } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);
      setPendingUsers(pendingData || []);

      // Pengumuman terbaru
      const { data: pData } = await supabase
        .from('pengumuman')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      setPengumuman(pData || []);
    };
    load();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('profiles').update({ status: 'aktif' }).eq('id', id);
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    setStats(prev => ({ ...prev, pending: prev.pending - 1, total: prev.total + 1 }));
  };

  const handleReject = async (id: string) => {
    await supabase.from('profiles').update({ status: 'ditolak' }).eq('id', id);
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    setStats(prev => ({ ...prev, pending: prev.pending - 1 }));
  };

  return (
    <DashboardLayout navItems={adminNavItems} sidebarTitle="KEMANUSA" sidebarSub="Panel Admin">
      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Dashboard Admin
          <small>Selamat datang, {currentUser ? `${currentUser.nama_depan} ${currentUser.nama_belakang}` : 'Administrator'}</small>
        </div>
        <div className={styles.avatar}>{currentUser?.nama_depan?.charAt(0) || 'A'}</div>
      </div>

      {/* STAT CARDS */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{stats.total}</span>
          <div className={styles.statLabel}>Total Anggota Aktif</div>
          <span className={`${styles.statBadge} ${styles.badgeGreen}`}>▲ Aktif</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{stats.pending}</span>
          <div className={styles.statLabel}>Pendaftaran Masuk</div>
          <span className={`${styles.statBadge} ${styles.badgeGold}`}>Menunggu review</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{stats.kegiatan}</span>
          <div className={styles.statLabel}>Kegiatan Terdaftar</div>
          <span className={`${styles.statBadge} ${styles.badgeBlue}`}>Total kegiatan</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{stats.dokumen}</span>
          <div className={styles.statLabel}>Dokumen Tersimpan</div>
          <span className={`${styles.statBadge} ${styles.badgeGreen}`}>Di Google Drive</span>
        </div>
      </div>

      {/* PENDAFTARAN PENDING */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
          <div className={styles.sectionCardTitle}>📋 Pendaftaran Menunggu Persetujuan</div>
          <Link href="/dashboard/admin/pendaftaran" className="btn-sm">Lihat Semua</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.tbl}>
            <thead>
              <tr>
                <th>Nama</th><th>Email</th><th>Role</th><th>Tanggal</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--abu)', padding: '32px' }}>Tidak ada pendaftaran baru</td></tr>
              ) : pendingUsers.map(u => (
                <tr key={u.id}>
                  <td>{u.nama_depan} {u.nama_belakang}</td>
                  <td>{u.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                  <td>{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                  <td><span className="status-pill sp-pending">Pending</span></td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.abOk}`} onClick={() => handleApprove(u.id)}>✓ Terima</button>
                    <button className={`${styles.actionBtn} ${styles.abNo}`} onClick={() => handleReject(u.id)}>✗ Tolak</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PENGUMUMAN TERBARU */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
          <div className={styles.sectionCardTitle}>📣 Pengumuman Terbaru</div>
          <Link href="/dashboard/admin/pengumuman" className="btn-sm">+ Tambah</Link>
        </div>
        <div style={{ padding: '8px 0' }}>
          {pengumuman.length === 0 ? (
            <p style={{ padding: '24px', textAlign: 'center', color: 'var(--abu)', fontSize: '13px' }}>Belum ada pengumuman</p>
          ) : pengumuman.map(p => (
            <div key={p.id} style={{ padding: '16px 24px', borderBottom: '1px solid var(--batas)' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{p.judul}</div>
              <div style={{ fontSize: '12px', color: 'var(--abu)' }}>{new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
