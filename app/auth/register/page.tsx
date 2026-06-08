'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    namaDepan: '', namaBelakang: '', email: '',
    noWhatsapp: '', universitas: '', password: '', konfirmasi: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sukses, setSukses] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.konfirmasi) {
      return setError('Kata sandi tidak cocok.');
    }
    if (form.password.length < 8) {
      return setError('Kata sandi minimal 8 karakter.');
    }

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nama_depan: form.namaDepan,
            nama_belakang: form.namaBelakang,
            no_whatsapp: form.noWhatsapp,
            universitas: form.universitas,
            // Role SELALU anggota — admin hanya bisa dibuat oleh super admin
            role: 'anggota',
          },
        },
      });

      if (signUpError) throw signUpError;

      // Tampilkan pesan sukses, tidak langsung redirect
      setSukses(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.';
      if (msg.includes('already registered')) {
        setError('Email ini sudah terdaftar. Silakan login.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Tampilan setelah berhasil daftar
  if (sukses) {
    return (
      <div className={styles.page}>
        <div className={styles.left}>
          <div className={styles.leftTop}>
            <div className={styles.orgBar}>
              <div className={styles.orgLogo}>K</div>
              <div className={styles.orgName}>KEMANUSA<span>Cabang Kota Parepare · Sulawesi Selatan</span></div>
            </div>
          </div>
          <div className={styles.leftFoot}>© 2026 KEMANUSA Cabang Kota Parepare</div>
        </div>
        <div className={styles.right}>
          <div className={styles.suksesWrap}>
            <div className={styles.suksesIcon}>✅</div>
            <h2 className={styles.formTitle}>Pendaftaran Terkirim!</h2>
            <p className={styles.formSub}>
              Akun Anda sudah terdaftar dan sedang menunggu persetujuan dari <strong>Admin KEMANUSA</strong>.
            </p>
            <div className={styles.suksesInfo}>
              <p>📧 Cek email <strong>{form.email}</strong> untuk konfirmasi</p>
              <p>⏳ Admin akan memverifikasi akun Anda dalam 1×24 jam</p>
              <p>📱 Hubungi Admin via WhatsApp jika butuh bantuan</p>
            </div>
            <Link href="/auth/login" className={styles.suksesBtn}>
              → Ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* LEFT PANEL */}
      <div className={styles.left}>
        <div className={styles.leftTop}>
          <div className={styles.orgBar}>
            <div className={styles.orgLogo}>K</div>
            <div>
              <div className={styles.orgName}>
                KEMANUSA
                <span>Cabang Kota Parepare · Sulawesi Selatan</span>
              </div>
            </div>
          </div>
          <h1 className={styles.headline}>
            Bergabung<br />bersama<br /><em>kami</em>.
          </h1>
          <p className={styles.sub}>
            Daftarkan diri Anda sebagai anggota Kejayaan Mahasiswa Nusantara dan jadilah bagian dari gerakan mahasiswa yang bergerak nyata.
          </p>
          <div className={styles.steps}>
            {[
              { ic: '📝', h: 'Isi formulir pendaftaran', s: 'Data diri lengkap sebagai anggota' },
              { ic: '⏳', h: 'Menunggu verifikasi Admin', s: 'Akun diverifikasi & disetujui Admin' },
              { ic: '📊', h: 'Akses dashboard anggota', s: 'Lihat kegiatan, pengumuman & arsip' },
              { ic: '✅', h: 'Data tersimpan aman', s: 'Sinkron ke Supabase & Google Drive' },
            ].map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepIc}>{s.ic}</div>
                <div>
                  <strong>{s.h}</strong>
                  <span>{s.s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.leftFoot}>© 2026 KEMANUSA Cabang Kota Parepare · Sistem Digital Organisasi</div>
      </div>

      {/* RIGHT FORM */}
      <div className={styles.right}>
        <p className={styles.eyebrow}>Pendaftaran Anggota</p>
        <h2 className={styles.formTitle}>Buat akun baru</h2>
        <p className={styles.formSub}>Lengkapi data berikut untuk bergabung</p>

        {/* NOTICE: tidak ada pilihan role Admin */}
        <div className={styles.noticeBadge}>
          👥 Pendaftaran terbuka untuk <strong>Anggota</strong>. Akun Admin hanya dibuat oleh pengurus.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row-2">
            <div className="field-group">
              <label className="field-label">Nama Depan</label>
              <div className="field-wrap">
                <span className="field-icon">👤</span>
                <input className="field-input" name="namaDepan" type="text" placeholder="Ahmad" required value={form.namaDepan} onChange={handleChange} />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Nama Belakang</label>
              <div className="field-wrap">
                <span className="field-icon">👤</span>
                <input className="field-input" name="namaBelakang" type="text" placeholder="Fauzi" required value={form.namaBelakang} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Alamat Email</label>
            <div className="field-wrap">
              <span className="field-icon">✉️</span>
              <input className="field-input" name="email" type="email" placeholder="ahmad@gmail.com" required value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Nomor WhatsApp</label>
            <div className="field-wrap">
              <span className="field-icon">📱</span>
              <input className="field-input" name="noWhatsapp" type="text" placeholder="+62 812 3456 7890" value={form.noWhatsapp} onChange={handleChange} />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Universitas / Kampus</label>
            <div className="field-wrap">
              <span className="field-icon">🏫</span>
              <input className="field-input" name="universitas" type="text" placeholder="Universitas Anda" value={form.universitas} onChange={handleChange} />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Kata Sandi</label>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input className="field-input" name="password" type="password" placeholder="Minimal 8 karakter" required value={form.password} onChange={handleChange} />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Konfirmasi Kata Sandi</label>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input className="field-input" name="konfirmasi" type="password" placeholder="Ulangi kata sandi" required value={form.konfirmasi} onChange={handleChange} />
            </div>
          </div>

          {error && <p className={styles.errorMsg}>⚠️ {error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '⏳ Mendaftar...' : '✦ Daftar Sekarang'}
          </button>

          <div className="divider-row">atau</div>
          <p className="login-link-row">
            Sudah punya akun? <Link href="/auth/login">Masuk di sini</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
