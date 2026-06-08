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

const STATUS_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  upcoming:  { bg: '#fdf3e3', color: '#854f0b', label: '🕐 Akan Datang' },
  ongoing:   { bg: '#e8f5ed', color: '#155228', label: '🟢 Berlangsung' },
  selesai:   { bg: '#f0f0f0', color: '#666',    label: '✓ Selesai' },
};

export default function KegiatanAnggota() {
  const supabase = createClient();
  const router = useRouter();
  const [kegiatan, setKegiatan] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('semua');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('kegiatan').select('*').order('tanggal', { ascending: true });
      setKegiatan(data || []);
    };
    load();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const filtered = filter === 'semua' ? kegiatan : kegiatan.filter(k => k.status === filter);

  const Sidebar = () => (
    <aside style={{ width: 230, flexShrink: 0, background: '#0c1f14', display: 'flex', flexDirection: 'column', padding: '24px 14px', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50 }} className="sidebar-desk">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700, color: '#155228' }}>K</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece3', lineHeight: 1.3 }}>KEMANUSA<span style={{ display: 'block', fontSize: 10, color: '#7a8a7e', fontWeight: 400 }}>Portal Anggota</span></div>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 7, fontSize: 13, fontWeight: 500, color: n.href === '/dashboard/anggota/kegiatan' ? '#a8e6c0' : 'rgba(255,255,255,0.5)', background: n.href === '/dashboard/anggota/kegiatan' ? 'rgba(26,122,60,0.25)' : 'transparent', textDecoration: 'none' }}>{n.icon} {n.label}</Link>
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
          <div style={{ fontWeight: 600, fontSize: 15 }}>📅 Kegiatan</div>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#f0ece3', fontSize: 22, cursor: 'pointer' }}>☰</button>
        </div>

        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 26, fontWeight: 700, color: '#0c1f14', marginBottom: 6 }}>📅 Jadwal Kegiatan</h1>
        <p style={{ fontSize: 13, color: '#7a8a7e', marginBottom: 20 }}>Agenda dan kegiatan organisasi KEMANUSA Parepare</p>

        {/* FILTER TABS */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['semua', 'upcoming', 'ongoing', 'selesai'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 18px', borderRadius: 20, fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-b)', cursor: 'pointer', border: '1.5px solid', background: filter === f ? '#155228' : '#fff', color: filter === f ? '#fff' : '#7a8a7e', borderColor: filter === f ? '#155228' : '#dde8e1', transition: 'all .2s', textTransform: 'capitalize' }}>
              {f === 'semua' ? 'Semua' : STATUS_COLOR[f]?.label || f}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', color: '#7a8a7e', fontSize: 13 }}>Tidak ada kegiatan</div>
          ) : filtered.map(k => {
            const st = STATUS_COLOR[k.status] || STATUS_COLOR.selesai;
            return (
              <div key={k.id} style={{ background: '#fff', border: '1px solid #dde8e1', borderRadius: 14, padding: '20px 24px', display: 'flex', gap: 18, alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(12,31,20,.04)' }}>
                <div style={{ background: '#e8f5ed', borderRadius: 12, padding: '12px 16px', textAlign: 'center', flexShrink: 0, minWidth: 60 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#155228', lineHeight: 1 }}>{new Date(k.tanggal).getDate()}</div>
                  <div style={{ fontSize: 11, color: '#7a8a7e', marginTop: 2 }}>{new Date(k.tanggal).toLocaleDateString('id-ID', { month: 'short' })}</div>
                  <div style={{ fontSize: 10, color: '#b0bdb3' }}>{new Date(k.tanggal).getFullYear()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#0c1f14', marginBottom: 6 }}>{k.nama}</div>
                  {k.deskripsi && <p style={{ fontSize: 13, color: '#7a8a7e', lineHeight: 1.6, marginBottom: 10 }}>{k.deskripsi}</p>}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    {k.lokasi && <span style={{ fontSize: 12, color: '#7a8a7e' }}>📍 {k.lokasi}</span>}
                    <span style={{ display: 'inline-flex', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <style>{`@media(max-width:768px){.sidebar-desk{transform:translateX(-100%) !important;}.main-content{margin-left:0 !important;padding:16px !important;}.mobile-topbar{display:flex !important;}}`}</style>
    </div>
  );
}
