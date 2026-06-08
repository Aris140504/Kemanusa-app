'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/dashboard/anggota', icon: '🏠', label: 'Beranda' },
  { href: '/dashboard/anggota/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/anggota/kegiatan', icon: '📅', label: 'Kegiatan' },
  { href: '/dashboard/anggota/arsip', icon: '📁', label: 'Arsip Dokumen' },
  { href: '/dashboard/anggota/bacaan', icon: '📚', label: 'Bacaan Humas' },
  { href: '/dashboard/anggota/profil', icon: '👤', label: 'Profil Saya' },
];

export default function PengumumanAnggota() {
  const supabase = createClient();
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);
      const { data } = await supabase.from('pengumuman').select('*').order('created_at', { ascending: false });
      setList(data || []);
    };
    load();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const Sidebar = () => (
    <aside style={{ width: 230, flexShrink: 0, background: '#0c1f14', display: 'flex', flexDirection: 'column', padding: '24px 14px', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50 }} className="sidebar-desk">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700, color: '#155228' }}>K</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece3', lineHeight: 1.3 }}>KEMANUSA<span style={{ display: 'block', fontSize: 10, color: '#7a8a7e', fontWeight: 400 }}>Portal Anggota</span></div>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 7, fontSize: 13, fontWeight: 500, color: n.href === '/dashboard/anggota/pengumuman' ? '#a8e6c0' : 'rgba(255,255,255,0.5)', background: n.href === '/dashboard/anggota/pengumuman' ? 'rgba(26,122,60,0.25)' : 'transparent', textDecoration: 'none' }}>{n.icon} {n.label}</Link>
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
          <div style={{ fontWeight: 600, fontSize: 15 }}>📣 Pengumuman</div>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#f0ece3', fontSize: 22, cursor: 'pointer' }}>☰</button>
        </div>

        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 26, fontWeight: 700, color: '#0c1f14', marginBottom: 6 }}>📣 Pengumuman</h1>
        <p style={{ fontSize: 13, color: '#7a8a7e', marginBottom: 24 }}>Informasi dan pengumuman terbaru dari organisasi</p>

        {/* MODAL DETAIL */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 560, width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, background: '#f0ede6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
              <div style={{ fontSize: 11, color: '#7a8a7e', marginBottom: 8 }}>{new Date(selected.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 24, fontWeight: 700, color: '#0c1f14', marginBottom: 16 }}>{selected.judul}</h2>
              <p style={{ fontSize: 14, color: '#3a4d3e', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.isi}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', color: '#7a8a7e', fontSize: 13 }}>Belum ada pengumuman</div>
          ) : list.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{ background: '#fff', border: '1px solid #dde8e1', borderRadius: 12, padding: '18px 22px', cursor: 'pointer', transition: 'all .2s', boxShadow: '0 1px 3px rgba(12,31,20,.04)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(12,31,20,.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(12,31,20,.04)')}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0c1f14', marginBottom: 6 }}>{p.judul}</div>
              <div style={{ fontSize: 13, color: '#7a8a7e', marginBottom: 8, lineHeight: 1.5 }}>{p.isi.substring(0, 100)}...</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#b0bdb3' }}>{new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span style={{ fontSize: 12, color: '#1a7a3c', fontWeight: 500 }}>Baca selengkapnya →</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <style>{`@media(max-width:768px){.sidebar-desk{transform:translateX(-100%) !important;}.main-content{margin-left:0 !important;padding:16px !important;}.mobile-topbar{display:flex !important;}}`}</style>
    </div>
  );
}
