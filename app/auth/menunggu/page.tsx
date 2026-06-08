'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function MenungguPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      setEmail(user.email || '');

      // Cek status, kalau sudah aktif langsung redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', user.id)
        .single();

      if (profile?.status === 'aktif') {
        if (profile.role === 'admin') router.push('/dashboard/admin');
        else if (profile.role === 'humas') router.push('/dashboard/humas');
        else router.push('/dashboard/anggota');
      } else if (profile?.status === 'ditolak') {
        router.push('/auth/ditolak');
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>⏳</div>
        <h1 className={styles.title}>Menunggu Verifikasi</h1>
        <p className={styles.desc}>
          Pendaftaran Anda sudah diterima! Admin KEMANUSA sedang memverifikasi akun Anda.
        </p>

        <div className={styles.infoBox}>
          <div className={styles.infoItem}>
            <span className={styles.infoIc}>📧</span>
            <div>
              <strong>Email terdaftar</strong>
              <span>{email}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIc}>⏱️</span>
            <div>
              <strong>Estimasi waktu</strong>
              <span>Maksimal 1×24 jam kerja</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIc}>📱</span>
            <div>
              <strong>Butuh bantuan?</strong>
              <span>Hubungi Admin via WhatsApp</span>
            </div>
          </div>
        </div>

        <p className={styles.hint}>
          Halaman ini akan otomatis berpindah saat akun disetujui. Atau refresh halaman ini untuk mengecek status.
        </p>

        <div className={styles.actions}>
          <button onClick={() => window.location.reload()} className={styles.btnRefresh}>
            🔄 Cek Status Sekarang
          </button>
          <button onClick={handleLogout} className={styles.btnLogout}>
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
