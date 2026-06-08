'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from '@/components/dashboard/DashboardLayout.module.css';

const humasNavItems = [
  { href: '/dashboard/humas', icon: '📚', label: 'Catatan Buku' },
  { href: '/dashboard/humas/arsip', icon: '📁', label: 'Arsip Dokumen' },
  { href: '/dashboard/humas/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/humas/data-penting', icon: '💾', label: 'Data Penting' },
  { href: '/dashboard/admin', icon: '◀', label: 'Dashboard Admin' },
];

interface DataPenting {
  id: string;
  judul: string;
  isi: string;
  kategori: string;
  created_at: string;
  dibuat_oleh: string;
}

export default function DataPentingPage() {
  const supabase = createClient();
  const [data, setData] = useState<DataPenting[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ judul: '', isi: '', kategori: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    // Simpan data penting di tabel arsip_dokumen dengan kategori 'data-penting'
    // atau bisa buat tabel baru. Di sini kita pakai arsip_dokumen dengan kategori khusus
    const { data: rows } = await supabase
      .from('arsip_dokumen')
      .select('*')
      .eq('kategori', 'data-penting')
      .order('created_at', { ascending: false });

    // Map ke format yang dibutuhkan
    const mapped = (rows || []).map(r => ({
      id: r.id,
      judul: r.nama_file,
      isi: r.deskripsi || '',
      kategori: 'Data Penting',
      created_at: r.created_at,
      dibuat_oleh: r.diupload_oleh,
    }));
    setData(mapped);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('arsip_dokumen').insert({
      nama_file: form.judul,
      deskripsi: form.isi,
      drive_url: '-',
      kategori: 'data-penting',
      diupload_oleh: user?.id,
    });
    setForm({ judul: '', isi: '', kategori: '' });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data ini?')) return;
    await supabase.from('arsip_dokumen').delete().eq('id', id);
    load();
  };

  return (
    <DashboardLayout navItems={humasNavItems} sidebarTitle="KEMANUSA" sidebarSub="Divisi Humas">
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Data Penting Organisasi
          <small>Divisi Humas · Dokumentasi informasi penting</small>
        </div>
        <button className="btn-green" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Batal' : '+ Tambah Data'}
        </button>
      </div>

      {showForm && (
        <div className={styles.sectionCard} style={{ marginBottom: '24px' }}>
          <div className={styles.sectionCardHeader}>
            <div className={styles.sectionCardTitle}>💾 Tambah Data Penting</div>
          </div>
          <form onSubmit={handleSave} style={{ padding: '24px' }}>
            <div className="field-group">
              <label className="field-label">Judul / Nama Data</label>
              <div className="field-wrap">
                <span className="field-icon">💾</span>
                <input className="field-input" type="text" placeholder="Nama data penting..." required value={form.judul} onChange={e => setForm(p => ({ ...p, judul: e.target.value }))} />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Isi / Keterangan</label>
              <textarea className="field-input" rows={4} placeholder="Tulis keterangan data penting ini..." required value={form.isi} onChange={e => setForm(p => ({ ...p, isi: e.target.value }))} style={{ height: 'auto', padding: '12px', resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn-green" disabled={saving}>
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Data'}
            </button>
          </form>
        </div>
      )}

      <div className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
          <div className={styles.sectionCardTitle}>💾 Data Penting Tersimpan ({data.length})</div>
        </div>
        {data.length === 0 ? (
          <p style={{ padding: '40px', textAlign: 'center', color: 'var(--abu)', fontSize: '13px' }}>Belum ada data penting</p>
        ) : data.map(d => (
          <div key={d.id} style={{ padding: '20px 24px', borderBottom: '1px solid var(--batas)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>{d.judul}</div>
              <p style={{ fontSize: '13px', color: '#4a5e4e', lineHeight: 1.6, maxWidth: '600px', marginBottom: '8px' }}>{d.isi}</p>
              <span style={{ fontSize: '11px', color: 'var(--abu)' }}>
                {new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button onClick={() => handleDelete(d.id)}
              style={{ padding: '7px 14px', borderRadius: '7px', background: 'var(--merah-soft)', color: 'var(--merah)', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'var(--font-b)', flexShrink: 0 }}>
              ✕ Hapus
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
