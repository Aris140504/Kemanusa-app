'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from '@/components/dashboard/DashboardLayout.module.css';
import type { Pengumuman } from '@/types';

const adminNavItems = [
  { href: '/dashboard/admin', icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/admin/anggota', icon: '👥', label: 'Anggota' },
  { href: '/dashboard/admin/pendaftaran', icon: '📋', label: 'Pendaftaran' },
  { href: '/dashboard/admin/kegiatan', icon: '📅', label: 'Kegiatan' },
  { href: '/dashboard/admin/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/admin/pengaturan', icon: '⚙️', label: 'Pengaturan' },
];

export default function PengumumanPage() {
  const supabase = createClient();
  const [list, setList] = useState<Pengumuman[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from('pengumuman')
      .select('*')
      .order('created_at', { ascending: false });
    setList(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('pengumuman').insert({ judul, isi, dibuat_oleh: user?.id });
    setJudul(''); setIsi(''); setShowForm(false);
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus pengumuman ini?')) return;
    await supabase.from('pengumuman').delete().eq('id', id);
    load();
  };

  return (
    <DashboardLayout navItems={adminNavItems} sidebarTitle="KEMANUSA" sidebarSub="Panel Admin">
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Pengumuman
          <small>Kelola pengumuman organisasi KEMANUSA</small>
        </div>
        <button className="btn-green" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Batal' : '+ Buat Pengumuman'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className={styles.sectionCard} style={{ marginBottom: '24px' }}>
          <div className={styles.sectionCardHeader}>
            <div className={styles.sectionCardTitle}>✏️ Buat Pengumuman Baru</div>
          </div>
          <form onSubmit={handleSave} style={{ padding: '24px' }}>
            <div className="field-group">
              <label className="field-label">Judul Pengumuman</label>
              <div className="field-wrap">
                <span className="field-icon">📣</span>
                <input className="field-input" type="text" placeholder="Judul pengumuman..." required value={judul} onChange={e => setJudul(e.target.value)} />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Isi Pengumuman</label>
              <textarea
                className="field-input"
                rows={5}
                placeholder="Tulis isi pengumuman di sini..."
                required
                value={isi}
                onChange={e => setIsi(e.target.value)}
                style={{ height: 'auto', padding: '12px', resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn-green" disabled={saving}>
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Pengumuman'}
            </button>
          </form>
        </div>
      )}

      {/* LIST */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
          <div className={styles.sectionCardTitle}>📣 Daftar Pengumuman ({list.length})</div>
        </div>
        {list.length === 0 ? (
          <p style={{ padding: '40px', textAlign: 'center', color: 'var(--abu)', fontSize: '13px' }}>Belum ada pengumuman</p>
        ) : list.map(p => (
          <div key={p.id} style={{ padding: '20px 24px', borderBottom: '1px solid var(--batas)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>{p.judul}</div>
                <p style={{ fontSize: '13px', color: 'var(--abu)', lineHeight: 1.6, maxWidth: '600px' }}>{p.isi}</p>
                <span style={{ fontSize: '11px', color: 'var(--abu)', marginTop: '8px', display: 'block' }}>
                  {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                style={{ padding: '6px 14px', borderRadius: '6px', background: 'var(--merah-soft)', color: 'var(--merah)', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'var(--font-b)', flexShrink: 0 }}
              >
                ✗ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
