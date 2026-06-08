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

export default function BacaanAnggota() {
  const supabase = createClient();
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { data } = await supabase
        .from('catatan_buku')
        .select('*, profiles(nama_depan, nama_belakang)')
        .order('created_at', { ascending: false });
      setBooks(data || []);
    };
    load();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const filtered = books.filter(b =>
    `${b.judul_buku} ${b.nama_penulis} ${b.kategori}`.toLowerCase().includes(search.toLowerCase())
  );

  const Sidebar = () => (
    <aside style={{ width: 230, flexShrink: 0, background: '#0c1f14', display: 'flex', flexDirection: 'column', padding: '24px 14px', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50 }} className="sidebar-desk">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700, color: '#155228' }}>K</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece3', lineHeight: 1.3 }}>KEMANUSA<span style={{ display: 'block', fontSize: 10, color: '#7a8a7e', fontWeight: 400 }}>Portal Anggota</span></div>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 7, fontSize: 13, fontWeight: 500, color: n.href === '/dashboard/anggota/bacaan' ? '#a8e6c0' : 'rgba(255,255,255,0.5)', background: n.href === '/dashboard/anggota/bacaan' ? 'rgba(26,122,60,0.25)' : 'transparent', textDecoration: 'none' }}>{n.icon} {n.label}</Link>
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
          <div style={{ fontWeight: 600, fontSize: 15 }}>📚 Bacaan Humas</div>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#f0ece3', fontSize: 22, cursor: 'pointer' }}>☰</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 26, fontWeight: 700, color: '#0c1f14', margin: 0 }}>📚 Perpustakaan Digital Humas</h1>
            <p style={{ fontSize: 13, color: '#7a8a7e', marginTop: 4 }}>{filtered.length} buku tersedia</p>
          </div>
          <input type="text" placeholder="🔍 Cari buku..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '9px 16px', borderRadius: 40, border: '1.5px solid #dde8e1', fontSize: 13, fontFamily: 'var(--font-b)', outline: 'none', width: 200, background: '#fff' }} />
        </div>

        {/* GRID BUKU */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#7a8a7e', fontSize: 13 }}>
              {search ? 'Buku tidak ditemukan' : 'Belum ada catatan buku'}
            </div>
          ) : filtered.map(b => (
            <div key={b.id} style={{ background: '#fff', border: '1px solid #dde8e1', borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 1px 3px rgba(12,31,20,.04)', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(12,31,20,.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(12,31,20,.04)'; }}>
              {b.kategori && <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: '#e8f5ed', color: '#155228', width: 'fit-content' }}>{b.kategori}</span>}
              <div style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 700, color: '#0c1f14', lineHeight: 1.2 }}>{b.judul_buku}</div>
              <div style={{ fontSize: 12, color: '#7a8a7e', fontStyle: 'italic' }}>{b.nama_penulis}{b.tahun ? ` · ${b.tahun}` : ''}</div>
              <p style={{ fontSize: 13, color: '#4a5e4e', lineHeight: 1.65, flex: 1 }}>{b.ringkasan}</p>
              {b.pelajaran && (
                <div style={{ background: '#fdf3e3', borderLeft: '3px solid #c9963a', padding: '10px 12px', borderRadius: '0 6px 6px 0', fontSize: 12, color: '#5a4a20', lineHeight: 1.6 }}>
                  <strong style={{ color: '#854f0b' }}>💡 Pelajaran: </strong>{b.pelajaran}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f0ede6', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: '#7a8a7e' }}>📝 {b.profiles?.nama_depan || 'Humas'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#b0bdb3' }}>{new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {b.pdf_url && (
                    <a href={b.pdf_url} target="_blank" rel="noopener noreferrer" download
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 20, background: '#155228', color: '#fff', fontSize: 11, fontWeight: 500, textDecoration: 'none', transition: 'all .2s' }}>
                      ⬇ PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <style>{`@media(max-width:768px){.sidebar-desk{transform:translateX(-100%) !important;}.main-content{margin-left:0 !important;padding:16px !important;}.mobile-topbar{display:flex !important;}}`}</style>
    </div>
  );
}
