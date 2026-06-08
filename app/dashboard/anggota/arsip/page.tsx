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

export default function ArsipAnggota() {
  const supabase = createClient();
  const router = useRouter();
  const [arsip, setArsip] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  // Google Drive folder ID — isi dari link folder Google Drive organisasi
  const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/YOUR_FOLDER_ID';

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { data } = await supabase
        .from('arsip_dokumen')
        .select('*, profiles(nama_depan, nama_belakang)')
        .order('created_at', { ascending: false });
      setArsip((data || []).filter((a: any) => a.kategori !== 'data-penting'));
    };
    load();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const filtered = arsip.filter(a =>
    `${a.nama_file} ${a.kategori} ${a.deskripsi}`.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (nama: string) => {
    if (nama.match(/\.(pdf)$/i)) return '📕';
    if (nama.match(/\.(doc|docx)$/i)) return '📘';
    if (nama.match(/\.(xls|xlsx)$/i)) return '📗';
    if (nama.match(/\.(ppt|pptx)$/i)) return '📙';
    if (nama.match(/\.(jpg|jpeg|png|gif)$/i)) return '🖼️';
    return '📄';
  };

  const Sidebar = () => (
    <aside style={{ width: 230, flexShrink: 0, background: '#0c1f14', display: 'flex', flexDirection: 'column', padding: '24px 14px', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50 }} className="sidebar-desk">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700, color: '#155228' }}>K</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece3', lineHeight: 1.3 }}>KEMANUSA<span style={{ display: 'block', fontSize: 10, color: '#7a8a7e', fontWeight: 400 }}>Portal Anggota</span></div>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 7, fontSize: 13, fontWeight: 500, color: n.href === '/dashboard/anggota/arsip' ? '#a8e6c0' : 'rgba(255,255,255,0.5)', background: n.href === '/dashboard/anggota/arsip' ? 'rgba(26,122,60,0.25)' : 'transparent', textDecoration: 'none' }}>{n.icon} {n.label}</Link>
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
          <div style={{ fontWeight: 600, fontSize: 15 }}>📁 Arsip Dokumen</div>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#f0ece3', fontSize: 22, cursor: 'pointer' }}>☰</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 26, fontWeight: 700, color: '#0c1f14', margin: 0 }}>📁 Arsip Dokumen</h1>
            <p style={{ fontSize: 13, color: '#7a8a7e', marginTop: 4 }}>Dokumen & file resmi organisasi KEMANUSA</p>
          </div>
          <a href={DRIVE_FOLDER_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 40, background: '#155228', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
            ☁️ Buka Google Drive
          </a>
        </div>

        {/* SEARCH */}
        <input type="text" placeholder="🔍 Cari dokumen..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 16px', borderRadius: 10, border: '1.5px solid #dde8e1', fontSize: 13, fontFamily: 'var(--font-b)', outline: 'none', marginBottom: 20, background: '#fff', boxSizing: 'border-box' }} />

        {/* GRID DOKUMEN */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#7a8a7e', fontSize: 13 }}>Belum ada dokumen</div>
          ) : filtered.map(a => (
            <div key={a.id} style={{ background: '#fff', border: '1px solid #dde8e1', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(12,31,20,.04)', transition: 'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(12,31,20,.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(12,31,20,.04)'}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: '#e8f5ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, border: '1px solid #dde8e1' }}>
                {getIcon(a.nama_file)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0c1f14', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.nama_file}</div>
                <div style={{ fontSize: 11, color: '#7a8a7e' }}>
                  {a.kategori && <span style={{ background: '#e8f5ed', color: '#155228', padding: '1px 7px', borderRadius: 10, marginRight: 6 }}>{a.kategori}</span>}
                  {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <a href={a.drive_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 14px', borderRadius: 8, background: '#e8f5ed', color: '#155228', fontSize: 12, fontWeight: 500, textDecoration: 'none', flexShrink: 0, border: '1px solid #dde8e1', transition: 'all .2s' }}>
                🔗 Buka
              </a>
            </div>
          ))}
        </div>
      </main>
      <style>{`@media(max-width:768px){.sidebar-desk{transform:translateX(-100%) !important;}.main-content{margin-left:0 !important;padding:16px !important;}.mobile-topbar{display:flex !important;}}`}</style>
    </div>
  );
}
