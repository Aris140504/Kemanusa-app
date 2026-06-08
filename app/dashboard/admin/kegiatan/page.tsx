'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from '@/components/dashboard/DashboardLayout.module.css';
import type { Kegiatan } from '@/types';

const adminNavItems = [
  { href: '/dashboard/admin', icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/admin/anggota', icon: '👥', label: 'Anggota' },
  { href: '/dashboard/admin/pendaftaran', icon: '📋', label: 'Pendaftaran' },
  { href: '/dashboard/admin/kegiatan', icon: '📅', label: 'Kegiatan' },
  { href: '/dashboard/admin/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/admin/pengaturan', icon: '⚙️', label: 'Pengaturan' },
];

const statusColors: Record<string, string> = {
  upcoming: 'sp-pending',
  ongoing: 'sp-aktif',
  selesai: 'status-pill',
};

export default function KegiatanPage() {
  const supabase = createClient();
  const [list, setList] = useState<Kegiatan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nama: '', deskripsi: '', tanggal: '', lokasi: '', status: 'upcoming' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('kegiatan').select('*').order('tanggal', { ascending: false });
    setList(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('kegiatan').insert({ ...form, dibuat_oleh: user?.id });
    setForm({ nama: '', deskripsi: '', tanggal: '', lokasi: '', status: 'upcoming' });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus kegiatan ini?')) return;
    await supabase.from('kegiatan').delete().eq('id', id);
    load();
  };

  return (
    <DashboardLayout navItems={adminNavItems} sidebarTitle="KEMANUSA" sidebarSub="Panel Admin">
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Kegiatan Organisasi
          <small>Kelola agenda dan kegiatan KEMANUSA Parepare</small>
        </div>
        <button className="btn-green" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Batal' : '+ Tambah Kegiatan'}
        </button>
      </div>

      {showForm && (
        <div className={styles.sectionCard} style={{ marginBottom: '24px' }}>
          <div className={styles.sectionCardHeader}>
            <div className={styles.sectionCardTitle}>📅 Tambah Kegiatan Baru</div>
          </div>
          <form onSubmit={handleSave} style={{ padding: '24px' }}>
            <div className="row-2">
              <div className="field-group">
                <label className="field-label">Nama Kegiatan</label>
                <div className="field-wrap">
                  <span className="field-icon">📅</span>
                  <input className="field-input" type="text" placeholder="Nama kegiatan" required value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Tanggal</label>
                <div className="field-wrap">
                  <span className="field-icon">📆</span>
                  <input className="field-input" type="date" required value={form.tanggal} onChange={e => setForm(p => ({ ...p, tanggal: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="row-2">
              <div className="field-group">
                <label className="field-label">Lokasi</label>
                <div className="field-wrap">
                  <span className="field-icon">📍</span>
                  <input className="field-input" type="text" placeholder="Lokasi kegiatan" value={form.lokasi} onChange={e => setForm(p => ({ ...p, lokasi: e.target.value }))} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  style={{ width: '100%', height: '44px', border: '1.5px solid var(--batas)', borderRadius: 'var(--r-sm)', padding: '0 12px', fontSize: '13px', fontFamily: 'var(--font-b)', background: '#fff', outline: 'none' }}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Berlangsung</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Deskripsi</label>
              <textarea
                className="field-input"
                rows={3}
                placeholder="Deskripsi kegiatan..."
                value={form.deskripsi}
                onChange={e => setForm(p => ({ ...p, deskripsi: e.target.value }))}
                style={{ height: 'auto', padding: '12px', resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn-green" disabled={saving}>
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Kegiatan'}
            </button>
          </form>
        </div>
      )}

      <div className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
          <div className={styles.sectionCardTitle}>📅 Daftar Kegiatan ({list.length})</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.tbl}>
            <thead>
              <tr><th>Nama Kegiatan</th><th>Tanggal</th><th>Lokasi</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--abu)' }}>Belum ada kegiatan</td></tr>
              ) : list.map(k => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 500 }}>{k.nama}</td>
                  <td>{new Date(k.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td>{k.lokasi || '—'}</td>
                  <td>
                    <span className={`status-pill ${statusColors[k.status] || 'sp-pending'}`} style={{ textTransform: 'capitalize' }}>
                      {k.status}
                    </span>
                  </td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.abNo}`} onClick={() => handleDelete(k.id)}>✗ Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
