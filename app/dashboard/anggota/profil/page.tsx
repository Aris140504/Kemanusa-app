'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Profile } from '@/types';

const NAV = [
  { href: '/dashboard/anggota', icon: '🏠', label: 'Beranda' },
  { href: '/dashboard/anggota/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/anggota/kegiatan', icon: '📅', label: 'Kegiatan' },
  { href: '/dashboard/anggota/arsip', icon: '📁', label: 'Arsip Dokumen' },
  { href: '/dashboard/anggota/bacaan', icon: '📚', label: 'Bacaan Humas' },
  { href: '/dashboard/anggota/profil', icon: '👤', label: 'Profil Saya' },
];

export default function ProfilAnggota() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ no_whatsapp: '', universitas: '', divisi: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);
      setForm({ no_whatsapp: prof?.no_whatsapp || '', universitas: prof?.universitas || '', divisi: prof?.divisi || '' });
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update(form).eq('id', user!.id);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const Sidebar = () => (
    <aside style={{ width: 230, flexShrink: 0, background: '#0c1f14', display: 'flex', flexDirection: 'column', padding: '24px 14px', position: 'fixed', top: 0, left: menuOpen ? 0 : undefined, height: '100vh', zIndex: 50 }} className="sidebar-desk">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700, color: '#155228' }}>K</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece3', lineHeight: 1.3 }}>KEMANUSA<span style={{ display: 'block', fontSize: 10, color: '#7a8a7e', fontWeight: 400 }}>Portal Anggota</span></div>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 7, fontSize: 13, fontWeight: 500, color: n.href === '/dashboard/anggota/profil' ? '#a8e6c0' : 'rgba(255,255,255,0.5)', background: n.href === '/dashboard/anggota/profil' ? 'rgba(26,122,60,0.25)' : 'transparent', textDecoration: 'none' }}>{n.icon} {n.label}</Link>
        ))}
      </nav>
      <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={handleLogout} style={{ width: '100%', padding: '8px 11px', borderRadius: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'var(--font-b)', cursor: 'pointer', textAlign: 'left' }}>🚪 Keluar</button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0ede6', fontFamily: 'var(--font-b)' }}>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />}
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 230, padding: 28, overflowY: 'auto', maxHeight: '100vh' }} className="main-content">
        <div className="mobile-topbar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, background: '#0c1f14', padding: '14px 18px', borderRadius: 12, color: '#f0ece3' }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>👤 Profil Saya</div>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#f0ece3', fontSize: 22, cursor: 'pointer' }}>☰</button>
        </div>

        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 26, fontWeight: 700, color: '#0c1f14', marginBottom: 6 }}>👤 Profil Saya</h1>
        <p style={{ fontSize: 13, color: '#7a8a7e', marginBottom: 28 }}>Data diri dan informasi keanggotaan Anda</p>

        {/* AVATAR CARD */}
        <div style={{ background: '#0c1f14', borderRadius: 14, padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-d)', flexShrink: 0 }}>
            {profile?.nama_depan?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#f0ece3', fontFamily: 'var(--font-d)' }}>{profile?.nama_depan} {profile?.nama_belakang}</div>
            <div style={{ fontSize: 13, color: '#7a8a7e', marginTop: 4 }}>{profile?.email}</div>
            <span style={{ display: 'inline-flex', marginTop: 8, padding: '3px 12px', borderRadius: 20, background: '#e8f5ed', color: '#155228', fontSize: 11, fontWeight: 500 }}>✓ Anggota Aktif</span>
          </div>
        </div>

        {/* INFO READONLY */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #dde8e1', padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(12,31,20,.05)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0c1f14', marginBottom: 18 }}>Informasi Akun</h3>
          {[
            { label: 'Nama Lengkap', value: `${profile?.nama_depan || ''} ${profile?.nama_belakang || ''}` },
            { label: 'Email', value: profile?.email || '—' },
            { label: 'Role', value: profile?.role || 'anggota' },
            { label: 'Status', value: profile?.status || '—' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f5f2ed', fontSize: 13 }}>
              <span style={{ color: '#7a8a7e' }}>{r.label}</span>
              <strong style={{ color: '#0c1f14', fontWeight: 500 }}>{r.value}</strong>
            </div>
          ))}
        </div>

        {/* EDITABLE FORM */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #dde8e1', padding: 24, boxShadow: '0 1px 3px rgba(12,31,20,.05)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0c1f14', marginBottom: 6 }}>Edit Informasi Tambahan</h3>
          <p style={{ fontSize: 12, color: '#7a8a7e', marginBottom: 20 }}>Anda dapat mengubah nomor WhatsApp, universitas, dan divisi</p>
          <form onSubmit={handleSave}>
            {[
              { label: 'Nomor WhatsApp', key: 'no_whatsapp', placeholder: '+62 812 3456 7890', icon: '📱' },
              { label: 'Universitas / Kampus', key: 'universitas', placeholder: 'Nama universitas Anda', icon: '🏫' },
              { label: 'Divisi', key: 'divisi', placeholder: 'Divisi Anda di KEMANUSA', icon: '🏷️' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#5a6b5e', marginBottom: 6 }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15 }}>{f.icon}</span>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', height: 44, border: '1.5px solid #dde8e1', borderRadius: 8, padding: '0 12px 0 40px', fontSize: 13, fontFamily: 'var(--font-b)', color: '#0c1f14', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            ))}
            {saved && <div style={{ background: '#e8f5ed', border: '1px solid #c5e8d1', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#155228', marginBottom: 16 }}>✅ Profil berhasil disimpan!</div>}
            <button type="submit" disabled={saving} style={{ padding: '12px 32px', borderRadius: 40, background: '#155228', color: '#fff', border: 'none', fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-b)', cursor: 'pointer', transition: 'all .2s' }}>
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </form>
        </div>
      </main>
      <style>{`
        @media (max-width: 768px) {
          .sidebar-desk { transform: translateX(-100%) !important; }
          .main-content { margin-left: 0 !important; padding: 16px !important; }
          .mobile-topbar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
