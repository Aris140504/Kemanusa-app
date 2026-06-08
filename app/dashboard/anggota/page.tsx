'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Profile } from '@/types';

interface NavItem { href: string; icon: string; label: string; }

const NAV: NavItem[] = [
  { href: '/dashboard/anggota', icon: '🏠', label: 'Beranda' },
  { href: '/dashboard/anggota/pengumuman', icon: '📣', label: 'Pengumuman' },
  { href: '/dashboard/anggota/kegiatan', icon: '📅', label: 'Kegiatan' },
  { href: '/dashboard/anggota/arsip', icon: '📁', label: 'Arsip Dokumen' },
  { href: '/dashboard/anggota/bacaan', icon: '📚', label: 'Bacaan Humas' },
  { href: '/dashboard/anggota/profil', icon: '👤', label: 'Profil Saya' },
];

export default function DashboardAnggota() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [kegiatan, setKegiatan] = useState<any[]>([]);
  const [pengumuman, setPengumuman] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (prof?.role === 'admin') { router.push('/dashboard/admin'); return; }
      if (prof?.role === 'humas') { router.push('/dashboard/humas'); return; }
      setProfile(prof);
      const [{ data: k }, { data: p }] = await Promise.all([
        supabase.from('kegiatan').select('*').order('tanggal', { ascending: true }).limit(5),
        supabase.from('pengumuman').select('*').order('created_at', { ascending: false }).limit(3),
      ]);
      setKegiatan(k || []);
      setPengumuman(p || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ede6' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #dde8e1', borderTopColor: '#1a7a3c', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0ede6', fontFamily: 'var(--font-b)' }}>

      {/* MOBILE OVERLAY */}
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />}

      {/* SIDEBAR */}
      <aside style={{
        width: 230, flexShrink: 0, background: '#0c1f14',
        display: 'flex', flexDirection: 'column', padding: '24px 14px',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50,
        transform: menuOpen ? 'translateX(0)' : undefined,
        transition: 'transform .25s',
      }} className="sidebar-desk">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700, color: '#155228', flexShrink: 0 }}>K</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece3', lineHeight: 1.3 }}>KEMANUSA<span style={{ display: 'block', fontSize: 10, color: '#7a8a7e', fontWeight: 400, marginTop: 2 }}>Portal Anggota</span></div>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 11px', borderRadius: 7, fontSize: 13, fontWeight: 500,
              color: pathname === n.href ? '#a8e6c0' : 'rgba(255,255,255,0.5)',
              background: pathname === n.href ? 'rgba(26,122,60,0.25)' : 'transparent',
              textDecoration: 'none', transition: 'all .18s',
            }}>{n.icon} {n.label}</Link>
          ))}
        </nav>
        <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {profile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12, padding: '0 4px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a7a3c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{profile.nama_depan?.charAt(0)}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#ddd8ce' }}>{profile.nama_depan} {profile.nama_belakang}</div>
                <div style={{ fontSize: 11, color: '#7a8a7e' }}>Anggota</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{ width: '100%', padding: '8px 11px', borderRadius: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-b)', cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}>
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: 230, padding: 28, maxHeight: '100vh', overflowY: 'auto' }} className="main-content">

        {/* MOBILE TOPBAR */}
        <div className="mobile-topbar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, background: '#0c1f14', padding: '14px 18px', borderRadius: 12, color: '#f0ece3' }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>🏠 KEMANUSA</div>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#f0ece3', fontSize: 22, cursor: 'pointer' }}>☰</button>
        </div>

        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 26, fontWeight: 700, color: '#0c1f14', margin: 0 }}>
            Selamat datang, {profile?.nama_depan}! 👋
          </h1>
          <p style={{ fontSize: 13, color: '#7a8a7e', marginTop: 4 }}>Portal Anggota KEMANUSA Parepare</p>
        </div>

        {/* KEGIATAN UTAMA */}
        <div style={{ background: '#fff', border: '1px solid #dde8e1', borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(12,31,20,.05)' }}>
          <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 700, color: '#0c1f14', marginBottom: 18 }}>📅 Jadwal Kegiatan</h2>
          {kegiatan.length === 0 ? (
            <p style={{ color: '#7a8a7e', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Belum ada kegiatan terdaftar</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {kegiatan.map(k => (
                <div key={k.id} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: '1px solid #f0ede6', alignItems: 'flex-start' }}>
                  <div style={{ background: '#e8f5ed', borderRadius: 10, padding: '10px 14px', textAlign: 'center', flexShrink: 0, minWidth: 56 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#155228', lineHeight: 1 }}>{new Date(k.tanggal).getDate()}</div>
                    <div style={{ fontSize: 10, color: '#7a8a7e', marginTop: 2 }}>{new Date(k.tanggal).toLocaleDateString('id-ID', { month: 'short' })}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0c1f14', marginBottom: 3 }}>{k.nama}</div>
                    {k.lokasi && <div style={{ fontSize: 12, color: '#7a8a7e' }}>📍 {k.lokasi}</div>}
                    <span style={{ display: 'inline-flex', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, marginTop: 6, background: k.status === 'upcoming' ? '#fdf3e3' : k.status === 'ongoing' ? '#e8f5ed' : '#f5f5f5', color: k.status === 'upcoming' ? '#854f0b' : k.status === 'ongoing' ? '#155228' : '#666' }}>{k.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/anggota/kegiatan" style={{ display: 'inline-flex', marginTop: 16, fontSize: 13, color: '#1a7a3c', fontWeight: 500, textDecoration: 'none' }}>Lihat semua kegiatan →</Link>
        </div>

        {/* PENGUMUMAN TERBARU */}
        <div style={{ background: '#fff', border: '1px solid #dde8e1', borderRadius: 14, padding: 24, boxShadow: '0 1px 3px rgba(12,31,20,.05)' }}>
          <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 700, color: '#0c1f14', marginBottom: 18 }}>📣 Pengumuman Terbaru</h2>
          {pengumuman.length === 0 ? (
            <p style={{ color: '#7a8a7e', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Belum ada pengumuman</p>
          ) : pengumuman.map(p => (
            <div key={p.id} style={{ padding: '14px 0', borderBottom: '1px solid #f0ede6' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0c1f14', marginBottom: 4 }}>{p.judul}</div>
              <div style={{ fontSize: 12, color: '#7a8a7e' }}>{new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          ))}
          <Link href="/dashboard/anggota/pengumuman" style={{ display: 'inline-flex', marginTop: 16, fontSize: 13, color: '#1a7a3c', fontWeight: 500, textDecoration: 'none' }}>Lihat semua pengumuman →</Link>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desk { transform: translateX(-100%) !important; }
          .sidebar-desk[style*="translateX(0)"] { transform: translateX(0) !important; }
          .main-content { margin-left: 0 !important; padding: 16px !important; }
          .mobile-topbar { display: flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
