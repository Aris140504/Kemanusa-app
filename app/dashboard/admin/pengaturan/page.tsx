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

export default function PengaturanPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update({
      nama_depan: profile.nama_depan,
      nama_belakang: profile.nama_belakang,
      no_whatsapp: profile.no_whatsapp,
      universitas: profile.universitas,
      divisi: profile.divisi,
    }).eq('id', user!.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout navItems={adminNavItems} sidebarTitle="KEMANUSA" sidebarSub="Panel Admin">
      <div className={styles.topbar}>
        <div className={styles.greeting}>
          Pengaturan Akun
          <small>Kelola informasi profil Anda</small>
        </div>
      </div>

      <div className={styles.sectionCard} style={{ maxWidth: '600px' }}>
        <div className={styles.sectionCardHeader}>
          <div className={styles.sectionCardTitle}>👤 Informasi Profil</div>
        </div>
        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          <div className="row-2">
            <div className="field-group">
              <label className="field-label">Nama Depan</label>
              <div className="field-wrap">
                <span className="field-icon">👤</span>
                <input className="field-input" type="text" value={profile.nama_depan || ''} onChange={e => setProfile(p => ({ ...p, nama_depan: e.target.value }))} />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Nama Belakang</label>
              <div className="field-wrap">
                <span className="field-icon">👤</span>
                <input className="field-input" type="text" value={profile.nama_belakang || ''} onChange={e => setProfile(p => ({ ...p, nama_belakang: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Email</label>
            <div className="field-wrap">
              <span className="field-icon">✉️</span>
              <input className="field-input" type="email" value={profile.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Nomor WhatsApp</label>
            <div className="field-wrap">
              <span className="field-icon">📱</span>
              <input className="field-input" type="text" value={profile.no_whatsapp || ''} onChange={e => setProfile(p => ({ ...p, no_whatsapp: e.target.value }))} />
            </div>
          </div>
          <div className="row-2">
            <div className="field-group">
              <label className="field-label">Universitas</label>
              <div className="field-wrap">
                <span className="field-icon">🏫</span>
                <input className="field-input" type="text" value={profile.universitas || ''} onChange={e => setProfile(p => ({ ...p, universitas: e.target.value }))} />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Divisi</label>
              <div className="field-wrap">
                <span className="field-icon">🏷️</span>
                <input className="field-input" type="text" value={profile.divisi || ''} onChange={e => setProfile(p => ({ ...p, divisi: e.target.value }))} />
              </div>
            </div>
          </div>

          {saved && (
            <div style={{ background: '#e8f5ed', border: '1px solid #c5e8d1', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: 'var(--hijau-mid)', marginBottom: '16px' }}>
              ✅ Profil berhasil disimpan
            </div>
          )}

          <button type="submit" className="btn-green" disabled={saving}>
            {saving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
