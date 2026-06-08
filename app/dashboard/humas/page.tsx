'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from '@/components/dashboard/DashboardLayout.module.css';
import humasStyles from './page.module.css';
import type { CatatanBuku } from '@/types';

const humasNavItems = [
  { href: '/dashboard/humas', icon: '📚', label: 'Catatan Buku' },
  { href: '/dashboard/humas/arsip', icon: '📁', label: 'Arsip Dokumen' },
  { href: '/dashboard/humas/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/humas/data-penting', icon: '💾', label: 'Data Penting' },
  { href: '/dashboard/admin', icon: '◀', label: 'Dashboard Admin' },
];

const KATEGORI = ['Pengembangan Diri', 'Kepemimpinan', 'Produktivitas', 'Teknologi', 'Sosial', 'Lainnya'];

export default function HumasCatatanBuku() {
  const supabase = createClient();
  const [books, setBooks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ judul_buku: '', nama_penulis: '', tahun: '', kategori: '', ringkasan: '', pelajaran: '' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase
      .from('catatan_buku')
      .select('*, profiles(nama_depan, nama_belakang)')
      .order('created_at', { ascending: false });
    setBooks(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    let pdf_url = null;

    // Upload PDF jika ada
    if (pdfFile) {
      setUploadProgress('Mengupload PDF...');
      const fileName = `buku/${Date.now()}_${pdfFile.name.replace(/\s/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kemanusa-files')
        .upload(fileName, pdfFile, { cacheControl: '3600', upsert: false });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('kemanusa-files').getPublicUrl(fileName);
        pdf_url = urlData.publicUrl;
      }
      setUploadProgress('');
    }

    await supabase.from('catatan_buku').insert({ ...form, pdf_url, dicatat_oleh: user?.id });
    setForm({ judul_buku: '', nama_penulis: '', tahun: '', kategori: '', ringkasan: '', pelajaran: '' });
    setPdfFile(null);
    setShowForm(false);
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus catatan ini?')) return;
    await supabase.from('catatan_buku').delete().eq('id', id);
    load();
  };

  const filtered = books.filter(b =>
    `${b.judul_buku} ${b.nama_penulis} ${b.kategori}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={humasNavItems} sidebarTitle="KEMANUSA" sidebarSub="Divisi Humas">
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Catatan Buku Bacaan
          <small>Divisi Humas · Dokumentasi Pengetahuan Organisasi</small>
        </div>
        <button className="btn-green" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Batal' : '+ Tambah Catatan'}
        </button>
      </div>

      {showForm && (
        <div className={styles.sectionCard} style={{ marginBottom: 28 }}>
          <div className={styles.sectionCardHeader}>
            <div className={styles.sectionCardTitle}>✏️ Tulis Catatan Buku Baru</div>
          </div>
          <form onSubmit={handleSave} style={{ padding: 24 }}>
            <div className="row-2">
              <div className="field-group">
                <label className="field-label">Judul Buku</label>
                <div className="field-wrap">
                  <span className="field-icon">📗</span>
                  <input className="field-input" type="text" placeholder="Atomic Habits" required value={form.judul_buku} onChange={e => setForm(p => ({ ...p, judul_buku: e.target.value }))} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Nama Penulis</label>
                <div className="field-wrap">
                  <span className="field-icon">✍️</span>
                  <input className="field-input" type="text" placeholder="James Clear" required value={form.nama_penulis} onChange={e => setForm(p => ({ ...p, nama_penulis: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="row-2">
              <div className="field-group">
                <label className="field-label">Tahun Terbit</label>
                <div className="field-wrap">
                  <span className="field-icon">📅</span>
                  <input className="field-input" type="text" placeholder="2018" value={form.tahun} onChange={e => setForm(p => ({ ...p, tahun: e.target.value }))} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Kategori</label>
                <select value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))}
                  style={{ width: '100%', height: 44, border: '1.5px solid var(--batas)', borderRadius: 'var(--r-sm)', padding: '0 12px', fontSize: 13, fontFamily: 'var(--font-b)', background: '#fff', outline: 'none' }}>
                  <option value="">Pilih kategori...</option>
                  {KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Ringkasan Singkat</label>
              <textarea className="field-input" rows={3} placeholder="Tuliskan ringkasan..." required value={form.ringkasan} onChange={e => setForm(p => ({ ...p, ringkasan: e.target.value }))} style={{ height: 'auto', padding: 12, resize: 'vertical' }} />
            </div>
            <div className="field-group">
              <label className="field-label">Pelajaran yang Diambil</label>
              <textarea className="field-input" rows={2} placeholder="Pelajaran untuk anggota KEMANUSA..." required value={form.pelajaran} onChange={e => setForm(p => ({ ...p, pelajaran: e.target.value }))} style={{ height: 'auto', padding: 12, resize: 'vertical' }} />
            </div>
            {/* PDF UPLOAD */}
            <div className="field-group">
              <label className="field-label">Upload PDF Buku (Opsional)</label>
              <div style={{ border: '1.5px dashed var(--batas)', borderRadius: 'var(--r-sm)', padding: '16px 20px', background: '#fafaf8', cursor: 'pointer' }}>
                <input type="file" accept=".pdf" id="pdfInput" style={{ display: 'none' }}
                  onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                <label htmlFor="pdfInput" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--abu)' }}>
                  📕 {pdfFile ? <span style={{ color: 'var(--hijau-mid)', fontWeight: 500 }}>✅ {pdfFile.name}</span> : 'Klik untuk pilih file PDF'}
                </label>
              </div>
              {uploadProgress && <p style={{ fontSize: 12, color: 'var(--hijau-aksen)', marginTop: 6 }}>⏳ {uploadProgress}</p>}
            </div>
            <button type="submit" className="btn-green" disabled={saving}>
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Catatan'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-d)', fontSize: 22, fontWeight: 600, color: 'var(--hijau-tua)' }}>
          Perpustakaan Digital ({filtered.length})
        </h3>
        <input type="text" placeholder="🔍 Cari buku..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid var(--batas)', fontSize: 13, fontFamily: 'var(--font-b)', outline: 'none', width: 180 }} />
      </div>

      <div className={humasStyles.bukuGrid}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--abu)' }}>
            {search ? 'Buku tidak ditemukan' : 'Belum ada catatan buku'}
          </div>
        ) : filtered.map(b => (
          <div key={b.id} className={humasStyles.bukuCard}>
            {b.kategori && <span className={humasStyles.bukuTag}>{b.kategori}</span>}
            <div className={humasStyles.bukuTitle}>{b.judul_buku}</div>
            <div className={humasStyles.bukuAuthor}>{b.nama_penulis}{b.tahun ? ` · ${b.tahun}` : ''}</div>
            <p className={humasStyles.bukuPreview}>{b.ringkasan}</p>
            {b.pelajaran && (
              <div className={humasStyles.bukuPelajaran}>
                <strong>💡 Pelajaran:</strong> {b.pelajaran}
              </div>
            )}
            <div className={humasStyles.bukuFooter}>
              <span className={humasStyles.bukuWriter}>
                📝 {b.profiles?.nama_depan || 'Humas'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={humasStyles.bukuDate}>{new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {b.pdf_url && (
                  <a href={b.pdf_url} target="_blank" rel="noopener noreferrer" download
                    style={{ padding: '4px 10px', borderRadius: 6, background: '#e8f5ed', color: '#155228', fontSize: 11, fontWeight: 500, textDecoration: 'none', border: '1px solid #dde8e1' }}>
                    ⬇ PDF
                  </a>
                )}
                <button onClick={() => handleDelete(b.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--abu)', padding: '2px 6px', borderRadius: 4 }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
