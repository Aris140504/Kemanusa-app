'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div>
      {/* ── NAVBAR ── */}
      <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <Link href="/" className={styles.navLogo}>
          <div className={styles.navLogoImg}>K</div>
          <div className={styles.navBrand}>
            <span className={styles.navBrandMain}>KEMANUSA</span>
            <span className={styles.navBrandSub}>Cabang Kota Parepare</span>
          </div>
        </Link>
        <ul className={styles.navLinks}>
          <li><a href="#tentang">Tentang</a></li>
          <li><a href="#fitur">Fitur</a></li>
          <li><a href="#kontak">Kontak</a></li>
        </ul>
        <div className={styles.navCta}>
          <Link href="/auth/login" className={styles.btnNavMasuk}>Masuk</Link>
          <Link href="/auth/register" className={styles.btnNavDaftar}>Daftar Anggota</Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className={styles.hero} id="home">
        <div className={styles.heroBgPattern} />
        <div className={styles.heroGrid} />
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <div className={styles.heroBadgeDot} />
              Organisasi Mahasiswa — Sulawesi Selatan
            </div>
            <h1 className={styles.heroTitle}>
              Kejayaan<br />
              <em>Mahasiswa</em><br />
              Nusantara
            </h1>
            <p className={styles.heroDesc}>
              Sistem digital terpadu untuk pengelolaan anggota, kegiatan, dan arsip organisasi KEMANUSA Cabang Kota Parepare. Paperless, modern, dan terkoneksi.
            </p>
            <div className={styles.heroCta}>
              <Link href="/auth/register" className="btn-primary">
                ✦ Daftar Sebagai Anggota
              </Link>
              <Link href="/auth/login" className="btn-outline">
                Sudah Punya Akun →
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div>
                <span className={styles.heroStatNum}>3+</span>
                <span className={styles.heroStatLabel}>Divisi Aktif</span>
              </div>
              <div>
                <span className={styles.heroStatNum}>100%</span>
                <span className={styles.heroStatLabel}>Digital & Paperless</span>
              </div>
              <div>
                <span className={styles.heroStatNum}>24/7</span>
                <span className={styles.heroStatLabel}>Akses Online</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>
                <div className={styles.heroCardLogo}>K</div>
                <div>
                  <div className={styles.heroCardOrg}>
                    KEMANUSA Parepare
                    <span>Kejayaan Mahasiswa Nusantara</span>
                  </div>
                </div>
              </div>
              {[
                { icon: '📝', title: 'Daftar akun', sub: 'Isi data diri sebagai Admin atau Anggota' },
                { icon: '🔐', title: 'Validasi login', sub: 'Sistem memverifikasi kredensial Anda' },
                { icon: '📊', title: 'Akses dashboard', sub: 'Kelola anggota, kegiatan, arsip & humas' },
                { icon: '☁️', title: 'Sinkron Google Drive', sub: 'Dokumen tersimpan aman & terstruktur' },
              ].map((s, i) => (
                <div key={i} className={styles.flowStep}>
                  <div className={styles.flowIcon}>{s.icon}</div>
                  <div>
                    <strong>{s.title}</strong>
                    <span>{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className={styles.section} id="tentang">
        <span className={styles.sectionLabel}>Tentang Kami</span>
        <h2 className={styles.sectionTitle}>Apa itu KEMANUSA<br /><em>Parepare?</em></h2>
        <p className={styles.sectionSub}>Kolektif mahasiswa yang bergerak nyata untuk kemajuan generasi muda Sulawesi Selatan.</p>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <p><strong>KEMANUSA</strong> (Kejayaan Mahasiswa Nusantara) Cabang Kota Parepare adalah organisasi mahasiswa yang berfokus pada pengembangan sumber daya manusia dan solidaritas antar mahasiswa di wilayah Sulawesi Selatan.</p>
            <p>Sistem digital ini hadir untuk menggantikan proses administrasi berbasis kertas menjadi <strong>sepenuhnya digital</strong> — mulai dari pendaftaran anggota baru, pengelolaan kegiatan, hingga pengarsipan dokumen organisasi secara terpusat.</p>
            <p>Dengan platform ini, seluruh anggota dapat mengakses informasi organisasi, status keanggotaan, dan dokumen penting kapan saja dan di mana saja melalui perangkat apapun.</p>
          </div>
          <div className={styles.nilaiCard}>
            {[
              { icon: '🤝', h: 'Kolaborasi', p: 'Solusi terbaik lahir dari kebersamaan dan beragam perspektif mahasiswa.' },
              { icon: '🛡️', h: 'Integritas', p: 'Setiap data dan keputusan organisasi dijaga dengan penuh tanggung jawab.' },
              { icon: '⚡', h: 'Inovasi Digital', p: 'Mendorong batas kemungkinan organisasi mahasiswa melalui teknologi modern.' },
            ].map((v, i) => (
              <div key={i} className={styles.nilaiItem}>
                <div className={styles.nilaiIcon}>{v.icon}</div>
                <div>
                  <h4>{v.h}</h4>
                  <p>{v.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <div className={styles.featuresBg} id="fitur">
        <div className={styles.featuresInner}>
          <p className={`${styles.sectionLabel} ${styles.sectionLabelGold}`}>Fitur Platform</p>
          <h2 className={styles.featuresTitle}>Semua yang Anda<br /><em>Butuhkan</em></h2>
          <p className={styles.featuresSub}>Ekosistem digital lengkap untuk pengelolaan organisasi modern.</p>
          <div className={styles.featuresGrid}>
            {[
              { icon: '📋', title: 'Pendaftaran Digital', desc: 'Formulir pendaftaran anggota baru sepenuhnya online. Admin dapat menyetujui atau menolak dengan satu klik.' },
              { icon: '📁', title: 'Arsip Google Drive', desc: 'Seluruh dokumen penting organisasi tersinkronisasi langsung ke Google Drive. Aman, terstruktur, dan dapat diakses kapan saja.' },
              { icon: '📚', title: 'Catatan Buku Humas', desc: 'Divisi Humas dapat mendokumentasikan ringkasan buku bacaan, pelajaran yang diambil, dan berbagi pengetahuan.' },
              { icon: '📣', title: 'Pengumuman Real-time', desc: 'Informasi organisasi tersampaikan ke seluruh anggota secara instan tanpa perlu group WhatsApp yang penuh spam.' },
              { icon: '👥', title: 'Manajemen Anggota', desc: 'Admin dapat mengelola data seluruh anggota, memantau status keanggotaan, dan mengatur hak akses setiap divisi.' },
              { icon: '🔐', title: 'Keamanan Berlapis', desc: 'Sistem autentikasi Supabase dengan pembagian role Admin dan User yang ketat. Data organisasi terlindungi.' },
            ].map((f, i) => (
              <div key={i} className={styles.featCard}>
                <span className={styles.featIcon}>{f.icon}</span>
                <div className={styles.featTitle}>{f.title}</div>
                <p className={styles.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTACT ── */}
      <section className={styles.contactSection} id="kontak">
        <span className={styles.sectionLabel}>Hubungi Kami</span>
        <h2 className={styles.sectionTitle}>Terhubung<br /><em>Bersama Kami</em></h2>
        <div className={styles.contactGrid}>
          <div>
            {[
              { icon: '📧', label: 'Email', val: 'dpckemanusa@gmail.com' },
              { icon: '📱', label: 'WhatsApp', val: '+62 853 3811 7765' },
              { icon: '📍', label: 'Lokasi', val: 'Kota Parepare, Sulawesi Selatan' },
            ].map((c, i) => (
              <div key={i} className={styles.contactItem}>
                <div className={styles.contactIcon}>{c.icon}</div>
                <div>
                  <strong>{c.label}</strong>
                  <span>{c.val}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.mapWrap}>
            <div className={styles.mapHeader}>
              <h3>📍 Jangkauan Wilayah</h3>
              <p>Kota Parepare & Sekitarnya, Sulawesi Selatan</p>
            </div>
            <iframe
              src="https://maps.google.com/maps?q=Parepare,Sulawesi+Selatan&t=&z=12&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
              loading="lazy"
              title="Peta Parepare"
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <p>© 2026 <strong>KEMANUSA Cabang Kota Parepare</strong> · Kejayaan Mahasiswa Nusantara · Sulawesi Selatan</p>
      </footer>
    </div>
  );
}
