'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw loginError;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', data.user.id)
          .single();

        // Cek status akun
        if (profile?.status === 'pending') {
          router.push('/auth/menunggu');
          return;
        }
        if (profile?.status === 'ditolak') {
          router.push('/auth/ditolak');
          return;
        }

        // Redirect berdasarkan role
        if (profile?.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (profile?.role === 'humas') {
          router.push('/dashboard/humas');
        } else {
          // anggota biasa
          router.push('/dashboard/anggota');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      if (msg.includes('Invalid') || msg.includes('invalid')) {
        setError('Email atau kata sandi salah.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* LEFT */}
        <div className={styles.left}>
          <div>
            <div className={styles.logoWrap}>
              <div className={styles.logo}>K</div>
              <div>
                <div className={styles.org}>
                  KEMANUSA
                  <small>Cabang Kota Parepare</small>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className={styles.quote}>"Bersatu kita maju, bergerak kita nyata."</p>
            <p className={styles.quoteAttr}>— Semangat KEMANUSA Nusantara</p>
          </div>
          <div className={styles.roleInfo}>
            <div className={styles.roleItem}>
              <span>🛡️</span>
              <div><strong>Admin</strong><span>Kelola anggota, kegiatan & arsip</span></div>
            </div>
            <div className={styles.roleItem}>
              <span>📚</span>
              <div><strong>Humas</strong><span>Kelola catatan buku & dokumen</span></div>
            </div>
            <div className={styles.roleItem}>
              <span>👥</span>
              <div><strong>Anggota</strong><span>Lihat kegiatan & pengumuman</span></div>
            </div>
          </div>
          <div className={styles.leftFoot}>© 2026 KEMANUSA Parepare</div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <p className={styles.eyebrow}>Selamat datang kembali</p>
          <h2 className={styles.formTitle}>Masuk ke akun</h2>
          <p className={styles.formSub}>Dashboard akan menyesuaikan role Anda secara otomatis</p>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Alamat Email</label>
              <div className="field-wrap">
                <span className="field-icon">✉️</span>
                <input className="field-input" type="email" placeholder="email@kemanusa.id" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Kata Sandi</label>
              <div className="field-wrap">
                <span className="field-icon">🔒</span>
                <input className="field-input" type="password" placeholder="Kata sandi Anda" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            {error && <p className={styles.errorMsg}>⚠️ {error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '⏳ Memproses...' : '→ Masuk'}
            </button>

            <div className="divider-row">atau</div>
            <p className="login-link-row">
              Belum punya akun? <Link href="/auth/register">Daftar sebagai anggota</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
