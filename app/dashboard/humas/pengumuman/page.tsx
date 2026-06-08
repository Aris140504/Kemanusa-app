'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import styles from '@/components/dashboard/DashboardLayout.module.css';
import type { Pengumuman } from '@/types';

const humasNavItems = [
  { href: '/dashboard/humas', icon: '📚', label: 'Catatan Buku' },
  { href: '/dashboard/humas/arsip', icon: '📁', label: 'Arsip Dokumen' },
  { href: '/dashboard/humas/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/humas/data-penting', icon: '💾', label: 'Data Penting' },
  { href: '/dashboard/admin', icon: '◀', label: 'Dashboard Admin' },
];

export default function HumasPengumuman() {
  const supabase = createClient();
  const [list, setList] = useState<Pengumuman[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('pengumuman').select('*').order('created_at', { ascending: false });
    setList(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('pengumuman').insert({ judul, isi, dibuat_oleh: user?.id });
    setJudul(''); setIsi(''); setShowForm(false); setSaving(false);
    load();
  };

  return (
    <DashboardLayout navItems={humasNavItems} sidebarTitle="KEMANUSA" sidebarSub="Divisi Humas">
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Pengumuman Humas
          <small>Buat dan kelola pengumuman dari divisi humas</small>
        </div>
        <button className="btn-green" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Batal' : '+ Buat Pengumuman'}
        </button>
      </div>

      {showForm && (
        <div className={styles.sectionCard} style={{ marginBottom: '24px' }}>
          <div className={styles.sectionCardHeader}>
            <div className={styles.sectionCardTitle}>✏️ Buat Pengumuman Baru</div>
          </div>
          <form onSubmit={handleSave} style={{ padding: '24px' }}>
            <div className="field-group">
              <label className="field-label">Judul</label>
              <div className="field-wrap">
                <span className="field-icon">📣</span>
                <input className="field-input" type="text" placeholder="Judul pengumuman..." required value={judul} onChange={e => setJudul(e.target.value)} />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Isi Pengumuman</label>
              <textarea className="field-input" rows={5} placeholder="Tuliskan isi pengumuman..." required value={isi} onChange={e => setIsi(e.target.value)} style={{ height: 'auto', padding: '12px', resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn-green" disabled={saving}>
              {saving ? '⏳ Menyimpan...' : '💾 Publikasikan'}
            </button>
          </form>
        </div>
      )}

      <div className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
          <div className={styles.sectionCardTitle}>📣 Pengumuman ({list.length})</div>
        </div>
        {list.length === 0 ? (
          <p style={{ padding: '40px', textAlign: 'center', color: 'var(--abu)', fontSize: '13px' }}>Belum ada pengumuman</p>
        ) : list.map(p => (
          <div key={p.id} style={{ padding: '20px 24px', borderBottom: '1px solid var(--batas)' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>{p.judul}</div>
            <p style={{ fontSize: '13px', color: '#4a5e4e', lineHeight: 1.6, marginBottom: '8px' }}>{p.isi}</p>
            <span style={{ fontSize: '11px', color: 'var(--abu)' }}>
              {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
