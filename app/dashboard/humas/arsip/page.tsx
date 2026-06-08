'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from '@/components/dashboard/DashboardLayout.module.css';
import humasStyles from '../page.module.css';
import type { ArsipDokumen } from '@/types';

const humasNavItems = [
  { href: '/dashboard/humas', icon: '📚', label: 'Catatan Buku' },
  { href: '/dashboard/humas/arsip', icon: '📁', label: 'Arsip Dokumen' },
  { href: '/dashboard/humas/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/humas/data-penting', icon: '💾', label: 'Data Penting' },
  { href: '/dashboard/admin', icon: '◀', label: 'Dashboard Admin' },
];

export default function ArsipPage() {
  const supabase = createClient();
  const [arsip, setArsip] = useState<ArsipDokumen[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nama_file: '', deskripsi: '', drive_url: '', kategori: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase
      .from('arsip_dokumen')
      .select('*, profiles(nama_depan, nama_belakang)')
      .order('created_at', { ascending: false });
    setArsip(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('arsip_dokumen').insert({ ...form, diupload_oleh: user?.id });
    setForm({ nama_file: '', deskripsi: '', drive_url: '', kategori: '' });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus arsip ini?')) return;
    await supabase.from('arsip_dokumen').delete().eq('id', id);
    load();
  };

  return (
    <DashboardLayout navItems={humasNavItems} sidebarTitle="KEMANUSA" sidebarSub="Divisi Humas">
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Arsip Dokumen
          <small>Divisi Humas · Kelola dokumen & file organisasi</small>
        </div>
        <button className="btn-green" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Batal' : '+ Upload Arsip'}
        </button>
      </div>

      {showForm && (
        <div className={styles.sectionCard} style={{ marginBottom: '24px' }}>
          <div className={styles.sectionCardHeader}>
            <div className={styles.sectionCardTitle}>📁 Upload Arsip Baru</div>
          </div>
          <form onSubmit={handleSave} style={{ padding: '24px' }}>
            <div className="field-group">
              <label className="field-label">Nama File / Dokumen</label>
              <div className="field-wrap">
                <span className="field-icon">📄</span>
                <input className="field-input" type="text" placeholder="Nama file atau dokumen" required value={form.nama_file} onChange={e => setForm(p => ({ ...p, nama_file: e.target.value }))} />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Link Google Drive</label>
              <div className="field-wrap">
                <span className="field-icon">🔗</span>
                <input className="field-input" type="url" placeholder="https://drive.google.com/..." required value={form.drive_url} onChange={e => setForm(p => ({ ...p, drive_url: e.target.value }))} />
              </div>
            </div>
            <div className="row-2">
              <div className="field-group">
                <label className="field-label">Kategori</label>
                <div className="field-wrap">
                  <span className="field-icon">🏷️</span>
                  <input className="field-input" type="text" placeholder="SK, Surat, Notulen..." value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Deskripsi (Opsional)</label>
                <div className="field-wrap">
                  <span className="field-icon">📝</span>
                  <input className="field-input" type="text" placeholder="Deskripsi singkat..." value={form.deskripsi} onChange={e => setForm(p => ({ ...p, deskripsi: e.target.value }))} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn-green" disabled={saving}>
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Arsip'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-d)', fontSize: '22px', fontWeight: 600, color: 'var(--hijau-tua)' }}>
          Dokumen Tersimpan ({arsip.length})
        </h3>
      </div>

      <div className={humasStyles.arsipGrid}>
        {arsip.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--abu)' }}>
            Belum ada dokumen tersimpan
          </div>
        ) : arsip.map(a => (
          <div key={a.id} className={humasStyles.arsipCard}>
            <div className={humasStyles.arsipIcon}>📄</div>
            <div className={humasStyles.arsipInfo}>
              <div className={humasStyles.arsipName}>{a.nama_file}</div>
              <div className={humasStyles.arsipMeta}>
                {a.kategori && <span style={{ marginRight: '8px', background: 'var(--hijau-light)', color: 'var(--hijau-mid)', padding: '1px 7px', borderRadius: '10px' }}>{a.kategori}</span>}
                {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <a href={a.drive_url} target="_blank" rel="noopener noreferrer"
                style={{ padding: '7px 14px', borderRadius: '7px', background: 'var(--hijau-light)', color: 'var(--hijau-mid)', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}>
                🔗 Buka
              </a>
              <button
                onClick={() => handleDelete(a.id)}
                style={{ padding: '7px 12px', borderRadius: '7px', background: 'var(--merah-soft)', color: 'var(--merah)', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
